/**
 * Utilidades de terminal y formateo sin dependencias externas para @echedev98/kit.
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
 * Extrae el contenido entre <body> y </body> si están presentes.
 *
 * @param {string} rawHtml
 * @returns {string}
 */
function extractBody(rawHtml) {
  const lower = rawHtml.toLowerCase();
  const bodyStart = lower.indexOf("<body");
  if (bodyStart === -1) return rawHtml;

  const bodyTagEnd = lower.indexOf(">", bodyStart);
  if (bodyTagEnd === -1) return rawHtml;

  const bodyClose = lower.lastIndexOf("</body>");
  if (bodyClose > bodyTagEnd) {
    return rawHtml.slice(bodyTagEnd + 1, bodyClose);
  }
  return rawHtml;
}

/**
 * Elimina etiquetas <script>...</script> del fragmento HTML.
 *
 * @param {string} html
 * @returns {string}
 */
function removeScriptTags(html) {
  let clean = "";
  let idx = 0;
  const lower = html.toLowerCase();

  while (idx < html.length) {
    const scriptStart = lower.indexOf("<script", idx);
    if (scriptStart === -1) {
      clean += html.slice(idx);
      break;
    }
    clean += html.slice(idx, scriptStart);
    const scriptTagEnd = lower.indexOf(">", scriptStart);
    if (scriptTagEnd === -1) break;

    const scriptClose = lower.indexOf("</script", scriptTagEnd);
    if (scriptClose === -1) break;

    const closeTagEnd = lower.indexOf(">", scriptClose);
    if (closeTagEnd === -1) break;

    idx = closeTagEnd + 1;
  }
  return clean;
}

/**
 * Elimina etiquetas <link ...rel="stylesheet"...> del fragmento HTML.
 *
 * @param {string} html
 * @returns {string}
 */
function removeStyleLinks(html) {
  let clean = "";
  let idx = 0;
  const lower = html.toLowerCase();

  while (idx < html.length) {
    const linkStart = lower.indexOf("<link", idx);
    if (linkStart === -1) {
      clean += html.slice(idx);
      break;
    }
    clean += html.slice(idx, linkStart);
    const linkTagEnd = lower.indexOf(">", linkStart);
    if (linkTagEnd === -1) break;

    const tagChunk = lower.slice(linkStart, linkTagEnd + 1);
    if (!tagChunk.includes("stylesheet")) {
      clean += html.slice(linkStart, linkTagEnd + 1);
    }
    idx = linkTagEnd + 1;
  }
  return clean;
}

/**
 * Elimina comentarios HTML <!-- ... --> del fragmento.
 *
 * @param {string} html
 * @returns {string}
 */
function removeComments(html) {
  let clean = "";
  let idx = 0;

  while (idx < html.length) {
    const commentStart = html.indexOf("<!--", idx);
    if (commentStart === -1) {
      clean += html.slice(idx);
      break;
    }
    clean += html.slice(idx, commentStart);
    const commentEnd = html.indexOf("-->", commentStart + 4);
    if (commentEnd === -1) break;
    idx = commentEnd + 3;
  }
  return clean;
}

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

  const body = extractBody(rawHtml);
  const withoutScripts = removeScriptTags(body);
  const withoutLinks = removeStyleLinks(withoutScripts);
  return removeComments(withoutLinks).trim();
}

/**
 * Muestra el banner visual de EchedevKit en la consola.
 */
export function printBanner() {
  const line0 = "   _____ _____ _    _ ______ _____  ________      __  _  _______ _______ ";
  const line1 = String.raw`  |  ___/ ____| |  | |  ____|  __ \|  ____\ \    / / | |/ /_   _|__   __|`;
  const line2 = String.raw`  | |__| |    | |__| | |__  | |  | | |__   \ \  / /  | ' /  | |    | |   `;
  const line3 = String.raw`  |  __| |    |  __  |  __| | |  | |  __|   \ \/ /   |  <   | |    | |   `;
  const line4 = String.raw`  | |__| |____| |  | | |____| |__| | |____   \  /    | . \ _| |_   | |   `;
  const line5 = String.raw`  |_____\_____|_|  |_|______|_____/|______|   \/     |_|\_\_____|  |_|   `;

  console.log(`
${c.cyan(c.bold(line0))}
${c.cyan(c.bold(line1))}
${c.cyan(c.bold(line2))}
${c.cyan(c.bold(line3))}
${c.cyan(c.bold(line4))}
${c.cyan(c.bold(line5))}
${c.gray("  ─────────────────────────────────────────────────────────────────────────")}
  ${c.bold("@echedev98/kit")} ${c.gray("—")} Colección de +1,000 componentes HTML, CSS y JS
  ${c.dim("Web oficial: https://libreria-html-css.vercel.app")}
`);
}
