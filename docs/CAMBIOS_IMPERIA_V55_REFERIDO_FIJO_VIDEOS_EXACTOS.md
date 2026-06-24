# Cambios IMPERIA v55 - Referido fijo y videos exactos

## Código de referido
- Se dejó un código fijo: REF-IMPERIA321.
- Al ingresar REF-IMPERIA321 en el checkout, se aplica 10% de descuento.
- Aplica para:
  - IMPERIA PRO.
  - Cursos exclusivos.
- Si el usuario ya tiene IMPERIA PRO activo, el curso exclusivo también aplica 10% automáticamente.

## Videos
- Se eliminó el comportamiento de búsqueda en YouTube.
- El reproductor ahora usa únicamente el videoId específico asignado en cada curso.
- El botón de respaldo abre el video exacto, no el buscador.
- Si luego se desean otros videos, reemplazar el campo videoId en:
  - js/data/courses-free.js
  - js/data/courses-premium.js

Nota: como no se entregaron links específicos por curso, se dejó un video de YouTube embebible de prueba para que la estructura quede funcional y sin buscador.
