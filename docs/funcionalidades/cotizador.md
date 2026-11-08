# Funcionalidad: Cotizador Web Pro

Ubicación: `index.html` (archivo único).
Actor: profesional que cotiza proyectos web.
Estado: implementado y operativo según lectura de código; pendiente baseline visual en navegador.

## F-01 Datos comerciales

- Objetivo: identificar proveedor y cliente en la cotización y el PDF.
- Ubicación: sección `data-od-id="parties"` (`index.html (data-od-id="parties")`).
- Campos proveedor: `providerName`, `providerBrand`, `providerRuc`, `providerEmail`, `providerPhone`, `providerAddress`.
- Campos cliente: `clientName`, `clientRuc`, `contactName`, `contactEmail`, `clientAddress`.
- Reglas: todos son texto libre; ninguno es obligatorio para calcular. `clientPreview` muestra cliente y RUC si existen (`assets/js/summary.js:21 (calculate)`).
- Persistencia: sección `commercial` (`assets/js/core.js:22 (sectionFields)`).
- Error/caso límite: acepta cualquier texto; no valida formato de correo, RUC ni teléfono.
- Prueba manual: completar ambos bloques, verificar vista previa y PDF.

## F-02 Configuración financiera

- Objetivo: definir documento, divisa, impuesto, descuento, abono y forma de pago.
- Ubicación: sección `data-od-id="finance"` (`index.html (data-od-id="finance")`).
- Campos: `quoteCode`, `issueDate`, `currency` (PEN/USD/EUR), `validity`, `taxRate`, `discountRate`, `advanceAmount`, `paymentMode`, `terms`.
- Reglas de cálculo (`assets/js/core.js:240 (totals)`):
  - Subtotal = Σ (cantidad × precio).
  - Descuento = subtotal × `discountRate` / 100.
  - Base imponible = max(0, subtotal − descuento).
  - Impuesto = base imponible × `taxRate` / 100.
  - Total = base imponible + impuesto.
  - Abono = min(total, max(0, `advanceAmount`)).
  - Saldo = total − abono.
- Formas de pago (`assets/js/summary.js:1-19 (updatePaymentUi)`): `upfront`, `advance_balance`, `final`, `deliverable`, `weekly`.
- Errores/casos límite: valores negativos se limitan en el cálculo, pero el input puede conservar el valor negativo. El JSON importado no valida números finitos. La etiqueta del abono dice “(S/)” aunque la divisa sea USD/EUR (`index.html (#advanceAmount)`).
- Prueba manual: cambiar divisa e impuesto; revisar subtotal, descuento, total, abono y saldo.

## F-03 Ítems

- Objetivo: desglosar el alcance y los precios.
- Ubicación: sección `data-od-id="items"` (`index.html (data-od-id="items")`); render en `renderItems()` (`assets/js/items.js:1 (renderItems)`).
- Campos por ítem: concepto, cantidad, precio, tipo, descripción/alcance.
- Tipos: Estrategia, Diseño, Desarrollo, Integración, Licencia, Contenido.
- Acciones: agregar, duplicar último, mover arriba/abajo, eliminar.
- Reglas: total por ítem = cantidad × precio; el estado se guarda en `state.items` (`assets/js/core.js:1-9 (state.items)`).
- Casos límite: cantidad/precio no numéricos se convierten a 0 en el cálculo; cantidades negativas no se bloquean en la UI.
- Prueba manual: agregar, editar, mover, duplicar y eliminar; comprobar recálculo y PDF.

## F-04 Proyecto y fechas

- Objetivo: describir el proyecto y calcular la entrega.
- Ubicación: sección `data-od-id="project"` (`index.html (data-od-id="project")`).
- Campos: `projectName`, `projectType` (6 opciones), `startDate`, `durationQty`, `durationUnit` (days/weeks), `endDate` (solo lectura), `scope`.
- Regla: `endDate` = inicio + (plazo × 7 si semanas, plazo si días) (`assets/js/schedule.js:98 (updateDeliveryPreview)`).
- Casos límite: `toIsoDate` usa `toISOString` (UTC), lo que puede retroceder un día en zonas UTC+ (`assets/js/core.js:219-222 (toIsoDate)`). Fechas inválidas importadas muestran “Invalid Date”.
- Prueba manual: cambiar inicio, plazo y unidad; verificar fecha final y vista previa.

## F-05 Cronograma por etapas

- Objetivo: planificar entregables y abonos.
- Ubicación: sección `data-od-id="schedule"` (`index.html (data-od-id="schedule")`); render en `renderSchedule()` (`assets/js/schedule.js:61 (renderSchedule)`).
- Campos por etapa: número, fecha, entregable, abono.
- Acciones: sincronizar etapas (`syncSchedule`), agregar etapa, distribuir pagos, eliminar etapa.
- Reglas: `requiredWeeks()` deriva etapas del plazo (`assets/js/schedule.js:1 (requiredWeeks)`); la sincronización crea o recorta etapas y calcula fechas semanales (`assets/js/schedule.js:6 (syncSchedule)`); distribuir reparte total − abono entre etapas (`assets/js/schedule.js:119 (distributeSchedulePayments)`).
- Casos límite: al reducir el plazo se recortan etapas; si los abonos superan el total, el saldo se limita a 0.
- Prueba manual: sincronizar, agregar, distribuir y eliminar; revisar resumen y PDF.

## F-06 Importación JSON y prompt

- Objetivo: cargar una cotización completa desde JSON generado por IA.
- Ubicación: sección `data-od-id="json-import"` (`index.html (data-od-id="json-import")`); lógica en `importJsonData()` (`assets/js/import.js:9-85 (importJsonData)`).
- Entrada: `jsonInput`; prompt readonly en `aiPromptText`; botón “Copiar prompt”.
- Estructura esperada: `proveedor`, `cliente`, `documento`, `proyecto`, `items`, `cronograma`; acepta alias en inglés.
- Validaciones actuales: `JSON.parse`; divisa, forma de pago y unidad de plazo se limitan con `allowedValue`. No valida objeto raíz, números finitos/no negativos, fechas ni `projectType`.
- Errores: JSON inválido muestra `alert` y no modifica el estado (`assets/js/import.js (parseo JSON)`).
- Casos límite: `items` o `cronograma` con `null` pueden lanzar excepción; tipo de proyecto desconocido deja el select vacío.
- Prueba manual: importar JSON válido, inválido y con valores fuera de catálogo.

## F-07 Persistencia local

- Objetivo: conservar datos entre recargas.
- Clave: `cotizador-web-pro-cache-v1` (`assets/js/core.js:13 (STORAGE_KEY)`).
- Secciones: `commercial`, `finance`, `items`, `project`, `schedule` (`assets/js/core.js:15-26 (sectionLabels, sectionFields)`).
- Guardado: `saveSelectedCache()` guarda solo las secciones marcadas (`assets/js/core.js:110 (saveSelectedCache)`).
- Restauración: `loadSavedCache()` aplica campos, ítems, cronograma y color (`assets/js/core.js:126 (loadSavedCache)`).
- Borrado: cada sección tiene un botón que abre el modal de confirmación y elimina también la copia guardada (`assets/js/core.js:176-198 (modal)`).
- Privacidad: contiene nombres, RUC, correo, teléfono y dirección; no se envía a ningún servidor.
- Casos límite: no hay caducidad ni borrado global; el checkbox “Todo” puede quedar desincronizado tras limpiar una sección.
- Prueba manual: guardar selección, recargar, restaurar y limpiar una sección.

## F-08 Generación de PDF

- Objetivo: exportar una cotización corporativa.
- Ubicación: `generatePdf()` (`assets/js/pdf.js:21 (generatePdf)`); botones `pdfBtn` y `pdfBtnAside`.
- Contenido: portada, proyecto/entrega, cliente/proveedor, alcance/condiciones, ítems, resumen financiero y cronograma.
- Dependencias: `window.jspdf.jsPDF` y `doc.autoTable`.
- Error controlado: si jsPDF no cargó, muestra `alert` (`assets/js/pdf.js:22-25 (guard jsPDF)`).
- Nombre de archivo: `quoteCode` saneado a `[a-z0-9_-]` (`assets/js/pdf.js:31 (fileSafeCode)`).
- Casos límite: textos muy largos podrían desbordar la primera página; no hay manejo de excepción alrededor de `doc.save`.
- Prueba manual: generar con ítems, sin ítems y con textos largos; verificar totales y nombre.

## F-09 Copiar resumen

- Objetivo: compartir un resumen textual.
- Ubicación: `copySummary()` (`assets/js/import.js:106-124 (copySummary)`); botón `copyBtn`.
- Contenido: código, proveedor, cliente, proyecto, entrega, subtotal, impuesto, total, abono y forma de pago.
- Error: si `navigator.clipboard` no existe, `undefined.then` lanza excepción; no hay aviso de error.
- Prueba manual: copiar en contexto seguro y en `file://`.

## F-10 Tema de color

- Objetivo: personalizar el acento visual y el PDF.
- Ubicación: header (`index.html (header, controles de color)`); `updateAccent()` (`assets/js/core.js:230 (updateAccent)`).
- Controles: cuatro colores predefinidos y selector personalizado.
- Persistencia: el color se guarda con la caché y se restaura al cargar.
- Prueba manual: cambiar color, recargar y generar PDF.

## F-11 Limpieza de secciones y modal

- Objetivo: borrar datos visibles y su copia local con confirmación.
- Ubicación: botones `.clear-section-btn`; modal `#confirmModal` (`index.html (#confirmModal)`); lógica (`assets/js/core.js:176-198 (modal)`).
- Comportamiento: abre modal con título de sección; “Cancelar” cierra; “Limpiar datos” borra campos, estado y caché; clic en el fondo cierra.
- Accesibilidad actual: sin `role="dialog"`, `aria-modal`, foco inicial, trampa de foco ni cierre con `Escape`.
- Prueba manual: abrir, cancelar, confirmar, cerrar con fondo y con teclado.
