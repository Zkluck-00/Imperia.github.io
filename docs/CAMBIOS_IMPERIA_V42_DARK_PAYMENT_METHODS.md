# IMPERIA V42 - Fix de métodos de pago en modo oscuro

## Problema corregido
En modo oscuro, los botones de métodos de pago (Tarjeta, Yape, Plin y Transferencia) heredaban estilos claros con mayor prioridad y el texto/iconos quedaban poco visibles.

## Solución aplicada
- Se creó una hoja de estilos específica con mayor especificidad para modo oscuro.
- Se corrigieron fondo, borde, texto e íconos de los métodos de pago.
- Se mejoraron los estados hover, active y focus.
- El modo claro no fue afectado.

## Archivos modificados
- `css/theme/v42-dark-payment-methods-fix.css`
- `index.html`
