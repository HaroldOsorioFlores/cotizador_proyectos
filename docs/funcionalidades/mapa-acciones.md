# Mapa de acciones

Toda acción visible de `index.html`, su handler y su efecto. No hay navegación entre páginas ni llamadas de red salvo los CDN documentados.

## Cabecera

| Control | Ubicación | Handler | Efecto |
|---|---|---|---|
| Botones de color (4) | `.theme-dot` | `updateAccent` + `saveAccent` (`assets/js/core.js`) | Cambia `--accent`, `--accent-soft`, `aria-pressed`, guarda el acento y lo aplica al PDF |
| Selector de color | `#customColor` | `updateAccent` + `saveAccent` | Aplica y guarda un color personalizado |
| Importar | `#importJsonTopBtn` | `openImportDrawer` (`assets/js/import.js`) | Abre el panel lateral de importación |
| Guardar | `#saveCacheTopBtn` | `saveSelectedCache` | Guarda las secciones marcadas en `localStorage` |
| PDF | `#pdfBtn` | `generatePdf` | Genera y descarga el PDF |

## Datos comerciales

| Control | Ubicación | Handler | Efecto |
|---|---|---|---|
| Limpiar datos comerciales | `.clear-section-btn[data-section="commercial"]` | `openClearModal('commercial')` | Abre confirmación; al confirmar limpia campos y caché |
| Campos de proveedor y cliente | `#provider*`, `#client*` | `calculate` | Actualizan el resumen y la vista del cliente |

## Documento y pago

| Control | Ubicación | Handler | Efecto |
|---|---|---|---|
| Título de la cotización | `#quoteTitle` | `input` → `updateQuoteTitle` + `calculate` | Actualiza pestaña, documento, resumen, copia y PDF; se guarda con la sección finance |
| Limpiar configuración | `.clear-section-btn[data-section="finance"]` | `openClearModal('finance')` | Limpia documento, título, condiciones y caché de la sección |
| Reiniciar ejemplo | `#resetBtn` | `resetExample` | Restaura los ítems y el cronograma de ejemplo |
| Divisa | `#currency` | `calculate` + `updateAdvanceLabel` | Cambia símbolos, totales y etiqueta del abono |
| Forma de pago | `#paymentMode` | `updatePaymentUi` | Ajusta abono/saldo, desactiva el abono cuando no aplica y muestra ayuda |
| Impuesto, descuento y abono | `#taxRate`, `#discountRate`, `#advanceAmount` | `calculate` | Recalculan totales y saldo |

## Importación JSON

| Control | Ubicación | Handler | Efecto |
|---|---|---|---|
| Cerrar panel | `#closeImportDrawerBtn`, fondo | `closeDialog` | Cierra y devuelve el foco al disparador |
| Pestaña Prompt | `#promptTab` | `setImportTab('prompt')` | Muestra el prompt y el botón Copiar |
| Pestaña JSON | `#jsonTab` | `setImportTab('json')` | Muestra el área para pegar JSON |
| Copiar prompt | `#copyPromptBtn` | `copyImportPrompt` | Copia el prompt o muestra `#promptError` |
| Importar y rellenar | `#importJsonBtn` | `importJsonData` | Valida, aplica o muestra errores sin mutar el formulario |

## Ítems

| Control | Ubicación | Handler | Efecto |
|---|---|---|---|
| Agregar ítem | `#addItemBtn` y `[data-action="add-item"]` | `addItem` | Añade ítem, enfoca el concepto y recalcula |
| Duplicar último ítem | `#duplicateBtn` | `addItem` | Copia el último ítem |
| Limpiar ítems | `.clear-section-btn[data-section="items"]` | `openClearModal('items')` | Vacía ítems y caché; muestra estado vacío |
| Importar JSON | `[data-action="open-import"]` | `openImportDrawer` | Abre el panel de importación desde el estado vacío |
| Subir/Bajar ítem | `.move-item-up`, `.move-item-down` | `moveItem` | Reordena y recalcula |
| Eliminar ítem | `.remove-item` | listener de ítem | Elimina y recalcula |
| Editar ítem | `.item-name`, `.item-qty`, `.item-price`, `.item-type`, `.item-description-field` | listeners de ítem | Actualizan `state.items` y totales |

## Proyecto y fechas

| Control | Ubicación | Handler | Efecto |
|---|---|---|---|
| Limpiar alcance y fechas | `.clear-section-btn[data-section="project"]` | `openClearModal('project')` | Limpia proyecto y fechas |
| Tipo de proyecto | `#projectType` | `calculate` | Acepta texto libre y sugerencias del `datalist` |
| Inicio, plazo y unidad | `#startDate`, `#durationQty`, `#durationUnit` | `updateDates` | Recalcula fecha final y cronograma |
| Alcance general | `#scope` | `calculate` | Se usa en el PDF |

## Cronograma

| Control | Ubicación | Handler | Efecto |
|---|---|---|---|
| Agregar etapa | `#addScheduleStageBtn` y `[data-action="add-stage"]` | `addScheduleStage` | Añade etapa con fecha estimada; botón agrupado en cuadrícula 2×2 |
| Distribuir pagos | `#distributeScheduleBtn` | `distributeSchedulePayments` | Reparte total − abono efectivo entre etapas |
| Sincronizar etapas | `#syncScheduleBtn` y `[data-action="sync-schedule"]` | `syncSchedule(true)` | Ajusta etapas al plazo, recalcula fechas y limpia marcas manuales |
| Limpiar cronograma | `.clear-section-btn[data-section="schedule"]` | `openClearModal('schedule')` | Vacía etapa y caché; muestra estado vacío |
| Editar etapa | `.schedule-date`, `.schedule-deliverable`, `.schedule-amount` | listeners de etapa | Actualizan estado; la fecha manual se conserva y el abono recalcula |
| Eliminar etapa | `.remove-schedule` | listener de etapa | Elimina y renumera |

## Costos del proveedor

| Control | Ubicación | Handler | Efecto |
|---|---|---|---|
| Agregar costo | `#addCostBtn` y `[data-action="add-cost"]` | `addCost` (`assets/js/costs.js`) | Añade un costo interno, enfoca el concepto y recalcula el margen |
| Limpiar costos | `.clear-section-btn[data-section="costs"]` | `openClearModal('costs')` | Vacía los costos y su caché; muestra estado vacío |
| Editar costo | `.cost-name`, `.cost-amount`, `.cost-period` | listeners de costo | Actualizan `state.costs`; el monto y la periodicidad recalculan el prorrateo y el margen |
| Eliminar costo | `.remove-cost` | listener de costo | Elimina la fila y recalcula |

- Los costos no se incluyen en el PDF ni en el texto de Copiar resumen; solo alimentan `#costTotal`, `#marginTotal` y `#marginPercent` del resumen.

## Resumen, caché y PDF

| Control | Ubicación | Handler | Efecto |
|---|---|---|---|
| Todo | `#cacheAll` | listener de caché | Marca o desmarca todas las secciones |
| Checkboxes de sección | `.cache-section` | `updateCacheAllState` | Sincroniza el checkbox Todo |
| Guardar selección | `#saveCacheBtn` | `saveSelectedCache` | Guarda en `localStorage` y muestra aviso |
| Borrar todos los datos | `#clearAllCacheBtn` | `openClearModal('all')` | Confirma y elimina todos los datos y la caché |
| Copiar resumen | `#copyBtn` | `copySummary` | Copia el texto o muestra `#copyError` |
| Generar PDF | `#pdfBtnAside` | `generatePdf` | Genera y descarga el PDF |
| Barra móvil: Resumen | `#mobileSummaryBtn` | scroll/focus al resumen | Lleva al resumen en móvil |
| Barra móvil: PDF | `#mobilePdfBtn` | `generatePdf` | Genera y descarga el PDF |

## Modal y comportamientos globales

| Control | Ubicación | Handler | Efecto |
|---|---|---|---|
| Cancelar | `#cancelClearBtn` | `closeDialog` | Cierra sin borrar y devuelve el foco |
| Limpiar datos | `#confirmClearBtn` | `confirmClearSection` | Borra la sección o todo, actualiza caché y cierra |
| Fondo del modal | `[data-close-modal]` | `closeDialog` | Cierra la confirmación |
| Fondo del drawer | `[data-close-drawer]` | `closeDialog` | Cierra la importación |

- Los campos estáticos disparan `calculate`; los ítems, costos y etapas actualizan su estado y recalculan totales o margen cuando corresponde.
- Los diálogos atrapan el foco, cierran con Escape y devuelven el foco al disparador.
- No hay `fetch`, `XMLHttpRequest`, telemetría ni analítica.
