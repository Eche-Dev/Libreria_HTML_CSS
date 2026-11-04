import { mkdir, readFile, readdir, writeFile, rm, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

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
 * Extrae el snippet HTML puro del cuerpo del documento.
 *
 * @param {string} rawHtml
 * @returns {string}
 */
export function extractSnippet(rawHtml) {
  const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let content = bodyMatch ? bodyMatch[1] : rawHtml;

  // Eliminar referencias a scripts
  content = content.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");

  // Eliminar etiquetas <link rel="stylesheet" ...>
  content = content.replace(/<link\b[^>]*rel=["']?stylesheet["']?[^>]*>/gi, "");

  // Eliminar comentarios HTML para dejar el snippet limpio
  content = content.replace(/<!--[\s\S]*?-->/g, "");

  return content.trim();
}

/**
 * Builds the standalone component registry for @echedev/kit.
 */
async function buildRegistry() {
  console.log("==========================================");
  console.log("  @echedev/kit - Compilador de Registro   ");
  console.log("==========================================");

  await ensureCatalogExists();

  const rawCatalog = await readFile(catalogPath, "utf8");
  const catalog = JSON.parse(rawCatalog);
  console.log(`Catálogo cargado: ${catalog.length} componentes encontrados.`);

  // Limpiar y preparar directorios
  await rm(componentsDir, { recursive: true, force: true });
  await mkdir(componentsDir, { recursive: true });

  const kitCatalog = [];
  let totalFiles = 0;
  let totalBytes = 0;

  for (const item of catalog) {
    const demoHtmlPath = path.resolve(repoRoot, "Web", item.preview);
    const demoDir = path.dirname(demoHtmlPath);

    let htmlContent = "";
    try {
      htmlContent = await readFile(demoHtmlPath, "utf8");
    } catch {
      console.warn(`[AVISO] No se pudo leer HTML para ${item.id} en ${demoHtmlPath}`);
      continue;
    }

    const dirFiles = await readdir(demoDir);

    // Identificar archivo CSS
    let cssFile = dirFiles.find((f) => f.toLowerCase() === "styles.css") ||
                   dirFiles.find((f) => f.toLowerCase().endsWith(".css"));
    let cssContent = "";
    if (cssFile) {
      cssContent = await readFile(path.join(demoDir, cssFile), "utf8");
    }

    // Identificar archivo JS
    let jsFile = dirFiles.find((f) => f.toLowerCase() === "script.js") ||
                 dirFiles.find((f) => f.toLowerCase() === "main.js") ||
                 dirFiles.find((f) => f.toLowerCase().endsWith(".js"));
    let jsContent = "";
    if (jsFile) {
      jsContent = await readFile(path.join(demoDir, jsFile), "utf8");
    }

    const snippet = extractSnippet(htmlContent);

    // Crear carpeta para el componente
    const compTargetDir = path.join(componentsDir, item.id);
    await mkdir(compTargetDir, { recursive: true });

    // Guardar index.html (preview completa)
    await writeFile(path.join(compTargetDir, "index.html"), htmlContent, "utf8");
    totalFiles++;
    totalBytes += Buffer.byteLength(htmlContent);

    // Guardar snippet.html (código puro para incrustar)
    await writeFile(path.join(compTargetDir, "snippet.html"), snippet, "utf8");
    totalFiles++;
    totalBytes += Buffer.byteLength(snippet);

    // Guardar styles.css si existe
    if (cssContent) {
      await writeFile(path.join(compTargetDir, "styles.css"), cssContent, "utf8");
      totalFiles++;
      totalBytes += Buffer.byteLength(cssContent);
    }

    // Guardar script.js si existe
    if (jsContent) {
      await writeFile(path.join(compTargetDir, "script.js"), jsContent, "utf8");
      totalFiles++;
      totalBytes += Buffer.byteLength(jsContent);
    }

    // Guardar metadatos individuales
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
    totalFiles++;

    // Guardar README de uso rápido para el desarrollador que instale el componente
    const componentReadme = `# ${meta.name}

> Componente de la librería [@echedev/kit](https://www.npmjs.com/package/@echedev/kit)  
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
${snippet.slice(0, 150)}...

${meta.hasJs ? '<!-- 3. Enlazar script -->\n<script src="./script.js"></script>' : ""}
\`\`\`
`;
    await writeFile(path.join(compTargetDir, "README.md"), componentReadme, "utf8");
    totalFiles++;

    kitCatalog.push(meta);
  }

  // Guardar catálogo consolidado en el registro
  await writeFile(
    path.join(registryDir, "catalog.json"),
    JSON.stringify(kitCatalog, null, 2),
    "utf8"
  );
  totalFiles++;

  console.log(`\n✔ Registro compilado exitosamente:`);
  console.log(`  - Componentes procesados: ${kitCatalog.length}`);
  console.log(`  - Ficheros generados:     ${totalFiles}`);
  console.log(`  - Tamaño total:           ${(totalBytes / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  - Destino:                ${registryDir}\n`);
}

// Ejecutar si se llama directamente
if (process.argv[1] === __filename) {
  buildRegistry().catch((err) => {
    console.error("Error al compilar el registro:", err);
    process.exit(1);
  });
}
