# IMPERIA v57 - Corrección de quiz final

## Problema corregido
- Al responder una pregunta del quiz final, la app podía quedarse visualmente en la misma pantalla.
- El botón Continuar no era suficientemente evidente y dependía del render manual.

## Cambios
- Cuando la respuesta es correcta, el quiz avanza automáticamente a la siguiente pregunta.
- El botón cambia a "Siguiente pregunta" o "Ver resultado" según corresponda.
- El botón también funciona manualmente aunque el avance automático esté activo.
- Se mejoró la visibilidad del panel de feedback.
- Si el usuario no aprueba, ya no se guarda el logro por error; aparece opción para reintentar.
- El logro solo se guarda cuando el puntaje supera el mínimo del curso.
