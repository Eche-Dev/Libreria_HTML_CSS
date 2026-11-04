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
 * Extrae de forma segura el fragmento HTML del cuerpo del documento.
 * No utiliza expresiones regulares complejas para evitar vulnerabilidades de ReDoS
 * o sanitización incompleta (CodeQL/SonarCloud).
 *
 * @param {string} rawHtml
 * @returns {string}
 */
export function extractSnippet(rawHtml) {
  if (!rawHtml || typeof rawHtml !== "string") return "";

  // 1. Extraer contenido entre <body> y </body> si existe
  let content = rawHtml;
  const lower = rawHtml.toLowerCase();
  const bodyStart = lower.indexOf("<body");
  if (bodyStart !== -1) {
    const bodyTagEnd = lower.indexOf(">", bodyStart);
    if (bodyTagEnd !== -1) {
      const bodyClose = lower.lastIndexOf("</body>");
      if (bodyClose > bodyTagEnd) {
        content = rawHtml.slice(bodyTagEnd + 1, bodyClose);
      }
    }
  }

  // 2. Eliminar etiquetas <script>...</script> completamente
  let clean = "";
  let idx = 0;
  while (idx < content.length) {
    const lowerContent = content.toLowerCase();
    const scriptStart = lowerContent.indexOf("<script", idx);
    if (scriptStart === -1) {
      clean += content.slice(idx);
      break;
    }
    clean += content.slice(idx, scriptStart);
    const scriptTagEnd = lowerContent.indexOf(">", scriptStart);
    if (scriptTagEnd === -1) break;

    const scriptClose = lowerContent.indexOf("</script", scriptTagEnd);
    if (scriptClose === -1) break;

    const closeTagEnd = lowerContent.indexOf(">", scriptClose);
    if (closeTagEnd === -1) break;

    idx = closeTagEnd + 1;
  }
  content = clean;

  // 3. Eliminar etiquetas <link ...rel="stylesheet"...>
  clean = "";
  idx = 0;
  while (idx < content.length) {
    const lowerContent = content.toLowerCase();
    const linkStart = lowerContent.indexOf("<link", idx);
    if (linkStart === -1) {
      clean += content.slice(idx);
      break;
    }
    clean += content.slice(idx, linkStart);
    const linkTagEnd = lowerContent.indexOf(">", linkStart);
    if (linkTagEnd === -1) break;

    const tagChunk = lowerContent.slice(linkStart, linkTagEnd + 1);
    if (!tagChunk.includes("stylesheet")) {
      clean += content.slice(linkStart, linkTagEnd + 1);
    }
    idx = linkTagEnd + 1;
  }
  content = clean;

  // 4. Eliminar comentarios HTML <!-- ... -->
  clean = "";
  idx = 0;
  while (idx < content.length) {
    const commentStart = content.indexOf("<!--", idx);
    if (commentStart === -1) {
      clean += content.slice(idx);
      break;
    }
    clean += content.slice(idx, commentStart);
    const commentEnd = content.indexOf("-->", commentStart + 4);
    if (commentEnd === -1) break;
    idx = commentEnd + 3;
  }

  return clean.trim();
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
  ${c.bold("@echedev98/kit")} ${c.gray("—")} Colección de +1,000 componentes HTML, CSS y JS
  ${c.dim("Web oficial: https://libreria-html-css.vercel.app")}
`);
}
