# Funcionalidad: Cotizador Pro

Ubicación: `index.html` + `assets/css/styles.css` + `assets/js/*.js`.
Actor: profesional que cotiza proyectos digitales para un cliente.
Estado: implementado y verificado con Playwright MCP el 2026-11-08.

## F-01 Datos comerciales

- Objetivo: identificar proveedor y cliente en la cotización y el PDF.
- Ubicación: `#section-commercial` (`data-od-id="parties"`).
- Campos proveedor: `providerName`, `providerBrand`, `providerRuc`, `providerEmail`, `providerPhone`, `providerAddress`.
- Campos cliente: `clientName`, `clientRuc`, `contactName`, `contactEmail`, `clientAddress`.
- Reglas: texto libre con límites de longitud; ninguno es obligatorio para calcular. `clientPreview` muestra cliente y RUC si existen (`assets/js/summary.js:calculate`).
- Persistencia: sección `commercial` (`assets/js/core.js:sectionFields`).
- Prueba manual: completar ambos bloques, guardar, recargar y generar el PDF.

## F-02 Documento y pago

- Objetivo: definir título, código, fecha, divisa, impuesto, descuento, abono y forma de pago.
- Título: `quoteTitle` al inicio de la sección Documento y pago; controla la pestaña, el documento, el resumen, el texto copiado, el encabezado del PDF y el nombre de archivo de respaldo (`updateQuoteTitle`).
- Campos: `quoteTitle`, `quoteCode`, `issueDate`, `currency` (PEN/USD/EUR), `validity`, `taxRate`, `discountRate`, `advanceAmount`, `paymentMode`, `terms`.
- Reglas de cálculo (`assets/js/core.js:totals`):
  - Subtotal = Σ (cantidad × precio).
  - Descuento = subtotal × `discountRate` / 100.
  - Base imponible = max(0, subtotal − descuento).
  - Impuesto = base imponible × `taxRate` / 100.
  - Total = base imponible + impuesto.
  - Abono efectivo según forma de pago (`effectiveAdvance`).
- Formas de pago (`assets/js/summary.js:updatePaymentUi`):
  - `upfront`: abono = total, saldo = 0; el campo de abono se desactiva.
  - `advance_balance`: abono = monto ingresado; saldo = total − abono.
  - `final`: abono = 0, saldo = total; el campo de abono se desactiva.
  - `deliverable` y `weekly`: abono opcional; saldo = total − abono − abonos del cronograma.
- Etiqueta de abono: se actualiza con el símbolo de la divisa (`updateAdvanceLabel`).
- El impuesto es genérico; el texto de ayuda menciona IGV 18% como ejemplo peruano.
- Persistencia: sección `finance`.
- Prueba manual: cambiar divisa, impuesto y los cinco modos de pago; revisar abono/saldo y el aviso del cronograma.

## F-03 Ítems

- Objetivo: desglosar el alcance y los precios.
- Ubicación: `#section-items`; render en `renderItems()` (`assets/js/items.js`).
- Campos por ítem: concepto, cantidad, precio, tipo libre con sugerencias y descripción/alcance.
- Tipos sugeridos: Estrategia, Diseño, Desarrollo, Integración, Automatización, Pruebas, Despliegue, Licencia, Contenido, Otro.
- Acciones: agregar, duplicar último, mover arriba/abajo, eliminar.
- Reglas: total por ítem = cantidad × precio; el estado vive en `state.items`.
- Estado vacío: mensaje con acciones para agregar o importar.
- Prueba manual: agregar, editar, mover, duplicar y eliminar; comprobar recálculo, estado vacío y PDF.

## F-04 Proyecto y fechas

- Objetivo: describir el proyecto y calcular la entrega.
- Ubicación: `#section-project`.
- Campos: `projectName`, `projectType` (input libre con `datalist`), `startDate`, `durationQty`, `durationUnit` (days/weeks), `endDate` (solo lectura), `scope`.
- Regla: `endDate` = inicio + (plazo × 7 si semanas, plazo si días) (`updateDeliveryPreview`).
- Fechas en hora local con `toIsoDate` basado en componentes locales; `formatDate` devuelve `—` para valores inválidos.
- Prueba manual: cambiar inicio, plazo y unidad; verificar fecha final y cronograma.

## F-05 Cronograma por etapas

- Objetivo: planificar entregables y abonos.
- Ubicación: `#section-schedule`; render en `renderSchedule()`.
- Campos por etapa: número, fecha, entregable y abono.
- Acciones: sincronizar etapas, agregar etapa, distribuir pagos, eliminar etapa; agrupadas en una cuadrícula 2×2 para que no se amontonen en tablet.
- Reglas:
  - `requiredStages()` deriva etapas del plazo (semanas o bloques de 7 días) y limita a 52 para no bloquear la interfaz.
  - `syncSchedule(force)` crea o recorta etapas; la última fecha coincide con la fecha final.
  - Las fechas manuales se conservan; `Sincronizar etapas` las recalcula.
  - Si una etapa queda después de la fecha final, se muestra un aviso.
  - `Distribuir pagos` reparte total − abono efectivo entre etapas.
- Prueba manual: sincronizar, agregar, distribuir, editar fecha y eliminar; revisar avisos, resumen y PDF.

## F-06 Importación JSON y prompt

- Objetivo: cargar una cotización completa desde JSON generado por IA.
- Ubicación: panel lateral `#importDrawer`; lógica en `assets/js/import.js`.
- Entrada: pestaña Prompt con `aiPromptText` y botón Copiar; pestaña JSON con `jsonInput` y botón Importar.
- Estructura esperada: `documento` (con `titulo`), `proveedor`, `cliente`, `proyecto`, `items`, `costos`, `cronograma`; acepta alias en inglés.
- Validaciones:
  - Raíz y subobjetos de tipo objeto; listas para ítems, costos y cronograma.
  - Cada ítem, costo y etapa debe ser objeto.
  - Números finitos y dentro de rangos; no se aceptan negativos.
  - Fechas `YYYY-MM-DD` reales.
  - Divisa, forma de pago y unidad de plazo dentro del catálogo.
  - Periodicidad de costos: `monthly`, `annual` o `one_time` (acepta alias en español).
  - Tipo de proyecto libre, no vacío y con límite de longitud.
  - Límites de longitud para textos.
- Si hay errores: se muestra una lista, el foco va al bloque de error y no se muta el formulario.
- La fecha del cronograma se valida y se escapa antes de renderizar.
- Portapapeles: helper con `navigator.clipboard`, fallback `execCommand` y aviso de error controlado.
- Prueba manual: JSON válido de app móvil, `items:[null]`, negativos, costos con monto negativo o periodicidad inválida, fecha inválida, divisa inválida y payload XSS.

## F-07 Persistencia local

- Objetivo: conservar datos entre recargas.
- Clave: `cotizador-web-pro-cache-v1` (`assets/js/core.js`).
- Secciones: `commercial`, `finance`, `items`, `project`, `schedule`, `costs`.
- Guardado: botón Guardar de la cabecera o Guardar selección del resumen; guarda solo las secciones marcadas y el acento.
- Restauración: `loadSavedCache()` aplica campos, título, ítems, cronograma, costos y color.
- Borrado: cada sección tiene confirmación; `Borrar todos los datos` elimina la clave y reinicia el formulario.
- El checkbox Todo se sincroniza al marcar, desmarcar o limpiar secciones.
- Privacidad: contiene nombres, RUC, correo, teléfono y dirección; no se envía a ningún servidor.
- Prueba manual: guardar, recargar, restaurar, limpiar una sección y borrar todo.

## F-08 Generación de PDF

- Objetivo: exportar una cotización corporativa.
- Ubicación: `generatePdf()` (`assets/js/pdf.js`); botones `pdfBtn`, `pdfBtnAside` y `mobilePdfBtn`.
- Contenido:
  - Página 1: título editable, código, fecha, validez, total, proyecto/entrega, cliente/proveedor y alcance/condiciones.
  - Página 2: ítems, resumen financiero, cronograma y condiciones si aplica.
- Tipografía: Times para títulos y Helvetica para cuerpo; acento del tema.
- Metadatos: título, proyecto, autor/proveedor y creador.
- Nombre de archivo: código saneado o nombre del proyecto/título como respaldo.
- Error controlado: aviso si jsPDF no cargó; `try/catch` al guardar.
- Casos verificados: con ítems, sin ítems, textos largos (más de 2000 caracteres), USD/EUR y sin avisos de AutoTable.
- Prueba manual: generar en los tres escenarios y revisar título, totales, paginación y nombre.

## F-09 Copiar resumen

- Objetivo: compartir un resumen textual.
- Ubicación: `copySummary()` (`assets/js/import.js`); botón `copyBtn`.
- Contenido: título, código, proveedor, cliente, proyecto, entrega, subtotal, descuento, impuesto, total, abono, saldo y forma de pago.
- Error: si el portapapeles no está disponible y el fallback falla, muestra `#copyError` sin excepción.
- Prueba manual: copiar en contexto seguro y simular portapapeles bloqueado.

## F-10 Tema de color

- Objetivo: personalizar el acento visual y el PDF.
- Controles: cuatro temas (bosque, tinta, terracota, cobalto) y selector personalizado.
- `updateAccent()` actualiza `--accent`, `--accent-soft`, el valor del selector y `aria-pressed`.
- Persistencia: al elegir un tema o un color personalizado se guarda el acento de inmediato en `localStorage`; también se incluye al guardar la selección.
- PDF: usa el acento seleccionado en barra superior, total, títulos de sección, cabecera de ítems, cabecera del cronograma y fila de total.
- Prueba manual: cambiar color, recargar y generar PDF.

## F-11 Diálogos accesibles

- Objetivo: confirmar limpiezas y abrir la importación sin perder contexto.
- Componentes: `#confirmModal` y `#importDrawer`, ambos con `role="dialog"`, `aria-modal="true"`, título/descripción asociados, foco inicial, trampa de foco, cierre con Escape y clic en el fondo.
- Al cerrar, el foco vuelve al disparador visible; si el disparador desapareció, vuelve al botón Importar de la cabecera.
- Prueba manual: abrir, recorrer con Tab y Shift+Tab, cerrar con Escape y con el fondo.

## F-12 Responsive y accesibilidad

- Objetivo: usar la app en escritorio, tablet y móvil.
- Puntos de quiebre verificados: 360, 768, 1024 y 1440 px sin scroll horizontal.
- La cabecera solo contiene marca y acciones; el título y su estado viven en Documento y pago.
- Barra inferior móvil con total, Resumen y PDF.
- El resumen es sticky desde 1024 px (`top: 90px`), con scroll interno y separación respecto a la cabecera.
- Las cabeceras de sección se apilan hasta 1279 px para dar espacio a las acciones; el formulario usa 2 columnas en tablet y 4 solo desde 1280 px.
- Foco visible, objetivos de 44 px, labels asociados, `aria-live` en totales y avisos, `prefers-reduced-motion`.
- Prueba manual: recorrido solo con teclado y resize en los cuatro anchos.

## F-13 Costos del proveedor y margen

- Objetivo: registrar gastos internos (suscripciones, servidores, licencias) y estimar el margen del proyecto sin exponerlos al cliente.
- Ubicación: `#section-costs`; render en `renderCosts()` (`assets/js/costs.js`).
- Campos por costo: concepto, monto y periodicidad (`monthly`, `annual`, `one_time`).
- Reglas de cálculo (`assets/js/core.js:costRowTotal`, `costTotals`):
  - Meses del proyecto = plazo en días o semanas × 7, dividido entre 30; mínimo 1 mes.
  - Mensual = monto × meses; anual = monto × meses / 12; único = monto.
  - Costos estimados = Σ de los costos prorrateados.
  - Margen estimado = base imponible − costos estimados.
  - Margen % = margen / base imponible × 100.
- El margen se muestra solo en el resumen (`#costTotal`, `#marginTotal`, `#marginPercent`) y se marca en rojo si es negativo. No se incluye en el PDF ni en el resumen copiado.
- Acciones: agregar, editar, eliminar y limpiar la sección; estado vacío con acción para agregar.
- Persistencia: sección `costs` de la misma clave; se guarda y restaura con la selección.
- Importación: acepta `costos`/`costs` con `concepto`, `monto` y `periodicidad`; valida monto no negativo y periodicidad permitida (acepta alias en español).
- Prueba manual: agregar costos mensual, anual y único; cambiar el plazo y la divisa; guardar, recargar, limpiar e importar.
