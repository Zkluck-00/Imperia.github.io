# IMPERIA v63 - Video oculto si no hay enlace real

## Cambio aplicado
- Se eliminó el bloque visual de "video pendiente" que se veía en las tarjetas de curso.
- Si un curso no tiene un videoId real de YouTube, la sección "Video principal" ya no se muestra.
- No se muestra mensaje de placeholder, buscador ni video genérico.
- Cuando se agregue un videoId real, el bloque de video volverá a aparecer automáticamente con el reproductor exacto.

## Archivos modificados
- js/app/main.js
