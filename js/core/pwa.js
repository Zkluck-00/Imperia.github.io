(() => {
  // IMPERIA v6: durante esta etapa desactivamos el Service Worker para evitar que GitHub Pages
  // sirva CSS/HTML antiguos desde cache.
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map(registration => registration.unregister()));
      } catch (error) {}
      try {
        if ('caches' in window) {
          const keys = await caches.keys();
          await Promise.all(keys.map(key => caches.delete(key)));
        }
      } catch (error) {}
    });
  }
})();
