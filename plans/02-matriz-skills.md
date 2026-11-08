# 02 — Matriz de skills

Fecha: 2026-11-07

## Skills conservadas en `.agents/skills/`

| Skill | ¿Leída? | Aplicabilidad | Decisión |
|---|---|---|---|
| `app-ux-requirements` | Descripción y encabezado | Requisitos funcionales de la interfaz del cotizador | Conservar |
| `frontend-design` | `SKILL.md` revisado | Dirección visual y calidad de UI | Conservar |
| `frontend-standards` | Descripción y encabezado | Estándares genéricos; usar solo lo aplicable a HTML/CSS/JS vanilla | Conservar con salvedad |
| `ui-ux-pro-max` | `SKILL.md` revisado | Diseño, accesibilidad, interacción y patrones UI | Conservar |
| `web-design-guidelines` | `SKILL.md` revisado | Revisión de accesibilidad y UX | Conservar |

`frontend-standards` referencia React 19, TypeScript y Zod; en este proyecto solo aplican sus reglas genéricas de formularios, accesibilidad, tokens y documentación. No se usará para introducir esas tecnologías.

## Skills eliminadas de `.agents/skills/` (29)

| Grupo | Skills | Motivo |
|---|---|---|
| n8n | 9 skills `n8n-*` | No hay n8n ni automatizaciones |
| Next.js / React / shadcn | `next-best-practices`, `vercel-react-best-practices`, `vercel-composition-patterns`, `shadcn` | El proyecto es HTML + JS vanilla |
| Auth | `better-auth-best-practices`, `better-auth-security-best-practices`, `email-and-password-best-practices` | No hay autenticación |
| Backend / base de datos | `backend-standards`, `database-standards`, `supabase-postgres-best-practices` | No hay backend ni base de datos |
| Seguridad / scanners | `audit-context-building`, `codeql`, `differential-review`, `entry-point-analyzer`, `fp-check`, `sarif-parsing`, `semgrep`, `sharp-edges`, `supply-chain-risk-auditor`, `variant-analysis` | Herramientas de auditoría no requeridas para una app estática de una página |
| Producción / CI | `production-engineering` | No hay pipeline, release ni observabilidad |

## Skills eliminadas de `.claude/skills/` (7)

`codeql`, `entry-point-analyzer`, `fp-check`, `sarif-parsing`, `sharp-edges`, `supply-chain-risk-auditor`, `variant-analysis`. Se conservó `ui-ux-pro-max`.

## Skills globales del entorno

`superpowers`, `ponytail`, `engram`, `rtk`. No se versionan en este repositorio ni se añaden como dependencias.

## Conflictos y decisiones

- Ninguna skill local prevalece sobre `AGENTS.md`.
- No se instalaron skills nuevas.
- No se afirmó la ejecución de scanners ni MCPs.
