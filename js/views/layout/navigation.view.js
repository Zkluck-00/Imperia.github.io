// Navegación inferior y comportamiento mobile.
// El render runtime está centralizado en js/app/main.js para mantener compatibilidad estática.
window.IMPERIA_VIEW_MODULES = window.IMPERIA_VIEW_MODULES || {};
window.IMPERIA_VIEW_MODULES.navigation = {
  name: "Navegación",
  responsibility: "Barra inferior, cambio de vistas y scroll horizontal responsive.",
  runtime: "js/app/main.js",
  styles: ["css/screens/v24-mobile-figma.css", "css/screens/v32-responsive-universal.css"]
};
