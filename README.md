# orbital-dev-front

Frontend de Orbital Ctrl con Next.js App Router, React, Axios, Zustand y SCSS.

## Desarrollo

```sh
npm ci
npm run dev
```

Abrir http://localhost:3000. Para validar y ejecutar la compilación:

```sh
npm run lint
npm run build
npm start
```

## Estructura

```text
src/
  app/(public)/home/   # Home y sus componentes con SCSS propio
  assets/fonts/       # Fuentes locales y licencia
  helpers/            # Hooks y utilidades
  services/           # HttpService e interceptor Axios
  store/              # Estado compartido con Zustand
  styles/             # Base global, tokens tipográficos y mixins
```

Las convenciones de componentes, estilos y tipografía están en [AGENTS.md](AGENTS.md).

## Tipografía

Satoshi se carga localmente con `next/font/local`. La interfaz utiliza los pesos 400, 500 y 700, con una escala de tamaños definida en `src/styles/_typography.scss`.

Los binarios de la fuente están excluidos de Git. `npm run dev` y `npm run build` ejecutan automáticamente `scripts/setup-fonts.mjs`, que descarga los archivos originales desde Fontshare solo si faltan. La primera ejecución requiere acceso a internet; las siguientes reutilizan las copias locales. También puede ejecutarse manualmente:

```sh
node scripts/setup-fonts.mjs
```

Se conserva la licencia oficial en `src/assets/fonts/satoshi/LICENSE.txt`. [Fuente y condiciones de uso de Satoshi](https://www.fontshare.com/fonts/satoshi).

## Backend y acceso

El formulario de registro e inicio de sesión consume el backend Express en `NEXT_PUBLIC_BACK_HOST` (por defecto `http://localhost:4000`). El backend necesita PostgreSQL; configura sus variables en `back/.env`, aplica la migración con `npm run db:migrate` y arráncalo con `npm run dev`.

El registro crea la cuenta y un primer espacio de trabajo. Después de iniciar sesión, `/dashboard` muestra un mensaje inicial. La verificación de correo, recuperación de contraseña y acceso social aún no están implementados.

No se versionan dependencias, compilaciones, archivos locales de entorno ni claves privadas.
