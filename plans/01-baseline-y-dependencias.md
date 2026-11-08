# 01 — Baseline y dependencias

Fecha: 2026-11-07

## Estado verificado

| Comprobación | Resultado | Evidencia |
|---|---|---|
| Repositorio Git | Inicializado y publicado al cierre de esta tarea | Ver `plans/05-bitacora-ejecucion.md` |
| Gestor de paquetes | No existe | Sin `package.json`, `pnpm-lock.yaml` ni `node_modules` |
| Build | No existe | La app se abre directamente desde `index.html` |
| Backend / API | No existe | Todo el código está en el navegador |
| Base de datos | No existe | Persistencia en `localStorage` |
| Tests automatizados | No existen | Smoke check headless local, sin framework |
| CI / despliegue | GitHub Pages | Publicación estática desde `main` |

## Dependencias externas

| Dependencia | Versión | Origen | Uso | Riesgo |
|---|---|---|---|---|
| Tailwind CSS | CDN actual | `https://cdn.tailwindcss.com` | Estilos utilitarios | Sin SRI; el CDN puede cambiar; no recomendado para producción crítica |
| jsPDF | 2.5.1 | `cdnjs.cloudflare.com` | Generación de PDF | Sin SRI; sin fallback local |
| jsPDF-AutoTable | 3.8.4 | `cdnjs.cloudflare.com` | Tablas del PDF | Sin SRI; versión fijada en URL |

Sin conexión o con CDN caído, la interfaz pierde estilos y/o la generación de PDF falla. La aplicación ya muestra un aviso controlado cuando falta `jsPDF` (`assets/js/pdf.js:22-25 (guard jsPDF)`).

## Baseline funcional

- Baseline de código: lectura íntegra del `index.html` original (1440 líneas) antes del refactor.
- Baseline pre-refactor en Edge headless: `itemCount=4`, `weekCount=4`, `heroTotal=S/ 6,844.00`, `subtotal=S/ 5,800.00`, `discount=S/ 0.00`, `taxable=S/ 5,800.00`, `tax=S/ 1,044.00`, `grandTotal=S/ 6,844.00`, `advance=S/ 0.00`, `balance=S/ 6,844.00`.
- Baseline post-refactor: `tmp/after-refactor.html` y `tmp/after-refactor.png`; los diez valores anteriores se conservaron (`node tmp/check-dom.mjs` → `DOM OK`).
- Navegador: Microsoft Edge 157.0.4341.42, headless, `--virtual-time-budget=10000`.
- Estado: la carga inicial y los cálculos están verificados; las interacciones (PDF, importación, caché, modal) siguen pendientes de prueba manual.

## Navegadores objetivo

- Chrome / Edge recientes.
- Firefox reciente.
- Sin soporte declarado para navegadores antiguos.

## Riesgos abiertos

1. Dependencia total de CDN sin integridad ni copia local.
2. Persistencia de datos personales en `localStorage` sin caducidad.
3. Importación JSON con validación parcial.
4. Fechas calculadas con `toISOString` (UTC) en un contexto de fechas locales.
5. Modal sin semántica completa de diálogo ni cierre con `Escape`.
