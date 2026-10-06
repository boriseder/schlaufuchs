#!/usr/bin/env node
/**
 * Schlaufuchs – Regel-Check
 * Prüft die harten Regeln aus AGENTS.md automatisch. Keine Abhängigkeiten.
 *
 * Aufruf:   node scripts/check-regeln.mjs [--strict] [--help]
 *   --strict   Warnungen zählen auch als Fehler (für CI).
 *
 * Ausnahmen:
 *   Zeile mit  check-regeln:ignore  im Text wird übersprungen.
 *   Zeile nach einer Zeile mit  check-regeln:ignore-next-line  wird übersprungen.
 *   Optional: scripts/check-regeln.config.json
 *     { "ignorePaths": ["legacy/"], "storageModule": "js/core/storage.js" }
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative, extname, sep } from "node:path";

if (process.argv.includes("--help")) {
  console.log("node scripts/check-regeln.mjs [--strict]");
  process.exit(0);
}

const ROOT = process.cwd();
const STRICT = process.argv.includes("--strict");
const SCAN_EXT = new Set([".html", ".css", ".js", ".mjs", ".svg", ".json", ".webmanifest"]);
const SKIP_DIRS = new Set(["node_modules", ".git", ".agents", "docs", "scripts", "tests", "fonts", "dist", "build"]);

let config = { ignorePaths: [], storageModule: "js/core/storage.js" };
const configPfad = join(ROOT, "scripts", "check-regeln.config.json");
if (existsSync(configPfad)) {
  try { config = { ...config, ...JSON.parse(readFileSync(configPfad, "utf8")) }; }
  catch (e) { console.error("Konfiguration nicht lesbar:", e.message); process.exit(2); }
}

/* ---------- Dateien einsammeln ---------- */
function sammle(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const voll = join(dir, name);
    const rel = relative(ROOT, voll).split(sep).join("/");
    if (config.ignorePaths.some((p) => rel.startsWith(p))) continue;
    const st = statSync(voll);
    if (st.isDirectory()) {
      if (!SKIP_DIRS.has(name)) sammle(voll, out);
    } else if (SCAN_EXT.has(extname(name).toLowerCase())) {
      out.push({ voll, rel, ext: extname(name).toLowerCase().slice(1) });
    }
  }
  return out;
}

/* ---------- Muster ---------- */
const ZAHL = String.raw`(?<![\w.,])[1-9]\d{0,2}(?:\.\d{3})+(?![\d.])`;
const IN_STRING = new RegExp(String.raw`(["'\`])[^"'\`\n]*${ZAHL}[^"'\`\n]*\1`);
const IN_TEXT = new RegExp(String.raw`>[^<]*${ZAHL}`);
const EMOJI = /(?![©®™])\p{Extended_Pictographic}/u;

/** Zeilenregeln. ext: Liste der Dateiendungen, test(zeile, datei) liefert true bei Verstoß. */
const REGELN = [
  { id: "tausenderpunkt", level: "error", ext: ["html", "js", "mjs", "json"],
    msg: "Tausenderpunkt. Verwende ein Spatium (1 000) über formatZahl().",
    test: (z, d) => IN_STRING.test(z) || (d.ext === "html" && IN_TEXT.test(z)) },
  { id: "tolocalestring", level: "error", ext: ["html", "js", "mjs"],
    msg: "toLocaleString oder Intl.NumberFormat für Zahlen. Verwende Schlaufuchs.formatZahl().",
    test: (z) => /\.toLocaleString\(|Intl\.NumberFormat/.test(z) },
  { id: "obelus", level: "error", ext: ["html", "js", "mjs", "css", "json", "svg"],
    msg: "Obelus ➗ ist nicht erlaubt. Division wird mit Doppelpunkt (:) geschrieben.",
    test: (z) => z.includes("\u2797") },
  { id: "dauer-animation", level: "error", ext: ["css", "html", "js", "mjs", "svg"],
    msg: "Dauer-Animation (infinite). Im Ruhezustand muss alles stillstehen.",
    test: (z) => /animation(-iteration-count)?\s*:[^;}]*\binfinite\b/.test(z) || /repeatCount\s*=\s*["']indefinite["']/.test(z) },
  { id: "verlauf", level: "error", ext: ["css", "html", "js", "mjs", "svg"],
    msg: "Verlauf. Verwende flächige Farben aus den Tokens.",
    test: (z) => /(linear|radial|conic)-gradient\s*\(/i.test(z) || /<(linear|radial)Gradient/i.test(z) },
  { id: "blur", level: "error", ext: ["css", "html", "js", "mjs"],
    msg: "backdrop-filter ist nicht erlaubt (Glassmorphism).",
    test: (z) => /backdrop-filter/.test(z) },
  { id: "schatten", level: "warn", ext: ["css", "html"],
    msg: "Schatten oder Blur als Gestaltungsmittel. Verwende einen 2px-Rahmen.",
    test: (z) => /(box-shadow|text-shadow|drop-shadow)\s*[:(]\s*(?!none)/.test(z) || /filter\s*:\s*blur/.test(z) },
  { id: "externe-ressource", level: "error", ext: ["html"],
    msg: "Externe Ressource (script, link, img, iframe). Alles muss lokal liegen.",
    test: (z) => /<(script|link|img|iframe|source|audio|video)\b[^>]*\b(src|href)\s*=\s*["']?(https?:)?\/\//i.test(z) },
  { id: "externe-ressource", level: "error", ext: ["css"],
    msg: "Externe URL in CSS (url() oder @import).",
    test: (z) => /url\(\s*["']?(https?:)?\/\//i.test(z) || /@import\s+(url\()?\s*["']?(https?:)?\/\//i.test(z) },
  { id: "externe-ressource", level: "error", ext: ["js", "mjs", "html"],
    msg: "Externer Netzwerkzugriff (fetch, XHR, WebSocket, sendBeacon, import von URL).",
    test: (z) => /fetch\(\s*["'`](https?:)?\/\//.test(z) || /XMLHttpRequest|sendBeacon|new\s+WebSocket|import\(\s*["']https?:/.test(z) },
  { id: "externer-dienst", level: "error", ext: ["html", "css", "js", "mjs", "json", "webmanifest"],
    msg: "Bekannter externer Dienst (CDN, Fonts, Analytics). Keine Anfragen nach außen.",
    test: (z) => /(googleapis|gstatic|cdnjs|jsdelivr|unpkg|googletagmanager|google-analytics|doubleclick|facebook\.net|hotjar|sentry\.io)/i.test(z) },
  { id: "cookies", level: "error", ext: ["js", "mjs", "html"],
    msg: "Cookies sind nicht erlaubt.",
    test: (z) => /document\.cookie/.test(z) },
  { id: "zoom-sperre", level: "error", ext: ["html"],
    msg: "Zoom gesperrt (user-scalable=no oder maximum-scale). Das ist ein Barrierefreiheits-Fehler.",
    test: (z) => /user-scalable\s*=\s*(no|0)|maximum-scale/i.test(z) },
  { id: "emoji", level: "warn", ext: ["html", "js", "mjs", "css", "json"],
    msg: "Emoji im Quelltext. Bedienelemente und Symbole sind eigene SVG-Icons.",
    test: (z) => EMOJI.test(z) },
  { id: "zahlfeld-typ", level: "warn", ext: ["html", "js", "mjs"],
    msg: 'type="number" verwenden wir nicht. Besser das Ziffernfeld der App oder type="text" inputmode="numeric".',
    test: (z) => /type\s*=\s*["']number["']/.test(z) },
  { id: "html5-dnd", level: "warn", ext: ["html", "js", "mjs"],
    msg: "HTML5-Drag-and-Drop ist auf Touch unzuverlässig. Verwende Pointer Events und eine Antipp-Alternative.",
    test: (z) => /\b(ondragstart|dragstart)\b|draggable\s*=\s*["']true["']/.test(z) },
  { id: "tailwind-farben", level: "warn", ext: ["css", "html", "js", "mjs"],
    msg: "Tailwind-Standardfarbe (typischer KI-Look). Verwende die Tokens aus tokens.css.",
    test: (z) => /#(f8fafc|f1f5f9|e2e8f0|cbd5e1|94a3b8|64748b|475569|334155|1e293b|0f172a)\b/i.test(z) },
  { id: "storage-direkt", level: "warn", ext: ["js", "mjs", "html"],
    msg: "Direkter Zugriff auf localStorage oder sessionStorage. Verwende Schlaufuchs.Storage.",
    test: (z, d) => d.rel !== config.storageModule && /\b(localStorage|sessionStorage)\b/.test(z) },
  { id: "fehlerfarbe-rot", level: "warn", ext: ["css"],
    msg: "Rot als Rückmeldefarbe? Fehlversuche werden nicht rot gezeigt.",
    test: (z) => /(error|wrong|falsch|fehler|incorrect)[^{]*\{[^}]*(color|background)[^;}]*(red|#f00\b|#ff0000|#d[0-9a-f]{5})/i.test(z) },
];

/* ---------- Prüfen ---------- */
const funde = [];
const dateien = sammle(ROOT);

if (dateien.length === 0) {
  console.log("Keine prüfbaren Dateien gefunden (html, css, js, svg, json). Nichts zu tun.");
  process.exit(0);
}

for (const d of dateien) {
  const zeilen = readFileSync(d.voll, "utf8").split(/\r?\n/);
  let ueberspringe = false;
  zeilen.forEach((z, i) => {
    if (ueberspringe) { ueberspringe = false; return; }
    if (z.includes("check-regeln:ignore-next-line")) { ueberspringe = true; return; }
    if (z.includes("check-regeln:ignore")) return;
    for (const r of REGELN) {
      if (!r.ext.includes(d.ext)) continue;
      if (r.test(z, d)) funde.push({ datei: d.rel, zeile: i + 1, level: r.level, id: r.id, msg: r.msg });
    }
  });
}

/* ---------- Dateiübergreifende Prüfungen ---------- */
const alles = dateien.map((d) => ({ ...d, text: readFileSync(d.voll, "utf8") }));
const css = alles.filter((d) => d.ext === "css" || d.ext === "html");
const alleTexte = css.map((d) => d.text).join("\n");

if (/\b(animation|transition)\b\s*:/.test(alleTexte) && !/prefers-reduced-motion/.test(alleTexte)) {
  funde.push({ datei: "(Projekt)", zeile: 0, level: "error", id: "reduced-motion",
    msg: "Animationen vorhanden, aber kein @media (prefers-reduced-motion) gefunden." });
}
if (css.length && !/touch-action\s*:\s*manipulation/.test(alleTexte)) {
  funde.push({ datei: "(Projekt)", zeile: 0, level: "warn", id: "touch-action",
    msg: "Global touch-action: manipulation fehlt (verhindert Zoom durch Doppeltippen)." });
}
const index = alles.find((d) => d.rel === "index.html");
if (index) {
  if (!/<html[^>]*\blang\s*=\s*["']de-AT["']/i.test(index.text))
    funde.push({ datei: "index.html", zeile: 0, level: "warn", id: "sprache", msg: 'Fehlt: <html lang="de-AT">.' });
  if (!/<meta[^>]*name\s*=\s*["']viewport["']/i.test(index.text))
    funde.push({ datei: "index.html", zeile: 0, level: "warn", id: "viewport", msg: "Viewport-Meta fehlt." });
}

/* ---------- Ausgabe ---------- */
const fehler = funde.filter((f) => f.level === "error");
const warnungen = funde.filter((f) => f.level === "warn");

for (const f of funde) {
  const ort = f.zeile ? `${f.datei}:${f.zeile}` : f.datei;
  console.log(`${f.level === "error" ? "FEHLER " : "WARNUNG"}  ${ort}  [${f.id}]  ${f.msg}`);
}
console.log(`\n${dateien.length} Dateien geprüft: ${fehler.length} Fehler, ${warnungen.length} Warnungen.`);
if (fehler.length === 0 && warnungen.length === 0) console.log("Alle Regeln eingehalten.");
process.exit(fehler.length > 0 || (STRICT && warnungen.length > 0) ? 1 : 0);
