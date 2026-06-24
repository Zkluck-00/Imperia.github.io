# IMPERIA v23 - Estructura modular y cursos ampliados

## Nueva estructura principal

```text
Imperia/
├── index.html
├── css/
│   ├── tokens.css
│   ├── layout.css
│   ├── components.css
│   ├── responsive.css
│   └── v12-app-professional.css
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
│   └── engines/
│       ├── courses.nodes.js
│       ├── node.engine.js
│       └── map.renderer.js
├── assets/
├── img/
└── docs/
```

## Qué cambió

- `js/data.js` ya no concentra todo el contenido.
- Los cursos gratuitos están en `js/data/courses-free.js`.
- Los cursos premium están en `js/data/courses-premium.js`.
- Las misiones están en `js/data/missions.js`.
- La tienda está en `js/data/store-items.js`.
- `js/data/index.js` ensambla todo y mantiene `window.IMPERIA_DATA`.
- `js/app/main.js` contiene la lógica principal de interfaz.
- `js/core/storage.js` contiene login, progreso, compras y cuenta.
- `js/engines/` contiene archivos relacionados al motor de nodos.

## Cursos incluidos

### Gratuitos
1. Finanzas Personales desde Cero — 6 módulos.
2. Sistema Financiero Peruano y Créditos — 6 módulos.
3. Historial Crediticio y Perfil Verde — 6 módulos.

### Premium
1. Inversión Inteligente en Perú — 10 módulos.
2. Emprendimiento Digital desde Cero — 10 módulos.
3. Crédito Avanzado e Historial Perfecto — 10 módulos.
4. Finanzas para Negocios Reales — 10 módulos.

## Validación técnica

Se verificó sintaxis de todos los archivos JavaScript con `node --check`.
También se validó que `IMPERIA_DATA` ensamble correctamente:
- 7 cursos en total.
- 3 cursos gratuitos.
- 4 cursos premium.
- 58 módulos entre gratuitos y premium.
