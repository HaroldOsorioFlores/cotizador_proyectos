# Cotizador Web Pro

Aplicación web estática de una sola página para crear cotizaciones de proyectos web y exportarlas a PDF corporativo. El markup vive en `index.html`, los estilos en `assets/css/styles.css` y la lógica en `assets/js/*.js`; no requiere instalación, build ni backend.

## Uso

1. Abrir `index.html` en un navegador moderno (Chrome, Edge o Firefox).
2. Completar datos del proveedor, cliente, ítems, cronograma y condiciones.
3. Generar el PDF o copiar el resumen.

También puede servirse desde cualquier hosting estático (GitHub Pages, Netlify, servidor local). La generación de PDF y la persistencia son locales al navegador.

## Publicación

- Repositorio: <https://github.com/HaroldOsorioFlores/cotizador_proyectos>
- GitHub Pages: <https://haroldosorioflores.github.io/cotizador_proyectos/>
- Rama de publicación: `main`, raíz del repositorio.

## Funcionalidades

- Datos comerciales de proveedor y cliente.
- Divisa PEN, USD o EUR, impuesto, descuento y abono inicial.
- Formas de pago: pago al inicio, abono y saldo, pago al final, por entregable o por etapas.
- Ítems con concepto, descripción, cantidad, precio, tipo y total.
- Cronograma por etapas con fechas, entregables y abonos; sincronización y distribución de pagos.
- Importación de JSON generado por IA y copia del prompt.
- Persistencia selectiva en `localStorage` (clave `cotizador-web-pro-cache-v1`).
- Exportación a PDF con jsPDF y copia del resumen al portapapeles.
- Tema de color configurable y diseño responsive.

## Estructura

```
index.html                  Markup de la aplicación
assets/css/styles.css       Estilos propios
assets/js/tailwind-config.js Configuración de Tailwind CDN
assets/js/core.js           Estado, caché, utilidades y cálculos base
assets/js/items.js          Render y acciones de ítems
assets/js/schedule.js       Cronograma y fechas
assets/js/summary.js        Cálculo y resumen financiero
assets/js/import.js         Importación JSON, prompt y copia de resumen
assets/js/pdf.js            Generación del PDF
assets/js/app.js            Inicialización y listeners
AGENTS.md                   Reglas de trabajo del repositorio
README.md                   Este archivo
.gitignore                  Exclusiones de Git
plans/                      Inventario, auditoría, plan y bitácora
docs/funcionalidades/       Documentación funcional del cotizador
.agents/skills/             Skills locales aplicables (ignoradas por Git)
.claude/                    Configuración local del asistente (ignorada por Git)
```

## Dependencias externas

- Tailwind CSS por CDN: `https://cdn.tailwindcss.com`
- jsPDF 2.5.1 por CDN de cdnjs
- jsPDF-AutoTable 3.8.4 por CDN de cdnjs

Requieren conexión a internet. No hay dependencias instaladas ni gestor de paquetes.

## Privacidad

Los datos comerciales y de contacto se guardan únicamente en el navegador del usuario mediante `localStorage`. La aplicación no envía información a ningún servidor ni incorpora telemetría.

## Verificación

No hay una suite de tests automatizada. La verificación principal es manual en navegador con la consola abierta; la checklist está en `AGENTS.md` (sección 7) y el historial de pruebas en `plans/05-bitacora-ejecucion.md`.

Comprobaciones locales rápidas:

```powershell
node --check assets/js/core.js
msedge --headless=new --dump-dom file:///C:/ruta/al/index.html
```

El smoke check headless debe mostrar `itemCount=4`, `weekCount=4`, `heroTotal=S/ 6,844.00`, `subtotal=S/ 5,800.00`, `tax=S/ 1,044.00`, `grandTotal=S/ 6,844.00` y `balance=S/ 6,844.00`.

## Documentación

- Reglas de trabajo: `AGENTS.md`
- Documentación funcional: `docs/funcionalidades/`
- Trazabilidad y auditoría: `plans/`
