// Vista: Registro
window.IMPERIA_VIEW_MODULES = window.IMPERIA_VIEW_MODULES || {};
window.IMPERIA_VIEW_MODULES.register = {
  name: "Registro",
  fields: ["nombres y apellidos", "correo", "fecha de nacimiento", "sexo", "contraseña", "perfil"],
  certificateSource: "El certificado usa el campo fullName registrado por el usuario.",
  runtime: "js/app/main.js"
};
