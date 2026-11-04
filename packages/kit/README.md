# @echedev/kit

<div align="center">

```
   _____ _____ _    _ ______ _____  ________      __  _  _______ _______ 
  |  ___/ ____| |  | |  ____|  __ \|  ____\ \    / / | |/ /_   _|__   __|
  | |__| |    | |__| | |__  | |  | | |__   \ \  / /  | ' /  | |    | |   
  |  __| |    |  __  |  __| | |  | |  __|   \ \/ /   |  <   | |    | |   
  | |__| |____| |  | | |____| |__| | |____   \  /    | . \ _| |_   | |   
  |_____\_____|_|  |_|______|_____/|______|   \/     |_|\_\_____|  |_|   
```

**La librería y CLI de componentes HTML, CSS y JS con más de 1,000 elementos listos para usar.**

[![npm version](https://img.shields.io/npm/v/@echedev/kit.svg?style=flat-square)](https://www.npmjs.com/package/@echedev/kit)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![Web](https://img.shields.io/badge/Web-Oficial-00f0ff.svg?style=flat-square)](https://libreria-html-css.vercel.app)

</div>

---

## ⚡ ¿Qué es @echedev/kit?

**@echedev/kit** es una solución híbrida (CLI + Paquete NPM) para integrar componentes visuales de alta calidad en cualquier proyecto web con **un solo comando**, sin dependencias obligatorias ni complejidad de configuración:

- 💎 **Más de 1,000 componentes**: Efectos de texto, botones animados, tarjetas 3D, loaders futuristas, formularios interactivos y navegación moderna.
- 🚀 **Zero Dependencies**: El CLI y la librería funcionan con Node.js puro nativo, sin dependencias externas pesadas ni vulnerabilidades.
- 🧩 **Compatible con cualquier stack**: HTML nativo, Astro, React, Next.js, Vue, Svelte, Angular, Vite o WordPress.
- 📦 **Propiedad 100% de tu código**: Al instalar un componente, el código HTML, CSS y JS se descarga en tu proyecto para que lo modifiques y adaptes a tu gusto.

---

## 🛠️ Instalación rápida (CLI en un solo comando)

No necesitas instalar nada previamente. Simplemente usa `npx`:

```bash
# Instalar un componente directamente en tu proyecto
npx @echedev/kit add 3d-cube-rubiks-twist

# Instalar varios componentes a la vez
npx @echedev/kit add neon-button glow-card

# Instalar en una carpeta personalizada
npx @echedev/kit add neon-button -o ./src/components/ui
```

### ¿Qué se crea al instalar un componente?

Cada componente descargado incluye:
1. `index.html`: Demo autónoma completa ejecutable en el navegador.
2. `snippet.html`: Código HTML limpio listo para pegar en tu template o vista.
3. `styles.css`: Estilos CSS aislados del componente.
4. `script.js`: Interactividad en JavaScript (si el componente lo requiere).
5. `README.md`: Instrucciones rápidas de integración.

---

## 🔍 Comandos del CLI

| Comando | Descripción | Ejemplo |
|---|---|---|
| `npx @echedev/kit add <id...>` | Instala uno o más componentes | `npx @echedev/kit add 3d-card` |
| `npx @echedev/kit search <término>` | Busca componentes por nombre o tag | `npx @echedev/kit search button` |
| `npx @echedev/kit list` | Lista componentes disponibles | `npx @echedev/kit list -c Buttons` |
| `npx @echedev/kit info <id>` | Inspecciona detalles de un componente | `npx @echedev/kit info 3d-range-slider` |
| `npx @echedev/kit categories` | Lista todas las categorías y cantidad | `npx @echedev/kit categories` |
| `npx @echedev/kit init` | Crea el fichero de configuración local | `npx @echedev/kit init` |
| `npx @echedev/kit` | Abre el **modo interactivo** en terminal | `npx @echedev/kit` |

### Opciones y Banderas
- `-o, --output <dir>`: Ruta de destino (por defecto: `./components/echedev/`).
- `-f, --overwrite`: Sobrescribe archivos si ya existen.
- `--flat`: Guarda los archivos directamente en el directorio sin crear subcarpeta con el ID.
- `--snippet-only`: Copia solo `snippet.html`, `styles.css` y `script.js`.
- `-c, --category <nombre>`: Filtra por categoría en `list`.
- `-l, --limit <n>`: Limita la cantidad de resultados devueltos.
- `--json`: Devuelve los resultados en formato JSON estructurado.

---

## 📦 Uso como Paquete NPM (API Programática)

Si prefieres integrarlo en tus scripts de build, plugins de Vite o utilidades internas:

```bash
npm install @echedev/kit
```

```javascript
import {
  getComponent,
  searchComponents,
  listComponents,
  getCategories,
  installComponent
} from '@echedev/kit';

// 1. Buscar componentes
const buttons = await searchComponents('glow');

// 2. Obtener el código de un componente
const card = await getComponent('3d-card');
console.log(card.snippet); // HTML listo para usar
console.log(card.css);     // Estilos CSS

// 3. Instalar programáticamente
await installComponent('3d-card', {
  outputDir: './src/ui',
  overwrite: true
});
```

---

## 🎨 Categorías Disponibles

- **Effects**: Efectos visuales, texto y shaders CSS (+200 componentes).
- **Buttons**: Botones interactivos con animaciones avanzadas (+89 componentes).
- **Cards**: Tarjetas de producto, perfiles y 3D glassmorphism (+96 componentes).
- **Loaders**: Indicadores de carga y spinners futuristas (+96 componentes).
- **Navigation**: Barras de navegación, docks y menús (+161 componentes).
- **Animations**: Animaciones puras en CSS y JS (+101 componentes).
- **Controls**: Sliders, toggles, switches e inputs especiales (+93 componentes).
- **Forms**: Formularios de login, registro y checkout (+85 componentes).
- **Galleries**: Galerías interactivas, carruseles y grids (+95 componentes).

---

## 📄 Licencia

MIT © [Eche-Dev](https://github.com/Eche-Dev)
