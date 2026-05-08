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

## Deploy a Produccion (GitHub Pages)

Este proyecto se despliega con GitHub Actions (no se sube `dist` al repo).

1. Verifica que `CNAME` tenga el dominio correcto.
2. Haz commit y push a `main`:

```bash
git add .
git commit -m "release: production update"
git push origin main
```

3. En GitHub, revisa `Actions` y espera que el workflow termine en verde.
4. Abre el dominio en produccion y haz hard refresh (`Cmd+Shift+R`) para validar cambios.

## Base path para Pages

`vite.config.js` usa `VITE_BASE_PATH`.

- Por defecto: `/`
- Si publicas como project page (`usuario.github.io/repositorio`):

```bash
VITE_BASE_PATH=/scissortail/ npm run build
```
