/**
 * Descarga los sprites de terraria.wiki.gg a public/assets/<categoria>/
 * y genera src/assets/generated/assetIndex.ts con el mapa tipado.
 *
 *   node scripts/scrape-assets.mjs                        // manifest completo
 *   node scripts/scrape-assets.mjs --only=enemies,bosses  // solo esas categorias
 *   node scripts/scrape-assets.mjs --force                // re-descarga lo existente
 *   node scripts/scrape-assets.mjs --category="Category:Item images" --dest=items --limit=500
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const API = 'https://terraria.wiki.gg/api.php';
const UA = 'terraclicker-asset-scraper/1.0 (fan project)';
const OUT_DIR = path.join(ROOT, 'public', 'assets');
const INDEX_FILE = path.join(ROOT, 'src', 'assets', 'generated', 'assetIndex.ts');

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? true];
  }),
);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function api(params) {
  const url = `${API}?${new URLSearchParams({ format: 'json', formatversion: '2', ...params })}`;
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    } catch (err) {
      if (attempt === 3) throw err;
      await sleep(500 * 2 ** attempt);
    }
  }
}

/** Resuelve titulos File:X.<ext> a la url real del fichero. */
async function resolveUrls(names, ext) {
  const found = new Map();
  const missing = [];
  for (let i = 0; i < names.length; i += 40) {
    const chunk = names.slice(i, i + 40);
    const data = await api({
      action: 'query',
      prop: 'imageinfo',
      iiprop: 'url',
      titles: chunk.map((n) => `File:${n}.${ext}`).join('|'),
    });
    for (const page of data?.query?.pages ?? []) {
      const key = page.title
        .replace(/^File:/, '')
        .replace(new RegExp(`\\.${ext}$`), '')
        .replace(/ /g, '_');
      const url = page.imageinfo?.[0]?.url;
      if (url) found.set(key, url);
      else missing.push(key);
    }
    await sleep(120);
  }
  return { found, missing };
}

async function download(url, dest) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(url, { headers: { 'User-Agent': UA } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      if (buf.byteLength < 64) throw new Error('fichero sospechosamente vacio');
      await fs.mkdir(path.dirname(dest), { recursive: true });
      await fs.writeFile(dest, buf);
      return buf.byteLength;
    } catch (err) {
      if (attempt === 2) throw err;
      await sleep(400 * 2 ** attempt);
    }
  }
}

async function exists(p) {
  try {
    return (await fs.stat(p)).size > 0;
  } catch {
    return false;
  }
}

/** Modo bulk: recorre una categoria entera de la wiki. */
async function crawlCategory(category, limit) {
  const names = [];
  let cont;
  do {
    const data = await api({
      action: 'query',
      list: 'categorymembers',
      cmtitle: category,
      cmtype: 'file',
      cmlimit: '500',
      ...(cont ? { cmcontinue: cont } : {}),
    });
    for (const m of data?.query?.categorymembers ?? []) {
      names.push(
        m.title
          .replace(/^File:/, '')
          .replace(/\.(png|gif|jpg)$/i, '')
          .replace(/ /g, '_'),
      );
    }
    cont = data?.continue?.cmcontinue;
  } while (cont && names.length < limit);
  return names.slice(0, limit);
}

async function fetchCategory(category, names, report) {
  const dir = path.join(OUT_DIR, category);
  const todo = [];
  for (const name of names) {
    const already = (
      await Promise.all(
        ['png', 'gif', 'jpg'].map((ext) => exists(path.join(dir, `${name}.${ext}`))),
      )
    ).some(Boolean);
    if (!args.force && already) {
      report.skipped.push(`${category}/${name}`);
      continue;
    }
    todo.push(name);
  }
  if (todo.length === 0) return;

  // Se prueba cada extension en orden: los sprites son png, los NPCs animados
  // gif, y los fondos de bioma jpg.
  const pending = [];
  let remaining = todo;
  for (const ext of ['png', 'gif', 'jpg']) {
    if (remaining.length === 0) break;
    const { found, missing } = await resolveUrls(remaining, ext);
    pending.push(...[...found].map(([n, u]) => [n, u, ext]));
    remaining = missing;
  }
  for (const m of remaining) report.missing.push(`${category}/${m}`);

  for (const [name, url, ext] of pending) {
    try {
      const size = await download(url, path.join(dir, `${name}.${ext}`));
      report.downloaded.push(`${category}/${name}.${ext} (${size}B)`);
    } catch (err) {
      report.failed.push(`${category}/${name}: ${err.message}`);
    }
    await sleep(60);
  }
}

async function writeIndex(entries) {
  const byCat = new Map();
  for (const [cat, name, rel] of entries) {
    if (!byCat.has(cat)) byCat.set(cat, new Map());
    byCat.get(cat).set(name, rel);
  }
  const lines = [
    '/* AUTOGENERADO por scripts/scrape-assets.mjs — no editar a mano. */',
    '',
    'export const ASSETS = {',
  ];
  for (const [cat, items] of [...byCat].sort()) {
    lines.push(`  ${cat}: {`);
    for (const [name, rel] of [...items].sort()) {
      lines.push(`    ${JSON.stringify(name)}: ${JSON.stringify(rel)},`);
    }
    lines.push('  },');
  }
  lines.push('} as const;', '');
  lines.push('export type AssetCategory = keyof typeof ASSETS;');
  lines.push('');
  lines.push('/** Mapa plano nombre -> ruta, para resolver un sprite sin saber su categoria. */');
  lines.push('export const ASSET_BY_NAME: Record<string, string> = {');
  const flat = new Map();
  for (const [, name, rel] of entries) if (!flat.has(name)) flat.set(name, rel);
  for (const [name, rel] of [...flat].sort()) {
    lines.push(`  ${JSON.stringify(name)}: ${JSON.stringify(rel)},`);
  }
  lines.push('};', '');
  await fs.mkdir(path.dirname(INDEX_FILE), { recursive: true });
  await fs.writeFile(INDEX_FILE, lines.join('\n'), 'utf8');
}

async function main() {
  const report = { downloaded: [], skipped: [], missing: [], failed: [] };

  if (args.category) {
    const dest = args.dest || 'misc';
    const names = await crawlCategory(args.category, Number(args.limit || 500));
    console.log(`[bulk] ${args.category}: ${names.length} ficheros -> assets/${dest}`);
    await fetchCategory(dest, names, report);
  } else {
    const manifest = JSON.parse(
      await fs.readFile(path.join(ROOT, 'scripts', 'asset-manifest.json'), 'utf8'),
    );
    const only = args.only ? String(args.only).split(',') : null;
    for (const [category, names] of Object.entries(manifest)) {
      if (category.startsWith('$') || !Array.isArray(names)) continue;
      if (only && !only.includes(category)) continue;
      console.log(`[${category}] ${names.length} sprites...`);
      await fetchCategory(category, names, report);
    }
  }

  // El indice se reconstruye siempre leyendo el disco, no solo lo descargado en esta pasada.
  const diskEntries = [];
  for (const cat of await fs.readdir(OUT_DIR).catch(() => [])) {
    const dir = path.join(OUT_DIR, cat);
    if (!(await fs.stat(dir)).isDirectory()) continue;
    for (const file of await fs.readdir(dir)) {
      if (!/\.(png|gif|jpg)$/i.test(file)) continue;
      diskEntries.push([cat, file.replace(/\.(png|gif|jpg)$/i, ''), `assets/${cat}/${file}`]);
    }
  }
  await writeIndex(diskEntries);

  console.log(`\n  descargados: ${report.downloaded.length}`);
  console.log(`  ya estaban:  ${report.skipped.length}`);
  console.log(`  en indice:   ${diskEntries.length}`);
  if (report.missing.length)
    console.log(`\n  NO EXISTEN en la wiki (revisa el nombre):\n   - ${report.missing.join('\n   - ')}`);
  if (report.failed.length) console.log(`\n  FALLARON:\n   - ${report.failed.join('\n   - ')}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
