<div align="center">

# Biblioteca HTML y CSS

[![Validar sitio](https://github.com/kindred-98/Libreria_HTML_CSS/actions/workflows/validate.yml/badge.svg)](https://github.com/kindred-98/Libreria_HTML_CSS/actions/workflows/validate.yml)
[![CodeQL](https://github.com/kindred-98/Libreria_HTML_CSS/actions/workflows/codeql.yml/badge.svg)](https://github.com/kindred-98/Libreria_HTML_CSS/actions/workflows/codeql.yml)
[![Enlaces externos](https://github.com/kindred-98/Libreria_HTML_CSS/actions/workflows/enlaces-externos.yml/badge.svg)](https://github.com/kindred-98/Libreria_HTML_CSS/actions/workflows/enlaces-externos.yml)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=kindred-98_Libreria_HTML_CSS&metric=alert_status)](https://sonarcloud.io/dashboard?id=kindred-98_Libreria_HTML_CSS)
[![Web en vivo](https://img.shields.io/badge/web-libreria--html--css.vercel.app-0070F2)](https://libreria-html-css.vercel.app)
[![Licencia](https://img.shields.io/badge/licencia-MIT%20(parcial)-blue.svg)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-5FA04E.svg)](./package.json)

> [!WARNING]
> **El `LICENSE` de la raíz no cubre todo el repositorio.** Solo cubre el código
> original de la aplicación y la documentación. Los demos de terceros tienen sus
> propias licencias y `Docs/THIRD_PARTY_NOTICES.md` es la fuente de verdad sobre
> qué se puede redistribuir. Lee [Procedencia y licencias](#procedencia-y-licencias)
> antes de usar o publicar algo de aquí.

Biblioteca estática y con búsqueda de demos independientes de interfaces hechos con HTML, CSS y JavaScript. El repositorio contiene actualmente **1018 páginas de demos** repartidas en tres colecciones:

[![CI](https://github.com/kindred-98/Libreria_HTML_CSS/actions/workflows/validate.yml/badge.svg)](https://github.com/kindred-98/Libreria_HTML_CSS/actions/workflows/validate.yml)
[![CodeQL](https://github.com/kindred-98/Libreria_HTML_CSS/actions/workflows/codeql.yml/badge.svg)](https://github.com/kindred-98/Libreria_HTML_CSS/actions/workflows/codeql.yml)
[![Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=kindred-98_Libreria_HTML_CSS&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=kindred-98_Libreria_HTML_CSS)
[![Licencia](https://img.shields.io/badge/licencia-MIT-d4f779?style=flat-square&labelColor=1b231c)](./LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D20-5FA04E?style=flat-square&labelColor=1b231c)](./package.json)

[**Ver la biblioteca**](https://libreria-html-css.vercel.app/) · [Cómo usar un componente](./Web/como-usar.html) · [Privacidad](./Web/privacidad.html) · [Aviso legal](./Web/legal.html)

> 🎉 **Versión estable 1.0.0 publicada.** [Ver notas de la release](https://github.com/kindred-98/Libreria_HTML_CSS/releases/tag/v1.0.0).

</div>

---

## Qué es

Una colección de **1 018 demos** de interfaz web, repartidos en tres
colecciones, con buscador, filtros, vistas previas reales y **descarga del
código fuente en ZIP**. Cada demo es un componente autónomo pensado para
copiarse tal cual: no hay framework, ni paso de compilación, ni
dependencias que instalar para usarlo.

| Colección                                      | Qué contiene                                                                  | ZIP |
| ---------------------------------------------- | ----------------------------------------------------------------------------- | --- |
| [`CreacionesNuevas/`](./CreacionesNuevas/)     | **248** creaciones originales del autor, cada una con su `LICENSE` MIT propio | Sí  |
| [`creaciones-primium/`](./creaciones-primium/) | **651** creaciones en curso por categorías (de **kindred-98** y **fatmaerm**) | Sí  |
| [`DavokerDiseñador/`](./DavokerDiseñador/)     | **119** efectos de texto de **davoker**, cada uno con su showcase y su `.zip` | Sí  |

## Tabla de contenidos

- [Características](#características)
- [Stack técnico](#stack-técnico)
- [Ejecutar en local](#ejecutar-en-local)
- [Estructura](#estructura)
- [Añadir un demo](#añadir-un-demo)
- [Vistas previas y código](#vistas-previas-y-código)
- [Procedencia y licencias](#procedencia-y-licencias)
  - [Material retirado](#material-retirado)
- [Despliegue](#despliegue)
  - [Vercel](#vercel)
  - [El catálogo se genera en el despliegue](#el-catálogo-se-genera-en-el-despliegue)
  - [GitHub Pages](#github-pages)
  - [Netlify](#netlify)
- [Validación continua](#validación-continua)
- [Contribuir](#contribuir)
- [Documentación](#documentación)

## Stack técnico

| Capa | Tecnología | Notas |
| --- | --- | --- |
| Markup | HTML5 semántico | Tres páginas: `index.html`, `components.html`, `team-core.html` |
| Estilos | CSS3 moderno | Custom properties, `grid`, `flexbox`, `@layer`, `color-mix()`, container queries |
| Lógica | JavaScript (ES modules) | Vanilla, sin framework ni transpilación |
| Build | Node.js 20+ | Solo scripts de catálogo, sellado y ZIP. Sin bundler |
| Despliegue | Vercel | Estático, sin backend ni base de datos |
| CI | GitHub Actions | Node 20, 22 y 24 en `ubuntu-24.04` |
| Calidad | SonarCloud, CodeQL | Analysis y quality gates |
| Dependencias de runtime | **Ninguna** | El sitio no carga nada externo salvo fuentes y analítica |

No hay frameworks, no hay paso de compilación y no hay paso de instalación de
paquetes para ver el sitio en marcha. Los `devDependencies` del `package.json`
existen solo para las comprobaciones de CI.

## Ejecutar en local

> `GevendraAutorExterno/` **no forma parte del repositorio**. Está en
> `.gitignore`, no está en el disco y sus 116 demos no se catalogan ni se
> sirven: su material no declara licencia. Ver [Material retirado](#material-retirado).

---

## Características

- **Búsqueda** por nombre, categoría, descripción y etiquetas, sin distinguir
  mayúsculas.
- **Filtros** por categoría (inferidas del nombre del demo) y por autor. Cada
  botón lleva su propia animación: davoker _Liquid Fill_, kindred-98
  _Datamosh_, fatmaerm _Neutron Star_.
- **Vistas previas reales**: cada tarjeta carga el `index.html` original en un
  `iframe`. No son capturas.
- **Código fuente a la vista**: el detalle trae el HTML, el CSS y el JavaScript
  de cada demo, con botones de copia.
- **Descarga en ZIP** solo tras verificar la fuente, los permisos de
  redistribución y la licencia individual de cada pieza.
- **Tema oscuro y claro**, con la preferencia recordada en el navegador.
- **Interfaz en español e inglés**, con el idiomaindependiente independiente del tema.
- **Accesible**: navegación por teclado, foco visible, `prefers-reduced-motion`
  respetado y **0 violaciones serious ni critical** en axe-core.
- **Instalable**: se puede añadir a la pantalla de inicio como aplicación.
- **Sin frameworks, sin backend, sin paso de compilación.**

---

## Dependencias

### En producción: ninguna

El sitio es HTML, CSS y JavaScript a pelo. **No hay `node_modules` en
producción, ni framework, ni bundler.** Todo lo que se descarga el visitante
son los ficheros del repositorio.

Esto es deliberado: el sitio carga sin build, funciona sin JavaScript en las
páginas de texto, y su `Lighthouse` de escritorio está en **99-100**.

### De desarrollo (9 paquetes, todos `devDependencies`)

Se usan **solo** para generar el catálogo, validar y medir. No se despliegan.

| Paquete                                                                                                          | Para qué                                                                               |
| ---------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| [`playwright`](https://playwright.dev)                                                                           | Abrir Chromium en los validadores de layout, accesibilidad, Lighthouse y los tests e2e |
| [`@axe-core/playwright`](https://github.com/dequelabs/axe-core-npm/tree/develop/packages/%40axe-core/playwright) | Motor de accesibilidad                                                                 |
| [`lighthouse`](https://developer.chrome.com/docs/lighthouse/overview)                                            | Medición de rendimiento y SEO                                                          |
| [`html-validate`](https://html-validate.org)                                                                     | Validar el HTML de las páginas del sitio                                               |
| [`chrome-launcher`](https://github.com/GoogleChrome/chrome-launcher)                                             | Arrancar el Chromium que usa Lighthouse                                                |
| [`eslint`](https://eslint.org)                                                                                   | Lint del código de Node                                                                |
| [`prettier`](https://prettier.io)                                                                                | Formato del código de Node                                                             |
| [`typescript`](https://www.typescriptlang.org)                                                                   | Solo para `tsc --checkJs`: tipos sobre JavaScript                                      |
| `@types/node`                                                                                                    | Tipos de Node para el anterior                                                         |

**Instalar:**

```bash
npm install
npx playwright install chromium   # solo si vas a medir o a correr los e2e
```

**Requisitos:** Node.js **20 o superior** (lo declara `engines`).

---

## Empezar

Para probarla mediante HTTP, inicia un servidor estático desde la raíz del repositorio:

```powershell
node Web/scripts/serve.mjs
```

Abre <http://localhost:8000/>. La página raíz redirige a `/Web/`.

En Windows también puedes usar Python:

```bash
npm install
npm run catalogo     # genera Web/data/catalog.json y sources/
npm run servidor     # sirve el repositorio en http://localhost:8000
```

O iniciar Live Server en VS Code desde la raíz del repositorio. El servidor HTTP es recomendable para probar el portapapeles y las descargas ZIP; al abrir con `file://`, la compatibilidad de esas API depende del navegador.

---

## Estructura

```text
.
|-- CreacionesNuevas/           # 248 creaciones propias del autor (MIT, ZIP)
|-- creaciones-primium/         # 651 creaciones en curso, por categorías (MIT, ZIP)
|-- DavokerDiseñador/           # 119 efectos de texto de davoker + su portada
|-- Web/
|   |-- index.html              # Portada
|   |-- components.html         # Listado y detalle de componentes
|   |-- team-core.html          # Equipo y donación
|   |-- como-usar.html          # Cómo usar un componente (guía para visitantes)
|   |-- privacidad.html         # Política de privacidad
|   |-- legal.html              # Aviso legal y declaración de accesibilidad
|   |-- manifest.webmanifest    # Para instalarla como aplicación
|   |-- styles/site.css         # Estilos del sitio
|   |-- scripts/
|   |   |-- app.js              # Búsqueda, filtros, detalle, copia, tema y metadatos
|   |   |-- build-zips.mjs      # Los 119 ZIP de Davoker (build de Vercel y `npm run zips`)
|   |   |-- catalog-format.mjs  # Formato compartido por el generador y el validador
|   |   |-- generate-catalog.mjs
|   |   |-- serve.mjs           # Servidor estático local, sin dependencias
|   |   |-- stamp-assets.mjs    # Sella el `?v=` de los assets en el despliegue
|   |   |-- validate.mjs        # Comprueba que el catálogo cuadra con el disco
|   |   |-- zip.js              # Crea archivos ZIP comprimidos en el navegador
|   |   |-- generar-sitemap.mjs  # Regenera sitemap.xml
|   |   `-- validaciones (solo CI, no se despliegan)
|   |       |-- validar-csp.mjs         # La CSP cubre todos los hosts externos de los demos
|   |       |-- validar-layout.mjs      # Que ninguna página se sale de lado (usa Chromium)
|   |       |-- validar-a11y.mjs        # Accesibilidad con axe-core sobre Chromium real
|   |       |-- validar-encabezados.mjs # Los encabezados de seguridad son los correctos
|   |       |-- validar-enlaces.mjs     # Enlaces internos que no llevan a ninguna parte
|   |       |-- smoke-demos.mjs         # Que cada demo carga sin errores de consola
|   |       |-- detectar-duplicados.mjs # Demos duplicados o casi idénticos
|   |       `-- validar-lighthouse.mjs  # Rendimiento, accesibilidad y SEO (Node 24)
|   |-- styles/site.css
|   |-- styles/team-core.css    # Hoja propia de Team Core (solo esa pagina)
|   |-- components.html          # Listado de componentes y detalle
|   |-- favicon.svg
|   |-- og-image.jpg             # Tarjeta social 1200x630 (og:image)
|   |-- robots.txt
|   |-- sitemap.xml
|   |-- team-core.html           # Equipo y donación
|   `-- index.html
|-- .github/                    # CI (workflows/), plantillas de incidencias, CODEOWNERS, Dependabot y FUNDING
|-- CHANGELOG.md
|-- CODE_OF_CONDUCT.md          # Convivencia y canal de denuncias
|-- Docs/
|   |-- THIRD_PARTY_NOTICES.md   # Procedencia y licencias de los componentes
|   `-- (auditorías, planes, notas de sesión y fases aplicadas)
|-- index.html                  # Entrada a la aplicación web
|-- LICENSE
|-- PRIVACY.md                  # Qué datos recoge la web y cuáles no
|-- SECURITY.md                 # Cómo avisar de un fallo de seguridad
`-- README.md
```

### El catálogo se genera en el despliegue

`Web/data/catalog.json`, `Web/data/catalog.js` y `Web/data/sources/` son
**artefactos generados** y **no están versionados**. Se producen en el build,
antes de servir nada.

La razón práctica: añadir un demo no exige ningún paso manual y dos personas
(o dos agentes) pueden trabajar a la vez sin que sus cambios choquen sobre los
mismos 1 018 ficheros de `sources/`. Lo único que hay que recordar en local
antes de abrir el sitio es `npm run catalogo`.

`Web/data/component-overrides.json` **sí** está versionado: se edita a mano.

---

## Añadir un demo

1. Crea una carpeta dentro de `creaciones-primium/` con un `index.html` y sus
   recursos. Nombre en `kebab-case` y descriptivo, por ejemplo `image-gallery/`.
2. Enlaza el CSS y el JavaScript locales desde ese HTML.
3. Ejecuta `npm run catalogo`.
4. Si hace falta, añade metadatos revisados a
   `Web/data/component-overrides.json`:

```json
{
  "my-hover-card": {
    "category": "Cards",
    "description": "A concise, accurate description of the demo.",
    "descriptionEs": "Descripción concisa y precisa del demo.",
    "tags": ["card", "hover"],
    "source": "https://example.com/original-source",
    "license": "MIT",
    "licenseFile": "LICENSE",
    "redistributable": true
  }
}
```

Pon `redistributable: true` **solo** después de confirmar los permisos del
código y de todos los recursos incluidos. Sin eso y sin un archivo de licencia
válido en la carpeta, el botón ZIP permanece deshabilitado.

Las categorías se infieren de los nombres y se añaden solas. El ID del demo
sale de su ruta en minúsculas con guiones.

---

## Validación continua

El workflow [`validate.yml`](./.github/workflows/validate.yml) corre en cada
`push` a `main` y en cada pull request. **No despliega nada**: reproduce lo
que hace Vercel y lo comprueba, para que si el catálogo, el sellado o los ZIP
fallan, se vea en GitHub antes de llegar a producción.

Roda sobre la matriz de Node `[20, 22, 24]` en `ubuntu-24.04`, con
`fail-fast: false`, y las acciones **fijadas por SHA** (un tag se puede mover
por quien tenga escritura).

| Comprobación                                | Qué mide                                              |
| ------------------------------------------- | ----------------------------------------------------- |
| `npm audit --audit-level=high`              | Vulnerabilidades de dependencias                      |
| `format:check`, `lint`, `typecheck`, `test` | Estilo, errores, tipos y 55 tests                     |
| `validar`                                   | Que el catálogo cuadre con el disco, y la CSP         |
| `validar:layout`                            | 8 páginas × 23 anchos, con navegador real             |
| `validar:a11y`                              | axe-core: 6 páginas × 2 idiomas × 2 temas             |
| `validar:lighthouse`                        | Rendimiento y SEO de las 6 páginas                    |
| `validar:demos`                             | Abre los **1 018 demos** con el sandbox de producción |

`validate.mjs` comprueba, entre otras cosas, que **ningún demo del disco falte
en el catálogo**: un demo nuevo sin indexar no aparecería en la web sin ningún
otro síntoma.

---

## Despliegue

Es estático y no necesita backend. El repositorio incluye
[`vercel.json`](./vercel.json) y [`.vercelignore`](./.vercelignore).

- **Framework Preset:** `Other`
- **Output Directory:** `.` (la raíz del repositorio, no un subdirectorio: las
  vistas previas cargan `../CreacionesNuevas/...`).
- **Build Command:** el de `vercel.json`. **No lo dejes en blanco** en el
  panel, o sobrescribes el valor del fichero.

Se despliega la **raíz** porque las vistas previas necesitan las carpetas de
demos. `vercel.json` redirige `/` → `/Web/`, sirve `/robots.txt` y
`/sitemap.xml` desde la raíz (es donde los busca Google) y añade las cabeceras
de seguridad: `Content-Security-Policy`, `Strict-Transport-Security`,
`Permissions-Policy`, `X-Content-Type-Options`, `X-Frame-Options` y
`Referrer-Policy`.

**GitHub Pages no se usa** (solo podría publicar una versión recortada por
licencias) y **Netlify** tampoco hace falta.

---

## Licencias y procedencia

La MIT de la raíz cubre el **código de la aplicación y la documentación**, no
los demos ni los recursos de terceros. Cada colección lleva sus propios
términos, y cada ZIP incluye su `LICENSE` y un `ATTRIBUTION.txt`.

- **`CreacionesNuevas/`**: creaciones originales, `LICENSE` MIT propio cada una.
- **`creaciones-primium/`**: comparten el `LICENSE` MIT de la carpeta, que nombra
  a las dos autoras.
- **`DavokerDiseñador/`**: MIT del autor de origen.

Las **86 galerías** (676 fotografías) enlazan imágenes de Wikimedia Commons con
el autor y la licencia impresos en la propia página. El inventario completo
está en [`Docs/THIRD_PARTY_NOTICES.md`](./Docs/THIRD_PARTY_NOTICES.md).

Antes de publicar un demo, verifica la procedencia y las condiciones de su
código, imágenes, fuentes, iconos y dependencias.

### Material retirado

`GevendraAutorExterno/` **no forma parte del repositorio**: está en
`.gitignore` y no está en el disco de un clon nuevo. Sus 116 demos proceden de
[`gevendra2004/gevstack`](https://github.com/gevendra2004/gevstack), que **no
declara licencia** y cuyo autor no respondió a los contactos hechos para pedir
permiso. Sin licencia no hay permiso de redistribución, así que se retiraron
también de `git`, del catálogo y del despliegue. Volver a publicarlos exige su
**autorización escrita** o que añada una licencia a su repositorio.

---

## Documentación

| Documento                                                              | Qué contiene                                                  |
| ---------------------------------------------------------------------- | ------------------------------------------------------------- |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md)                                 | Cómo añadir un componente y abrir un PR                       |
| [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md)                           | Convivencia y canal de denuncias                              |
| [`SECURITY.md`](./SECURITY.md)                                         | Cómo reportar un fallo de seguridad (**no por issue**)        |
| [`Web/como-usar.html`](./Web/como-usar.html)                           | Guía para visitantes: elegir, copiar el código y bajar el ZIP |
| [`PRIVACY.md`](./PRIVACY.md)                                           | Fuente de la política de privacidad del sitio                 |
| [`CHANGELOG.md`](./CHANGELOG.md)                                       | Qué cambió en cada commit                                     |
| [`Docs/01-planes/Plan_de_nivel_siguiente.md`](./Docs/01-planes/Plan_de_nivel_siguiente.md) | Plan por fases para llevar el proyecto al 97                  |
| [`Docs/04-sesiones/Sesion_2026-10-05_06.md`](./Docs/04-sesiones/Sesion_2026-10-05_06.md)       | Cierre de las fases 0, 1, 2, 4a y 4b, con lo que queda        |
| [`Docs/04-sesiones/Sesion_2026-10-08.md`](./Docs/04-sesiones/Sesion_2026-10-08.md)             | Estado de SonarCloud, guía pública y validaciones actuales    |
| [`Docs/03-sonar/Sonar_decisiones.md`](./Docs/03-sonar/Sonar_decisiones.md)               | Qué se **no** corrigió de SonarQube, y por qué                |
| [`Docs/03-sonar/Sonar_para_marcar.md`](./Docs/03-sonar/Sonar_para_marcar.md)             | Decisiones SonarCloud aplicadas y issues pendientes           |
| [`Docs/06-seo/Search_Console.md`](./Docs/06-seo/Search_Console.md)                   | Estado del descubrimiento en buscadores                       |
| [`Docs/03-sonar/AnalisisSonarQube.md`](./Docs/03-sonar/AnalisisSonarQube.md)             | Análisis del quality gate y limpieza de SonarQube             |
| [`Docs/THIRD_PARTY_NOTICES.md`](./Docs/THIRD_PARTY_NOTICES.md)         | Procedencia y licencias de cada componente                    |

En el sitio: [Privacidad](https://libreria-html-css.vercel.app/Web/privacidad.html)
· [Aviso legal y accesibilidad](https://libreria-html-css.vercel.app/Web/legal.html)

---

## Contribuir

Lee antes [`CONTRIBUTING.md`](./CONTRIBUTING.md): explica las tres
colecciones, cuándo usar cuál y la convención de los demos. Participar implica
aceptar el [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md).

Si has encontrado un **fallo de seguridad**, no lo reportes por issue: lee
[`SECURITY.md`](./SECURITY.md).

### Comandos disponibles

Todos se lanzan desde la raíz del repositorio. Los marcados como *(CI)* no se
ejecutan en el despliegue, solo en las comprobaciones automáticas.

| Comando | Qué hace |
| --- | --- |
| `npm run catalogo` | Regenera `catalog.json`, `catalog.js` y `sources/`. **Obligatorio** tras añadir o modificar un demo |
| `npm run servidor` | Sirve el repositorio en <http://localhost:8000/> |
| `npm run sellar` | Sella el `?v=` de los assets. En local solo con `--force`, para ver qué URLs quedarían |
| `npm run zips` | Genera los 119 ZIP de Davoker |
| `npm run sitemap` | Regenera `sitemap.xml` |
| `npm run validar` | `validate.mjs` + `validar-csp.mjs`: lo mínimo antes de abrir un PR |
| `npm run validar:html` | `html-validate` sobre los HTML *(CI)* |
| `npm run validar:enlaces` | Enlaces internos rotos *(CI)* |
| `npm run validar:encabezados` | Cabeceras de seguridad *(CI)* |
| `npm run validar:layout` | Ninguna página se sale de lado; usa Chromium |
| `npm run validar:a11y` | Accesibilidad con axe-core *(CI)* |
| `npm run validar:demos` | Que cada demo carga sin errores *(CI)* |
| `npm run validar:lighthouse` | Rendimiento, accesibilidad y SEO; requiere Node ≥ 22.19 |
| `npm run duplicados` | Detecta demos duplicados o casi idénticos |
| `npm run enlaces:externos` | Comprueba que los enlaces externos siguen vivos |

Las que usan Chromium necesitan el navegador instalado una vez:

```powershell
npx playwright install chromium
```

## Contribuir

<div align="center">

**1018 demos** · MIT · sin dependencias en producción

Hecho con HTML, CSS y JavaScript a pelo.

Si quieres añadir un componente o un pull request, lee antes [`CONTRIBUTING.md`](./CONTRIBUTING.md). Participar implica aceptar el [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md). Si has encontrado un fallo de seguridad, no lo reportes por issue: lee [`SECURITY.md`](./SECURITY.md). Qué datos recoge la web (y cuáles no), en [`PRIVACY.md`](./PRIVACY.md).

## Documentación

| Documento | Para qué sirve |
| --- | --- |
| [`CONTRIBUTING.md`](./CONTRIBUTING.md) | Convenciones para añadir componentes, licenses, commits y pull requests |
| [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md) | Convivencia y canal de denuncias |
| [`SECURITY.md`](./SECURITY.md) | Cómo avisar de un fallo de seguridad (canal privado) |
| [`PRIVACY.md`](./PRIVACY.md) | Qué datos recoge la web y cuáles no |
| [`CHANGELOG.md`](./CHANGELOG.md) | Registro de cambios, en formato Keep a Changelog |
| [`Web/README.md`](./Web/README.md) | Cómo funciona la aplicación por dentro |
| [`Docs/THIRD_PARTY_NOTICES.md`](./Docs/THIRD_PARTY_NOTICES.md) | Procedencia y licencias de cada colección de componentes |
| [`LICENSE`](./LICENSE) | MIT de la raíz, con su alcance limitado |
| [`Docs/`](./Docs/) | Auditorías, planes de fase, notas de sesión y lo aplicado de cada fase |

### Resumen de licencias por colección

| Carpeta | Componentes | Autoría | Licencia | ZIP |
| --- | ---: | --- | --- | :---: |
| `CreacionesNuevas/` | 248 | `kindred-98` | MIT propia por carpeta | Sí |
| `creaciones-primium/` | 651 | `kindred-98` y `fatmaerm` | MIT de la raíz de la colección | Sí |
| `DavokerDiseñador/` | 119 | `davoker` | MIT de su repositorio | Sí |
| **Total** | **1018** | | | **1018/1018** |

## Cómo contribuir en tres pasos

Si vienes a aportar algo y no has leído todo lo anterior, esta es la ruta corta:

1. **Lee [`CONTRIBUTING.md`](./CONTRIBUTING.md)** — te dice dónde va tu componente
   (`creaciones-primium/`, en la categoría que le toque), cómo se nombra la carpeta
   y qué metadatos necesita.
2. **Trabaja en tu rama y abre un pull request.** El CI valida solo; tú no necesitas
   desplegar nada.
3. **Antes de abrir el PR**, ejecuta en local lo mismo que correrá el CI:

   ```powershell
   npm ci
   node Web/scripts/generate-catalog.mjs
   node Web/scripts/validate.mjs
   ```

   No subas `Web/data/catalog.json`, `Web/data/catalog.js` ni `Web/data/sources/`:
   son artefactos generados y están en `.gitignore`.

La decisión de integrar o no es siempre de quien mantiene el repositorio.
