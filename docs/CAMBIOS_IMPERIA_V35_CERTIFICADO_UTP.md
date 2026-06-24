# IMPERIA V35 - Plantilla de certificado estilo UTP

## Cambios aplicados

Se adaptó la plantilla descargable del certificado usando los recursos ubicados en `img/`:

- `logo utp.png`
- `firma 1.jpeg`
- `firma 2.jpeg`

## Firmas configuradas

### Firma 1
ANTONIO FERNANDO MAESTRE SATTUI  
Coordinador Servicio de Atención al Estudiante

### Firma 2
JUAN ANTONIO TRELLES CASTILLO  
Secretario General

## Reglas mantenidas

- El certificado solo se puede descargar si el estudiante culminó el curso.
- El nombre del certificado toma el campo `fullName` del registro.
- El curso y la duración se toman automáticamente del curso culminado.
- El certificado se descarga como archivo `.html`, listo para imprimir o guardar como PDF desde el navegador.

## Archivos modificados

- `js/app/main.js`
- `css/screens/v27-contrast-audit.css`
- `index.html`
