# IMPERIA v45 - Design System Premium

Versión con rediseño visual escalable tipo Figma/Lovable: tokens de diseño, Tailwind config, componentes atómicos y nuevo Dashboard de Aprendizaje con mentor, sidebar y grid de ruta gamificada.

Ver detalles en `docs/CAMBIOS_IMPERIA_V45_DESIGN_SYSTEM.md`.

---

# IMPERIA v12 Pro App Fluid

Plataforma web gamificada de educación financiera peruana con experiencia visual tipo aplicación móvil.

## Incluye

- Login y registro local con correo o celular.
- Progreso, vidas, XP, ImperiaCoins y certificados guardados en localStorage.
- 4 cursos gratuitos orientados al contexto peruano.
- Quiz final animado estilo Duolingo por curso.
- Bottom nav móvil deslizable estilo app.
- Skeleton loading, transiciones, microinteracciones y avatar Einstein animado.
- Simulación de suscripción mensual y pago por curso.

## Uso

Abre `index.html` o publica el contenido de la carpeta `Imperia` en GitHub Pages.

No subir el ZIP completo como carpeta raíz. La raíz publicada debe contener:

```text
index.html
css/
js/
assets/
img/
service-worker.js
```

## Importante

El proyecto no usa base de datos ni backend. Todo se guarda localmente en el navegador.


## v23 - Estructura modular

El proyecto ahora separa datos, lógica principal, almacenamiento y motores en carpetas dentro de `js/`. Ver `docs/CAMBIOS_IMPERIA_V23_ESTRUCTURA_MODULAR.md`.


## V33 - Estructura profesional

El proyecto fue reorganizado por carpetas funcionales: `js/views/auth`, `js/views/courses`, `js/views/profile`, `js/views/subscription`, `js/views/certificates`, `js/views/tools`, `js/views/layout`, `js/views/theme` y `css/` organizado por base, legacy, app, screens y theme. Ver `docs/CAMBIOS_IMPERIA_V33_ESTRUCTURA_PROFESIONAL.md`.


## V36 - Cursos premium adicionales

Se agregaron 3 cursos premium nuevos: Contabilidad Básica para Emprendedores, Marketing Digital y Ventas para Negocios, y Planeamiento Financiero Familiar. Ahora el sistema cuenta con 7 cursos premium.


## GitHub Pages
This package is prepared with relative paths (./) and includes a .nojekyll file.


## Logo update
The app now points to `./img/LogoActual.png`, which matches the updated asset in the repository.


## v49

Se actualizó la suscripción a IMPERIA PRO, se añadieron 3 cursos exclusivos y los cursos gratuitos ahora cuentan con 12 lecciones y 5 monedas por lección.
## Cambios v52 - Cursos, IMPERIA PRO y certificados
- Cursos gratuitos actualizados: Aprende a Emprender, Gestión de Inventarios y Finanzas al Toque.
- Cada curso gratuito tiene 12 lecciones y entrega 5 monedas por lección completada.
- Cursos exclusivos actualizados: Administración Financiera para PYMES, Administración y Contabilidad, Gestión Comercial, Marketing Digital y Ventas para Negocios.
- Cada curso exclusivo cuesta S/ 80 y se paga por separado.
- IMPERIA PRO cuesta S/ 25 mensuales y no desbloquea cursos exclusivos.
- IMPERIA PRO incluye 500 coins, eliminación de anuncios y acceso a conferencias disponibles.
- Cada certificado cuesta S/ 35 para poder descargarse, aun cuando el curso ya esté culminado.


## v54 - Descuentos, videos y herramientas
- Descuento 10% en cursos exclusivos para usuarios IMPERIA PRO.
- Código de referido PRO para aplicar 10% en suscripción o cursos exclusivos.
- Videos YouTube con búsqueda relacionada y fallback visible.
- Nuevas herramientas interactivas: precio de venta, inventario ABC y flujo de caja.
