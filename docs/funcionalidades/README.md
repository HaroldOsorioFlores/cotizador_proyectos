# Documentación funcional — Cotizador Pro

Fuente funcional de verdad del proyecto. Describe el comportamiento real de `index.html` + `assets/`; no es un manual genérico de HTML, Tailwind ni jsPDF.

## Índice

| Documento | Contenido |
|---|---|
| [`cotizador.md`](./cotizador.md) | Funcionalidades, campos, reglas de cálculo, pagos, importación, persistencia y PDF |
| [`mapa-acciones.md`](./mapa-acciones.md) | Cada botón, control y handler con su efecto visible |
| [`mapa-rutas.md`](./mapa-rutas.md) | Página única, secciones, identificadores y navegación |

## Reglas de mantenimiento

1. Actualizar el documento en la misma tarea que cambia el comportamiento visible.
2. Toda afirmación debe poder comprobarse en `index.html` o `assets/` con su línea o selector.
3. Documentar estados vacío, éxito, error y casos límite.
4. No documentar funcionalidades hipotéticas ni dependencias que no existan.
5. Mantener las restricciones de privacidad, accesibilidad, responsive y CDN.

## Estado general

- Aplicación de una sola página, sin backend ni autenticación.
- Cotizaciones para proyectos web, móviles, automatización, software a medida, datos y consultoría.
- Título de cotización editable.
- Costos internos para margen y costos de terceros separados del total de servicios.
- Datos persistidos solo en el navegador (`localStorage`, clave `cotizador-web-pro-cache-v1`).
- Generación de PDF local con jsPDF + AutoTable.
- Importación JSON validada antes de aplicar cambios.
- Verificación manual con Playwright MCP; no hay tests automatizados.
