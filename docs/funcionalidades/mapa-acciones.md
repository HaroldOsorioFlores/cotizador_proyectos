# Mapa de acciones

Toda acción visible de `index.html`, su handler y su efecto. No hay navegación entre páginas ni llamadas de red.

## Cabecera

| Control | Ubicación | Handler | Efecto |
|---|---|---|---|
| Botones de color (4) | `index.html (.theme-dot)` | `updateAccent` (`assets/js/core.js:230 (updateAccent)`) | Cambia `--accent`, `--accent-soft` y el color del PDF |
| Selector de color | `index.html (#customColor)` | `customColor` input (`assets/js/app.js:35 (listener customColor)`) | Aplica un color personalizado |
| “Importar JSON” | `index.html (#importJsonTopBtn)` | `importJsonTopBtn` (`assets/js/app.js:47 (listener importJsonTopBtn)`) | Desplaza la vista a la sección de importación |
| “Generar PDF pro” | `index.html (#pdfBtn)` | `generatePdf` (`assets/js/app.js:61 (listener pdfBtn)`) | Genera y descarga el PDF |

## Datos comerciales

| Control | Ubicación | Handler | Efecto |
|---|---|---|---|
| “Limpiar datos comerciales” | `index.html (.clear-section-btn[data-section="commercial"])` | `openClearModal('commercial')` (`assets/js/app.js:54 (listener .clear-section-btn)`) | Abre confirmación; al confirmar limpia campos y caché |

## Configuración financiera

| Control | Ubicación | Handler | Efecto |
|---|---|---|---|
| “Limpiar configuración” | `index.html (.clear-section-btn[data-section="finance"])` | `openClearModal('finance')` | Limpia campos de configuración |
| “Reiniciar ejemplo” | `index.html (#resetBtn)` | `resetBtn` (`assets/js/app.js:46 (listener resetBtn)`) | Restaura ítems de ejemplo y sincroniza cronograma |

## Importación JSON

| Control | Ubicación | Handler | Efecto |
|---|---|---|---|
| “Copiar prompt” | `index.html (#copyPromptBtn)` | `copyImportPrompt` (`assets/js/import.js:86-95 (copyImportPrompt)`) | Copia el prompt; muestra aviso o falla si no hay portapapeles |
| “Importar y rellenar cotización” | `index.html (#importJsonBtn)` | `importJsonData` (`assets/js/import.js:9-85 (importJsonData)`) | Parsea y aplica el JSON; muestra aviso o `alert` de error |

## Ítems

| Control | Ubicación | Handler | Efecto |
|---|---|---|---|
| “Agregar ítem” | `index.html (#addItemBtn)` | `addItem()` (`assets/js/app.js:40 (listener addItemBtn)`) | Añade un ítem vacío y recalcula |
| “Duplicar último ítem” | `index.html (#duplicateBtn)` | `duplicateBtn` (`assets/js/app.js:41 (listener duplicateBtn)`) | Copia el último ítem |
| “Limpiar ítems” | `index.html (.clear-section-btn[data-section="items"])` | `openClearModal('items')` | Vacía ítems y su caché |
| Subir ítem | `assets/js/items.js (botón subir ítem)` | `moveItem(index, -1)` | Reordena hacia arriba |
| Bajar ítem | `assets/js/items.js (botón bajar ítem)` | `moveItem(index, 1)` | Reordena hacia abajo |
| Eliminar ítem | `assets/js/items.js (botón eliminar ítem)` | `remove-item` listener (`assets/js/items.js (listener eliminar ítem)`) | Elimina el ítem y recalcula |

Los inputs de concepto, cantidad, precio, tipo y descripción actualizan `state.items` y recalculan (`assets/js/items.js (listeners de ítem)`).

## Proyecto y fechas

| Control | Ubicación | Handler | Efecto |
|---|---|---|---|
| “Limpiar alcance y fechas” | `index.html (.clear-section-btn[data-section="project"])` | `openClearModal('project')` | Limpia proyecto, fechas y alcance |
| Fecha de inicio / plazo / unidad | `index.html (#startDate, #durationQty, #durationUnit)` | `updateDates` (`assets/js/app.js:37 (listener updateDates)`) | Recalcula fecha final y sincroniza cronograma |

## Cronograma

| Control | Ubicación | Handler | Efecto |
|---|---|---|---|
| “Agregar etapa” | `index.html (#addScheduleStageBtn)` | `addScheduleStage` (`assets/js/app.js:43 (listener addScheduleStageBtn)`) | Añade etapa con fecha estimada |
| “Distribuir pagos” | `index.html (#distributeScheduleBtn)` | `distributeSchedulePayments` (`assets/js/app.js:45 (listener distributeScheduleBtn)`) | Reparte total − abono entre etapas |
| “Sincronizar etapas” | `index.html (#syncScheduleBtn)` | `syncSchedule(true)` (`assets/js/app.js:44 (listener syncScheduleBtn)`) | Ajusta etapas al plazo y recalcula fechas |
| Eliminar etapa | `assets/js/schedule.js (botón eliminar etapa)` | `remove-schedule` listener (`assets/js/schedule.js (listener eliminar etapa)`) | Elimina y renumera etapas |

## Resumen, caché y PDF

| Control | Ubicación | Handler | Efecto |
|---|---|---|---|
| “Todo” (caché) | `index.html (#cacheAll)` | `cacheAll` change (`assets/js/app.js:50 (listener cacheAll)`) | Marca o desmarca todas las secciones |
| Checkboxes de sección | `index.html (.cache-section)` | `updateCacheAllState` (`assets/js/app.js:53 (listener .cache-section)`) | Sincroniza el checkbox “Todo” |
| “Guardar selección” | `index.html (#saveCacheBtn)` | `saveCacheBtn` (`assets/js/app.js:55 (listener saveCacheBtn)`) | Guarda las secciones marcadas en `localStorage` |
| “Copiar resumen” | `index.html (#copyBtn)` | `copySummary` (`assets/js/app.js:42 (listener copyBtn)`) | Copia texto al portapapeles |
| “Generar PDF corporativo” | `index.html (#pdfBtnAside)` | `generatePdf` (`assets/js/app.js:62 (listener pdfBtnAside)`) | Genera y descarga el PDF |

## Modal de confirmación

| Control | Ubicación | Handler | Efecto |
|---|---|---|---|
| “Cancelar” | `index.html (#cancelClearBtn)` | `closeClearModal` (`assets/js/app.js:56 (listener cancelClearBtn)`) | Cierra sin borrar |
| “Limpiar datos” | `index.html (#confirmClearBtn)` | `confirmClearSection` (`assets/js/app.js:57 (listener confirmClearBtn)`) | Borra la sección pendiente y su caché |
| Clic en el fondo | `index.html (#confirmModal)` | `confirmModal` click (`assets/js/app.js:58 (listener backdrop)`) | Cierra el modal |

## Comportamientos globales

- Cualquier `input`, `textarea` o `select` dispara `calculate` (`assets/js/app.js:36 (listener calculate)`).
- No hay enlaces externos ni formularios con envío.
- No hay `fetch`, `XMLHttpRequest`, telemetría ni analítica.
