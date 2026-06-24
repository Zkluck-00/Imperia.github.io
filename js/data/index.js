/* Ensamblador de datos de IMPERIA.
   Mantiene compatibilidad con el código existente mediante window.IMPERIA_DATA. */
window.IMPERIA_DATA = {
  ...window.IMPERIA_CONFIG,
  missions: window.IMPERIA_MISSIONS || [],
  courses: [
    ...(window.IMPERIA_FREE_COURSES || []),
    ...(window.IMPERIA_PREMIUM_COURSES || [])
  ],
  storeItems: window.IMPERIA_STORE_ITEMS || []
};
