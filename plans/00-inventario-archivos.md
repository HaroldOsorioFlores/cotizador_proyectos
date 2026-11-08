# 00 — Inventario de archivos

Fecha: 2026-11-07
Estado del repositorio: ver `plans/05-bitacora-ejecucion.md` (sección Git). La publicación en GitHub Pages se registra allí.

## Archivos propios

| Ruta | Tipo | Tamaño / líneas | Rol | Estado |
|---|---|---|---|---|
| `index.html` | HTML | 31.178 bytes / 448 líneas | Markup, CDN, configuración y carga de assets | Activo |
| `assets/css/styles.css` | CSS | 5.088 bytes | Tokens, componentes y responsive propios | Activo |
| `assets/js/tailwind-config.js` | JS | 429 bytes | Configuración de Tailwind CDN | Activo |
| `assets/js/core.js` | JS | 9.717 bytes / 249 líneas | Estado, DOM refs, caché, modal, tema, fechas y `totals` | Activo |
| `assets/js/items.js` | JS | 4.357 bytes / 79 líneas | `renderItems`, `moveItem`, `addItem` | Activo |
| `assets/js/schedule.js` | JS | 5.791 bytes / 133 líneas | Cronograma, fechas y distribución de pagos | Activo |
| `assets/js/summary.js` | JS | 1.640 bytes / 34 líneas | `updatePaymentUi` y `calculate` | Activo |
| `assets/js/import.js` | JS | 5.856 bytes / 125 líneas | Importación JSON, prompt, copia de resumen | Activo |
| `assets/js/pdf.js` | JS | 9.988 bytes / 220 líneas | Generación del PDF | Activo |
| `assets/js/app.js` | JS | 5.301 bytes / 73 líneas | Inicialización y listeners | Activo |
| `AGENTS.md` | Markdown | 19.287 bytes | Reglas de trabajo adaptadas a este proyecto | Activo |
| `README.md` | Markdown | 3.415 bytes | Presentación, uso y estructura | Activo |
| `.gitignore` | Texto | — | Exclusiones de Git | Activo |
| `plans/00-inventario-archivos.md` | Markdown | — | Este inventario | Activo |
| `plans/01-baseline-y-dependencias.md` | Markdown | — | Baseline y dependencias | Activo |
| `plans/02-matriz-skills.md` | Markdown | — | Skills y aplicabilidad | Activo |
| `plans/03-auditoria-index-html.md` | Markdown | — | Hallazgos con archivo:línea | Activo |
| `plans/04-plan-de-tareas.md` | Markdown | — | Backlog priorizado | Activo |
| `plans/05-bitacora-ejecucion.md` | Markdown | — | Registro de cambios y pruebas | Activo |
| `plans/06-informe-final.md` | Markdown | — | Cierre de la tarea | Activo |
| `docs/funcionalidades/README.md` | Markdown | — | Índice funcional | Activo |
| `docs/funcionalidades/cotizador.md` | Markdown | — | Funcionalidad del cotizador | Activo |
| `docs/funcionalidades/mapa-acciones.md` | Markdown | — | Botones, formularios y handlers | Activo |
| `docs/funcionalidades/mapa-rutas.md` | Markdown | — | Página única, secciones y anclas | Activo |
| `docs/superpowers/plans/2026-11-07-refactor-assets.md` | Markdown | 8.577 bytes | Plan del refactor modular | Activo |
| `.agents/skills/app-ux-requirements/` | Skill | — | Requisitos funcionales de UI | Instalada |
| `.agents/skills/frontend-design/` | Skill | — | Dirección visual frontend | Instalada |
| `.agents/skills/frontend-standards/` | Skill | — | Estándares frontend genéricos | Instalada |
| `.agents/skills/ui-ux-pro-max/` | Skill | — | Diseño, accesibilidad e interacción | Instalada |
| `.agents/skills/web-design-guidelines/` | Skill | — | Revisión de accesibilidad/UX | Instalada |

## Archivos locales no versionables

| Ruta | Motivo |
|---|---|
| `tmp/` | Artefactos de verificación y perfiles de navegador; ignorado por Git |
| `.claude/.gitignore` | Ignora todo el contenido de `.claude/` |
| `.claude/settings.local.json` | Configuración local de asistente; sin permisos heredados de otros proyectos |
| `.claude/skills/ui-ux-pro-max/` | Copia local de skill; el original vive en `.agents/skills/` |

## Excluidos de lectura línea por línea

- Contenido interno de las skills: se revisó su `SKILL.md` o descripción; no se auditó cada referencia.
- `__pycache__` y artefactos de skills eliminadas: se borraron con las skills no aplicables.
- `tmp/`: artefactos de verificación (DOM headless, capturas, perfiles de navegador).

## Cobertura revisada

- `index.html`: lectura completa antes del refactor (1440 líneas) y verificación posterior (448 líneas).
- `assets/js/*.js`: extracción mecánica desde el bloque original y validación con `node --check`.
- `AGENTS.md`: reescritura y actualización a la estructura modular.
- Skills: inventario de las 34 originales y decisión de conservar 5.
- No hay `package.json`, `node_modules`, `dist`, `build`, CI ni tests automatizados.
