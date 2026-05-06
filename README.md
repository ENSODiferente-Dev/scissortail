# Scissortail React App (Prototype)

Prototype React + Vite para migrar el sitio estatico de Scissortail y validar que el embed de LeadConnector funciona en GitHub Pages.

## Incluye

- React + Vite.
- Rutas SPA con `HashRouter`:
  - `/#/`
  - `/#/terms`
  - `/#/privacy`
- Formulario de Free Estimate (iframe original).
- Script externo de formulario de LeadConnector.
- Widget de live chat de LeadConnector cargado una sola vez.

## Ejecutar local

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Base path para Pages

`vite.config.js` usa `VITE_BASE_PATH`.

- Por defecto: `/`
- Si publicas como project page (`usuario.github.io/repositorio`):

```bash
VITE_BASE_PATH=/scissortail/ npm run build
```
