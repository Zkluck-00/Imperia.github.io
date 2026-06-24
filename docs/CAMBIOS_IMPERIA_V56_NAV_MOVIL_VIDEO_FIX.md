# IMPERIA v56 - Navegación móvil y corrección de videos

## Navegación móvil
- Se agregó una capa CSS final para forzar la barra inferior en teléfonos.
- La barra queda fija al fondo, deslizable horizontalmente y con botones visibles.
- Se reserva espacio inferior en el body para que no tape contenido.

## Videos de cursos
- Se eliminó el video incorrecto de programación / demo.
- Se eliminan IDs genéricos que no corresponden al curso.
- Si no existe link exacto del curso, se muestra un espacio de video específico pendiente.
- No abre buscador de YouTube ni permite que el alumno elija cualquier video.
- Para activar videos reales, reemplazar `videoId: ""` por el ID del video de YouTube correcto en:
  - `js/data/courses-free.js`
  - `js/data/courses-premium.js`
