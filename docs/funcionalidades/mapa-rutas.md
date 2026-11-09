# Mapa de rutas y secciones

La aplicación es una sola página (`index.html`). No hay router, rutas URL, historial ni parámetros de consulta. La navegación es por scroll, por la barra móvil y por los enlaces del checklist del resumen.

## Secciones de la página

| Orden | Sección | Identificador | Ubicación | Contenido |
|---|---|---|---|---|
| 1 | Cabecera | `header.topbar` | `index.html` | Marca, color, Importar, Guardar y PDF |
| 2 | Introducción | `.workspace-intro` | `index.html` | Resumen de uso y pasos 01–07 |
| 3 | Datos comerciales | `#section-commercial` / `data-od-id="parties"` | `index.html` | Proveedor y cliente |
| 4 | Documento y pago | `#section-finance` / `data-od-id="finance"` | `index.html` | Título, estado, código, fecha, divisa, impuesto, abono, pago y condiciones |
| 5 | Ítems | `#section-items` / `data-od-id="items"` | `index.html` | Lista dinámica de ítems y estado vacío |
| 6 | Proyecto y fechas | `#section-project` / `data-od-id="project"` | `index.html` | Nombre, tipo, inicio, plazo, fin y alcance |
| 7 | Cronograma | `#section-schedule` / `data-od-id="schedule"` | `index.html` | Etapas, entregables, abonos y avisos |
| 8 | Costos del proveedor | `#section-costs` / `data-od-id="costs"` | `index.html` | Costos internos, prorrateo y margen estimado |
| 9 | Costos de terceros | `#section-third-party` / `data-od-id="third-party"` | `index.html` | Pagos a Apple/Google y otros proveedores, con total referencial |
| 10 | Resumen | `#summaryPanel` / `data-od-id="summary"` | `index.html` | Totales, pagos, margen, costos de terceros, entrega, checklist, caché, copiar y PDF |
| 11 | Barra móvil | `.mobile-bar` | `index.html` | Total, Resumen y PDF en pantallas ≤767 px |
| 12 | Panel de importación | `#importDrawer` | `index.html` | Diálogo lateral con pestañas Prompt y JSON |
| 13 | Modal de confirmación | `#confirmModal` | `index.html` | Confirmación de limpieza de sección o de todos los datos |

## Anclas y desplazamiento

- El título de la cotización y su estado se editan en `#section-finance`, no en la cabecera.
- El checklist del resumen enlaza a `#section-commercial`, `#section-items`, `#section-project` y `#section-schedule`.
- `scroll-padding-top` mantiene las secciones visibles bajo la cabecera sticky (90 px en escritorio, 158 px en móvil).
- `#mobileSummaryBtn` desplaza y enfoca `#summaryPanel` en móvil.
- El resto de la navegación es scroll manual.
- Los diálogos bloquean el scroll del body mientras están abiertos.

## Estados de URL

- No se leen ni escriben `location`, `hash` ni `search`.
- Recargar la página conserva datos solo si el usuario los guardó en `localStorage`.

## Dependencias de red

- Tailwind CDN, jsPDF y jsPDF-AutoTable se cargan al abrir la página.
- Google Fonts carga Calistoga, Inter y JetBrains Mono con fallback local.
- No hay otras peticiones de red.
