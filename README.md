# Scissortail Comfort Solutions

Sitio web estatico para Scissortail Comfort Solutions LLC, publicado con GitHub Pages en el dominio personalizado `scissortailsolutions.com`.

Ultima modificacion: 25 de abril de 2026.

## Tecnologias

- HTML estatico en `index.html`.
- Tailwind CSS cargado por CDN para estilos utilitarios.
- Google Fonts con la familia `Barlow`.
- Font Awesome por CDN para iconos.
- JavaScript vanilla dentro de `index.html` para el menu movil.
- Assets locales en `assets/`, incluyendo logos SVG y la imagen de fondo.
- Formulario embebido de LeadConnector/GoHighLevel mediante iframe externo.

## Estructura

- `index.html`: pagina principal completa, estilos, contenido, navegacion, formulario embebido y scripts.
- `assets/`: imagenes y logos usados por el sitio.
- `CNAME`: dominio personalizado usado por GitHub Pages.
- `.nojekyll`: evita el procesamiento Jekyll en GitHub Pages.

## Formulario embebido

El formulario de "Free Estimate" esta en `index.html`, dentro de la seccion con `id="estimate"`.

El formulario se carga con este iframe:

```html
<iframe
  src="https://api.leadconnectorhq.com/widget/form/cxpaHUVp0MW1FFRVpPaJ"
  id="inline-cxpaHUVp0MW1FFRVpPaJ"
  data-form-id="cxpaHUVp0MW1FFRVpPaJ"
  title="Contact Us"
></iframe>
```

Tambien usa el script externo de LeadConnector al final de `index.html`:

```html
<script src="https://link.msgsndr.com/js/form_embed.js"></script>
```

El sitio solo muestra el iframe. El envio, campos, validaciones y destino de los datos se gestionan desde LeadConnector/GoHighLevel, no desde este repositorio. Para cambiar preguntas, emails de destino, automatizaciones o estilos internos del formulario, hay que editar el formulario en LeadConnector/GoHighLevel. Desde este sitio solo se controla el espacio donde se inserta el iframe, su ancho, alto y posicion dentro de la pagina.

## Despliegue

El sitio se despliega con GitHub Pages desde el repositorio:

```text
https://github.com/ENSODiferente-Dev/scissortail.git
```

Flujo habitual de despliegue:

```bash
git add .
git commit -m "Describe the change"
git push origin main
```

GitHub Pages esta configurado sobre la rama `main`, cada `push` a `origin/main` inicia el despliegue automaticamente. El cambio suele verse en unos segundos o pocos minutos. Si el repositorio usa GitHub Actions para Pages, el estado del despliegue se puede revisar en la pestaña `Actions` del repositorio.
