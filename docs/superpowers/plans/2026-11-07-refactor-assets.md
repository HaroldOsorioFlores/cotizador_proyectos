# Refactor modular del cotizador — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Dividir `index.html` (1440 líneas) en HTML semántico + CSS + siete archivos JS clásicos, preservando comportamiento, diseño, `localStorage`, PDF y apertura directa del archivo.

**Architecture:** `index.html` conserva el markup y carga `assets/css/styles.css`, `assets/js/tailwind-config.js` y siete scripts clásicos al final del body (`core`, `items`, `schedule`, `summary`, `import`, `pdf`, `app`). Sin módulos ES, bundler ni dependencias nuevas. Los símbolos compartidos se declaran una sola vez en `core.js`; los scripts comparten el entorno léxico global del navegador.

**Tech Stack:** HTML, CSS, JavaScript vanilla, Tailwind CDN, jsPDF 2.5.1, jsPDF-AutoTable 3.8.4, `localStorage`.

**Spec:** `AGENTS.md`, `docs/funcionalidades/cotizador.md` y este plan.

## Global Constraints

- No cambiar textos, IDs, clases, orden de secciones, cálculos, claves de `localStorage` ni comportamiento visible.
- Mantener rutas relativas para GitHub Pages y apertura directa con `file://`.
- No introducir ES modules, bundler, TypeScript, frameworks ni dependencias.
- Todo temporal va en `tmp/` del repositorio; nunca fuera del proyecto.
- Cada archivo JS debe pasar `node --check`.
- El DOM headless debe conservar el baseline: `itemCount=4`, `weekCount=4`, `heroTotal=S/ 6,844.00`, `subtotal=S/ 5,800.00`, `tax=S/ 1,044.00`, `grandTotal=S/ 6,844.00`, `balance=S/ 6,844.00`.

## Review Focus

- Importación JSON con `null`, números inválidos o valores fuera de catálogo.
- Portapapeles no disponible (`navigator.clipboard` ausente).
- Fecha de cronograma importada sin escapar.
- Generación de PDF con y sin ítems.
- Restauración de `localStorage`.
- CDN caído: la estructura HTML debe seguir visible aunque falten estilos o PDF.

---

### Task 1: Baseline y andamiaje

**Files:**
- Create: `tmp/` (ignorado por Git), `assets/css/`, `assets/js/`, `docs/superpowers/plans/`.

**Interfaces:**
- Produces: baseline DOM en `tmp/baseline-dom.html` y valores esperados.

- [x] Crear `tmp/`, `assets/css/` y `assets/js/`.
- [x] Ejecutar Edge headless con perfil `tmp/edge-baseline` y salida `tmp/baseline-dom.html`.
- [x] Extraer valores de `itemCount`, `weekCount`, `heroTotal`, `subtotal`, `tax`, `grandTotal`, `balance`.
- [x] Registrar los valores en `plans/05-bitacora-ejecucion.md`.

### Task 2: Extraer CSS y configuración de Tailwind

**Files:**
- Create: `assets/css/styles.css` (contenido de líneas 26-84 del `index.html` original).
- Create: `assets/js/tailwind-config.js` (contenido de líneas 11-23, envuelto en `if (window.tailwind) { ... }`).
- Modify: `index.html` (reemplazar `<style>` y el script inline de configuración).

**Interfaces:**
- Produces: hoja de estilos y configuración cargadas antes del body.

- [ ] Verificar que el bloque CSS y el script de configuración no tengan contenido adicional.
- [ ] Crear los dos archivos con el contenido exacto.
- [ ] Reemplazar en `index.html` el `<style>` por `<link rel="stylesheet" href="assets/css/styles.css" />`.
- [ ] Reemplazar el script inline por `<script src="assets/js/tailwind-config.js"></script>`.
- [ ] Ejecutar Edge headless y comparar los valores del baseline.
- [ ] Ejecutar `node --check assets/js/tailwind-config.js`.

### Task 3: Extraer `core.js`

**Files:**
- Create: `assets/js/core.js` (líneas 534-781: estado, DOM refs, constantes, caché, modal, tema, utilidades y `totals`).
- Modify: `index.html` (añadir `<script src="assets/js/core.js"></script>` antes del resto).

**Interfaces:**
- Produces: `state`, `els`, `currencySymbols`, `STORAGE_KEY`, `pendingClearSection`, `sectionLabels`, `sectionFields`, `readCache`, `writeCache`, `valuesFor`, `cloneItems`, `cloneSchedule`, `normalizeScheduleRow`, `applyValues`, `selectedCacheSections`, `updateCacheState`, `updateCacheAllState`, `applySavedCacheSelection`, `saveSelectedCache`, `loadSavedCache`, `resetSection`, `openClearModal`, `closeClearModal`, `confirmClearSection`, `escapeHtml`, `money`, `pdfMoney`, `addDays`, `toIsoDate`, `formatDate`, `updateAccent`, `totals`.

- [ ] Crear `core.js` con el rango exacto.
- [ ] Comprobar que empieza en `const state` y termina en el cierre de `totals`.
- [ ] Añadir el script en `index.html`.
- [ ] Ejecutar `node --check assets/js/core.js`.
- [ ] Ejecutar Edge headless y comparar el baseline.

### Task 4: Extraer `items.js`, `schedule.js` y `summary.js`

**Files:**
- Create: `assets/js/items.js` (líneas 783-852 y 1004-1008).
- Create: `assets/js/schedule.js` (líneas 854-968 y 1111-1124).
- Create: `assets/js/summary.js` (líneas 970-1002).
- Modify: `index.html` (añadir los tres scripts en ese orden).

**Interfaces:**
- `items.js`: `renderItems`, `moveItem`, `addItem`.
- `schedule.js`: `requiredWeeks`, `syncSchedule`, `estimateNextStageDate`, `renumberScheduleStages`, `addScheduleStage`, `defaultDeliverable`, `renderSchedule`, `updateDeliveryPreview`, `updateDates`, `distributeSchedulePayments`.
- `summary.js`: `updatePaymentUi`, `calculate`.

- [ ] Crear los tres archivos con los rangos exactos.
- [ ] Confirmar que cada función quedó completa y sin duplicados.
- [ ] Añadir los scripts en orden después de `core.js`.
- [ ] Ejecutar `node --check` en cada archivo.
- [ ] Ejecutar Edge headless y comparar el baseline.

### Task 5: Extraer `import.js`, `pdf.js` y `app.js`

**Files:**
- Create: `assets/js/import.js` (líneas 1010-1104, 1106-1109 y 1126-1144).
- Create: `assets/js/pdf.js` (líneas 1146-1364).
- Create: `assets/js/app.js` (líneas 1366-1437, incluida la llamada `init()`).
- Modify: `index.html` (reemplazar el `<script>` grande por los siete scripts).

**Interfaces:**
- `import.js`: `setField`, `allowedValue`, `importJsonData`, `copyImportPrompt`, `paymentModeText`, `copySummary`.
- `pdf.js`: `cleanText`, `addPdfSectionTitle`, `hexToRgb`, `generatePdf`.
- `app.js`: `resetExample`, `initDefaults`, `init`.

- [ ] Crear los tres archivos con los rangos exactos.
- [ ] Verificar que `init()` queda al final de `app.js` y que no hay código inline restante.
- [ ] Añadir los scripts en orden y retirar el bloque `<script>` original.
- [ ] Ejecutar `node --check` en los siete archivos.
- [ ] Ejecutar Edge headless y comparar el baseline.
- [ ] Abrir con `file://` y confirmar que los scripts clásicos cargan sin módulos.

### Task 6: Actualizar documentación y trazabilidad

**Files:**
- Modify: `AGENTS.md` (nueva estructura de archivos y regla de workspace).
- Modify: `README.md` (estructura y uso).
- Modify: `plans/01-baseline-y-dependencias.md`, `plans/04-plan-de-tareas.md`, `plans/05-bitacora-ejecucion.md`, `plans/06-informe-final.md`.
- Modify: `docs/funcionalidades/cotizador.md`, `mapa-acciones.md`, `mapa-rutas.md`.
- Modify: `plans/03-auditoria-index-html.md` (referencias a nuevos archivos:línea).

- [ ] Reemplazar referencias a `index.html:línea` por `assets/js/<archivo>:<línea>`.
- [ ] Documentar la nueva estructura y el orden de carga.
- [ ] Registrar baseline y verificación del refactor.

### Task 7: Git, GitHub y Pages

**Files:**
- No nuevos archivos de aplicación; `.gitignore` ya excluye `tmp/`, PDFs y configuración local.

**Interfaces:**
- Remote: `https://github.com/HaroldOsorioFlores/cotizador_proyectos.git`.
- Branch: `main` para publicación; `refactor/quoter-split-assets` para el trabajo.

- [ ] `git init`.
- [ ] Configurar identidad local: `user.name=HaroldOsorioFlores`, `user.email=HaroldOsorioFlores@users.noreply.github.com`.
- [ ] `git add -A` y commit inicial `first commit`.
- [ ] `git branch -M main`.
- [ ] Crear `refactor/quoter-split-assets` y commit del refactor.
- [ ] Volver a `main`, merge del refactor y push.
- [ ] Habilitar GitHub Pages desde `main` raíz con `gh api`.
- [ ] Verificar la URL pública con HTTP 200 y headless.

### Task 8: Cierre

- [ ] Confirmar `git status` limpio.
- [ ] Confirmar URL de Pages y estado de build.
- [ ] Registrar evidencia final en `plans/05-bitacora-ejecucion.md`.
- [ ] Actualizar `plans/06-informe-final.md`.

## Self-Review

- Cobertura: cada bloque del `index.html` original tiene un archivo destino y una tarea.
- Interfaces: los nombres de funciones se mantienen exactamente.
- Riesgo principal: orden de carga de scripts; se valida con headless después de cada tarea.
- Sin tests automatizados nuevos; se usa el DOM headless como prueba de regresión y `node --check` para sintaxis.
