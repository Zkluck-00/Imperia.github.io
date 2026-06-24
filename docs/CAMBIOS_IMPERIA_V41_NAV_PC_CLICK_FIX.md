# IMPERIA V41 - Corrección de navegación en PC

## Problema corregido
En PC los botones de la barra inferior no navegaban correctamente, aunque en móvil sí funcionaban.

## Solución aplicada
- Se corrigió el sistema de arrastre con mouse.
- Si el usuario hace clic sobre un botón, navega inmediatamente.
- El arrastre horizontal en PC ahora solo se activa al tomar el espacio/fondo de la barra, no los botones.
- Se agregó un listener directo de navegación al contenedor fijo de la barra.
- Se mantiene el desplazamiento con rueda del mouse.

## Archivos modificados
- `js/app/main.js`
- `css/theme/v41-nav-pc-click-fix.css`
- `index.html`
