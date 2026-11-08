# Mapa de rutas y secciones

La aplicación es una sola página (`index.html`). No hay router, rutas URL, historial ni parámetros de consulta. La navegación es por scroll y por el botón “Importar JSON”, que desplaza a una sección.

## Secciones de la página

| Orden | Sección | Identificador | Ubicación | Contenido |
|---|---|---|---|---|
| 1 | Cabecera | `header` | `index.html (header)` | Marca, tema de color, importar JSON, generar PDF |
| 2 | Hero / vista rápida | `data-od-id="hero"` | `index.html (data-od-id="hero")` | Presentación, contador de ítems/etapas, total |
| 3 | Datos comerciales | `data-od-id="parties"` | `index.html (data-od-id="parties")` | Proveedor y cliente |
| 4 | Configuración | `data-od-id="finance"` | `index.html (data-od-id="finance")` | Divisa, impuestos, abono, forma de pago |
| 5 | Importación JSON | `jsonImportSection`, `data-od-id="json-import"` | `index.html (data-od-id="json-import")` | Prompt e importación |
| 6 | Ítems | `data-od-id="items"` | `index.html (data-od-id="items")` | Lista dinámica de ítems |
| 7 | Proyecto y fechas | `data-od-id="project"` | `index.html (data-od-id="project")` | Nombre, tipo, inicio, plazo, alcance |
| 8 | Cronograma | `data-od-id="schedule"` | `index.html (data-od-id="schedule")` | Etapas, entregables y abonos |
| 9 | Resumen | `data-od-id="summary"` | `index.html (data-od-id="summary")` | Totales, entrega, caché, copiar, PDF |
| 10 | Modal de confirmación | `confirmModal` | `index.html (#confirmModal)` | Diálogo de limpieza de sección |

## Anclas y desplazamiento

- No hay enlaces `href="#..."` internos.
- `importJsonTopBtn` usa `window.scrollTo` hacia `jsonImportSection.offsetTop - 96` (`assets/js/app.js:47 (listener importJsonTopBtn)`).
- El resto de la navegación es scroll manual.

## Estados de URL

- No se leen ni escriben `location`, `hash` ni `search`.
- Recargar la página conserva datos solo si el usuario los guardó en `localStorage`.

## Dependencias de red

- Tailwind CDN, jsPDF y jsPDF-AutoTable se cargan al abrir la página (`index.html:7-9`).
- No hay otras peticiones de red.
