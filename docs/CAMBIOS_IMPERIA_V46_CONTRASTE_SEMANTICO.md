# IMPERIA v46 - Corrección semántica de contraste WCAG

## Objetivo
Corregir problemas de legibilidad al alternar entre modo claro y modo oscuro, evitando dependencias de colores fijos como blanco o negro en superficies que cambian de tema.

## Cambios aplicados

1. Se agregó `css/theme/v46-contrast-semantic-wcag.css` como última capa visual del sistema.
2. Se definieron tokens semánticos globales:
   - `--ui-bg`
   - `--ui-surface`
   - `--ui-surface-elevated`
   - `--ui-surface-glass`
   - `--ui-text`
   - `--ui-text-heading`
   - `--ui-text-muted`
   - `--ui-border`
   - `--ui-focus`
3. Se corrigieron pares de fondo/texto para:
   - Dashboard de aprendizaje.
   - Sidebar.
   - Tarjetas de cursos.
   - Panel de mentor.
   - Cards de estadísticas.
   - Acciones rápidas.
   - Perfil, certificados, premium, pagos, herramientas y tarjetas heredadas.
4. Se reforzó contraste en:
   - Títulos.
   - Párrafos.
   - Textos secundarios.
   - Badges.
   - Botones.
   - Inputs.
   - Bordes y divisores.
5. Se mantuvo texto blanco únicamente en componentes de marca con fondos oscuros o degradados, como el hero del mentor, botones primarios y badges premium.
6. Se agregaron colores semánticos al `tailwind.config.js` para futuras migraciones:
   - `semantic.bg`
   - `semantic.surface`
   - `semantic.elevated`
   - `semantic.text`
   - `semantic.heading`
   - `semantic.muted`
   - `semantic.border`

## Resultado esperado
La interfaz mantiene visibilidad completa en modo claro y modo oscuro, con contraste más consistente y una arquitectura visual más cercana a un sistema profesional tipo Figma/Lovable.
