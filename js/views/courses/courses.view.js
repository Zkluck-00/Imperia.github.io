// Vista: Cursos
window.IMPERIA_VIEW_MODULES = window.IMPERIA_VIEW_MODULES || {};
window.IMPERIA_VIEW_MODULES.courses = {
  name: "Cursos",
  sections: ["Cursos gratuitos", "Cursos exclusivos"],
  rules: ["Cursos gratuitos con 12 lecciones y 5 monedas por lección", "Cursos exclusivos cuestan S/ 80 cada uno", "IMPERIA PRO no desbloquea cursos exclusivos"],
  data: ["js/data/courses-free.js", "js/data/courses-premium.js"],
  runtime: "js/app/main.js"
};
