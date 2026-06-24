# IMPERIA V40 - Dark mode total fix

## Objetivo
Corregir de forma integral el modo oscuro para que ningún texto, input, selector, opción, badge, método de pago o bloque de interfaz quede ilegible o con colores del modo claro.

## Cambios realizados
- Nuevo archivo `css/theme/v40-dark-mode-total-fix.css` cargado al final para tener prioridad.
- Corrección integral de:
  - textos y fondos en tarjetas
  - inputs, textarea y select
  - opciones de select desplegable
  - inputs de fecha y checkbox
  - métodos de pago y banners del checkout premium
  - badges, chips y caja de seguridad
  - barra de navegación inferior en dark mode
  - certificados, errores y overlays
- Ajuste visual del badge "Seguro" para evitar cortes o saltos de línea no deseados.
- Los cambios solo aplican cuando `data-theme="dark"`, por lo que el modo claro no se altera.

## Archivos modificados
- `index.html`
- `css/theme/v40-dark-mode-total-fix.css`
