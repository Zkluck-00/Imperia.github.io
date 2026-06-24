// Microinteracciones sin librerías externas: mantiene la app 100% local.
document.addEventListener('click', (event) => {
  const btn = event.target.closest('.btn, .question-option, .payment-method');
  if (!btn) return;
  const ripple = document.createElement('span');
  ripple.className = 'tap-ripple';
  const rect = btn.getBoundingClientRect();
  ripple.style.left = `${event.clientX - rect.left}px`;
  ripple.style.top = `${event.clientY - rect.top}px`;
  btn.appendChild(ripple);
  setTimeout(() => ripple.remove(), 520);
});
const style = document.createElement('style');
style.textContent = `.tap-ripple{position:absolute;width:14px;height:14px;border-radius:999px;background:rgba(255,255,255,.5);transform:translate(-50%,-50%) scale(1);animation:ripple .5s ease-out;pointer-events:none}@keyframes ripple{to{opacity:0;transform:translate(-50%,-50%) scale(18)}}`;
document.head.appendChild(style);
