# IMPERIA V37 - Barra de navegación fija real

## Problema corregido
La barra inferior no se mantenía visible en todo momento; aparecía solo al llegar más abajo o podía quedar atrapada dentro del contenido.

## Solución aplicada
- La barra inferior ahora se monta en un contenedor fijo dentro del `body`.
- Ya no depende del scroll del contenido.
- Permanece visible en inicio, cursos, herramientas, certificados, premium y perfil.
- Conserva desplazamiento horizontal.
- Se agregó espacio inferior para que no tape botones ni tarjetas.

## Archivos modificados
- `js/app/main.js`
- `css/theme/v37-nav-body-fixed.css`
- `index.html`
