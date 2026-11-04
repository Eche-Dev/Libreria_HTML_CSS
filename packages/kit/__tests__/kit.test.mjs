import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { mkdtemp, rm, readFile, access } from "node:fs/promises";
import os from "node:os";

import {
  getCatalog,
  getCategories,
  searchComponents,
  listComponents,
  getComponent,
  installComponent,
} from "../src/index.mjs";
import { extractSnippet } from "../src/utils.mjs";

test("getCatalog(): devuelve el catálogo completo de componentes", async () => {
  const catalog = await getCatalog();
  assert.ok(Array.isArray(catalog), "El catálogo debe ser un array");
  assert.ok(catalog.length >= 1000, "Debe contener al menos 1000 componentes");

  const first = catalog[0];
  assert.ok(first.id, "Cada componente debe tener un id");
  assert.ok(first.name, "Cada componente debe tener un name");
  assert.ok(first.category, "Cada componente debe tener una category");
});

test("getCategories(): devuelve el desglose de categorías", async () => {
  const categories = await getCategories();
  assert.ok(typeof categories === "object" && categories !== null);
  assert.ok(categories.Buttons > 0, "Debe haber componentes de tipo Buttons");
  assert.ok(categories.Cards > 0, "Debe haber componentes de tipo Cards");
  assert.ok(categories.Effects > 0, "Debe haber componentes de tipo Effects");
});

test("searchComponents(): busca por término coincidente", async () => {
  const results = await searchComponents("rubik");
  assert.ok(results.length > 0, "Debe encontrar resultados para 'rubik'");
  assert.ok(
    results.some((r) => r.id.includes("rubik")),
    "Al menos un resultado debe contener 'rubik' en su id"
  );
});

test("listComponents(): filtra por categoría", async () => {
  const buttons = await listComponents({ category: "Buttons", limit: 10 });
  assert.ok(buttons.length > 0, "Debe retornar botones");
  assert.ok(buttons.every((b) => b.category === "Buttons"), "Todos deben pertenecer a Buttons");
});

test("getComponent(): carga archivos completos del componente", async () => {
  const comp = await getComponent("3d-cube-rubiks-twist");
  assert.equal(comp.id, "3d-cube-rubiks-twist");
  assert.ok(comp.html.includes("<html") || comp.html.includes("<div"));
  assert.ok(comp.snippet.length > 0, "El snippet no debe estar vacío");
  assert.ok(comp.css.length > 0, "Debe tener hoja de estilos");
  assert.ok(comp.files["snippet.html"]);
  assert.ok(comp.files["styles.css"]);
});

test("extractSnippet(): remueve scripts, doctype y etiquetas head", () => {
  const raw = `<!DOCTYPE html>
<html>
<head>
  <title>Prueba</title>
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <!-- Comentario -->
  <div class="mi-boton">Click me</div>
  <script src="script.js"></script>
</body>
</html>`;

  const snippet = extractSnippet(raw);
  assert.equal(snippet, '<div class="mi-boton">Click me</div>');
});

test("installComponent(): escribe archivos en destino de forma segura", async () => {
  const tempDir = await mkdtemp(path.join(os.tmpdir(), "echedev-test-"));

  try {
    const res = await installComponent("3d-cube-rubiks-twist", {
      outputDir: tempDir,
      flat: true,
      overwrite: true,
    });

    assert.ok(res.writtenFiles.length >= 3, "Debe escribir al menos HTML, snippet y CSS");
    const snippetContent = await readFile(path.join(tempDir, "snippet.html"), "utf8");
    assert.ok(snippetContent.includes("rubik-scene"));
  } finally {
    await rm(tempDir, { recursive: true, force: true });
  }
});
