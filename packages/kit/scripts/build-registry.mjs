import { mkdir, readFile, readdir, writeFile, rm, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { extractSnippet } from "../src/utils.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const kitRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(kitRoot, "../..");
const registryDir = path.join(kitRoot, "registry");
const componentsDir = path.join(registryDir, "components");
const catalogPath = path.join(repoRoot, "Web", "data", "catalog.json");

/**
 * Ensures that catalog.json exists, generating it if needed.
 */
async function ensureCatalogExists() {
  try {
    await access(catalogPath);
  } catch {
    console.log("Generando catálogo desde Web/scripts/generate-catalog.mjs...");
    execFileSync(process.execPath, [path.join(repoRoot, "Web", "scripts", "generate-catalog.mjs")], {
      stdio: "inherit",
      cwd: repoRoot,
    });
  }
}

/**
 * Genera el archivo README para el componente.
 *
 * @param {object} meta
 * @param {string} snippet
 * @returns {string}
 */
function createReadme(meta, snippet) {
  const preview = snippet.slice(0, 150);
  const jsUsage = meta.hasJs ? '\n<!-- 3. Enlazar script -->\n<script src="./script.js"></script>' : "";

  return `# ${meta.name}

> Componente de la librería [@echedev98/kit](https://www.npmjs.com/package/@echedev98/kit)  
> Categoría: **${meta.category}** | Autor: **${meta.author}**

## Archivos incluidos
- \`index.html\`: Demo interactiva completa autónoma.
- \`snippet.html\`: Código HTML limpio listo para copiar en tu layout o componente.
- \`styles.css\`: Hoja de estilos del componente.${meta.hasJs ? "\n- `script.js`: Lógica interactiva en JavaScript." : ""}

## Cómo usarlo en tu HTML
\`\`\`html
<!-- 1. Enlazar estilos -->
<link rel="stylesheet" href="./styles.css">

<!-- 2. Pegar contenido de snippet.html -->
${preview}...
${jsUsage}
\`\`\`
`;
}

/**
 * Procesa y escribe un componente individual en el registro.
 *
 * @param {object} item
 * @returns {Promise<object|null>}
 */
async function processComponent(item) {
  const demoHtmlPath = path.resolve(repoRoot, "Web", item.preview);
  const demoDir = path.dirname(demoHtmlPath);

  let htmlContent = "";
  try {
    htmlContent = await readFile(demoHtmlPath, "utf8");
  } catch {
    console.warn(`[AVISO] No se pudo leer HTML para ${item.id} en ${demoHtmlPath}`);
    return null;
  }

  const dirFiles = await readdir(demoDir);
  const cssFile = dirFiles.find((f) => f.toLowerCase() === "styles.css") ||
                 dirFiles.find((f) => f.toLowerCase().endsWith(".css"));
  const cssContent = cssFile ? await readFile(path.join(demoDir, cssFile), "utf8") : "";

  const jsFile = dirFiles.find((f) => f.toLowerCase() === "script.js") ||
                dirFiles.find((f) => f.toLowerCase() === "main.js") ||
                dirFiles.find((f) => f.toLowerCase().endsWith(".js"));
  const jsContent = jsFile ? await readFile(path.join(demoDir, jsFile), "utf8") : "";

  const snippet = extractSnippet(htmlContent);
  const compTargetDir = path.join(componentsDir, item.id);
  await mkdir(compTargetDir, { recursive: true });

  await writeFile(path.join(compTargetDir, "index.html"), htmlContent, "utf8");
  await writeFile(path.join(compTargetDir, "snippet.html"), snippet, "utf8");

  if (cssContent) {
    await writeFile(path.join(compTargetDir, "styles.css"), cssContent, "utf8");
  }
  if (jsContent) {
    await writeFile(path.join(compTargetDir, "script.js"), jsContent, "utf8");
  }

  const meta = {
    id: item.id,
    name: item.name || item.id,
    category: item.category || "Other",
    author: item.author || "Eche-Dev",
    description: item.descriptionEs || item.description || "",
    tags: Array.isArray(item.tags) ? item.tags : [],
    hasJs: Boolean(jsContent),
    hasCss: Boolean(cssContent),
  };

  await writeFile(path.join(compTargetDir, "meta.json"), JSON.stringify(meta, null, 2), "utf8");
  await writeFile(path.join(compTargetDir, "README.md"), createReadme(meta, snippet), "utf8");

  return meta;
}

/**
 * Builds the standalone component registry for @echedev98/kit.
 */
async function buildRegistry() {
  console.log("==========================================");
  console.log("  @echedev98/kit - Compilador de Registro ");
  console.log("==========================================");

  await ensureCatalogExists();

  const rawCatalog = await readFile(catalogPath, "utf8");
  const catalog = JSON.parse(rawCatalog);
  console.log(`Catálogo cargado: ${catalog.length} componentes encontrados.`);

  await rm(componentsDir, { recursive: true, force: true });
  await mkdir(componentsDir, { recursive: true });

  const kitCatalog = [];
  for (const item of catalog) {
    const meta = await processComponent(item);
    if (meta) {
      kitCatalog.push(meta);
    }
  }

  await writeFile(
    path.join(registryDir, "catalog.json"),
    JSON.stringify(kitCatalog, null, 2),
    "utf8"
  );

  console.log(`\n✔ Registro compilado exitosamente: ${kitCatalog.length} componentes en ${registryDir}\n`);
}

// Ejecutar si se llama directamente con top-level await
if (path.resolve(process.argv[1]) === path.resolve(__filename)) {
  try {
    await buildRegistry();
  } catch (err) {
    console.error("Error al compilar el registro:", err);
    process.exit(1);
  }
}
