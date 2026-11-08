# 04 — Plan de tareas

Fecha: 2026-11-07

## Completadas en esta tarea

| ID | Tarea | Criterio de aceptación | Evidencia | Estado |
|---|---|---|---|---|
| T-01 | Adaptar `AGENTS.md` al cotizador estático | Sin referencias a Next.js, React, Prisma, Better Auth, PostgreSQL, n8n ni pnpm; contexto real y reglas aplicables | `AGENTS.md` reescrito | Hecho |
| T-02 | Eliminar skills no correspondientes | Solo quedan skills aplicables a HTML/CSS/JS vanilla | 5 skills en `.agents/skills/`, 1 en `.claude/skills/` | Hecho |
| T-03 | Limpiar configuración local heredada | `.claude/settings.local.json` sin permisos de otros proyectos ni MCP n8n | Archivo reescrito con `allow: []` | Hecho |
| T-04 | Crear `.gitignore` y `README.md` | Excluye secretos, artefactos, PDFs y configuración local; README describe uso y estructura | Archivos creados | Hecho |
| T-05 | Crear `plans/` | Inventario, baseline, skills, auditoría, backlog, bitácora e informe | Archivos `plans/00` a `plans/06` | Hecho |
| T-06 | Crear `docs/funcionalidades/` | README, funcionalidad, mapa de acciones y mapa de rutas/secciones | Archivos creados | Hecho |
| T-19 | Planificar el refactor modular | Plan con archivos, interfaces y criterios de regresión | `docs/superpowers/plans/2026-11-07-refactor-assets.md` | Hecho |
| T-20 | Extraer CSS y Tailwind config | `assets/css/styles.css` y `assets/js/tailwind-config.js` cargados sin cambiar valores | Baseline headless conservado | Hecho |
| T-21 | Extraer `core`, `items`, `schedule` y `summary` | Funciones completas, sin duplicados y con orden de carga correcto | `node --check` OK | Hecho |
| T-22 | Extraer `import`, `pdf` y `app` | `index.html` sin JS inline; `init()` al final de `app.js` | `node --check` OK y DOM headless OK | Hecho |
| T-23 | Verificar regresión del refactor | Sintaxis y valores base idénticos al baseline | `tmp/after-refactor.html` + `tmp/after-refactor.png` | Hecho |
| T-24 | Publicar en GitHub y GitHub Pages | `main` pusheada, Pages activo y URL con HTTP 200 | `main` → `origin`; Pages `built`; URL y assets 200; DOM live OK | Hecho |

## Backlog pendiente (requiere autorización para modificar `index.html`)

| ID | Prioridad | Tarea | Archivo:línea | Criterio de aceptación | Prueba |
|---|---|---|---|---|---|
| T-07 | P1 | Escapar y validar la fecha del cronograma importado | `assets/js/schedule.js:73 (fecha de etapa)` | Un `date` malicioso no ejecuta HTML/JS | Importar JSON con intento de XSS |
| T-08 | P1 | Manejar portapapeles ausente o rechazado | `assets/js/import.js:87 (portapapeles)`, `assets/js/import.js:120 (portapapeles)` | Muestra aviso de error, no lanza excepción | Probar en contexto sin `navigator.clipboard` |
| T-09 | P2 | Validar el JSON importado de forma completa | `assets/js/import.js:9-85 (importJsonData)` | Rechaza tipos, números y catálogos inválidos sin romper el estado | Casos inválidos de `plans/03` |
| T-10 | P2 | Corregir fechas locales sin `toISOString` | `assets/js/core.js:219-222 (toIsoDate)` | Fecha final y etapas correctas en UTC+ y UTC- | Cambiar zona horaria del sistema |
| T-11 | P2 | Completar accesibilidad del modal | `index.html (#confirmModal)`, `assets/js/core.js:176-198 (modal)` | Rol, foco, trampa, Escape y foco visible | Recorrido solo con teclado |
| T-12 | P2 | Evaluar integridad/fallback de CDN | `index.html:7-9` | Riesgo documentado o dependencia con integridad/fallback | Bloqueo de red |
| T-13 | P2 | Documentar retención y borrado de `localStorage` | `assets/js/core.js:13 (STORAGE_KEY)`, `assets/js/core.js:110-145 (saveSelectedCache/loadSavedCache)` | Documentación actualizada; control de borrado total si se aprueba | Guardar, recargar, borrar |
| T-14 | P3 | Etiqueta de abono según divisa | `index.html (#advanceAmount)` | La etiqueta muestra la divisa activa | Cambiar PEN/USD/EUR |
| T-15 | P3 | Coherencia del modo de pago `final` | `assets/js/summary.js:1-19 (updatePaymentUi)` | Abono/saldo coherentes con la forma de pago | Probar los cinco modos |
| T-16 | P3 | Sincronizar checkbox “Todo” al limpiar | `assets/js/core.js:190 (confirmClearSection)` | El checkbox refleja las secciones guardadas | Guardar, limpiar una sección |
| T-17 | P3 | Validar `projectType` importado | `assets/js/import.js:47 (projectType)` | El select mantiene una opción válida | Importar tipo inexistente |
| T-18 | P3 | Probar PDF con textos largos | `assets/js/pdf.js (tablas del PDF)` | Sin solapamientos ni contenido cortado | Textos de 2000 caracteres |

## Dependencias

- T-07 a T-18 modifican `index.html` o `assets/js/*.js`; requieren autorización expresa del propietario.
- Antes de tocar código: baseline manual en navegador y confirmación de la rama de trabajo.
- T-12 puede requerir cambiar URLs o descargar dependencias; evaluar disponibilidad y política de dependencias antes.
- T-24 requiere autorización explícita de Git, push y publicación; el propietario la dio en la tarea del 2026-11-07.
