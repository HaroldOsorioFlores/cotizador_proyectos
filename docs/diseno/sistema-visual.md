# Sistema visual — Cotizador Pro editorial

## Dirección

Estudio editorial: papel cálido, tinta oscura, acento verde bosque configurable, títulos con serif de carácter y una hoja de cotización como resumen. La prioridad es que cualquier persona entienda el flujo y genere una cotización en pocos minutos.

## Tokens

```css
--paper: #f7f4ee;
--surface: #ffffff;
--ink: #171717;
--ink-soft: #3f3a34;
--muted: #6f6a61;
--line: #e4ded2;
--line-strong: #cfc7b8;
--accent: #1f4d3a;
--accent-soft: color-mix(in oklab, var(--accent) 10%, white);
--accent-ink: #ffffff;
--danger: #b42318;
--success: #2f6b4f;
--warning: #a15c00;
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-pill: 999px;
--shadow-soft: 0 1px 2px rgba(23, 23, 23, .04), 0 12px 32px rgba(23, 23, 23, .06);
--font-display: 'Calistoga', 'Iowan Old Style', Georgia, serif;
--font-body: 'Inter', 'Segoe UI', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', 'Cascadia Code', Consolas, monospace;
--text-display: clamp(2rem, 3.2vw, 3rem);
--text-h1: clamp(1.75rem, 2.4vw, 2.25rem);
--text-h2: 1.5rem;
--text-h3: 1.125rem;
--text-body: 0.95rem;
--text-small: 0.8125rem;
--text-label: 0.72rem;
--space-1: 4px;
--space-2: 8px;
--space-3: 12px;
--space-4: 16px;
--space-6: 24px;
--space-8: 32px;
--space-12: 48px;
--space-16: 64px;
```

## Tipografía

- Títulos y cifra principal: `Calistoga` (fallback Georgia).
- Cuerpo e inputs: `Inter` (fallback Segoe UI).
- Cifras, etiquetas y códigos: `JetBrains Mono` (fallback Consolas), con `font-variant-numeric: tabular-nums`.
- Labels en mayúsculas de 12 px, tracking `.08em`, color `--muted`.
- El título de la cotización se escribe en `quoteTitle` y se muestra al inicio de Documento y pago con la fuente display. La cabecera solo lleva marca y acciones. No hay otro H1 de marketing.

## Layout

- Cabecera sticky compacta: marca a la izquierda y acciones a la derecha; el título y el estado viven en Documento y pago.
- Workspace máximo 1280 px, padding 16/24/32 px.
- Grid `1fr 380px` desde 1024 px; resumen sticky; una columna por debajo.
- Secciones numeradas `01`–`06` con borde superior y acciones a la derecha.
- Barra inferior fija en móvil con total y acciones PDF/resumen.
- Drawer de importación a la derecha (480 px; ancho completo en móvil).
- Modal de confirmación centrado de 480 px.
- Sin hero de marketing; intro de una línea y foco en el formulario.

## Componentes

- **Card:** fondo `--surface`, borde 1 px `--line`, radio `--radius-lg`, sin sombra salvo hover.
- **Section header:** número mono acento, título display, descripción muted, borde superior.
- **Field:** fondo blanco, borde 1 px, radio `--radius-md`, altura mínima 44 px, foco 2 px acento con offset.
- **Button primary:** acento, texto blanco, altura 44 px, radio `--radius-md`.
- **Button secondary:** blanco, borde `--line`, texto `--ink`.
- **Button ghost:** transparente, hover `--accent-soft`.
- **Icon button:** 44×44 px, borde 1 px, `aria-label` obligatorio, tooltip visual.
- **Pill:** solo para estados (Borrador, Guardado, Pendiente).
- **Summary sheet:** hoja blanca con barra superior de acento, total en display, desglose mono, bloque de margen interno (costos estimados y margen) y CTA PDF.
- **Checklist:** cuatro pasos con icono SVG, estado pendiente/completo y enlace a la sección.
- **Empty state:** borde discontinuo, texto muted y CTA.
- **Drawer/modal:** overlay `rgba(23,23,23,.28)`, foco atrapado, Escape, retorno de foco.

## PDF

- Página 1: encabezado con título, código/fecha/validez, total, proveedor/cliente, proyecto y resumen ejecutivo.
- Página 2: ítems, resumen financiero, cronograma y condiciones.
- Los costos internos del proveedor y el margen no se imprimen en el PDF.
- Times para títulos y Helvetica para cuerpo (fuentes nativas de jsPDF).
- Acento del tema en barra superior, total, títulos de sección, cabecera de ítems, cabecera del cronograma y fila de total; fondo blanco para impresión. No se usan beiges fijos que rompan la elección de color.
- Pie: “Cotizador Pro · Página X de Y”.
- Metadatos: título de la cotización, proyecto, autor/proveedor.
- Textos largos: AutoTable con paginación, títulos partidos y total grande ajustado.

## Accesibilidad

- Contraste mínimo 4.5:1; no usar color solo para comunicar estado.
- Foco visible en todos los controles; objetivos de 44 px.
- `aria-live="polite"` para totales y avisos.
- Diálogos con `role="dialog"`, `aria-modal`, `aria-labelledby`, foco inicial, trampa y Escape.
- `prefers-reduced-motion: reduce` desactiva transiciones no esenciales.
- Etiquetas asociadas a cada campo; errores junto al campo y resumen de errores en importación.

## Dependencias

- Google Fonts: Calistoga, Inter y JetBrains Mono con `display=swap` y fallback local.
- Tailwind CDN, jsPDF y AutoTable se mantienen; no se añaden frameworks ni build.
