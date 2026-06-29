const fs = require("node:fs/promises");
const path = require("node:path");

const ROOT = process.cwd();
const REPORTS_DIR = path.join(ROOT, "reports");

async function listFiles(dir, pattern) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isFile() && pattern.test(entry.name))
      .map((entry) => entry.name)
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));
  } catch (error) {
    if (error && error.code === "ENOENT") return [];
    throw error;
  }
}

async function loadManifest() {
  let raw;
  try {
    raw = await fs.readFile(path.join(REPORTS_DIR, "manifest.json"), "utf8");
  } catch (error) {
    // ENOENT is the documented "manifest intentionally absent" case — degrade
    // silently. Anything else (failed bundling, EACCES) means we are serving
    // un-enriched cards by accident, so surface it in the function logs.
    if (!error || error.code !== "ENOENT") {
      console.warn("manifest.json read failed:", error && (error.code || error.message));
    }
    return { collateral: {}, weekly: {} };
  }
  try {
    const parsed = JSON.parse(raw);
    return {
      collateral: parsed.collateral || {},
      weekly: parsed.weekly || {}
    };
  } catch (error) {
    console.warn("manifest.json parse error (enrichment skipped):", error && error.message);
    return { collateral: {}, weekly: {} };
  }
}

function basenameOf(filename) {
  return filename.replace(/\.(html?|md)$/i, "");
}

// Read the first `bytes` of a file as UTF-8 (header-only; reports are large).
async function readHead(filePath, bytes) {
  try {
    const fh = await fs.open(filePath, "r");
    try {
      const buf = Buffer.alloc(bytes);
      const { bytesRead } = await fh.read(buf, 0, bytes, 0);
      return buf.toString("utf8", 0, bytesRead);
    } finally {
      await fh.close();
    }
  } catch (_) {
    return "";
  }
}

// "1 ⚠️" -> { n: 1, warn: true }   |   "0" -> { n: 0, warn: false }
function parseStat(value) {
  const num = (value.match(/-?\d[\d,]*/) || [null])[0];
  return {
    n: num === null ? null : Number(num.replace(/,/g, "")),
    warn: /⚠/.test(value)
  };
}

// Parse the Markdown report header + Surface Summary into card facts.
// Everything here is read straight from the report the analyst published —
// no hand-maintained duplication.
async function parseReportHead(mdPath) {
  const head = await readHead(mdPath, 6144);
  if (!head) return null;

  const meta = {};        // metadata table (key -> value)
  const surface = {};     // surface summary table (key -> value)
  let inSurface = false;
  let title = "";

  for (const raw of head.split(/\r?\n/)) {
    const line = raw.trim();

    if (!title) {
      const t = line.match(/^#\s+(.*\S)/);
      if (t) title = t[1].trim();
    }
    if (/^###\s+Surface Summary/i.test(line)) { inSurface = true; continue; }
    if (inSurface && /^##\s/.test(line)) inSurface = false; // next section ends it

    const row = line.match(/^\|\s*([^|]+?)\s*\|\s*(.*?)\s*\|$/);
    if (row) {
      const key = row[1].trim();
      const val = row[2].trim();
      if (/^-+$/.test(key) || key.toLowerCase() === "field") continue; // header / separator
      if (inSurface) surface[key] = val;
      else if (!(key in meta)) meta[key] = val;
    }
  }

  // token / symbol from the title: "... Access Control Report — <Token> (<SYM>)"
  let token = "", symbol = "";
  const tm = title.match(/Access Control Report\s+[—-]\s+(.*?)\s*\(([^)]+)\)\s*$/);
  if (tm) { token = tm[1].trim(); symbol = tm[2].trim(); }

  // control surface
  const csRaw = meta["Control Surface"] || "";
  let controlSurface = null, controlDetail = "";
  if (/on-chain/i.test(csRaw)) controlSurface = "on-chain";
  else if (/hybrid/i.test(csRaw)) {
    controlSurface = "hybrid";
    const d = csRaw.match(/hybrid\s*[—-]\s*(.*\S)/i);
    if (d) controlDetail = d[1].trim();
  }

  // proxy / upgradability
  const pxRaw = meta["Proxy Status"] || "";
  let proxy = null;
  if (/yes/i.test(pxRaw)) {
    let kind = (pxRaw.match(/\b(UUPS|Transparent\w*|Beacon)\b/i) || [null])[0];
    if (kind && /^transparent/i.test(kind)) kind = "Transparent"; // tidy the long form
    const impl = (pxRaw.match(/0x[0-9a-fA-F]{40}/) || [null])[0];
    proxy = { upgradable: true, kind: kind || null, impl: impl || null };
  } else if (pxRaw) {
    proxy = { upgradable: false, kind: null, impl: null };
  }

  const dateRaw = meta["Report Date"] || "";
  const reportDate = (dateRaw.match(/\d{4}-\d{2}-\d{2}/) || [""])[0];
  const address = (meta["Contract"] || "").replace(/[`\s]/g, "") || null;

  const eoa = parseStat(surface["EOA Holders"] || "");
  const crit = parseStat(surface["Critical Roles"] || "");

  return {
    token: token || (meta["Token"] || "").replace(/\s*\([^)]*\)\s*$/, "").trim(),
    symbol,
    name: meta["Name"] || "",
    address,
    chain: meta["Chain"] || "",
    controlSurface,
    controlDetail,
    proxy,
    reportDate,
    surface: {
      contracts: parseStat(surface["Contracts"] || "").n,
      roles: parseStat(surface["Role slots"] || surface["Roles"] || "").n,
      privilegedFns: parseStat(surface["Privileged Fns"] || "").n,
      eoaHolders: eoa.n,
      eoaWarn: eoa.warn,
      criticalRoles: crit.n,
      criticalWarn: crit.warn
    }
  };
}

// Compact summary of a weekly checkup from its header lines.
async function summariseWeekly(filePath) {
  const summary = { title: "", date: "", baseline: "", scanner: "", stats: {} };
  const head = await readHead(filePath, 2048);
  if (!head) return summary;

  for (const line of head.split(/\r?\n/)) {
    const titleM = line.match(/^#\s+(.*\S)/);
    // Normalise the title separator: source H1s use either " — " (em-dash) or
    // " -- " before the date. Collapse both to one consistent en-dash for display.
    if (titleM && !summary.title) summary.title = titleM[1].trim().replace(/\s+(?:--|—|–)\s+/g, " – ");

    if (/observed\s+\d+\s*\|/i.test(line)) {
      const pairs = line.match(/([a-z][a-z-]*)\s+(\d+)/gi) || [];
      for (const p of pairs) {
        const m = p.match(/([a-z][a-z-]*)\s+(\d+)/i);
        if (m) summary.stats[m[1].toLowerCase()] = Number(m[2]);
      }
    }
    const baseM = line.match(/baseline[^|]*?(\d{4}-\d{2}-\d{2})/i);
    if (baseM && !summary.baseline) summary.baseline = baseM[1];
    const scanM = line.match(/scanner\s+([^|@]+@\s*[0-9a-f]+)/i);
    if (scanM && !summary.scanner) summary.scanner = scanM[1].trim();
  }
  return summary;
}

module.exports = async (req, res) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");

  try {
    const manifest = await loadManifest();
    const collateralDir = path.join(REPORTS_DIR, "collateral");
    const weeklyDir = path.join(REPORTS_DIR, "weekly");

    // ---- FiRM collateral assessments (HTML primary, MD sibling self-enriches the card) ----
    const collHtml = await listFiles(collateralDir, /\.html?$/i);
    const collMdList = await listFiles(collateralDir, /\.md$/i);
    // Case-insensitive sibling lookup that preserves the real on-disk casing.
    const collMdByLower = new Map(collMdList.map((n) => [n.toLowerCase(), n]));

    // De-duplicate by basename so a stray crvUSD.htm next to crvUSD.html
    // cannot emit two cards for one asset (prefer the .html).
    const byBase = new Map();
    for (const filename of collHtml) {
      const base = basenameOf(filename);
      const existing = byBase.get(base);
      if (existing && /\.html$/i.test(existing) && /\.htm$/i.test(filename)) continue;
      byBase.set(base, filename);
    }

    const collateral = await Promise.all([...byBase.entries()].map(async ([base, filename]) => {
      const meta = manifest.collateral[base] || null;
      const realMd = collMdByLower.get(`${base}.md`.toLowerCase());
      const report = realMd ? await parseReportHead(path.join(collateralDir, realMd)) : null;
      return {
        basename: base,
        filename,
        href: `/reports/collateral/${encodeURIComponent(filename)}`,
        md: realMd ? `/reports/collateral/${encodeURIComponent(realMd)}` : null,
        report,
        meta
      };
    }));

    collateral.sort((a, b) => {
      const oa = (a.meta && Number.isFinite(a.meta.order)) ? a.meta.order : 9999;
      const ob = (b.meta && Number.isFinite(b.meta.order)) ? b.meta.order : 9999;
      if (oa !== ob) return oa - ob;
      return a.basename.localeCompare(b.basename, undefined, { sensitivity: "base" });
    });

    // ---- Weekly access-control reports (dated MD) ----
    const weeklyMd = await listFiles(weeklyDir, /\.md$/i);
    const weekly = [];
    for (const filename of weeklyMd) {
      const base = basenameOf(filename);
      const dateM = base.match(/(\d{4}-\d{2}-\d{2})/);
      const summary = await summariseWeekly(path.join(weeklyDir, filename));
      weekly.push({
        basename: base,
        filename,
        date: dateM ? dateM[1] : "",
        href: `/reports/weekly/${encodeURIComponent(filename)}`,
        summary,
        meta: manifest.weekly[base] || null
      });
    }
    weekly.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.basename.localeCompare(b.basename)));

    // ---- Markdown source files (secondary; AI inputs) ----
    const markdown = [...collMdList].sort((a, b) =>
      a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
    ).map((filename) => {
      const base = basenameOf(filename);
      return {
        basename: base,
        filename,
        href: `/reports/collateral/${encodeURIComponent(filename)}`,
        meta: manifest.collateral[base] || null
      };
    });

    res.status(200).json({
      collateral,
      weekly,
      markdown,
      counts: {
        collateral: collateral.length,
        weekly: weekly.length,
        markdown: markdown.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Unable to read reports directory." });
  }
};
