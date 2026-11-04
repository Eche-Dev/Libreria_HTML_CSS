import { readFile, readdir, mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { extractSnippet } from "./utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const kitRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(kitRoot, "../..");

const registryCatalogPath = path.join(kitRoot, "registry", "catalog.json");
const registryComponentsDir = path.join(kitRoot, "registry", "components");
const fallbackCatalogPath = path.join(repoRoot, "Web", "data", "catalog.json");

let cachedCatalog = null;

/**
 * Comprueba si un fichero o directorio existe de forma asíncrona.
 *
 * @param {string} targetPath
 * @returns {Promise<boolean>}
 */
async function fileExists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Obtiene el catálogo completo de componentes.
 * Busca primero en el registro empaquetado; si no existe, recurre al catálogo del monorepo.
 *
 * @returns {Promise<Array<object>>}
 */
export async function getCatalog() {
  if (cachedCatalog) return cachedCatalog;

  if (await fileExists(registryCatalogPath)) {
    const raw = await readFile(registryCatalogPath, "utf8");
    cachedCatalog = JSON.parse(raw);
    return cachedCatalog;
  }

  if (await fileExists(fallbackCatalogPath)) {
    const raw = await readFile(fallbackCatalogPath, "utf8");
    const rawCatalog = JSON.parse(raw);
    cachedCatalog = rawCatalog.map((item) => ({
      id: item.id,
      name: item.name || item.id,
      category: item.category || "Other",
      author: item.author || "Eche-Dev",
      description: item.descriptionEs || item.description || "",
      tags: Array.isArray(item.tags) ? item.tags : [],
      hasJs: true, // Se resolverá bajo demanda
      hasCss: true,
      _preview: item.preview,
    }));
    return cachedCatalog;
  }

  throw new Error(
    "No se encontró el catálogo de componentes. Ejecuta `npm run kit:build` o `npm run catalogo`."
  );
}

/**
 * Lista los componentes con opciones de filtrado.
 *
 * @param {object} [options]
 * @param {string} [options.category] Filtrar por categoría
 * @param {string} [options.author] Filtrar por autor
 * @param {string} [options.search] Término de búsqueda
 * @param {number} [options.limit] Límite de resultados
 * @param {number} [options.offset] Desplazamiento
 * @returns {Promise<Array<object>>}
 */
export async function listComponents(options = {}) {
  const { category, author, search, limit = 100, offset = 0 } = options;
  let items = await getCatalog();

  if (category) {
    const catLower = category.toLowerCase();
    items = items.filter((item) => item.category?.toLowerCase() === catLower);
  }

  if (author) {
    const authorLower = author.toLowerCase();
    items = items.filter((item) => item.author?.toLowerCase() === authorLower);
  }

  if (search) {
    const q = search.toLowerCase();
    items = items.filter(
      (item) =>
        (item.id && item.id.toLowerCase().includes(q)) ||
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q)) ||
        (Array.isArray(item.tags) && item.tags.some((tag) => typeof tag === "string" && tag.toLowerCase().includes(q)))
    );
  }

  return items.slice(offset, offset + limit);
}

/**
 * Devuelve un resumen de categorías con la cantidad de componentes en cada una.
 *
 * @returns {Promise<Record<string, number>>}
 */
export async function getCategories() {
  const items = await getCatalog();
  const counts = {};
  for (const item of items) {
    counts[item.category] = (counts[item.category] || 0) + 1;
  }
  return counts;
}

/**
 * Busca componentes según palabras clave en id, nombre, etiquetas y descripción.
 *
 * @param {string} query
 * @param {object} [options]
 * @param {number} [options.limit]
 * @returns {Promise<Array<object>>}
 */
export async function searchComponents(query, options = {}) {
  const { limit = 20 } = options;
  if (!query || typeof query !== "string") return [];

  const q = query.trim().toLowerCase();
  const items = await getCatalog();

  const scored = [];
  for (const item of items) {
    let score = 0;
    const idLower = item.id ? item.id.toLowerCase() : "";
    const nameLower = item.name ? item.name.toLowerCase() : "";

    if (idLower === q) score += 100;
    else if (idLower.startsWith(q)) score += 50;
    else if (idLower.includes(q)) score += 20;

    if (nameLower === q) score += 80;
    else if (nameLower.includes(q)) score += 15;

    if (Array.isArray(item.tags)) {
      if (item.tags.some((t) => typeof t === "string" && t.toLowerCase() === q)) score += 30;
      else if (item.tags.some((t) => typeof t === "string" && t.toLowerCase().includes(q))) score += 10;
    }

    if (item.description && typeof item.description === "string" && item.description.toLowerCase().includes(q)) {
      score += 5;
    }
    if (item.category && typeof item.category === "string" && item.category.toLowerCase().includes(q)) {
      score += 10;
    }

    if (score > 0) {
      scored.push({ item, score });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map((s) => s.item);
}

/**
 * Obtiene los datos completos y archivos de un componente por su ID.
 *
 * @param {string} id ID del componente (ej. '3d-cube-rubiks-twist')
 * @returns {Promise<object>}
 */
export async function getComponent(id) {
  if (!id) throw new Error("Debes proporcionar un ID de componente.");

  const compDir = path.join(registryComponentsDir, id);

  // 1. Intentar leer desde el registro empaquetado
  if (await fileExists(compDir)) {
    const metaPath = path.join(compDir, "meta.json");
    const meta = (await fileExists(metaPath))
      ? JSON.parse(await readFile(metaPath, "utf8"))
      : { id, name: id };

    const files = {};
    for (const f of ["index.html", "snippet.html", "styles.css", "script.js", "README.md"]) {
      const p = path.join(compDir, f);
      if (await fileExists(p)) {
        files[f] = await readFile(p, "utf8");
      }
    }

    return {
      ...meta,
      files,
      html: files["index.html"] || "",
      snippet: files["snippet.html"] || "",
      css: files["styles.css"] || "",
      js: files["script.js"] || "",
    };
  }

  // 2. Fallback: leer desde los fuentes del monorepo
  const catalog = await getCatalog();
  const entry = catalog.find((c) => c.id === id);
  if (!entry) {
    throw new Error(`Componente con id "${id}" no encontrado.`);
  }

  const preview = entry._preview;
  if (!preview) {
    throw new Error(`Ruta fuente no disponible para el componente "${id}".`);
  }

  const demoHtmlPath = path.resolve(repoRoot, "Web", preview);
  const demoDir = path.dirname(demoHtmlPath);

  const htmlContent = await readFile(demoHtmlPath, "utf8");
  const dirFiles = await readdir(demoDir);

  let cssContent = "";
  const cssFile = dirFiles.find((f) => f.toLowerCase().endsWith(".css"));
  if (cssFile) {
    cssContent = await readFile(path.join(demoDir, cssFile), "utf8");
  }

  let jsContent = "";
  const jsFile = dirFiles.find((f) => f.toLowerCase().endsWith(".js"));
  if (jsFile) {
    jsContent = await readFile(path.join(demoDir, jsFile), "utf8");
  }

  const snippet = extractSnippet(htmlContent);

  const files = {
    "index.html": htmlContent,
    "snippet.html": snippet,
  };
  if (cssContent) files["styles.css"] = cssContent;
  if (jsContent) files["script.js"] = jsContent;

  return {
    id: entry.id,
    name: entry.name,
    category: entry.category,
    author: entry.author,
    description: entry.description,
    tags: entry.tags,
    hasJs: Boolean(jsContent),
    hasCss: Boolean(cssContent),
    files,
    html: htmlContent,
    snippet,
    css: cssContent,
    js: jsContent,
  };
}

/**
 * Instala un componente en el sistema de archivos del usuario.
 *
 * @param {string} id ID del componente
 * @param {object} [options]
 * @param {string} [options.outputDir] Directorio destino
 * @param {boolean} [options.flat] Si se guardan los archivos sin crear subcarpeta
 * @param {boolean} [options.overwrite] Sobrescribir archivos existentes
 * @param {boolean} [options.snippetOnly] Instalar únicamente snippet.html, styles.css y script.js
 * @returns {Promise<{ targetDir: string, writtenFiles: string[] }>}
 */
export async function installComponent(id, options = {}) {
  const {
    outputDir = path.join(process.cwd(), "components", "echedev"),
    flat = false,
    overwrite = false,
    snippetOnly = false,
  } = options;

  const component = await getComponent(id);
  const targetDir = flat ? path.resolve(outputDir) : path.join(path.resolve(outputDir), id);

  await mkdir(targetDir, { recursive: true });

  const writtenFiles = [];
  const filesToWrite = { ...component.files };

  if (snippetOnly) {
    delete filesToWrite["index.html"];
    delete filesToWrite["README.md"];
  }

  for (const [filename, content] of Object.entries(filesToWrite)) {
    const destPath = path.join(targetDir, filename);

    if (!overwrite && (await fileExists(destPath))) {
      throw new Error(
        `El archivo ya existe: ${destPath}. Usa --overwrite o -f para sobrescribir.`
      );
    }

    await writeFile(destPath, content, "utf8");
    writtenFiles.push(destPath);
  }

  return {
    targetDir,
    writtenFiles,
    component,
  };
}
