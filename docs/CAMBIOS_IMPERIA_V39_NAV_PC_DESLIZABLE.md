# IMPERIA V39 - Navegación deslizable también en PC

## Problema corregido
En móvil la barra inferior se podía deslizar con el dedo, pero en PC no se sentía igual porque el usuario no podía arrastrarla fácilmente con mouse.

## Cambios aplicados
- Se agregó arrastre horizontal con mouse en escritorio.
- Se agregó soporte para rueda del mouse: el scroll vertical sobre la barra mueve la navegación horizontalmente.
- Se centra automáticamente el botón activo.
- Se agregaron degradados laterales para indicar que la barra se puede deslizar.
- En móvil se mantiene el comportamiento táctil.

## Archivos modificados
- `js/app/main.js`
- `css/theme/v39-nav-desktop-drag.css`
- `index.html`
