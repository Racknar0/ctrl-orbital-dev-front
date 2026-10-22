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
- Mantener SCSS puro: no añadir Tailwind, Bootstrap ni librerías de estilos.

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