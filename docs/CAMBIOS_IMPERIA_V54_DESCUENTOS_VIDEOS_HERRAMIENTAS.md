# Cambios IMPERIA v54 - Descuentos, videos y herramientas

## Descuento IMPERIA PRO / referido
- Si el usuario tiene IMPERIA PRO activo, los cursos exclusivos aplican 10% de descuento: S/ 80 -> S/ 72.
- Si un usuario usa un código de referido de otra cuenta con IMPERIA PRO activo, aplica 10% de descuento:
  - IMPERIA PRO: S/ 25 -> S/ 22.50.
  - Curso exclusivo: S/ 80 -> S/ 72.
- Cada usuario PRO muestra un código referido local en el panel de IMPERIA PRO.
- La lógica es simulada y local, no usa pasarela real.

## Videos de cursos
- Se reemplazó el iframe rígido que generaba error de reproductor por un componente YouTube robusto.
- El componente intenta cargar una búsqueda relacionada de YouTube según el nombre del curso.
- Incluye fallback visible con botón para abrir YouTube si el navegador local bloquea el reproductor.

## Herramientas
Se agregaron nuevas herramientas interactivas:
- Calculadora de precio de venta.
- Clasificador de inventario ABC.
- Reto de flujo de caja.
- Se mantuvieron presupuesto, quiz relámpago y meta de ahorro.

## Validación
- JavaScript validado con `node --check`.
