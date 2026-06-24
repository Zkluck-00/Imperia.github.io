# Cambios implementados - IMPERIA v7

## Enfoque
Se mantuvo el sistema sin backend ni base de datos externa. Todo sigue funcionando con `localStorage`, pero se agregó una capa visual y funcional para que parezca una plataforma más profesional, gamificada y cercana a una experiencia tipo Duolingo/fintech educativa.

## Mejoras visuales
- Nueva capa `css/imperia-ui.css` como mini framework visual local.
- Animaciones de entrada, tarjetas flotantes, nodos con movimiento, mentor Einstein animado y microinteracciones.
- Botones con efecto de profundidad y ripple.
- Mejora del mapa de aprendizaje, tarjetas, badges, paneles y responsive.

## Mejoras funcionales solicitadas
- Tres niveles de acceso visibles:
  - Nivel Gratuito.
  - Pago por curso: S/ 80 demo.
  - Suscripción mensual: S/ 35 demo.
- Registro e inicio de sesión con correo o celular.
- Sistema de vidas para el nivel gratuito.
- Las clases gratuitas consumen vidas al abrirlas por primera vez.
- Los quizzes correctos permiten ganar vidas.
- Suscripción mensual con vidas ilimitadas y eliminación de anuncios.
- Compra individual de cursos mediante pago simulado local.
- Panel de asistencia demo para cursos: Zoom, máximo 2 inasistencias, bloqueo a la tercera falta.
- Panel de administración demo en Perfil: contenidos, horarios, asistencia, pagos y reportes.
- Tienda de avatares mantenida y reforzada visualmente.

## Archivos agregados
- `css/imperia-ui.css`
- `js/ui-effects.js`
- `docs/CAMBIOS_IMPERIA_V7.md`

## Archivos modificados
- `index.html`
- `js/app.js`
- `js/storage.js`
- `js/data.js`
