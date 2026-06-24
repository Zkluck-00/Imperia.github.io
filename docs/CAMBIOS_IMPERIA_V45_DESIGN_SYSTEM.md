# IMPERIA v45 - Design System Premium

## Objetivo
Elevar la interfaz de IMPERIA a una experiencia visual premium, escalable y cohesiva, con enfoque de Design System tipo Figma/Lovable para educación financiera gamificada.

## Cambios aplicados

### 1. Tokens de diseño
Se creó el archivo:

- `css/theme/v45-design-system-tailwind-premium.css`

Incluye tokens globales para:

- Paleta financiera: azules profundos para confianza y estabilidad.
- Paleta de crecimiento: verdes esmeralda para progreso financiero.
- Acentos gamificados: violeta XP, dorado recompensa y cyan energía.
- Superficies glassmorphism para modo claro y oscuro.
- Tipografía: lectura limpia y display con personalidad.
- Sistema de radios: xs, sm, md, lg, xl, 2xl y pill.
- Elevaciones: elevation-1, elevation-2, elevation-3 y glow.
- Espaciado base para ritmo visual consistente.

### 2. Tailwind CSS listo para escalar
Se añadió:

- `tailwind.config.js`

El archivo contiene la traducción de tokens a Tailwind para una futura migración o refactor con clases utilitarias.

### 3. Componentes atómicos
Se rediseñaron estilos base para:

- Botón primario.
- Botón secundario / ghost.
- Botón de recompensa.
- Botón de acción gamificada.
- Cards modulares.
- Progress bars.
- Badges de logro.
- Píldoras de estado.
- Avatares y panel de mentor.

### 4. Dashboard de aprendizaje
Se rediseñó la vista principal `home` en `js/app/main.js` con:

- Sidebar profesional en escritorio.
- Header con estado de racha, coins, perfil y tema.
- Hero principal con mentor/personaje.
- Consejo financiero destacado.
- Acciones rápidas.
- Grid de cursos por desbloquear.
- Panel lateral de estado, XP, vidas y badges.
- Responsive mobile-first.

### 5. Cohesión visual global
Se aplicaron mejoras transversales a cards, botones, barras, curso, perfil, premium, certificados y herramientas mediante una capa CSS final que no rompe la funcionalidad previa.

## Archivos modificados

- `index.html`
- `js/app/main.js`
- `css/theme/v45-design-system-tailwind-premium.css`
- `tailwind.config.js`
- `docs/CAMBIOS_IMPERIA_V45_DESIGN_SYSTEM.md`

## Validación

- JavaScript validado con `node --check`.
- Se conservan login, registro, acceso invitado, premium, cursos, certificados, herramientas y modo claro/oscuro.
