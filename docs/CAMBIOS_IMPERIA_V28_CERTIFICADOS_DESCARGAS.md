# IMPERIA V28 - Certificados y descargas

## Nuevas funciones

### Apartado Certificados
Se agregó una nueva vista `Certificados` dentro del sistema y en la barra inferior.

El usuario podrá ver:
- certificados obtenidos
- cursos culminados
- cursos pendientes
- avance requerido para desbloquear certificados

### Regla de desbloqueo
El certificado solo se habilita si el usuario ha culminado todas las clases/módulos del curso.

### Descargar certificado
El certificado se descarga como archivo `.html` con diseño formal:
- nombre del estudiante
- nombre del curso
- código de certificado
- fecha de emisión
- duración del curso

### Descargar curso
El material del curso se descarga como archivo `.txt` solo si el curso está culminado. Incluye:
- resumen del curso
- módulos
- actividades
- lecturas
- prácticas
- quizzes

## Archivos modificados
- `js/app/main.js`
- `css/v27-contrast-audit.css`
- `index.html`
