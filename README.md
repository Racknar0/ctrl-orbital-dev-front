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

El registro crea la cuenta y un primer espacio de trabajo. Las cuentas nuevas verifican su correo antes de iniciar sesión. La recuperación de contraseña funciona mediante correo. El acceso social está pendiente.

No se versionan dependencias, compilaciones, archivos locales de entorno ni claves privadas.

## Probar salas rápidas

Abre `http://localhost:3001/salas-rapidas` con el frontend en el puerto 3001 y el backend local en el 4000. Crea una sala y abre su invitación en una ventana incógnita para entrar como otra persona. Registra gastos después de que entren quienes participarán en el reparto. Los datos y saldos se actualizan cada cinco segundos.

La sesión de invitado de cada sala se conserva en este navegador mediante `localStorage`. Borrar los datos del navegador elimina ese acceso. Las salas no se vinculan todavía con cuentas registradas.

### Pruebas automatizadas del navegador

Con backend y frontend locales encendidos, PostgreSQL local migrado y Google Chrome instalado:

```sh
npm run test:salas-rapidas
```

Playwright ejecuta seis escenarios: recorrido con dos invitados y pago confirmado, varias salas y recarga, edición/eliminación de gastos, perfil de pago y errores de validación, móvil/vencimiento y código inexistente. Los repositorios `back/` y `front/` deben ser carpetas hermanas, como en este proyecto; la suite usa el Prisma del backend para eliminar únicamente sus salas de prueba. Solo admite la base local `app_gastos` y no resetea tablas ni usuarios. El reporte HTML queda en `playwright-report/index.html` y los fallos incluyen captura y traza.
