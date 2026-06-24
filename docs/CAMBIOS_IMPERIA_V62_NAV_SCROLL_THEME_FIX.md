# IMPERIA v62 - Barra móvil deslizable y modo claro/oscuro

## Barra de navegación móvil
- Se retiró el comportamiento de barra completa distribuida.
- La barra vuelve a ser compacta y deslizable horizontalmente.
- Los botones tienen ancho fijo para que el usuario pueda deslizar de izquierda a derecha/derecha a izquierda y elegir la opción.
- La barra queda centrada como contenedor, pero no muestra obligatoriamente todas las opciones al mismo tiempo.

## Modo claro / oscuro
- Se reforzó el motor de tema para funcionar aun cuando localStorage falle en modo archivo.
- Se agregan clases `theme-light` y `theme-dark` además de `data-theme`.
- Se re-aplica el tema después de cada render para evitar que se pierda al navegar.
- Se agregaron estilos finales para fondo, tarjetas, textos y barra inferior en ambos temas.
