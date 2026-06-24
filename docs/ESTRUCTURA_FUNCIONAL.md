# Estructura funcional actualizada

## Autenticación

- Registro obligatorio.
- Inicio de sesión obligatorio.
- Validación de nombre, correo, fecha de nacimiento, región, tipo de usuario, objetivo, intereses y contraseña fuerte.
- Hash local de contraseña con `crypto.subtle` cuando está disponible.

## Planes

### Gratis

- Todos los usuarios empiezan aquí.
- Acceso a 3 cursos base.
- Muestra anuncios educativos simulados.

### Premium

- Se activa únicamente después del checkout simulado.
- Desbloquea 3 cursos avanzados.
- Oculta anuncios simulados.
- Duplica recompensas de misiones.
- Habilita cosméticos premium.

## Checkout simulado

El sistema incluye formularios independientes por método de pago:

- Tarjeta: titular, número, vencimiento, CVV y DNI.
- Yape: celular, operación y nombre.
- Plin: celular, banco y operación.
- Transferencia: banco, operación, titular y fecha.

Al validar el formulario, se guarda una suscripción local activa con ID de pago, referencia, método, fecha y renovación demo.

## Cursos

Cada curso tiene módulos con actividades:

- Lectura.
- Quiz.
- Completar.
- Práctica escrita.
- Video embebido.

## Datos

Todo se guarda en `localStorage` bajo una clave de demo versionada. No hay backend.
