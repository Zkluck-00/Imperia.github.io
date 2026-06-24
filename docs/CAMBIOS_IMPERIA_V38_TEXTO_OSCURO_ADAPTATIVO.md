# IMPERIA V38 - Adaptación total de textos para modo oscuro

## Problema corregido
Al activar el modo oscuro, algunos textos quedaban con colores de modo claro y perdían contraste, especialmente en tarjetas como **Consejo de Einstein**, módulos, certificados, herramientas y otros bloques internos.

## Solución aplicada
- Se creó una capa de estilos exclusiva para modo oscuro.
- Los títulos, subtítulos, textos secundarios, speech bubbles, badges e íconos ahora cambian correctamente sin afectar el modo claro.
- Se reforzó la visibilidad del texto dentro de `.einstein-card`, `.speech` y contenedores relacionados.
- La corrección solo se aplica bajo `data-theme="dark"`.

## Archivos modificados
- `css/theme/v38-dark-text-adaptive.css`
- `index.html`
