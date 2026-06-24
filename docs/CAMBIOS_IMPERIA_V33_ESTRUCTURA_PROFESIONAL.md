# IMPERIA V33 - Estructura profesional por módulos

## Objetivo
Ordenar el proyecto para que cada parte del sistema tenga una ubicación clara e independiente.

## Nueva distribución

```text
Imperia/
├── assets/
├── img/
├── css/
│   ├── base/
│   │   ├── tokens.css
│   │   ├── layout.css
│   │   ├── components.css
│   │   └── responsive.css
│   ├── legacy/
│   │   ├── pro-polish.css
│   │   ├── pro-final-fixes.css
│   │   ├── responsive-v4.css
│   │   ├── fluid-responsive-v5.css
│   │   ├── mobile-hard-fix-v6.css
│   │   └── imperia-ui.css
│   ├── app/
│   │   └── v12-app-professional.css
│   ├── screens/
│   │   ├── v24-mobile-figma.css
│   │   ├── v27-contrast-audit.css
│   │   └── v32-responsive-universal.css
│   └── theme/
│       └── v31-theme-toggle.css
├── js/
│   ├── app/
│   │   ├── main.js
│   │   └── ui-effects.js
│   ├── core/
│   │   ├── storage.js
│   │   └── pwa.js
│   ├── data/
│   │   ├── config.js
│   │   ├── courses-free.js
│   │   ├── courses-premium.js
│   │   ├── missions.js
│   │   ├── store-items.js
│   │   └── index.js
│   ├── engines/
│   │   ├── courses.nodes.js
│   │   ├── node.engine.js
│   │   └── map.renderer.js
│   ├── views/
│   │   ├── auth/
│   │   │   ├── login.view.js
│   │   │   └── register.view.js
│   │   ├── certificates/
│   │   │   └── certificates.view.js
│   │   ├── courses/
│   │   │   ├── courses.view.js
│   │   │   └── course-detail.view.js
│   │   ├── layout/
│   │   │   └── navigation.view.js
│   │   ├── profile/
│   │   │   └── profile.view.js
│   │   ├── subscription/
│   │   │   └── premium.view.js
│   │   ├── theme/
│   │   │   └── theme.view.js
│   │   ├── tools/
│   │   │   └── tools.view.js
│   │   ├── ui/
│   │   │   └── components.view.js
│   │   └── index.js
│   └── archive/
└── docs/
```

## Importante
- `js/app/main.js` queda como controlador principal de ejecución para que el proyecto siga funcionando en GitHub Pages sin compiladores.
- `js/views/` separa cada pantalla por responsabilidad para que puedas mantener, documentar y ubicar cada parte del sistema fácilmente.
- Se eliminaron archivos sueltos antiguos que ya no eran usados.
- Los estilos se organizaron por función: base, legacy, app, screens y theme.

## Módulos principales
- Login: `js/views/auth/login.view.js`
- Registro: `js/views/auth/register.view.js`
- Cursos: `js/views/courses/courses.view.js`
- Detalle de curso: `js/views/courses/course-detail.view.js`
- Perfil: `js/views/profile/profile.view.js`
- Suscripción/Premium: `js/views/subscription/premium.view.js`
- Certificados: `js/views/certificates/certificates.view.js`
- Herramientas: `js/views/tools/tools.view.js`
- Tema claro/oscuro: `js/views/theme/theme.view.js`
- Navegación: `js/views/layout/navigation.view.js`
