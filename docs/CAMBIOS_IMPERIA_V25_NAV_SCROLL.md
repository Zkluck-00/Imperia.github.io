# CAMBIOS IMPERIA V25 · NAV MÓVIL DESLIZABLE

## Mejora aplicada
Se rediseñó la barra de navegación inferior para que:
- se muestre en **una sola línea**
- permita **desplazamiento horizontal** de izquierda a derecha
- funcione mejor en teléfonos pequeños
- mantenga la opción activa centrada automáticamente

## Cambios técnicos
- `css/v24-mobile-figma.css`
  - navegación convertida a `flex` horizontal
  - `overflow-x: auto`
  - `scroll-snap`
  - `touch-action: pan-x`
  - botones con ancho fijo y estilo activo más visible
- `js/app/main.js`
  - función `centerActiveBottomNav()` para centrar el botón activo al renderizar
