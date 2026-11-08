# Cotizador Pro

Aplicación web estática de una sola página para crear cotizaciones de proyectos digitales: desarrollo web, aplicaciones móviles, automatización, integraciones, software a medida, datos y consultoría. El markup vive en `index.html`, los estilos en `assets/css/styles.css` y la lógica en `assets/js/*.js`; no requiere instalación, build ni backend.

## Uso

1. Abrir `index.html` en un navegador moderno (Chrome, Edge o Firefox).
2. Escribir el título de la cotización en la cabecera.
3. Completar proveedor, cliente, documento, ítems, proyecto y cronograma.
4. Generar el PDF o copiar el resumen.

También puede servirse desde cualquier hosting estático (GitHub Pages, Netlify, servidor local). La generación de PDF y la persistencia son locales al navegador.

## Funcionalidades

- Título de cotización editable en Documento y pago; controla la pestaña, el documento, el resumen y el PDF.
- Tipo de proyecto libre con sugerencias para web, móvil, automatización, software, datos y consultoría.
- Datos comerciales de proveedor y cliente.
- Divisa PEN, USD o EUR, impuesto, descuento y abono inicial.
- Formas de pago: pago al inicio, abono y saldo, pago al final, por entregable o por etapas.
- Ítems con concepto, descripción, cantidad, precio, tipo y total.
- Cronograma por etapas con fechas alineadas al plazo, entregables y abonos; sincronización y distribución de pagos.
- Importación desde JSON generado por IA en un panel lateral con pestañas Prompt/JSON.
- Validación completa del JSON importado y mensajes de error sin mutar el formulario.
- Persistencia selectiva en `localStorage` (clave `cotizador-web-pro-cache-v1`) y borrado total.
- Exportación a PDF con jsPDF y copia del resumen al portapapeles con manejo de errores.
- Tema de color configurable que se guarda automáticamente y se aplica al PDF; accesibilidad por teclado y diseño responsive.

## Estructura

```
index.html                  Markup de la aplicación
assets/css/styles.css       Sistema visual editorial y responsive
assets/favicon.svg          Icono local
assets/js/tailwind-config.js Configuración de Tailwind CDN
assets/js/core.js           Estado, caché, diálogos, fechas y cálculos base
assets/js/items.js          Render y acciones de ítems
assets/js/schedule.js       Cronograma, fechas y distribución
assets/js/summary.js        Cálculo, pagos y checklist
assets/js/import.js         Drawer de importación, validación y portapapeles
assets/js/pdf.js            Generación del PDF
assets/js/app.js            Inicialización y listeners
AGENTS.md                   Reglas internas (local, no publicado)
README.md                   Este archivo
.gitignore                  Exclusiones de Git
plans/                      Planificación interna
docs/funcionalidades/       Documentación funcional del cotizador
docs/diseno/                Sistema visual y decisiones de diseño
docs/superpowers/plans/     Planes de implementación (local)
.agents/skills/             Skills locales aplicables (ignoradas por Git)
.claude/                    Configuración local del asistente (ignorada por Git)
```

## Archivos locales y Git

Por recomendación, `AGENTS.md`, `plans/`, `docs/superpowers/plans/`, `.mcp.json` y `opencode.json` se mantienen fuera del repositorio y están en `.gitignore`.

- `AGENTS.md`: reglas internas de trabajo; se mantiene local y no se publica.
- `.mcp.json` y `opencode.json`: configuración local de Playwright MCP y opencode. Cada colaborador debe crear la suya siguiendo la guía interna de `AGENTS.md`, sección 7.0.
- `plans/` y `docs/superpowers/plans/`: planificación interna; no forma parte del repositorio publicado.
- `.agents/skills/` y `.claude/`: skills y configuración local del asistente.

La aplicación funciona sin estos archivos. La documentación funcional de `docs/funcionalidades/` sí forma parte del repositorio.

## Dependencias externas

- Tailwind CSS por CDN: `https://cdn.tailwindcss.com`
- jsPDF 2.5.1 por CDN de cdnjs
- jsPDF-AutoTable 3.8.4 por CDN de cdnjs
- Google Fonts: Calistoga, Inter y JetBrains Mono, con fallback a fuentes del sistema

Requieren conexión a internet. No hay dependencias instaladas ni gestor de paquetes. La interfaz conserva un fallback local si Google Fonts no carga; la generación de PDF avisa si jsPDF no está disponible.

## Privacidad

Los datos comerciales y de contacto se guardan únicamente en el navegador del usuario mediante `localStorage`. La aplicación no envía información a ningún servidor ni incorpora telemetría. El usuario puede borrar todos los datos desde el resumen.

## Verificación

No hay una suite de tests automatizada. La verificación principal es manual en navegador con Playwright MCP y la consola abierta; la checklist interna está en `AGENTS.md` (local, no publicado). El historial de pruebas se mantiene en `plans/05-bitacora-ejecucion.md` (local, no publicado).

Comprobaciones locales rápidas:

```powershell
Get-ChildItem assets/js/*.js | ForEach-Object { node --check $_.FullName }
python -m http.server 8765 --bind 127.0.0.1
```

Abrir `http://127.0.0.1:8765/index.html` con Playwright MCP y comprobar los valores base: `itemCount=4`, `weekCount=4`, `heroTotal=S/ 6,844.00`, `subtotal=S/ 5,800.00`, `tax=S/ 1,044.00`, `grandTotal=S/ 6,844.00` y `balance=S/ 6,844.00`. Si `msedge` está en PATH, el smoke headless opcional es `msedge --headless=new --dump-dom http://127.0.0.1:8765/index.html`.

## Documentación

- Reglas de trabajo: `AGENTS.md` (local, no publicado)
- Documentación funcional: `docs/funcionalidades/`
- Sistema visual: `docs/diseno/sistema-visual.md`
- Trazabilidad y auditoría: `plans/` (local, no publicado)
- Plan de la iteración editorial: `docs/superpowers/plans/2026-11-07-quoter-editorial-multi-domain.md` (local, no publicado)
