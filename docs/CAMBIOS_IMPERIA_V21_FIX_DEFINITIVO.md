# IMPERIA v21 - Fix definitivo de carga

Correcciones aplicadas:
- Se corrigieron errores de sintaxis en `js/app.js`.
- Se corrigió el bloque roto que reemplazó `localStorage` por texto visible.
- Se corrigió `js/data.js`, que tenía cursos premium fuera del objeto principal y rompía el JavaScript.
- La app ya no queda bloqueada en el splash del logo.
- Si no hay usuario, carga el login.
- Si hay usuario, carga la app.
- Premium ya no bloquea toda la aplicación; bloquea únicamente el contenido premium.
- Se mantuvieron los 5 cursos premium dentro del arreglo principal de cursos.
- Se verificó sintaxis de todos los archivos JavaScript con `node --check`.

Archivos validados:
- js/app.js
- js/data.js
- js/storage.js
- js/pwa.js
- js/ui-effects.js
- js/courses.nodes.v16.js
- js/node.engine.v16.js
- js/map.renderer.v16.js
