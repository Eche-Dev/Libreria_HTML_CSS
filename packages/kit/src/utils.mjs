/**
 * Utilidades de terminal y formateo sin dependencias externas para @echedev/kit.
 */

const isColorSupported =
  Boolean(process.stdout.isTTY) &&
  !process.env.NO_COLOR &&
  (process.env.TERM !== "dumb" || Boolean(process.env.CI));

/**
 * Aplica estilos ANSI si la terminal lo soporta.
 */
function wrap(open, close) {
  return (text) => (isColorSupported ? `\x1b[${open}m${text}\x1b[${close}m` : String(text));
}

export const c = {
  bold: wrap(1, 22),
  dim: wrap(2, 22),
  italic: wrap(3, 23),
  underline: wrap(4, 24),
  red: wrap(31, 39),
  green: wrap(32, 39),
  yellow: wrap(33, 39),
  blue: wrap(34, 39),
  magenta: wrap(35, 39),
  cyan: wrap(36, 39),
  white: wrap(37, 39),
  gray: wrap(90, 39),
};

export const symbols = {
  check: c.green("✔"),
  cross: c.red("✖"),
  info: c.cyan("ℹ"),
  bullet: c.magenta("◆"),
  star: c.yellow("★"),
  arrow: c.cyan("→"),
};

/**
 * Extrae el snippet HTML puro del cuerpo del documento.
 *
 * @param {string} rawHtml
 * @returns {string}
 */
export function extractSnippet(rawHtml) {
  const bodyMatch = rawHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  let content = bodyMatch ? bodyMatch[1] : rawHtml;

  // Quitar etiquetas script
  content = content.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");

  // Quitar links stylesheet
  content = content.replace(/<link\b[^>]*rel=["']?stylesheet["']?[^>]*>/gi, "");

  // Quitar comentarios HTML para dejar el snippet limpio
  content = content.replace(/<!--[\s\S]*?-->/g, "");

  return content.trim();
}

/**
 * Muestra el banner visual de EchedevKit en la consola.
 */
export function printBanner() {
  console.log(`
${c.cyan(c.bold("   _____ _____ _    _ ______ _____  ________      __  _  _______ _______ "))}
${c.cyan(c.bold("  |  ___/ ____| |  | |  ____|  __ \\|  ____\\ \\    / / | |/ /_   _|__   __|"))}
${c.cyan(c.bold("  | |__| |    | |__| | |__  | |  | | |__   \\ \\  / /  | ' /  | |    | |   "))}
${c.cyan(c.bold("  |  __| |    |  __  |  __| | |  | |  __|   \\ \\/ /   |  <   | |    | |   "))}
${c.cyan(c.bold("  | |__| |____| |  | | |____| |__| | |____   \\  /    | . \\ _| |_   | |   "))}
${c.cyan(c.bold("  |_____\\_____|_|  |_|______|_____/|______|   \\/     |_|\\_\\_____|  |_|   "))}
${c.gray("  ─────────────────────────────────────────────────────────────────────────")}
  ${c.bold("@echedev/kit")} ${c.gray("—")} Colección de +1,000 componentes HTML, CSS y JS
  ${c.dim("Web oficial: https://libreria-html-css.vercel.app")}
`);
}
