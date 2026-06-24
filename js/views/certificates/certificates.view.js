// Vista: Certificados
window.IMPERIA_VIEW_MODULES = window.IMPERIA_VIEW_MODULES || {};
window.IMPERIA_VIEW_MODULES.certificates = {
  name: "Certificados",
  rules: ["solo se genera si el curso está culminado", "cada certificado requiere pago individual de S/ 35", "usa fullName del registro", "permite descargar certificado HTML después del pago"],
  runtime: "js/app/main.js"
};
