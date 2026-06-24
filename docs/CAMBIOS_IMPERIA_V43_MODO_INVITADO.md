# IMPERIA V43 - Acceso como invitado

## Cambio implementado
Se agregó una opción en el login para ingresar como invitado sin crear cuenta.

## Funcionamiento
- Botón nuevo: `Ingresar como invitado`.
- Crea una sesión local con el usuario `Invitado IMPERIA`.
- Permite explorar la plataforma desde el inicio.
- El perfil muestra el estado `Invitado`.
- Desde perfil se puede salir del modo invitado o ir al registro formal.

## Archivos modificados
- `js/core/storage.js`
- `js/app/main.js`
- `css/theme/v43-guest-access.css`
- `index.html`
