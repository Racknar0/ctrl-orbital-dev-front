<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Directrices del Agente

## Stack y restricciones de entorno
- Next.js (App Router), React, JavaScript/JSX, Axios, Zustand y SCSS.
- No instalar dependencias ni modificar `package.json` sin autorización explícita.
- No refactorizar código fuera del alcance de la tarea.
- No crear carpetas, archivos placeholder ni `.gitkeep` vacíos.
- Todos los SCSS deben tener identacion de 2 espacios y no usar `!important`.


## Estructura y organización
- Árbol base:
  ```text
  src/
    app/          # Rutas y layouts
    components/   # Componentes globales compartidos
    helpers/      # Hooks y funciones de utilidad
    services/     # HttpService y AxiosInterceptor
    store/        # Stores de Zustand
    styles/       # Tokens globales, mixins y variables SCSS
  ```
- Componentes en su propia carpeta: `Nombre/Nombre.jsx` y `Nombre/Nombre.scss`. El JSX importa su SCSS vecino.
- Cada vista debe tener su propia carpeta de componentes , solamente debe ir a shared si es un componente que se reutiliza en varias vistas.
- Mantener SCSS puro: no añadir Tailwind, Bootstrap ni librerías de estilos.

## Tipografía y tamaños
- Familia principal: **Satoshi**, alojada localmente y cargada una sola vez con `next/font/local` en el layout raíz. Conservar su licencia junto a los archivos de fuente.
- Consumir `var(--font-sans)` y los tokens de `src/styles/_typography.scss`; no declarar familias ni cargar fuentes desde componentes. Formularios y botones heredan la familia.
- Usar solo tres pesos: `--weight-regular` (400) para lectura, `--weight-medium` (500) para títulos y controles, y `--weight-bold` (700) para énfasis puntual. No introducir pesos sintéticos ni usar negrita en todos los títulos.

  | Rol | Token | Tamaño |
  | --- | --- | --- |
  | Etiquetas y notas | `--text-caption` | 0.75rem / 12px |
  | Texto secundario y botones | `--text-small` | 0.875rem / 14px |
  | Texto principal y formularios | `--text-body` | 1rem / 16px |
  | Introducción destacada | `--text-lead` | 1.125rem / 18px |
  | Títulos de tarjetas | `--text-card-title` | 1.25rem / 20px |
  | Títulos de sección | `--text-section-title` | Fluido entre 30 y 44px |
  | Título principal | `--text-display` | Fluido entre 40 y 64px; entre 32 y 44px en móvil |

- Usar `rem` y `clamp()` para tipografía, respetando el tamaño raíz del navegador. No fijar el tamaño raíz para forzar equivalencias ni crear tamaños arbitrarios por componente.
- Interlineado de lectura: `--leading-body` (1.65); títulos: `--leading-heading` (1.15). Tracking normal en párrafos, `--tracking-heading` (-0.025em) en títulos, `--tracking-display` (-0.035em) en el hero y `--tracking-label` (0.12em) solo en etiquetas cortas en mayúsculas.
- Texto real de lectura: al menos 14px; notas o etiquetas auxiliares: al menos 12px. Inputs: al menos 16px. Comprobar saltos de línea y desbordamientos en móvil y con zoom.
- Importes comparables usan `font-variant-numeric: tabular-nums`. Las ilustraciones miniaturizadas de producto pueden tener una escala interna menor; esa excepción no aplica a formularios ni datos reales del dashboard.

## Reglas críticas de ejecución
- Server Components por defecto. Solo usar `"use client"` en la frontera que requiera hooks, eventos o interactividad.
- No acceder a `window`, `document` o `localStorage` durante el render inicial en servidor.
- Peticiones HTTP centralizadas: toda llamada pasa por `src/services/`. Nunca invocar `fetch` o `axios` directamente en componentes ni en stores.
- No quemar URLs ni contratos falsos: usar variables de entorno (`NEXT_PUBLIC_*`) y propagar errores.
- Zustand solo para estado global compartido; estado efímero de UI permanece local (`useState`).
- Leer Zustand fuera de React únicamente mediante `useStore.getState()`.

## Validación
- Comprobar que el código compile ejecutando `npm run lint` y `npm run build` antes de dar por cerrada la tarea.
- Al terminar, listar los archivos modificados y los puntos pendientes.

## Despliegue de producción
- El VPS de Orbital Ctrl publica desde `master` con los comandos `u_back_ctrl` y `u_front_ctrl`, ejecutados con privilegios de administrador del VPS.
- Para cambios del frontend, usa `u_front_ctrl`; para cambios del backend, usa `u_back_ctrl`. Cada comando despliega únicamente su servicio y reinicia únicamente su proceso PM2 correspondiente.
- Los comandos toman el último commit de GitHub en `master`. Los cambios deben estar commiteados y subidos antes de desplegar; no despliegues trabajo local sin publicar.
- El despliegue conserva releases anteriores y revierte el enlace estable si falla el chequeo de salud. Instala dependencias solo cuando cambia `package-lock.json`.
- No hagas `git pull`, compilaciones ni cambios de symlink directamente dentro de `/opt/orbital-ctrl/front` o `/opt/orbital-ctrl/back`; son rutas estables administradas por el despliegue.
- No muestres, sobrescribas ni subas los `.env` de producción. Si el acceso SSH o los comandos no están disponibles, informa el bloqueo y no simules un despliegue.
- Si una tarea requiere cambiar modelos o el esquema de datos, trata el cambio como trabajo del backend: incluye una migración Prisma nueva en el mismo cambio y sigue el flujo obligatorio de migraciones del `AGENTS.md` del backend. No resuelvas cambios de esquema con ajustes solo en el front.
