#!/usr/bin/env node

/**
 * CLI de @echedev/kit
 * Instalable y ejecutable con un solo comando:
 *   npx @echedev/kit add <component-id>
 */

import path from "node:path";
import process from "node:process";
import readline from "node:readline";
import { readFile, writeFile, access } from "node:fs/promises";
import {
  getCatalog,
  getComponent,
  searchComponents,
  listComponents,
  getCategories,
  installComponent,
} from "../src/index.mjs";
import { c, symbols, printBanner } from "../src/utils.mjs";

const args = process.argv.slice(2);

/**
 * Muestra la ayuda principal del CLI.
 */
function showHelp() {
  printBanner();
  console.log(`
${c.bold("USO:")}
  ${c.cyan("npx @echedev/kit")} ${c.yellow("<comando>")} [opciones]

${c.bold("COMANDOS:")}
  ${c.green("add")} ${c.yellow("<id...>")}${" ".repeat(14)} Instala uno o más componentes en tu proyecto
  ${c.green("search")} ${c.yellow("<término>")}${" ".repeat(11)} Busca componentes por palabra clave o etiquetas
  ${c.green("list")}${" ".repeat(23)} Lista componentes disponibles (con filtros)
  ${c.green("info")} ${c.yellow("<id>")}${" ".repeat(18)} Muestra los detalles y archivos de un componente
  ${c.green("categories")}${" ".repeat(17)} Muestra las categorías disponibles y su conteo
  ${c.green("init")}${" ".repeat(23)} Crea la configuración 'echedev.json' en tu proyecto
  ${c.green("help")}${" ".repeat(23)} Muestra esta guía de ayuda

${c.bold("OPCIONES:")}
  ${c.yellow("-o, --output <dir>")}${" ".repeat(7)} Directorio de destino ${c.gray("(por defecto: ./components/echedev)")}
  ${c.yellow("-f, --overwrite")}${" ".repeat(10)} Sobrescribe archivos existentes si ya existen
  ${c.yellow("--flat")}${" ".repeat(19)} No crea subcarpeta por componente
  ${c.yellow("--snippet-only")}${" ".repeat(11)} Instala solo snippet.html, styles.css y script.js
  ${c.yellow("-c, --category <nombre>")}${" ".repeat(2)} Filtra por categoría en 'list'
  ${c.yellow("-l, --limit <número>")}${" ".repeat(6)} Límite de resultados ${c.gray("(por defecto: 50)")}
  ${c.yellow("--json")}${" ".repeat(19)} Devuelve la salida en formato JSON

${c.bold("EJEMPLOS:")}
  ${c.gray("# Instalar un componente con un solo comando")}
  ${c.cyan("npx @echedev/kit add 3d-cube-rubiks-twist")}

  ${c.gray("# Instalar varios componentes en una carpeta personalizada")}
  ${c.cyan("npx @echedev/kit add neon-button glow-card -o ./src/ui")}

  ${c.gray("# Buscar componentes de botones")}
  ${c.cyan("npx @echedev/kit search button")}

  ${c.gray("# Modo interactivo")}
  ${c.cyan("npx @echedev/kit")}
`);
}

/**
 * Lee opciones de configuración desde `echedev.json` si existe en el cwd.
 */
async function loadProjectConfig() {
  const configPath = path.join(process.cwd(), "echedev.json");
  try {
    await access(configPath);
    const content = await readFile(configPath, "utf8");
    return JSON.parse(content);
  } catch {
    return {};
  }
}

/**
 * Parsea argumentos simples de línea de comandos.
 */
function parseArgs(rawArgs) {
  const parsed = {
    command: "",
    positionals: [],
    output: null,
    overwrite: false,
    flat: false,
    snippetOnly: false,
    category: null,
    limit: null,
    json: false,
  };

  let i = 0;
  while (i < rawArgs.length) {
    const arg = rawArgs[i];

    if (arg === "-o" || arg === "--output") {
      parsed.output = rawArgs[++i];
    } else if (arg === "-f" || arg === "--overwrite") {
      parsed.overwrite = true;
    } else if (arg === "--flat") {
      parsed.flat = true;
    } else if (arg === "--snippet-only") {
      parsed.snippetOnly = true;
    } else if (arg === "-c" || arg === "--category") {
      parsed.category = rawArgs[++i];
    } else if (arg === "-l" || arg === "--limit") {
      parsed.limit = parseInt(rawArgs[++i], 10);
    } else if (arg === "--json") {
      parsed.json = true;
    } else if (arg === "-h" || arg === "--help") {
      parsed.command = "help";
    } else if (!parsed.command) {
      parsed.command = arg;
    } else {
      parsed.positionals.push(arg);
    }
    i++;
  }

  return parsed;
}

/**
 * Comando: add
 */
async function handleAdd(parsed) {
  const ids = parsed.positionals;
  if (ids.length === 0) {
    console.error(`\n${symbols.cross} ${c.red("Debes especificar al menos un ID de componente.")}`);
    console.log(`Ejemplo: ${c.cyan("npx @echedev/kit add 3d-cube-rubiks-twist")}\n`);
    process.exit(1);
  }

  const projectConfig = await loadProjectConfig();
  const outputDir = parsed.output || projectConfig.componentsDir || path.join(process.cwd(), "components", "echedev");

  console.log(`\n${symbols.bullet} Instalando ${c.bold(ids.length)} componente(s) en ${c.cyan(outputDir)}...\n`);

  for (const id of ids) {
    try {
      const result = await installComponent(id, {
        outputDir,
        flat: parsed.flat,
        overwrite: parsed.overwrite,
        snippetOnly: parsed.snippetOnly,
      });

      console.log(`${symbols.check} ${c.bold(c.green(id))} instalado con éxito en:`);
      console.log(`  ${c.gray(result.targetDir)}`);
      for (const file of result.writtenFiles) {
        console.log(`  ${c.dim("└─")} ${path.basename(file)}`);
      }
      console.log("");
    } catch (err) {
      console.error(`${symbols.cross} Error al instalar ${c.bold(id)}: ${c.red(err.message)}\n`);
    }
  }

  console.log(`${c.green(c.bold("¡Listo!"))} Puedes importar o enlazar los componentes directamente en tu HTML.\n`);
}

/**
 * Comando: search
 */
async function handleSearch(parsed) {
  const query = parsed.positionals.join(" ").trim();
  if (!query) {
    console.error(`\n${symbols.cross} ${c.red("Especifica un término de búsqueda.")}`);
    console.log(`Ejemplo: ${c.cyan("npx @echedev/kit search card")}\n`);
    process.exit(1);
  }

  const limit = parsed.limit || 20;
  const results = await searchComponents(query, { limit });

  if (parsed.json) {
    console.log(JSON.stringify(results, null, 2));
    return;
  }

  console.log(`\n${symbols.bullet} Resultados para ${c.cyan(`"${query}"`)} (${results.length} encontrados):\n`);

  if (results.length === 0) {
    console.log(`  ${c.yellow("No se encontraron componentes coincidentes.")}`);
    console.log(`  Prueba con otro término o usa ${c.cyan("npx @echedev/kit list")} para ver todos.\n`);
    return;
  }

  for (const item of results) {
    const hasJsTag = item.hasJs ? c.yellow(" [JS]") : "";
    console.log(`  ${c.bold(c.cyan(item.id))}${hasJsTag}`);
    console.log(`    ${c.gray("Categoría:")} ${item.category} | ${c.gray("Autor:")} ${item.author}`);
    if (item.description) {
      console.log(`    ${c.dim(item.description)}`);
    }
    console.log(`    ${c.gray("Para instalar:")} ${c.green(`npx @echedev/kit add ${item.id}`)}\n`);
  }
}

/**
 * Comando: list
 */
async function handleList(parsed) {
  const limit = parsed.limit || 30;
  const items = await listComponents({
    category: parsed.category,
    limit,
  });

  if (parsed.json) {
    console.log(JSON.stringify(items, null, 2));
    return;
  }

  console.log(`\n${symbols.bullet} Lista de componentes ${parsed.category ? `(Categoría: ${parsed.category})` : ""}:\n`);

  for (const item of items) {
    const jsIndicator = item.hasJs ? c.yellow(" [JS]") : "";
    console.log(`  ${c.bold(c.cyan(item.id.padEnd(35)))}${c.gray(item.category.padEnd(15))}${jsIndicator}`);
  }

  console.log(`\n  ${c.dim(`Mostrando ${items.length} componentes. Usa -l <n> para ver más o -c <categoría> para filtrar.`)}`);
  console.log(`  Para ver categorías: ${c.cyan("npx @echedev/kit categories")}\n`);
}

/**
 * Comando: info
 */
async function handleInfo(parsed) {
  const id = parsed.positionals[0];
  if (!id) {
    console.error(`\n${symbols.cross} ${c.red("Especifica el ID del componente.")}`);
    console.log(`Ejemplo: ${c.cyan("npx @echedev/kit info 3d-cube-rubiks-twist")}\n`);
    process.exit(1);
  }

  try {
    const comp = await getComponent(id);

    if (parsed.json) {
      console.log(JSON.stringify(comp, null, 2));
      return;
    }

    console.log(`\n${symbols.star} ${c.bold(c.cyan(comp.name))} ${c.gray(`(${comp.id})`)}`);
    console.log(`  ${c.bold("Categoría:")}   ${comp.category}`);
    console.log(`  ${c.bold("Autor:")}       ${comp.author}`);
    console.log(`  ${c.bold("Descripción:")} ${comp.description || "N/A"}`);
    console.log(`  ${c.bold("Etiquetas:")}   ${comp.tags.join(", ") || "N/A"}`);
    console.log(`  ${c.bold("Archivos:")}    ${Object.keys(comp.files).join(", ")}`);
    console.log(`\n${c.bold("Instalación rápida:")}`);
    console.log(`  ${c.green(`npx @echedev/kit add ${comp.id}`)}\n`);
  } catch (err) {
    console.error(`\n${symbols.cross} ${c.red(err.message)}\n`);
    process.exit(1);
  }
}

/**
 * Comando: categories
 */
async function handleCategories(parsed) {
  const categories = await getCategories();

  if (parsed.json) {
    console.log(JSON.stringify(categories, null, 2));
    return;
  }

  console.log(`\n${symbols.bullet} Categorías disponibles en @echedev/kit:\n`);

  for (const [cat, count] of Object.entries(categories)) {
    console.log(`  ${c.cyan(cat.padEnd(20))} ${c.bold(String(count).padStart(5))} componentes`);
  }

  console.log(`\n  Filtra por categoría: ${c.cyan("npx @echedev/kit list -c Buttons")}\n`);
}

/**
 * Comando: init
 */
async function handleInit() {
  const configPath = path.join(process.cwd(), "echedev.json");
  const defaultConfig = {
    $schema: "https://libreria-html-css.vercel.app/schema.json",
    componentsDir: "./components/echedev",
    snippetOnly: false,
  };

  try {
    await writeFile(configPath, JSON.stringify(defaultConfig, null, 2), "utf8");
    console.log(`\n${symbols.check} Archivo de configuración ${c.bold("echedev.json")} creado exitosamente.`);
    console.log(`  Directorio por defecto de componentes: ${c.cyan("./components/echedev")}\n`);
  } catch (err) {
    console.error(`\n${symbols.cross} Error al crear echedev.json: ${c.red(err.message)}\n`);
    process.exit(1);
  }
}

/**
 * Modo interactivo para cuando se ejecuta `npx @echedev/kit` sin argumentos.
 */
async function runInteractive() {
  printBanner();

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (q) => new Promise((resolve) => rl.question(q, resolve));

  console.log(`  1) Buscar componentes`);
  console.log(`  2) Explorar por categoría`);
  console.log(`  3) Instalar componente por ID`);
  console.log(`  4) Inicializar proyecto (echedev.json)`);
  console.log(`  5) Salir\n`);

  const choice = (await question(c.bold("Selecciona una opción (1-5): "))).trim();

  if (choice === "1") {
    const q = (await question(c.cyan("Introduce término a buscar: "))).trim();
    rl.close();
    if (q) await handleSearch({ positionals: [q], limit: 10 });
  } else if (choice === "2") {
    rl.close();
    await handleCategories({});
  } else if (choice === "3") {
    const id = (await question(c.cyan("Introduce ID del componente: "))).trim();
    rl.close();
    if (id) await handleAdd({ positionals: [id] });
  } else if (choice === "4") {
    rl.close();
    await handleInit();
  } else {
    rl.close();
    console.log(`\n¡Hasta pronto! Visita ${c.cyan("https://libreria-html-css.vercel.app")}\n`);
  }
}

/**
 * Punto de entrada principal
 */
async function main() {
  const parsed = parseArgs(args);

  switch (parsed.command) {
    case "add":
      await handleAdd(parsed);
      break;
    case "search":
    case "find":
      await handleSearch(parsed);
      break;
    case "list":
    case "ls":
      await handleList(parsed);
      break;
    case "info":
    case "view":
      await handleInfo(parsed);
      break;
    case "categories":
    case "cats":
      await handleCategories(parsed);
      break;
    case "init":
      await handleInit(parsed);
      break;
    case "help":
      showHelp();
      break;
    case "":
      if (process.stdin.isTTY) {
        await runInteractive();
      } else {
        showHelp();
      }
      break;
    default:
      console.error(`\n${symbols.cross} Comando desconocido: ${c.red(parsed.command)}`);
      showHelp();
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(`\n${symbols.cross} Error inesperado:`, err);
  process.exit(1);
});
