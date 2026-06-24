// IMPERIA v49: helpers seguros. La app ya no bloquea todo el sistema por IMPERIA PRO.
function renderPaywall() {
  return `<section class="paywall-v18">
    <div class="paywall-card">
      <h1>IMPERIA PRO</h1>
      <p>Activa IMPERIA PRO por S/ 25.00: 10% de descuento por referido, eliminación de anuncios del contenido gratuito, acceso a conferencias disponibles y vidas ilimitadas. Los cursos exclusivos se pagan por separado.</p>
      <button onclick="activatePremium()" class="btn-premium">Activar IMPERIA PRO S/ 25.00</button>
    </div>
  </section>`;
}

function activatePremium(){
  try {
    ImperiaStore.activatePremium({
      method: "premium",
      methodLabel: "IMPERIA PRO",
      reference: "IMP-PRO"
    });
    if (window.App && typeof window.App.render === "function") window.App.render();
    else location.reload();
  } catch (error) {
    alert(error.message || "No se pudo activar IMPERIA PRO.");
  }
}


const ImperiaTheme = (() => {
  const KEY = "imperia_theme";
  const allowed = ["light", "dark"];
  let memoryTheme = "light";

  const safeStorageGet = () => {
    try { return localStorage.getItem(KEY); }
    catch { return memoryTheme; }
  };

  const safeStorageSet = (value) => {
    memoryTheme = value;
    try { localStorage.setItem(KEY, value); } catch { /* modo archivo / privacidad */ }
  };

  const syncMetaColor = (theme) => {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#07111f" : "#f8fafc");
  };

  const get = () => {
    const saved = safeStorageGet();
    return allowed.includes(saved) ? saved : memoryTheme;
  };

  const apply = (theme = get()) => {
    const normalized = allowed.includes(theme) ? theme : "light";
    const root = document.documentElement;
    const body = document.body;
    root.dataset.theme = normalized;
    root.setAttribute("data-theme", normalized);
    root.classList.toggle("theme-dark", normalized === "dark");
    root.classList.toggle("theme-light", normalized === "light");
    if (body) {
      body.dataset.theme = normalized;
      body.setAttribute("data-theme", normalized);
      body.classList.toggle("theme-dark", normalized === "dark");
      body.classList.toggle("theme-light", normalized === "light");
    }
    safeStorageSet(normalized);
    syncMetaColor(normalized);
    return normalized;
  };

  const toggle = () => apply(get() === "dark" ? "light" : "dark");

  const init = () => apply(get());
  init();
  document.addEventListener("DOMContentLoaded", init);

  return { get, apply, toggle, init };
})();
window.ImperiaTheme = ImperiaTheme;


const App = (() => {
  const validViews = ["home", "courses", "activities", "certificates", "store", "premium", "profile"];
  const initialView = validViews.includes((location.hash || "").replace("#", ""))
    ? location.hash.replace("#", "")
    : "home";

  const state = {
    view: initialView,
    authMode: "login",
    selectedCourse: null,
    selectedModule: null,
    quizCourse: null,
    answers: {},
    checkoutMethod: "card",
    paymentProcessing: false
  };

  const $ = (selector) => document.querySelector(selector);
  const app = () => $("#app");
  const esc = (value = "") => String(value).replace(/[&<>'"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[c]));
  const pct = (num, den) => den ? Math.round((num / den) * 100) : 0;
  const today = () => new Date().toISOString().slice(0, 10);
  const firstName = (user) => (user?.fullName || "Usuario").split(" ")[0];
  const randomQuote = () => IMPERIA_DATA.quotes[new Date().getDate() % IMPERIA_DATA.quotes.length];

  const iconSvg = (name, cls = "") => `<svg class="ui-icon ${cls}" aria-hidden="true"><use href="#i-${name}"></use></svg>`;
  const iconName = (value) => ({
    "badge-check":"check","x":"x","💸":"wallet","🏦":"bank","📊":"chart","📈":"trend","🚀":"rocket","🏛️":"landmark","🧠":"brain","📖":"book","⚡":"bolt","🥼":"shirt","🤵":"briefcase","📱":"phone","🦙":"paw","🌆":"city","🦅":"bird","👑":"crown","✅":"check","🔒":"lock","🎮":"gamepad","🎓":"graduation","⭐":"star","🪙":"coins","🔥":"flame","❤️":"heart","💚":"heart","📘":"book","📚":"book","🛒":"shopping","👤":"user","🗺️":"map","📣":"megaphone","💳":"card","🟣":"wallet","🧾":"receipt"
  }[value] || value || "brain");
  const icon = (value, cls = "") => iconSvg(iconName(value), cls);
  const iconSprite = () => `<svg class="icon-sprite" aria-hidden="true" focusable="false" width="0" height="0"><defs>
    <symbol id="i-brain" viewBox="0 0 24 24"><path d="M9 4a4 4 0 0 0-4 4v1a4 4 0 0 0 0 8 4 4 0 0 0 7 2 4 4 0 0 0 7-2 4 4 0 0 0 0-8V8a4 4 0 0 0-7-2 4 4 0 0 0-3-2Z"/><path d="M12 6v13M8 10h4m0 4h4"/></symbol>
    <symbol id="i-wallet" viewBox="0 0 24 24"><path d="M4 7h15a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3h13"/><path d="M16 13h5"/></symbol>
    <symbol id="i-bank" viewBox="0 0 24 24"><path d="M3 10h18L12 4 3 10Z"/><path d="M5 10v8m4-8v8m6-8v8m4-8v8M4 20h16"/></symbol>
    <symbol id="i-chart" viewBox="0 0 24 24"><path d="M4 19V5"/><path d="M4 19h16"/><path d="M8 16v-5m4 5V8m4 8v-7"/></symbol>
    <symbol id="i-trend" viewBox="0 0 24 24"><path d="M4 17 10 11l4 4 6-8"/><path d="M15 7h5v5"/></symbol>
    <symbol id="i-rocket" viewBox="0 0 24 24"><path d="M14 4c3 1 5 3 6 6l-7 7-6-6 7-7Z"/><path d="M8 16 4 20l1-5M13 17l-1 4 4-4M15 9h.01"/></symbol>
    <symbol id="i-landmark" viewBox="0 0 24 24"><path d="M3 10h18L12 4 3 10Z"/><path d="M5 10v9m4-9v9m6-9v9m4-9v9M3 21h18"/></symbol>
    <symbol id="i-book" viewBox="0 0 24 24"><path d="M4 5a3 3 0 0 1 3-3h13v17H7a3 3 0 0 0-3 3V5Z"/><path d="M4 19a3 3 0 0 1 3-3h13"/></symbol>
    <symbol id="i-bolt" viewBox="0 0 24 24"><path d="m13 2-9 13h7l-1 7 10-14h-7l0-6Z"/></symbol>
    <symbol id="i-shirt" viewBox="0 0 24 24"><path d="M8 4 4 6l2 5 2-1v10h8V10l2 1 2-5-4-2-4 3-4-3Z"/></symbol>
    <symbol id="i-briefcase" viewBox="0 0 24 24"><path d="M9 6V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1"/><path d="M4 7h16v12H4z"/><path d="M4 12h16"/></symbol>
    <symbol id="i-phone" viewBox="0 0 24 24"><rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/></symbol>
    <symbol id="i-paw" viewBox="0 0 24 24"><path d="M12 13c3 0 6 4 4 7H8c-2-3 1-7 4-7Z"/><path d="M5 10c-2-2 1-5 3-3s-1 5-3 3Zm11-3c2-2 5 1 3 3s-5-1-3-3ZM9 6c0-3 4-3 4 0s-4 3-4 0Z"/></symbol>
    <symbol id="i-city" viewBox="0 0 24 24"><path d="M4 20V8h6v12M14 20V4h6v16M2 20h20"/><path d="M7 11h.01M7 15h.01M17 8h.01M17 12h.01M17 16h.01"/></symbol>
    <symbol id="i-bird" viewBox="0 0 24 24"><path d="M4 12c5-6 10-6 16-2-5 1-8 4-10 9-1-3-3-5-6-7Z"/><path d="M15 9c1-2 3-3 5-3"/></symbol>
    <symbol id="i-crown" viewBox="0 0 24 24"><path d="M4 18h16l1-10-5 4-4-7-4 7-5-4 1 10Z"/><path d="M5 21h14"/></symbol>
    <symbol id="i-check" viewBox="0 0 24 24"><path d="m5 13 4 4L19 7"/></symbol>
    <symbol id="i-x" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></symbol>
    <symbol id="i-lock" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></symbol>
    <symbol id="i-gamepad" viewBox="0 0 24 24"><path d="M7 8h10a5 5 0 0 1 4 8l-1 2a2 2 0 0 1-3 0l-1-2H8l-1 2a2 2 0 0 1-3 0l-1-2a5 5 0 0 1 4-8Z"/><path d="M8 12h4M10 10v4M17 12h.01"/></symbol>
    <symbol id="i-graduation" viewBox="0 0 24 24"><path d="m2 9 10-5 10 5-10 5L2 9Z"/><path d="M6 12v4c3 3 9 3 12 0v-4"/></symbol>
    <symbol id="i-star" viewBox="0 0 24 24"><path d="m12 3 3 6 6 1-4.5 4.5 1 6.5-5.5-3.2L6.5 21l1-6.5L3 10l6-1 3-6Z"/></symbol>
    <symbol id="i-coins" viewBox="0 0 24 24"><path d="M12 6c0 2-3 4-7 4s-7-2-7-4 3-4 7-4 7 2 7 4Z" transform="translate(2 2)"/><path d="M4 12c0 2 3 4 7 4s7-2 7-4M4 16c0 2 3 4 7 4s7-2 7-4"/></symbol>
    <symbol id="i-flame" viewBox="0 0 24 24"><path d="M12 22c-4 0-7-3-7-7 0-4 4-7 5-12 4 3 7 6 7 12 1-1 2-3 2-5 2 2 3 4 3 7 0 3-3 5-6 5"/></symbol>
    <symbol id="i-heart" viewBox="0 0 24 24"><path d="M20 5c-2-2-5-2-8 1-3-3-6-3-8-1-3 3-1 8 8 15 9-7 11-12 8-15Z"/></symbol>
    <symbol id="i-map" viewBox="0 0 24 24"><path d="m9 18-6 3V6l6-3 6 3 6-3v15l-6 3-6-3Z"/><path d="M9 3v15M15 6v15"/></symbol>
    <symbol id="i-shopping" viewBox="0 0 24 24"><path d="M6 7h15l-2 9H8L6 7Z"/><path d="M6 7 5 3H2"/><circle cx="9" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></symbol>
    <symbol id="i-user" viewBox="0 0 24 24"><path d="M20 21a8 8 0 0 0-16 0"/><circle cx="12" cy="8" r="4"/></symbol>
    <symbol id="i-megaphone" viewBox="0 0 24 24"><path d="M4 14h4l10 4V6L8 10H4v4Z"/><path d="m8 14 2 6"/></symbol>
    <symbol id="i-card" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18M7 15h4"/></symbol>
    <symbol id="i-receipt" viewBox="0 0 24 24"><path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z"/><path d="M9 8h6M9 12h6M9 16h3"/></symbol>
  </defs></svg>`;

  const toast = (message) => {
    const el = $("#toast");
    el.textContent = message;
    el.classList.add("show");
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => el.classList.remove("show"), 3200);
  };

  const courseProgress = (user, course) => {
    const progress = user?.progress || ImperiaStore.makeProgress();
    const done = course.modules.filter(m => progress.completedModules.includes(`${course.id}:${m.id}`)).length;
    return { done, total: course.modules.length, percent: pct(done, course.modules.length), completed: progress.completedCourses.includes(course.id) };
  };

  const canAccessCourse = (user, course) => !!course && (course.plan === "free" || ImperiaStore.hasCourseAccess(user, course.id));

  

  const formatSoles = (value) => `S/ ${Number(value || 0).toFixed(2)}`;
  const normalizeReferral = (code = "") => String(code).trim().toUpperCase().replace(/\s+/g, "");
  const referralCodeFor = (user) => "REF-IMPERIA321";
  const referralOwner = (code, currentUserId = "") => {
    const normalized = normalizeReferral(code);
    if (!normalized) return null;
    if (normalized === "REF-IMPERIA321") {
      return { id: "imperia_ref_global", fullName: "Referido IMPERIA", plan: "premium", subscription: { status: "active" } };
    }
    return null;
  };
  const pricingForPayment = (payload = {}) => {
    const user = ImperiaStore.currentUser();
    const type = payload.paymentType || "premium";
    const referralCode = normalizeReferral(payload.referralCode || "");
    const referredBy = referralOwner(referralCode, user?.id);
    if (type === "course") {
      const base = 80;
      const proDiscount = ImperiaStore.hasPremium(user);
      const referralDiscount = !!referredBy;
      const discount = (proDiscount || referralDiscount) ? base * 0.10 : 0;
      return { base, discount, total: base - discount, totalLabel: formatSoles(base - discount), baseLabel: formatSoles(base), discountLabel: discount ? formatSoles(discount) : "", reason: proDiscount ? "IMPERIA PRO activo" : referralDiscount ? `Referido PRO ${referralCode}` : "", referralCode, referredBy: referredBy ? referralCodeFor(referredBy) : "" };
    }
    const base = 25;
    const discount = referredBy ? base * 0.10 : 0;
    return { base, discount, total: base - discount, totalLabel: formatSoles(base - discount), baseLabel: formatSoles(base), discountLabel: discount ? formatSoles(discount) : "", reason: referredBy ? `Referido PRO ${referralCode}` : "", referralCode, referredBy: referredBy ? referralCodeFor(referredBy) : "" };
  };
  const coursePriceForUser = (user, course) => {
    if (!course || course.plan === "free") return { label: "Gratis", total: 0 };
    const base = 80;
    const discount = ImperiaStore.hasPremium(user) ? base * 0.10 : 0;
    return { base, discount, total: base - discount, label: formatSoles(base - discount), baseLabel: formatSoles(base), reason: discount ? "10% IMPERIA PRO" : "" };
  };


const render = () => {
    try {
      const root = app();
      if (!root) return;
      const user = ImperiaStore.currentUser();
      if (!user) return renderAuth();
      return renderApp(user);
    } catch (error) {
      console.error("IMPERIA render error:", error);
      const root = app();
      if (root) {
        root.className = "auth-shell auth-shell-simple";
        root.innerHTML = iconSprite() + `
          <section class="auth-page-v13">
            <section class="auth-card-v13">
              <div class="auth-form-head-v13">
                <img src="./img/LogoActual.png?v=49.0.0" onerror="this.onerror=null;this.src='./img/LogoActual.png?v=49.0.0'" alt="IMPERIA" />
                <div>
                  <h2>IMPERIA</h2>
                  <p>Estamos preparando tu experiencia. Recarga la página para continuar.</p>
                </div>
              </div>
              <button class="btn primary full" onclick="location.reload()">Recargar</button>
            </section>
          </section>`;
      }
    }
  };


  const renderAuth = () => {
    const oldDock = document.getElementById("imperiaFixedNavDock");
    if (oldDock) oldDock.remove();
    app().className = "auth-shell auth-mobile-shell";
    app().innerHTML = iconSprite() + `
      <section class="auth-mobile-screen">
        <div class="auth-mobile-hero">
          <img src="./img/LogoActual.png?v=49.0.0" onerror="this.onerror=null;this.src='./img/LogoActual.png?v=49.0.0'" alt="Logo IMPERIA" class="auth-hero-logo" />
          <h1>IMPERIA</h1>
          <p>Educación Financiera y Contable</p>
        </div>

        <section class="auth-mobile-card animate__animated animate__fadeInUp">
          <div class="auth-mobile-copy">
            <h2>${state.authMode === "login" ? "Aprende, Administra, Crece" : "Crea tu cuenta en IMPERIA"}</h2>
            <p>${state.authMode === "login" ? "Conocimiento práctico para tu negocio y futuro." : "Elige tu perfil, registra tus datos y comienza tu ruta financiera."}</p>
          </div>

          <div class="tabs auth-tabs-v13 auth-mobile-tabs" aria-label="Autenticación">
            <button class="${state.authMode === "login" ? "active" : ""}" data-auth-mode="login" type="button">Iniciar sesión</button>
            <button class="${state.authMode === "register" ? "active" : ""}" data-auth-mode="register" type="button">Crear cuenta</button>
          </div>

          ${state.authMode === "login" ? loginForm() : registerForm()}
        </section>
      </section>`;
    bindAuth();
  };

  const loginForm = () => `
    <form id="loginForm" class="stack auth-form-v13 auth-mobile-form" novalidate>
      <div id="loginErrors" class="error-box"></div>
      <div class="field">
        <label for="loginEmail">Correo electrónico</label>
        <input class="input" id="loginEmail" type="email" autocomplete="username" required placeholder="tu@correo.com" />
      </div>
      <div class="field">
        <label for="loginPassword">Contraseña</label>
        <input class="input" id="loginPassword" type="password" autocomplete="current-password" required placeholder="Ingresa tu contraseña" />
      </div>
      <button class="btn primary full auth-submit-v13 auth-mobile-submit" type="submit">INICIAR SESIÓN</button>
      <button class="btn guest full" type="button" data-guest-login>Ingresar como invitado</button>
      <button class="btn ghost full" type="button" data-auth-mode="register">Crear una cuenta</button>
      <div class="auth-legal-v14 auth-mobile-note">Puedes explorar IMPERIA como invitado o crear una cuenta para personalizar tu progreso.</div>
    </form>`;

  const registerForm = () => `
    <form id="registerForm" class="stack auth-form-v13 register-clean-v13 auth-mobile-form" novalidate>
      <div id="registerErrors" class="error-box"></div>
      <div class="field">
        <label>¿Cuál es tu perfil?</label>
        <div class="auth-profile-grid">
          <label class="auth-profile-option">
            <input type="radio" name="userType" value="Estudiante" checked />
            <span class="auth-profile-icon">🎓</span>
            <span class="auth-profile-text"><strong>Estudiante</strong><small>Aprendo para mi futuro</small></span>
          </label>
          <label class="auth-profile-option">
            <input type="radio" name="userType" value="Pequeño Comerciante" />
            <span class="auth-profile-icon">🛒</span>
            <span class="auth-profile-text"><strong>Pequeño Comerciante</strong><small>Tengo un negocio o tienda</small></span>
          </label>
          <label class="auth-profile-option">
            <input type="radio" name="userType" value="Emprendedor / Empresario" />
            <span class="auth-profile-icon">💼</span>
            <span class="auth-profile-text"><strong>Emprendedor / Empresario</strong><small>Quiero hacer crecer mi empresa</small></span>
          </label>
          <label class="auth-profile-option">
            <input type="radio" name="userType" value="Asistente Contable" />
            <span class="auth-profile-icon">📘</span>
            <span class="auth-profile-text"><strong>Asistente Contable</strong><small>Trabajo o quiero trabajar en contabilidad</small></span>
          </label>
        </div>
      </div>
      <div class="field">
        <label for="fullName">Nombre completo</label>
        <input class="input" id="fullName" required placeholder="Ej. Juan Pérez" />
      </div>
      <div class="field">
        <label for="email">Correo electrónico</label>
        <input class="input" id="email" type="email" required placeholder="tu@correo.com" />
      </div>
      <div class="form-grid auth-two-v13">
        <div class="field">
          <label for="birthdate">Fecha de nacimiento</label>
          <input class="input" id="birthdate" type="date" required />
        </div>
        <div class="field">
          <label for="gender">Sexo</label>
          <select class="select" id="gender" required>
            <option value="">Selecciona</option>
            <option value="Femenino">Femenino</option>
            <option value="Masculino">Masculino</option>
            <option value="Prefiero no decirlo">Prefiero no decirlo</option>
          </select>
        </div>
      </div>
      <div class="field">
        <label for="password">Contraseña</label>
        <input class="input" id="password" type="password" autocomplete="new-password" required placeholder="Mínimo 6 caracteres" />
        <div class="password-meter simple-meter-v13"><span id="passwordMeter"></span></div>
      </div>
      <button class="btn primary full auth-submit-v13 auth-mobile-submit" type="submit">CREAR CUENTA</button>
      <button class="btn ghost full" type="button" data-auth-mode="login">Ya tengo una cuenta</button>
    </form>`;

  const bindAuth = () => {
    document.querySelectorAll("[data-auth-mode]").forEach(btn => btn.addEventListener("click", () => {
      state.authMode = btn.dataset.authMode;
      renderAuth();
    }));

    document.querySelectorAll("[data-demo-email]").forEach(btn => btn.addEventListener("click", () => {
      const emailInput = $("#loginEmail");
      const passInput = $("#loginPassword");
      if (emailInput && passInput) {
        emailInput.value = btn.dataset.demoEmail || "";
        passInput.value = btn.dataset.demoPass || "";
        emailInput.focus();
      }
    }));

    document.querySelectorAll("[data-guest-login]").forEach(btn => btn.addEventListener("click", () => {
      ImperiaStore.continueAsGuest();
      toast("Entraste como invitado. Puedes explorar IMPERIA sin crear cuenta.");
      state.view = "home";
      render();
    }));

    const password = $("#password");
    if (password) password.addEventListener("input", () => updatePasswordMeter(password.value));

    const login = $("#loginForm");
    if (login) login.addEventListener("submit", async (event) => {
      event.preventDefault();
      showErrors("loginErrors", []);
      try {
        await ImperiaStore.login($("#loginEmail").value, $("#loginPassword").value);
        toast("Bienvenido de vuelta a IMPERIA.");
        state.view = "home";
        render();
      } catch (error) {
        showErrors("loginErrors", [error.message]);
      }
    });

    const register = $("#registerForm");
    if (register) register.addEventListener("submit", async (event) => {
      event.preventDefault();
      const payload = collectRegisterPayload();
      const errors = validateRegister(payload);
      showErrors("registerErrors", errors);
      if (errors.length) return;
      try {
        await ImperiaStore.createAccount(payload);
        toast("Cuenta creada. Plan Base activado.");
        state.view = "home";
        render();
      } catch (error) {
        showErrors("registerErrors", [error.message]);
      }
    });
  };

  const collectRegisterPayload = () => ({
    fullName: $("#fullName").value,
    email: $("#email").value,
    birthdate: $("#birthdate").value,
    gender: $("#gender").value,
    password: $("#password").value,
    phone: "",
    region: "Piura",
    userType: document.querySelector('input[name="userType"]:checked')?.value || "Estudiante",
    knowledge: "Estoy empezando",
    dailyTime: "10 minutos",
    goal: "Ahorrar mejor",
    interests: ["Finanzas personales"]
  });

  const validateRegister = (p) => {
    const errors = [];
    const emailRegex = /^[^\s@]+@gmail\.com$/i;
    if (!p.fullName.trim() || p.fullName.trim().length < 3) errors.push("Ingresa tu nombre completo.");
    if (!emailRegex.test(p.email.trim())) errors.push("Ingresa un Gmail válido. Ejemplo: nombre@gmail.com");
    if (!p.birthdate || age(p.birthdate) < 13) errors.push("Debes tener al menos 13 años para usar esta plataforma educativa.");
    if (!p.gender) errors.push("Selecciona tu sexo.");
    if (!p.password || p.password.length < 6) errors.push("La contraseña debe tener mínimo 6 caracteres.");
    return errors;
  };

  const age = (date) => {
    const birth = new Date(date);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) years--;
    return years;
  };

  const passwordScore = (value) => {
    let score = 0;
    if ((value || "").length >= 6) score += 2;
    if ((value || "").length >= 8) score++;
    if (/[A-Za-z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    return score;
  };

  const updatePasswordMeter = (value) => {
    const score = passwordScore(value);
    const el = $("#passwordMeter");
    if (!el) return;
    el.style.width = `${Math.min(100, score * 20)}%`;
    el.style.background = score >= 5 ? "var(--success)" : score >= 3 ? "var(--warning)" : "var(--danger)";
  };

  const showErrors = (id, errors) => {
    const box = $(`#${id}`);
    if (!box) return;
    box.classList.toggle("show", errors.length > 0);
    box.innerHTML = errors.map(e => `<div>• ${esc(e)}</div>`).join("");
  };

  const centerActiveBottomNav = () => {
    const navBox = document.querySelector("#imperiaFixedNavDock .figma-bottom-nav") || document.querySelector(".figma-bottom-nav");
    const activeBtn = navBox?.querySelector("button.active");
    if (!navBox || !activeBtn) return;
    const target = activeBtn.offsetLeft - (navBox.clientWidth / 2) + (activeBtn.clientWidth / 2);
    navBox.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
  };

  const enableNavDesktopDrag = (navEl) => {
    if (!navEl || navEl.dataset.dragReady === "1") return;
    navEl.dataset.dragReady = "1";

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    navEl.addEventListener("pointerdown", (event) => {
      if (event.pointerType === "touch") return;

      // En PC, si el usuario hace clic sobre un botón, debe navegar.
      // El arrastre solo se activa cuando toma el fondo/espacio de la barra.
      if (event.target.closest("button")) return;

      isDown = true;
      navEl.classList.add("is-dragging");
      startX = event.clientX;
      scrollLeft = navEl.scrollLeft;
    });

    navEl.addEventListener("pointermove", (event) => {
      if (!isDown) return;
      const delta = event.clientX - startX;
      navEl.scrollLeft = scrollLeft - delta;
      event.preventDefault();
    });

    const stopDrag = () => {
      if (!isDown) return;
      isDown = false;
      navEl.classList.remove("is-dragging");
    };

    navEl.addEventListener("pointerup", stopDrag);
    navEl.addEventListener("pointercancel", stopDrag);
    navEl.addEventListener("mouseleave", stopDrag);

    // Rueda vertical del mouse sobre la barra = desplazamiento horizontal.
    navEl.addEventListener("wheel", (event) => {
      if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
        navEl.scrollLeft += event.deltaY;
        event.preventDefault();
      }
    }, { passive: false });
  };

  const bindFixedNavDirectly = (dock) => {
    if (!dock || dock.dataset.bound === "1") return;
    dock.dataset.bound = "1";
    dock.addEventListener("click", (event) => {
      const btn = event.target.closest("[data-view]");
      if (!btn) return;
      event.preventDefault();
      event.stopPropagation();

      state.view = btn.dataset.view;
      state.selectedCourse = null;
      state.selectedModule = null;
      state.quizCourse = null;
      if (validViews.includes(state.view)) history.replaceState(null, "", `#${state.view}`);
      render();
    });
  };

  const mountFixedNav = () => {
    const oldDock = document.getElementById("imperiaFixedNavDock");
    if (oldDock) oldDock.remove();
    const navEl = app().querySelector(".figma-bottom-nav");
    if (!navEl) return;
    const dock = document.createElement("div");
    dock.id = "imperiaFixedNavDock";
    dock.className = "imperia-fixed-nav-dock";
    dock.innerHTML = navEl.outerHTML;
    navEl.remove();
    document.body.appendChild(dock);
    enableNavDesktopDrag(dock.querySelector(".figma-bottom-nav"));
    bindFixedNavDirectly(dock);
  };

  const renderApp = (user) => {
    app().className = "app-shell figma-shell";
    app().innerHTML = iconSprite() + `${route(user)}${nav()}`;
    mountFixedNav();
    ImperiaTheme.apply(ImperiaTheme.get());
    bindApp(user);
    requestAnimationFrame(centerActiveBottomNav);
  };

  const nav = () => {
    const items = [
      ["home", "map", "Inicio"],
      ["courses", "book", "Cursos"],
      ["activities", "receipt", "Herramientas"],
      ["certificates", "graduation", "Certificados"],
      ["premium", "crown", "IMPERIA PRO"],
      ["profile", "user", "Perfil"]
    ];
    return `<nav class="bottom-nav figma-bottom-nav">${items.map(([view, icon, label]) => `<button class="${state.view === view ? "active" : ""}" data-view="${view}" type="button"><span>${iconSvg(icon)}</span><small>${label}</small></button>`).join("")}</nav>`;
  };

  const route = (user) => {
    if (state.quizCourse) return renderFullQuiz(user, state.quizCourse);
    if (state.selectedModule) return renderModulePage(user, state.selectedCourse, state.selectedModule);
    if (state.selectedCourse) return renderCourseDetail(user, state.selectedCourse);
    return ({ home: renderHome, courses: renderCourses, activities: renderActivities, certificates: renderCertificates, store: renderStore, premium: renderPremium, profile: renderProfile }[state.view] || renderHome)(user);
  };

  const einsteinAvatar = (user, mood = "happy") => {
    const item = IMPERIA_DATA.storeItems.find(i => i.id === user.progress?.equippedItem);
    const planClass = ImperiaStore.hasPremium(user) ? "premium" : "base";
    const accessory = icon(item?.icon || "brain", "einstein-accessory-icon");
    return `<div class="einstein-avatar ${planClass} mood-${mood}" aria-label="Einstein IMPERIA animado">
      <div class="einstein-glow"></div>
      <div class="einstein-head">
        <span class="hair hair-left"></span><span class="hair hair-top"></span><span class="hair hair-right"></span>
        <span class="brow brow-left"></span><span class="brow brow-right"></span>
        <span class="eye eye-left"></span><span class="eye eye-right"></span>
        <span class="nose"></span><span class="mustache"></span><span class="mouth"></span>
      </div>
      <div class="einstein-body"><span class="tie"></span></div>
      <div class="einstein-orbit orbit-one">${icon("star")}</div>
      <div class="einstein-orbit orbit-two">${accessory}</div>
      <div class="einstein-shadow"></div>
    </div>`;
  };

  const avatarFor = (user) => einsteinAvatar(user, "happy");

  const lifePill = (user) => {
    const lives = ImperiaStore.livesToday(user);
    return lives.unlimited
      ? `<span class="stat-pill infinity">${icon("heart")} Vidas ∞</span>`
      : `<span class="stat-pill hearts">${icon("heart")} ${lives.value}/${lives.max}</span>`;
  };

  const courseVisual = (course) => {
    const themes = {
      "finanzas-personales-peru": { emoji: "💳", cls: "theme-wallet" },
      "sistema-financiero-peru-creditos": { emoji: "🏦", cls: "theme-bank" },
      "historial-crediticio-infocorp": { emoji: "🌱", cls: "theme-growth" },
      "premium-inversion-peru": { emoji: "📈", cls: "theme-invest" },
      "premium-emprendimiento-digital": { emoji: "🚀", cls: "theme-rocket" },
      "premium-credito-historial": { emoji: "💼", cls: "theme-credit" },
      "premium-finanzas-negocios": { emoji: "🧾", cls: "theme-business" },
      "premium-administracion-financiera-pymes": { emoji: "💼", cls: "theme-business" },
      "premium-administracion-contabilidad": { emoji: "📒", cls: "theme-credit" },
      "premium-gestion-comercial": { emoji: "📣", cls: "theme-rocket" }
    };
    const theme = themes[course.id] || { emoji: course.plan === "premium" ? "⭐" : "📘", cls: course.plan === "premium" ? "theme-premium" : "theme-free" };
    return `<div class="course-thumb ${theme.cls}"><span>${theme.emoji}</span></div>`;
  };

  const courseHighlights = (course) => {
    const chips = [];
    if (course.delivery) chips.push(course.delivery);
    if (course.maxAbsences) chips.push(`${course.maxAbsences} inasistencias`);
    if (Array.isArray(course.materials)) chips.push(...course.materials);
    if (course.resources?.excel?.length) chips.push('Excel');
    if (course.resources?.books?.length) chips.push('Libros');
    if (course.conferenceAccess) chips.push('Conferencias disponibles');
    if (!chips.length) return '';
    const tags = chips.slice(0, 4).map(chip => `<span class="tag">${esc(chip)}</span>`).join('');
    const warning = course.maxAbsences ? `<div class="secure-line">Advertencia: ${course.maxAbsences} inasistencias y el curso se deshabilita.</div>` : '';
    return `<div class="chip-list">${tags}</div>${warning}`;
  };

  const progressRing = (percent) => `
    <div class="hero-ring" style="--progress:${percent}%">
      <div class="hero-ring-inner"><strong>${percent}%</strong></div>
    </div>`;

  const quickAction = (iconName, title, subtitle, targetView) => `
    <button class="quick-action-card" type="button" data-view="${targetView}">
      <span class="quick-action-icon">${iconSvg(iconName)}</span>
      <strong>${title}</strong>
      <small>${subtitle}</small>
    </button>`;

  const topBrandBar = (user, pageTitle, pageSubtitle = "") => `
    <div class="screen-topbar">
      <div class="screen-brand">
        <img src="./img/LogoActual.png?v=49.0.0" alt="Logo IMPERIA" />
        <div>
          <strong>${pageTitle}</strong>
          <small>${pageSubtitle}</small>
        </div>
      </div>
      <div class="topbar-actions">
        <button class="theme-mini-button" type="button" data-theme-toggle aria-label="Cambiar modo claro u oscuro">${ImperiaTheme.get() === "dark" ? "☀️" : "🌙"}</button>
        <button class="profile-mini-button" type="button" data-view="profile">${esc(firstName(user).charAt(0).toUpperCase())}</button>
      </div>
    </div>`;

  const homeCourseCard = (user, course) => {
    const progress = courseProgress(user, course);
    const locked = !canAccessCourse(user, course);
    const badge = course.plan === "free" ? "GRATIS" : locked ? "EXCLUSIVO" : "PREMIUM";
    const button = locked
      ? `<button class="btn purple full" type="button" data-view="premium">Desbloquear</button>`
      : `<button class="btn primary full" type="button" data-course="${course.id}">Continuar</button>`;
    return `<article class="home-course-card ${locked ? "is-locked" : ""}">
      ${courseVisual(course)}
      <div class="home-course-content">
        <div class="course-top-row"><h3>${esc(course.title)}</h3><span class="course-state-pill ${course.plan === "premium" ? "premium" : "free"}">${badge}</span></div>
        <p>${esc(course.summary)}</p>
        ${courseHighlights(course)}
        <div class="course-meta-row"><span>${icon("book")} ${course.modules.length} módulos</span><span>${icon("receipt")} ${esc(course.level)}</span></div>
        <div class="progress-track"><span style="width:${progress.percent}%"></span></div>
        <div class="progress-label">${progress.percent}% completado</div>
        ${button}
      </div>
    </article>`;
  };

  const planRibbon = () => ``;

  const renderHome = (user) => {
    const doneModules = user.progress?.completedModules?.length || 0;
    const totalModules = IMPERIA_DATA.courses.reduce((sum, course) => sum + course.modules.length, 0);
    const progressPercent = pct(doneModules, totalModules);
    const inProgressCourses = IMPERIA_DATA.courses.filter(course => courseProgress(user, course).done > 0).length;
    const completedCourses = user.progress?.completedCourses?.length || 0;
    const nextCourses = IMPERIA_DATA.courses.slice(0, 6);
    const planName = user.isGuest ? "Invitado" : ImperiaStore.hasPremium(user) ? "IMPERIA PRO" : "Base";
    const mentorAdvice = user.isGuest
      ? "Explora la ruta, prueba las herramientas y crea una cuenta cuando quieras guardar tu progreso definitivo."
      : "Hoy enfócate en una acción pequeña: registra un gasto, completa una clase y revisa tu progreso. La disciplina financiera se construye por repetición.";

    const sidebarItems = [
      ["home", "map", "Dashboard"],
      ["courses", "book", "Rutas"],
      ["activities", "receipt", "Herramientas"],
      ["certificates", "graduation", "Certificados"],
      ["premium", "crown", "IMPERIA PRO"],
      ["profile", "user", "Perfil"]
    ];

    const dashboardCourseCard = (course) => {
      const progress = courseProgress(user, course);
      const locked = !canAccessCourse(user, course);
      const badge = course.plan === "free" ? "GRATIS" : locked ? "BLOQUEADO" : "EXCLUSIVO";
      return `<article class="route-course-v45 ${locked ? "is-locked" : ""}">
        ${courseVisual(course)}
        <span class="course-state-pill ${course.plan === "premium" ? "premium" : "free"}">${badge}</span>
        <h3>${esc(course.title)}</h3>
        <p>${esc(course.summary)}</p>
        ${courseHighlights(course)}
        <div class="course-meta-row">
          <span>${icon("book")} ${course.modules.length} módulos</span>
          <span>${icon("star")} ${esc(course.level)}</span>
        </div>
        <div class="progress-track"><span style="width:${progress.percent}%"></span></div>
        <div class="course-list-footer">
          <div class="progress-label">${progress.percent}% completado</div>
          ${locked
            ? `<button class="btn action compact" type="button" data-view="premium">Desbloquear</button>`
            : `<button class="btn primary compact" type="button" data-course="${course.id}">Continuar</button>`}
        </div>
      </article>`;
    };

    return `
      <section class="learning-dashboard-v45" data-aos="fade-up">
        <aside class="dashboard-sidebar-v45" aria-label="Navegación principal IMPERIA">
          <div class="sidebar-brand-v45">
            <img src="./img/LogoActual.png?v=49.0.0" alt="Logo IMPERIA" />
            <div><strong>IMPERIA</strong><small>Financial Learning OS</small></div>
          </div>
          <nav class="sidebar-nav-v45">
            ${sidebarItems.map(([view, iconName, label]) => `<button class="${state.view === view ? "active" : ""}" type="button" data-view="${view}">${iconSvg(iconName)} ${label}</button>`).join("")}
          </nav>
          <div class="sidebar-plan-v45">
            <strong>${planName}</strong>
            <p>${user.isGuest ? "Estás navegando sin cuenta formal." : ImperiaStore.hasPremium(user) ? "Experiencia IMPERIA PRO activada." : "Activa IMPERIA PRO para desbloquear rutas avanzadas."}</p>
            <button class="btn ${ImperiaStore.hasPremium(user) ? "ghost" : "reward"} full" type="button" data-view="premium">${ImperiaStore.hasPremium(user) ? "Ver beneficios" : "Activar IMPERIA PRO"}</button>
          </div>
        </aside>

        <main class="dashboard-main-v45">
          <header class="dashboard-topbar-v45">
            <div>
              <div class="dashboard-eyebrow-v45">Dashboard de aprendizaje</div>
              <h1>Hola, ${esc(firstName(user))} 👋</h1>
              <p>Construye criterio financiero con rutas gamificadas, mentores y progreso medible.</p>
            </div>
            <div class="dashboard-actions-v45">
              <span class="status-pill-v45">${iconSvg("flame")} ${user.streak || 0} racha</span>
              <span class="status-pill-v45">${iconSvg("coins")} ${user.coins || 0} coins</span>
              <button class="theme-mini-button" type="button" data-theme-toggle aria-label="Cambiar modo claro u oscuro">${ImperiaTheme.get() === "dark" ? "☀️" : "🌙"}</button>
              <button class="profile-mini-button" type="button" data-view="profile">${esc(firstName(user).charAt(0).toUpperCase())}</button>
            </div>
          </header>

          <section class="mentor-hero-v45">
            <div class="mentor-copy-v45">
              <div class="kicker">Mentor financiero IMPERIA</div>
              <h2>Ruta IMPERIA PRO, progreso claro y decisiones financieras con método.</h2>
              <p>${esc(mentorAdvice)}</p>
              <div class="mentor-metrics-v45">
                <span>${progressPercent}% progreso general</span>
                <span>${completedCourses}/${IMPERIA_DATA.courses.length} cursos completados</span>
                <span>${doneModules}/${totalModules} clases realizadas</span>
              </div>
              <button class="btn reward" type="button" data-view="courses">Continuar mi ruta</button>
            </div>
            <aside class="mentor-card-v45">
              ${avatarFor(user)}
              <strong>Mentor Einstein</strong>
              <small>Consejo diario y avance gamificado</small>
            </aside>
          </section>

          <section class="quick-actions-v45">
            ${quickAction("receipt", "Herramientas", "Calculadoras y retos", "activities")}
            ${quickAction("book", "Rutas", "Cursos y módulos", "courses")}
            ${quickAction("graduation", "Certificados", "Logros descargables", "certificates")}
            ${quickAction("crown", "IMPERIA PRO", "Contenido avanzado", "premium")}
          </section>

          <section class="dashboard-grid-v45">
            <div class="route-panel-v45">
              <div class="panel-head-v45">
                <div><h2>Próximos cursos por desbloquear</h2><p>Grid modular basado en cards reutilizables para ruta de aprendizaje.</p></div>
                <span class="mini-chip">${inProgressCourses} activos</span>
              </div>
              <div class="route-grid-v45">${nextCourses.map(dashboardCourseCard).join("")}</div>
            </div>
            <aside class="insights-stack-v45">
              <div class="insights-panel-v45">
                <div class="panel-head-v45"><div><h2>Estado actual</h2><p>Resumen de progreso.</p></div></div>
                <div class="stats-grid-v45">
                  <div class="stat-box-v45"><strong>${progressPercent}%</strong><small>Progreso</small></div>
                  <div class="stat-box-v45"><strong>${user.xp || 0}</strong><small>XP</small></div>
                  <div class="stat-box-v45"><strong>${completedCourses}</strong><small>Certificables</small></div>
                  <div class="stat-box-v45"><strong>${ImperiaStore.livesToday(user).unlimited ? "∞" : ImperiaStore.livesToday(user).value}</strong><small>Vidas</small></div>
                </div>
                <div class="badge-row-v45">
                  <span class="badge-v45">🌱 Disciplina</span>
                  <span class="badge-v45 reward">🏆 Meta diaria</span>
                  <span class="badge-v45 xp">⚡ XP activo</span>
                </div>
              </div>
              <div class="insights-panel-v45">
                <div class="panel-head-v45"><div><h2>Consejo rápido</h2><p>Aplicación práctica.</p></div></div>
                <p class="muted">${esc(randomQuote())}</p>
                <button class="btn primary full" type="button" data-view="activities">Practicar ahora</button>
              </div>
            </aside>
          </section>
        </main>
      </section>`;
  };

  const mapNode = (user, course, index) => {
    const access = canAccessCourse(user, course);
    const progress = courseProgress(user, course);
    const previousDone = index === 0 || courseProgress(user, IMPERIA_DATA.courses[index - 1]).percent >= 100;
    const status = progress.completed ? "done" : access && previousDone ? "available" : "locked";
    const nodeIcon = progress.completed ? "✅" : status === "available" ? course.icon : "🔒";
    const label = course.plan === "premium" ? "EXCLUSIVO" : "Gratuito";
    const action = status === "locked"
      ? `<button class="btn ghost compact" type="button" data-view="${course.plan === "premium" ? "premium" : "courses"}">${course.plan === "premium" ? "Ver IMPERIA PRO" : "Bloqueado"}</button>`
      : `<button class="btn primary compact" type="button" data-course="${course.id}">Continuar</button>`;
    return `<div class="node ${status}">
      <div class="node-bubble">${icon(nodeIcon)}</div>
      <div class="node-card">
        <div class="between node-head"><strong>${esc(course.world)} · ${esc(course.title)}</strong><span class="badge ${course.plan === "premium" ? "premium" : "base"}">${label}</span></div>
        <p class="muted small">${esc(course.summary)}</p>
        <div class="between node-action"><div class="progress-track"><span style="width:${progress.percent}%"></span></div>${action}</div>
      </div>
    </div>`;
  };

  const missionItem = (user, mission) => {
    const done = !!(user.progress?.missions?.[today()] || []).includes(mission.id);
    return `<div class="module-item">
      <div class="module-icon">${icon(mission.icon)}</div><div><strong>${esc(mission.title)}</strong><div class="muted small">+${mission.rewardXp} XP · +${mission.rewardCoins} monedas</div></div>
      <button class="btn ${done ? "ghost" : "gold"}" type="button" data-mission="${mission.id}" ${done ? "disabled" : ""}>${done ? "Hecha" : "Cobrar"}</button>
    </div>`;
  };

  const adCard = () => `<div class="ad-card section"><strong>${icon("megaphone")} Anuncio educativo simulado</strong><p class="muted small">En IMPERIA PRO esta zona desaparece. Es solo una simulación visual dentro del navegador.</p></div>`;

  const renderCourses = (user) => {
    const freeCourses = IMPERIA_DATA.courses.filter(course => course.plan === "free");
    const premiumCourses = IMPERIA_DATA.courses.filter(course => course.plan === "premium");
    return `
      <section class="mobile-screen courses-screen" data-aos="fade-up">
        ${topBrandBar(user, "Cursos", "Academia IMPERIA")}
        <div class="page-copy-block">
          <div class="kicker">Ruta recomendada</div>
          <h1 class="h2">Explora tus cursos</h1>
          <p class="muted">Cursos gratuitos para empezar y cursos exclusivos con pago individual de S/ 80 por curso.</p>
        </div>

        <div class="mobile-section-head">
          <div><span class="section-dot"></span><h2>Cursos Gratuitos</h2></div>
          <span class="mini-chip">${freeCourses.length} cursos</span>
        </div>
        <div class="course-list-wrap">${freeCourses.map(course => courseCard(user, course)).join("")}</div>

        <div class="mobile-section-head premium-head">
          <div><span class="section-bar"></span><h2>Cursos Exclusivos</h2></div>
          <span class="mini-chip premium">${premiumCourses.length} cursos</span>
        </div>
        <div class="course-list-wrap">${premiumCourses.map(course => courseCard(user, course)).join("")}</div>
        ${!ImperiaStore.hasPremium(user) ? adCard() : ""}
      </section>`;
  };

  const courseCard = (user, course) => {
    const progress = courseProgress(user, course);
    const locked = !canAccessCourse(user, course);
    const isFree = course.plan === "free";
    const price = coursePriceForUser(user, course);
    const badge = isFree ? "GRATIS" : locked ? price.label : "COMPRADO";
    const cta = locked
      ? `<button class="btn gold" type="button" data-buy-course="${course.id}">${icon("card")} Comprar ${price.label}</button>`
      : `<button class="btn primary" type="button" data-course="${course.id}">Abrir curso</button>`;
    return `<article class="course-list-card ${locked ? "locked" : ""}" data-aos="zoom-in">
      ${courseVisual(course)}
      <div class="course-list-body">
        <div class="course-list-top">
          <h3>${esc(course.title)}</h3>
          <span class="course-state-pill ${isFree ? "free" : "premium"}">${badge}</span>
        </div>
        <p>${esc(course.summary)}</p>
        ${!isFree ? `<div class="chip-list"><span class="tag">Zoom</span><span class="tag">3 inasistencias</span><span class="tag">Excel</span><span class="tag">Libros</span></div>` : `<div class="chip-list"><span class="tag">12 lecciones</span><span class="tag">5 monedas por lección</span></div>`}
        <div class="course-list-meta">
          <span>${icon("book")} ${course.modules.length} lecciones</span>
          <span>${icon("receipt")} ${esc(course.duration)}</span>
          <span>${icon("star")} ${esc(course.level)}</span>
        </div>
        <div class="progress-track"><span style="width:${progress.percent}%"></span></div>
        <div class="course-list-footer">
          <div class="progress-label">${progress.percent}% completado</div>
          ${cta}
        </div>
      </div>
    </article>`;
  };

  const renderCoursePurchase = (user, course) => `
    <section class="section course-checkout-page">
      <button class="btn ghost" type="button" data-back="courses">← Volver a cursos</button>
      <div class="app-card premium-hero-card exclusive-course-hero">
        <div class="premium-glow"></div>
        <div class="page-title premium-title">
          <div>
            <div class="kicker">Curso exclusivo · Pago individual</div>
            <h1 class="h2">${icon(course.icon)} ${esc(course.title)}</h1>
            <p class="muted">${esc(course.summary)}</p>
          </div>
          <div class="premium-price-card">
            <strong>${coursePriceForUser(user, course).label}</strong>
            <span>${coursePriceForUser(user, course).discount ? "con 10% IMPERIA PRO" : "pago único por curso"}</span>
            <em class="badge premium">No incluido en IMPERIA PRO</em>
          </div>
        </div>
        <div class="two-grid plan-compare exclusive-feature-grid">
          <div class="app-card plan-card exclusive-feature-card"><h3>Incluye</h3><p>${icon("check")} Clases vía Zoom</p><p>${icon("check")} Planillas de Excel</p><p>${icon("check")} Libros y materiales</p></div>
          <div class="app-card plan-card exclusive-feature-card"><h3>Regla de asistencia</h3><p>${icon("megaphone")} Advertencia: 3 inasistencias deshabilitan el curso.</p><p>${icon("card")} Pago simulado local de S/ 80 por curso.</p></div>
        </div>
      </div>
      ${premiumCheckout({
        type: "course",
        courseId: course.id,
        title: course.title,
        amount: coursePriceForUser(user, course).label,
        heading: "Pago del curso exclusivo",
        subtitle: "Completa la simulación de pago para activar este curso en tu cuenta local.",
        actionText: `Pagar ${coursePriceForUser(user, course).label} y activar curso`,
        termsText: "Confirmo que es una simulación local y acepto activar este curso exclusivo en este navegador."
      })}
    </section>`;

  const renderCourseDetail = (user, courseId) => {
    const course = IMPERIA_DATA.courses.find(c => c.id === courseId);
    if (!course) return notFound();
    if (!canAccessCourse(user, course)) return renderCoursePurchase(user, course);
    const progress = courseProgress(user, course);
    const detailLabel = course.plan === "free" ? "Gratuito" : "Curso comprado";
    return `<section class="section">
      <button class="btn ghost" type="button" data-back="courses">← Volver a cursos</button>
      <div class="page-title">
        <div>
          <div class="kicker">${esc(course.world)} · ${esc(course.level)}</div>
          <h1 class="h2 course-title-icon">${icon(course.icon)} ${esc(course.title)}</h1>
          <p class="muted">${esc(course.summary)}</p>
        </div>
        <span class="badge ${course.plan === "premium" ? "premium" : "base"}">${detailLabel}</span>
      </div>
      <div class="module-grid">
        <div class="app-card">
          <div class="between"><h3 class="h3">Clases del curso</h3><span class="badge">${progress.done}/${progress.total}</span></div>
          <div class="progress-track" style="margin:12px 0 18px"><span style="width:${progress.percent}%"></span></div>
          <div class="module-list">${course.modules.map((m, index) => moduleRow(user, course, m, index)).join("")}</div>
        </div>
        <aside class="stack">
          ${courseVideoSection(course)}
          ${course.plan === "premium" ? `<div class="app-card attendance-card">
            <h3 class="h3">Curso exclusivo</h3>
            <div class="attendance-grid"><div><strong>Zoom</strong><br><span class="muted small">Clases vía Zoom</span></div><div><strong>Advertencia</strong><br><span class="muted small">3 inasistencias deshabilitan el curso</span></div><div><strong>Materiales</strong><br><span class="muted small">Planillas de Excel y libros</span></div></div>
          </div>` : `<div class="app-card attendance-card">
            <h3 class="h3">Curso gratuito</h3>
            <div class="attendance-grid"><div><strong>12 lecciones</strong><br><span class="muted small">Ruta secuencial</span></div><div><strong>5 monedas</strong><br><span class="muted small">Por lección completada</span></div><div><strong>Práctica</strong><br><span class="muted small">Ejercicios guiados</span></div></div>
          </div>`}
          <div class="app-card">
            <h3 class="h3">Recompensa</h3>
            <p class="muted small">Al completar todas las clases podrás pagar y descargar tu certificado IMPERIA por S/ 35. La descarga del material se habilita al finalizar el curso.</p>
            <button class="btn gold full" type="button" data-start-course-quiz="${course.id}">${icon("bolt")} Iniciar quiz final</button>
            <button class="btn ghost full" type="button" data-download-course="${course.id}">${icon("book")} Descargar curso</button>
            <button class="btn primary full" type="button" data-view="certificates">${icon("graduation")} Ver certificados</button>
          </div>
        </aside>
      </div>
    </section>`;
  };

  const moduleRow = (user, course, module, index) => {
    const done = user.progress?.completedModules?.includes(`${course.id}:${module.id}`);
    const previousDone = index === 0 || user.progress?.completedModules?.includes(`${course.id}:${course.modules[index - 1].id}`);
    const locked = !previousDone;
    return `<div class="module-item">
      <div class="module-icon">${icon(done ? "✅" : locked ? "🔒" : "📘")}</div>
      <div><strong>${esc(module.title)}</strong><div class="muted small">${esc(module.type)} · ${module.minutes} min</div></div>
      <button class="btn ${done ? "ghost" : "primary"}" type="button" data-module="${module.id}" ${locked ? "disabled" : ""}>${done ? "Revisar" : locked ? "Bloqueada" : "Abrir"}</button>
    </div>`;
  };

  const renderModulePage = (user, courseId, moduleId) => {
    const course = IMPERIA_DATA.courses.find(c => c.id === courseId);
    const module = course?.modules.find(m => m.id === moduleId);
    if (!course || !module) return notFound();
    const done = user.progress?.completedModules?.includes(`${course.id}:${module.id}`);
    return `<section class="section">
      <button class="btn ghost" type="button" data-back="course">← Volver al curso</button>
      <div class="page-title">
        <div><div class="kicker">${esc(course.title)}</div><h1 class="h2">${esc(module.title)}</h1><p class="muted">Completa las actividades para desbloquear progreso, XP y monedas.</p></div>
        <span class="badge">${module.minutes} min</span>
      </div>
      <div class="module-grid">
        <div>
          ${module.activities.map((activity, index) => activityCard(course, module, activity, index)).join("")}
          <div class="app-card between">
            <div><strong>${done ? "Clase completada" : "Finalizar clase"}</strong><p class="muted small">${done ? "Puedes volver a revisar el contenido." : "Guarda tu avance y gana recompensa."}</p></div>
            <button class="btn primary" type="button" data-complete-module="${module.id}" ${done ? "disabled" : ""}>${done ? "Completada" : "Completar"}</button>
          </div>
        </div>
        <aside class="stack">
          <div class="app-card einstein-card">
            <div class="row"><div class="avatar small">${einsteinAvatar(user, "happy")}</div><strong>Consejo de Einstein</strong></div>
            <div class="speech" style="margin-top:15px">Lee, responde y escribe con tus propias palabras. Aprender finanzas es practicar decisiones.</div>
          </div>
          <div class="app-card"><h3 class="h3">Progreso</h3><p class="muted small">Los cursos gratuitos entregan +5 monedas por lección. Los cursos exclusivos mantienen materiales y asistencia. El certificado se paga por separado: S/ 35.</p></div>
        </aside>
      </div>
    </section>`;
  };

  const activityCard = (course, module, activity, index) => {
    const id = `${course.id}:${module.id}:${index}`;
    if (activity.type === "reading") return `<article class="activity-card"><span class="badge">${icon("book")} Lectura</span><h3>${esc(activity.title)}</h3><p>${esc(activity.text)}</p><p class="muted small"><strong>Tip:</strong> ${esc(activity.tip || "")}</p></article>`;
    if (activity.type === "video") {
      const videoHtml = videoEmbed(activity.videoId, activity.author);
      if (!videoHtml) return "";
      return `<article class="activity-card"><span class="badge">${icon("book")} Video</span><h3>${esc(activity.title)}</h3><p class="muted small">${esc(activity.text)}</p>${videoHtml}<p class="video-note">Crédito: ${esc(activity.author)}. Reproducción externa desde YouTube.</p></article>`;
    }
    if (activity.type === "quiz") return `<article class="activity-card" data-quiz-card="${esc(id)}"><span class="badge">${icon("bolt")} Quiz</span><h3>${esc(activity.question)}</h3>${activity.options.map((option, i) => `<button class="question-option" type="button" data-quiz="${esc(id)}" data-answer="${i}">${esc(option)}</button>`).join("")}<p class="muted small" data-feedback="${esc(id)}"></p></article>`;
    if (activity.type === "complete") return `<article class="activity-card"><span class="badge">${icon("receipt")} Completar</span><h3>${esc(activity.prompt)}</h3><div class="row"><input class="input" style="flex:1" data-complete-input="${esc(id)}" placeholder="Tu respuesta" /><button class="btn gold" type="button" data-complete-check="${esc(id)}" data-expected="${esc(activity.answer)}">Validar</button></div><p class="muted small">Pista: ${esc(activity.hint || "")}</p><p class="muted small" data-complete-feedback="${esc(id)}"></p></article>`;
    if (activity.type === "practice") return `<article class="activity-card"><span class="badge">${icon("gamepad")} Práctica</span><h3>${esc(activity.title || "Ejercicio práctico")}</h3><p>${esc(activity.prompt)}</p><textarea class="textarea" data-practice="${esc(id)}" placeholder="${esc(activity.placeholder || "Escribe tu respuesta...")}"></textarea><div class="row" style="margin-top:8px"><button class="btn ghost" type="button" data-sample="${esc(id)}" data-sample-text="${esc(activity.sample || "")}">Ver ejemplo</button><span class="muted small" data-sample-box="${esc(id)}"></span></div></article>`;
    return "";
  };
  const hasValidCourseVideo = (video) => {
    const data = typeof video === "object" ? video : { videoId: video };
    const assignedId = (data.videoId || data.id || "").trim();
    const playlistId = (data.playlistId || data.list || "").trim();
    return (!!playlistId || !!assignedId) && assignedId !== "M7lc1UVf-VE" && assignedId !== "ysz5S6PUM-U";
  };

  const courseVideoSection = (course) => {
    if (!hasValidCourseVideo(course?.video)) return "";
    return `<div class="app-card">
      <h3 class="h3">Video principal</h3>
      ${videoEmbed(course.video, course.title)}
      <p class="video-note">${esc(course.video.title)} · Crédito: ${esc(course.video.author || "IMPERIA")}.</p>
    </div>`;
  };

  const videoEmbed = (video, courseTitle = "") => {
    if (!hasValidCourseVideo(video)) return "";
    const data = typeof video === "object" ? video : { videoId: video };
    const playlistId = (data.playlistId || data.list || "").trim();
    const assignedId = (data.videoId || data.id || "").trim();
    const watchUrl = data.url || (playlistId ? `https://www.youtube.com/playlist?list=${encodeURIComponent(playlistId)}` : `https://www.youtube.com/watch?v=${encodeURIComponent(assignedId)}`);
    const embedSrc = playlistId
      ? `https://www.youtube.com/embed/videoseries?list=${encodeURIComponent(playlistId)}&rel=0&modestbranding=1&playsinline=1`
      : `https://www.youtube.com/embed/${encodeURIComponent(assignedId)}?rel=0&modestbranding=1&playsinline=1`;
    return `<div class="yt-learning-card">
      <iframe class="video-frame" src="${embedSrc}" title="${esc(data.title || `Video de ${courseTitle}`)}" referrerpolicy="strict-origin-when-cross-origin" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen loading="lazy"></iframe>
      <div class="yt-fallback">
        <strong>${esc(data.title || `Video específico: ${courseTitle}`)}</strong>
        <p class="muted small">Video exacto asignado por IMPERIA. No abre buscador ni permite elegir otro video.</p>
        <a class="btn ghost full" href="${watchUrl}" target="_blank" rel="noopener">${icon("play")} Abrir video en YouTube</a>
      </div>
    </div>`;
  };


  const renderActivities = (user) => `
    <section class="mobile-screen tools-screen">
      ${topBrandBar(user, "Herramientas", "Tu espacio práctico")}
      <div class="page-copy-block">
        <div class="kicker">Aprender haciendo</div>
        <h1 class="h2">Herramientas, simuladores y retos</h1>
        <p class="muted">Practica decisiones reales con minijuegos financieros, simuladores y ejercicios rápidos para ganar XP y monedas.</p>
      </div>
      <div class="tools-grid-mobile tools-grid-v54">
        <div class="tool-card-mobile"><div class="tool-icon">${icon("chart")}</div><h3>Presupuesto 50/30/20</h3><p>Distribuye tus ingresos entre necesidades, gustos y ahorro.</p><button class="btn primary full" type="button" data-mini="budget">Abrir</button></div>
        <div class="tool-card-mobile"><div class="tool-icon">${icon("bolt")}</div><h3>Quiz relámpago</h3><p>Responde rápido, gana XP y sube tu racha financiera.</p><button class="btn gold full" type="button" data-mini="quickquiz">Jugar</button></div>
        <div class="tool-card-mobile"><div class="tool-icon">${icon("bank")}</div><h3>Meta de ahorro</h3><p>Calcula cuánto necesitas guardar cada semana.</p><button class="btn purple full" type="button" data-mini="savings">Crear reto</button></div>
        <div class="tool-card-mobile"><div class="tool-icon">${icon("card")}</div><h3>Calculadora de precio</h3><p>Calcula precio de venta con costo, margen y ganancia.</p><button class="btn primary full" type="button" data-mini="price">Calcular</button></div>
        <div class="tool-card-mobile"><div class="tool-icon">${icon("boxes")}</div><h3>Inventario ABC</h3><p>Clasifica productos A, B o C según valor y rotación.</p><button class="btn gold full" type="button" data-mini="inventory">Clasificar</button></div>
        <div class="tool-card-mobile"><div class="tool-icon">${icon("coins")}</div><h3>Reto flujo de caja</h3><p>Decide qué pagar primero y protege tu caja semanal.</p><button class="btn purple full" type="button" data-mini="cashflow">Jugar</button></div>
      </div>
      <div id="miniGame" class="section"></div>
      ${!ImperiaStore.hasPremium(user) ? adCard() : ""}
    </section>`;

  const renderStore = (user) => `
    <section class="section">
      <div class="page-title"><div><div class="kicker">Personalización</div><h1 class="h2">Tienda IMPERIA</h1><p class="muted">Compra elementos con ImperiaCoins y equipa a Einstein.</p></div><span class="stat-pill">${icon("coins")} ${user.coins || 0}</span></div>
      <div class="course-grid">${IMPERIA_DATA.storeItems.map(item => storeCard(user, item)).join("")}</div>
    </section>`;

  const storeCard = (user, item) => {
    const owned = user.progress?.purchasedItems?.includes(item.id);
    const equipped = user.progress?.equippedItem === item.id;
    const locked = item.plan === "premium" && !ImperiaStore.hasPremium(user);
    return `<article class="app-card store-item">
      <div class="store-emoji">${icon(item.icon)}</div>
      <div class="stack">
        <div class="between"><strong>${esc(item.name)}</strong><span class="badge ${item.plan === "premium" ? "premium" : "base"}">${item.plan === "premium" ? "IMPERIA PRO" : "Base"}</span></div>
        <div class="muted small">${esc(item.type)} · ${item.price} monedas</div>
        <button class="btn ${locked ? "purple" : owned ? "ghost" : "gold"}" type="button" data-buy="${item.id}" ${equipped ? "disabled" : ""}>${locked ? "Requiere IMPERIA PRO" : equipped ? "Equipado" : owned ? "Equipar" : "Comprar"}</button>
      </div>
    </article>`;
  };

  const renderPremium = (user) => {
    const active = ImperiaStore.hasPremium(user);
    const payment = user.subscription?.lastPayment;
    const exclusiveCourses = IMPERIA_DATA.courses.filter(course => course.plan !== "free");
    return `<section class="section premium-page">
      <div class="app-card premium-hero-card">
        <div class="premium-glow"></div>
        <div class="page-title premium-title">
          <div>
            <div class="kicker">IMPERIA PRO</div>
            <h1 class="h2">Suscripción mensual a S/ 25.00</h1>
            <p class="muted">IMPERIA PRO incluye 10% de descuento para curso o suscripción por referido, eliminación de anuncios del contenido gratuito, acceso a conferencias disponibles y vidas ilimitadas. Los cursos exclusivos se pagan por separado.</p>
          </div>
          <div class="premium-price-card">
            <img src="./img/LogoActual.png?v=52.0.0" alt="Logo IMPERIA" />
            <strong>S/ 25.00</strong>
            <span>mensual</span>
            <em class="badge ${active ? "premium" : "lock"}">${active ? "Activo" : "Pendiente de pago"}</em>
          </div>
        </div>
        <div class="two-grid plan-compare">
          <div class="app-card plan-card base-plan"><h3>Nivel Gratuito incluido</h3>${IMPERIA_DATA.plans.free.benefits.map(b => `<p>${icon("check")} ${esc(b.replace("Gratis", "Base"))}</p>`).join("")}</div>
          <div class="app-card plan-card premium-plan"><h3>IMPERIA PRO</h3>${IMPERIA_DATA.plans.premium.benefits.map(b => `<p>${icon("crown")} ${esc(b)}</p>`).join("")}</div>
        </div>
      </div>
      ${active ? premiumActivePanel(user, payment) : premiumCheckout()}
      <div class="page-title section"><div><div class="kicker">Cursos exclusivos · S/ 80 cada uno</div><h2 class="h2">Pago por curso independiente</h2><p class="muted">IMPERIA PRO no abre automáticamente estos cursos. Cada curso exclusivo se compra por separado y conserva sus reglas de asistencia, Zoom, Excel y libros.</p></div></div>
      <div class="course-grid section">${exclusiveCourses.map(course => { const price = coursePriceForUser(user, course); return `<article class="app-card course-card pro-elevate"><div class="between"><div class="course-icon">${icon(course.icon)}</div><span class="badge premium">${price.label}</span></div><h3>${esc(course.title)}</h3><p class="muted small">${esc(course.summary)}</p><div class="chip-list"><span class="tag">Zoom</span><span class="tag">3 inasistencias</span><span class="tag">Excel</span><span class="tag">Libros</span>${price.discount ? `<span class="tag discount">-${formatSoles(price.discount)} PRO</span>` : `<span class="tag">10% con PRO o referido</span>`}</div><button class="btn gold full" type="button" data-buy-course="${course.id}">${icon("card")} Comprar curso ${price.label}</button></article>`; }).join("")}</div>
    </section>`;
  };

  const premiumActivePanel = (user, payment) => `
    <div class="app-card premium-active-panel section">
      <div class="success-burst">${icon("crown")}</div>
      <div>
        <div class="kicker">IMPERIA PRO activa</div>
        <h2 class="h2">IMPERIA PRO habilitada correctamente</h2>
        <p class="muted">Los anuncios del contenido gratuito fueron ocultados. Ahora tienes vidas ilimitadas, acceso a conferencias disponibles y 10% de descuento en cursos exclusivos. Comparte tu código de referido: <strong class="referral-code">REF-IMPERIA321</strong>.</p>
        <div class="referral-box-v54"><span>${icon("gift")} Código referido PRO</span><strong>REF-IMPERIA321</strong><small>Tu amigo obtiene 10% de descuento al pagar IMPERIA PRO. Tú conservas el beneficio de 10% en cursos exclusivos.</small></div>
        <div class="payment-summary-grid">
          <div><span class="muted small">Pago</span><strong>${esc(payment?.id || "PAY-LOCAL")}</strong></div>
          <div><span class="muted small">Método</span><strong>${esc(payment?.methodLabel || "Simulado")}</strong></div>
          <div><span class="muted small">Referencia</span><strong>${esc(payment?.reference || "Local")}</strong></div>
          <div><span class="muted small">Renovación</span><strong>${user.subscription?.nextBillingAt ? new Date(user.subscription.nextBillingAt).toLocaleDateString("es-PE") : "No programada"}</strong></div>
        </div>
      </div>
    </div>`;

  const premiumCheckout = (options = {}) => {
    const user = ImperiaStore.currentUser();
    const computed = options.type === "course" ? coursePriceForUser(user, { plan: "premium" }) : { label: "S/ 25.00", baseLabel: "S/ 25.00", discount: 0 };
    const cfg = {
      type: options.type || "premium",
      courseId: options.courseId || "",
      title: options.title || "IMPERIA PRO",
      amount: options.amount || computed.label || "S/ 25.00",
      heading: options.heading || "IMPERIA PRO",
      subtitle: options.subtitle || "Esta interfaz no cobra dinero real. Valida datos de prueba y activa IMPERIA PRO por S/ 25.00.",
      actionText: options.actionText || "Pagar S/ 25.00 y activar suscripción",
      termsText: options.termsText || "Confirmo que es una simulación local y acepto activar la suscripción en este navegador."
    };
    const referralHint = cfg.type === "course"
      ? "Usa REF-IMPERIA321 para aplicar 10% de descuento. Si tienes IMPERIA PRO, el descuento también se aplica automáticamente."
      : "Usa REF-IMPERIA321 para pagar IMPERIA PRO con 10% de descuento.";
    const summaryNote = cfg.type === "course" && ImperiaStore.hasPremium(user)
      ? `<div class="discount-line">${icon("gift")} 10% aplicado por IMPERIA PRO activo. Total: <strong>S/ 72.00</strong></div>`
      : `<div class="discount-line muted">${icon("gift")} Puedes aplicar 10% con referido PRO.</div>`;
    return `
    <div class="checkout-shell section" data-checkout-type="${esc(cfg.type)}">
      <aside class="app-card checkout-resume">
        <div class="kicker">Checkout simulado</div>
        <h2 class="h2">${esc(cfg.heading)}</h2>
        <p class="muted">${esc(cfg.subtitle)}</p>
        <div class="checkout-total"><span>Total referencial</span><strong>${esc(cfg.amount)}</strong></div>
        ${summaryNote}
        <div class="secure-line">${icon("lock")} Simulación segura · datos locales · sin pasarela externa</div>
      </aside>
      <section class="app-card payment-card">
        <div class="between"><div><h3 class="h3">Elige método de pago</h3><p class="muted small">Completa los datos según el método. Al aprobarse se activará: ${esc(cfg.title)}.</p></div><span class="badge lock">Seguro</span></div>
        <div class="payment-methods">
          ${paymentMethodButton("card", "card", "Tarjeta")}
          ${paymentMethodButton("yape", "phone", "Yape")}
          ${paymentMethodButton("plin", "wallet", "Plin")}
          ${paymentMethodButton("bank", "bank", "Transferencia")}
        </div>
        <form id="paymentForm" class="stack payment-form" novalidate>
          <input type="hidden" id="paymentType" value="${esc(cfg.type)}" />
          <input type="hidden" id="paymentCourseId" value="${esc(cfg.courseId)}" />
          <input type="hidden" id="paymentAmount" value="${esc(cfg.amount)}" />
          <input type="hidden" id="paymentTitle" value="${esc(cfg.title)}" />
          <div id="paymentErrors" class="error-box"></div>
          ${paymentFields(state.checkoutMethod)}
          <div class="field referral-field-v54">
            <label for="referralCode">Código de referido IMPERIA PRO (opcional)</label>
            <input class="input" id="referralCode" placeholder="Ej. IMP-ABC123" />
            <small class="muted">${referralHint}</small>
          </div>
          <label class="row small muted"><input id="paymentTerms" type="checkbox" required /> ${esc(cfg.termsText)}</label>
          <button class="btn purple full pay-button" type="submit">${esc(cfg.actionText)}</button>
        </form>
      </section>
    </div>`;
  };

  const paymentMethodButton = (method, iconName, label) => `<button type="button" class="payment-method ${state.checkoutMethod === method ? "active" : ""}" data-payment-method="${method}"><span>${iconSvg(iconName)}</span><strong>${label}</strong></button>`;

  const paymentFields = (method) => {
    if (method === "card") return `
      <div class="card-preview">
        <div><span>IMPERIA</span><strong id="previewNumber">•••• •••• •••• ••••</strong></div>
        <div class="between"><span id="previewName">NOMBRE DEL TITULAR</span><span id="previewExp">MM/AA</span></div>
      </div>
      <div class="form-grid">
        <div class="field wide"><label for="cardName">Titular de la tarjeta</label><input class="input" id="cardName" autocomplete="cc-name" placeholder="Nombre como aparece en la tarjeta" required /></div>
        <div class="field wide"><label for="cardNumber">Número de tarjeta</label><input class="input" id="cardNumber" inputmode="numeric" autocomplete="cc-number" maxlength="19" placeholder="4242 4242 4242 4242" required /></div>
        <div class="field"><label for="cardExp">Vencimiento</label><input class="input" id="cardExp" inputmode="numeric" autocomplete="cc-exp" maxlength="5" placeholder="MM/AA" required /></div>
        <div class="field"><label for="cardCvv">CVV</label><input class="input" id="cardCvv" inputmode="numeric" autocomplete="cc-csc" maxlength="4" placeholder="123" required /></div>
        <div class="field wide"><label for="cardDni">DNI del titular</label><input class="input" id="cardDni" inputmode="numeric" maxlength="8" placeholder="8 dígitos" required /></div>
      </div>`;
    if (method === "yape") return `
      <div class="wallet-banner yape"><strong>Yape</strong><span>Ingresa teléfono y código de operación simulado.</span></div>
      <div class="form-grid">
        <div class="field"><label for="walletPhone">Celular afiliado</label><input class="input" id="walletPhone" inputmode="numeric" maxlength="9" placeholder="9XXXXXXXX" required /></div>
        <div class="field"><label for="walletCode">Código de operación</label><input class="input" id="walletCode" inputmode="numeric" maxlength="12" placeholder="12345678" required /></div>
        <div class="field wide"><label for="walletName">Nombre del pagador</label><input class="input" id="walletName" placeholder="Nombre completo" required /></div>
      </div>`;
    if (method === "plin") return `
      <div class="wallet-banner plin"><strong>Plin</strong><span>Simula el pago con celular, banco y operación.</span></div>
      <div class="form-grid">
        <div class="field"><label for="walletPhone">Celular afiliado</label><input class="input" id="walletPhone" inputmode="numeric" maxlength="9" placeholder="9XXXXXXXX" required /></div>
        <div class="field"><label for="walletBank">Banco</label><select class="select" id="walletBank"><option>BCP</option><option>Interbank</option><option>BBVA</option><option>Scotiabank</option><option>Otro</option></select></div>
        <div class="field wide"><label for="walletCode">Número de operación</label><input class="input" id="walletCode" inputmode="numeric" maxlength="12" placeholder="12345678" required /></div>
      </div>`;
    return `
      <div class="wallet-banner bank"><strong>Transferencia bancaria</strong><span>Registra los datos del voucher simulado.</span></div>
      <div class="form-grid">
        <div class="field"><label for="transferBank">Banco origen</label><select class="select" id="transferBank"><option>BCP</option><option>Interbank</option><option>BBVA</option><option>Scotiabank</option><option>Caja / Otro</option></select></div>
        <div class="field"><label for="transferOperation">Operación</label><input class="input" id="transferOperation" inputmode="numeric" maxlength="14" placeholder="000123456789" required /></div>
        <div class="field wide"><label for="transferHolder">Titular / remitente</label><input class="input" id="transferHolder" placeholder="Nombre completo" required /></div>
        <div class="field wide"><label for="transferDate">Fecha del pago</label><input class="input" id="transferDate" type="date" required /></div>
      </div>`;
  };

  const renderProfile = (user) => {
    const certs = user.progress?.certificates || [];
    const completedCourses = user.progress?.completedCourses?.length || 0;
    const totalCourses = IMPERIA_DATA.courses.length;
    const lives = ImperiaStore.livesToday(user);
    return `<section class="mobile-screen profile-screen">
      <div class="profile-hero-mobile">
        ${topBrandBar(user, "Mi perfil", "Cuenta y progreso")}
        <div class="profile-summary-card">
          <div>
            <p class="profile-mini-label">Perfil financiero</p>
            <h1>${esc(user.fullName)}</h1>
            <p>${user.isGuest ? "Modo invitado · Exploración rápida" : `${esc(user.email)} · ${esc(user.userType)}`}</p>
          </div>
          <div class="profile-badge-stack">
            <span class="mini-chip">Nivel ${user.level || 1}</span>
            <span class="mini-chip ${user.isGuest ? "guest" : ImperiaStore.hasPremium(user) ? "premium" : ""}">${user.isGuest ? "Invitado" : ImperiaStore.hasPremium(user) ? "IMPERIA PRO" : "Gratis"}</span>
          </div>
        </div>
      </div>

      <div class="profile-stats-mobile">
        <div class="profile-stat-box"><strong>${completedCourses}/${totalCourses}</strong><small>Cursos</small></div>
        <div class="profile-stat-box"><strong>${user.xp || 0}</strong><small>XP</small></div>
        <div class="profile-stat-box"><strong>${user.coins || 0}</strong><small>Coins</small></div>
        <div class="profile-stat-box"><strong>${lives.unlimited ? "∞" : `${lives.value}/${lives.max}`}</strong><small>Vidas</small></div>
      </div>

      <div class="profile-info-stack">
        <article class="profile-info-card"><span>🎯</span><div><strong>Objetivo</strong><p>${esc(user.goal)}</p></div></article>
        <article class="profile-info-card"><span>📍</span><div><strong>Región</strong><p>${esc(user.region)}</p></div></article>
        <article class="profile-info-card"><span>⏱️</span><div><strong>Tiempo diario</strong><p>${esc(user.dailyTime)}</p></div></article>
      </div>

      <div class="app-card mobile-cert-card">
        <div class="between"><h3 class="h3">Certificados</h3><span class="badge">${certs.length}</span></div>
        ${certs.length ? certs.map(c => certificateCard(c)).join("") : `<p class="muted small">Aún no tienes certificados. Completa un curso para obtener el primero.</p>`}
      </div>

      <div class="app-card mobile-theme-card">
        <div class="between">
          <div>
            <h3 class="h3">Apariencia</h3>
            <p class="muted small">Cambia entre modo claro y modo oscuro según tu preferencia.</p>
          </div>
          <button class="theme-toggle-card" type="button" data-theme-toggle>
            <span>${ImperiaTheme.get() === "dark" ? "☀️" : "🌙"}</span>
            <strong>${ImperiaTheme.get() === "dark" ? "Modo claro" : "Modo oscuro"}</strong>
          </button>
        </div>
      </div>

      <div class="app-card mobile-account-card">
        <h3 class="h3">Cuenta</h3>
        <p class="muted small">${user.isGuest ? "Estás explorando como invitado. Para conservar una experiencia personalizada, crea una cuenta desde el inicio." : "Tus datos se guardan solo en este dispositivo."}</p>
        <div class="account-button-stack">
          ${user.isGuest ? `<button class="btn primary full" type="button" data-logout data-auth-mode="register">Crear cuenta formal</button>` : ""}
          <button class="btn ghost full" type="button" data-logout>Salir ${user.isGuest ? "del modo invitado" : "de la cuenta"}</button>
          <button class="btn danger full" type="button" data-reset>Reiniciar progreso</button>
        </div>
      </div>
    </section>`;
  };

  const renderCertificates = (user) => {
    const certificates = user.progress?.certificates || [];
    const completedIds = user.progress?.completedCourses || [];
    const completedCourses = IMPERIA_DATA.courses.filter(course => completedIds.includes(course.id));
    const pendingCourses = IMPERIA_DATA.courses.filter(course => canAccessCourse(user, course) && !completedIds.includes(course.id));
    return `<section class="mobile-screen certificates-screen">
      ${topBrandBar(user, "Certificados", "Logros y descargas")}
      <div class="page-copy-block">
        <div class="kicker">Validación IMPERIA</div>
        <h1 class="h2">Tus certificados</h1>
        <p class="muted">El certificado se habilita al culminar el curso, pero para descargarlo debes realizar un pago simulado de S/ 35 por cada certificado.</p>
      </div>

      <div class="certificate-summary-grid">
        <article class="certificate-summary-card">
          <strong>${certificates.length}</strong>
          <span>Certificados generados</span>
        </article>
        <article class="certificate-summary-card">
          <strong>${completedCourses.length}</strong>
          <span>Cursos culminados</span>
        </article>
      </div>

      <div class="mobile-section-head">
        <div><span class="section-dot"></span><h2>Disponibles</h2></div>
      </div>

      <div class="certificate-list">
        ${certificates.length ? certificates.map(cert => certificateCard(cert, true)).join("") : emptyCertificateState()}
      </div>

      <div class="mobile-section-head premium-head">
        <div><span class="section-bar"></span><h2>Pendientes</h2></div>
      </div>

      <div class="certificate-list">
        ${pendingCourses.length ? pendingCourses.map(course => pendingCertificateCard(user, course)).join("") : `<article class="certificate-empty-card"><strong>No hay cursos pendientes disponibles.</strong><p class="muted small">Explora la academia para continuar aprendiendo.</p></article>`}
      </div>
    </section>`;
  };

  const emptyCertificateState = () => `<article class="certificate-empty-card">
    <div class="certificate-empty-icon">${icon("graduation")}</div>
    <strong>Aún no tienes certificados</strong>
    <p class="muted small">Completa todas las clases de un curso. Luego podrás pagar S/ 35 para descargar tu certificado IMPERIA.</p>
    <button class="btn primary full" type="button" data-view="courses">Ir a cursos</button>
  </article>`;

  const pendingCertificateCard = (user, course) => {
    const progress = courseProgress(user, course);
    const remaining = Math.max(0, progress.total - progress.done);
    return `<article class="certificate-course-card locked">
      <div class="certificate-course-icon">${courseVisual(course)}</div>
      <div class="certificate-course-body">
        <div class="between"><h3>${esc(course.title)}</h3><span class="badge lock">Pendiente</span></div>
        <p class="muted small">Completa ${remaining} clase${remaining === 1 ? "" : "s"} más. Luego podrás pagar S/ 35 para descargar el certificado.</p>
        <div class="progress-track"><span style="width:${progress.percent}%"></span></div>
        <div class="certificate-actions">
          <button class="btn primary" type="button" data-course="${course.id}">Continuar curso</button>
          <button class="btn ghost" type="button" disabled>Completa el curso</button>
        </div>
      </div>
    </article>`;
  };

  const certificateCard = (cert, full = false) => {
    const user = ImperiaStore.currentUser();
    const course = IMPERIA_DATA.courses.find(c => c.id === cert.courseId);
    if (!course) return "";
    const paid = !!cert.paid || !!(user?.progress?.paidCertificates || []).includes(cert.id);
    return `<article class="certificate-full-card">
      <div class="certificate-preview certificate-preview-utp">
        <div class="certificate-logo-line certificate-logo-utp">
          <img src="img/logo utp.png" alt="Logo UTP">
          <span>UTP · IMPERIA</span>
        </div>
        <div class="certificate-label">CERTIFICADO DE FINALIZACIÓN</div>
        <h3>${esc(userNameForCertificate())}</h3>
        <p>Ha culminado satisfactoriamente el curso</p>
        <h4>${esc(course.title)}</h4>
        <div class="certificate-mini-signatures">
          <span>ANTONIO F. MAESTRE SATTUI</span>
          <span>JUAN A. TRELLES CASTILLO</span>
        </div>
        <div class="certificate-code">Código: ${esc(cert.id)}</div>
      </div>
      <div class="certificate-info">
        <div class="between"><h3>${esc(course.title)}</h3><span class="badge ${paid ? "base" : "lock"}">${paid ? "Pagado" : "Pendiente S/ 35"}</span></div>
        <p class="muted small">Emitido: ${new Date(cert.issuedAt).toLocaleDateString("es-PE")} · Código: ${esc(cert.id)} · ${paid ? "Pago aprobado" : "Requiere pago simulado de S/ 35 para descarga"}</p>
        <div class="certificate-actions">
          ${paid ? `<button class="btn gold" type="button" data-download-cert="${esc(cert.id)}">${icon("graduation")} Descargar certificado</button>` : `<button class="btn gold" type="button" data-buy-cert="${esc(cert.id)}">${icon("card")} Pagar certificado S/ 35</button>`}
          <button class="btn primary" type="button" data-download-course="${esc(course.id)}">${icon("book")} Descargar curso</button>
          <button class="btn ghost" type="button" data-course="${esc(course.id)}">Revisar curso</button>
        </div>
      </div>
    </article>`;
  };

  const userNameForCertificate = () => {
    const user = ImperiaStore.currentUser();
    return user?.fullName || "Estudiante IMPERIA";
  };

  const notFound = () => `<section class="app-card section"><h2>No encontrado</h2><button class="btn primary" type="button" data-view="home">Volver</button></section>`;

  const bindApp = (user) => {
    document.querySelectorAll("[data-view]").forEach(btn => btn.addEventListener("click", () => {
      state.view = btn.dataset.view;
      state.selectedCourse = null;
      state.selectedModule = null;
      state.quizCourse = null;
      if (validViews.includes(state.view)) history.replaceState(null, "", `#${state.view}`);
      render();
    }));

    document.querySelectorAll("[data-course]").forEach(btn => btn.addEventListener("click", () => {
      const course = IMPERIA_DATA.courses.find(c => c.id === btn.dataset.course);
      if (!canAccessCourse(user, course)) {
        state.view = "courses";
        state.selectedCourse = course.id;
        state.selectedModule = null;
        toast("Este curso exclusivo requiere pago individual de S/ 80.");
      } else {
        state.selectedCourse = course.id;
        state.selectedModule = null;
      }
      render();
    }));

    document.querySelectorAll("[data-module]").forEach(btn => btn.addEventListener("click", () => {
      const course = IMPERIA_DATA.courses.find(c => c.id === state.selectedCourse);
      const key = `${state.selectedCourse}:${btn.dataset.module}`;
      const alreadyDone = user.progress?.completedModules?.includes(key);
      if (course?.plan === "free" && !alreadyDone && !ImperiaStore.hasPremium(user)) {
        if (!ImperiaStore.consumeLife()) {
          toast("No tienes vidas disponibles. Juega el quiz financiero o suscríbete para acceso a conferencias disponibles.");
          state.view = "activities"; state.selectedCourse = null; state.selectedModule = null; render(); return;
        }
        toast("Usaste 1 vida para desbloquear esta clase gratuita.");
      }
      state.selectedModule = btn.dataset.module;
      render();
    }));

    document.querySelectorAll("[data-start-course-quiz]").forEach(btn => btn.addEventListener("click", () => {
      state.quizCourse = btn.dataset.startCourseQuiz;
      state.selectedCourse = null;
      state.selectedModule = null;
      render();
    }));

    document.querySelectorAll("[data-back]").forEach(btn => btn.addEventListener("click", () => {
      if (btn.dataset.back === "courses") { state.selectedCourse = null; state.selectedModule = null; state.view = "courses"; }
      if (btn.dataset.back === "course") { state.selectedModule = null; }
      render();
    }));

    const complete = $("[data-complete-module]");
    if (complete) complete.addEventListener("click", () => {
      const course = IMPERIA_DATA.courses.find(c => c.id === state.selectedCourse);
      ImperiaStore.completeModule(state.selectedCourse, complete.dataset.completeModule);
      toast(course?.plan === "free" ? "Clase completada: +30 XP y +5 monedas." : "Clase completada: +30 XP.");
      render();
    });

    document.querySelectorAll("[data-quiz]").forEach(btn => btn.addEventListener("click", () => handleQuiz(btn)));
    document.querySelectorAll("[data-complete-check]").forEach(btn => btn.addEventListener("click", () => handleComplete(btn)));
    document.querySelectorAll("[data-sample]").forEach(btn => btn.addEventListener("click", () => handleSample(btn)));
    document.querySelectorAll("[data-mini]").forEach(btn => btn.addEventListener("click", () => renderMini(btn.dataset.mini)));
    document.querySelectorAll("[data-buy]").forEach(btn => btn.addEventListener("click", () => handleBuy(btn.dataset.buy)));
    document.querySelectorAll("[data-buy-course]").forEach(btn => btn.addEventListener("click", () => handleBuyCourse(btn.dataset.buyCourse)));
    document.querySelectorAll("[data-buy-cert]").forEach(btn => btn.addEventListener("click", () => handleBuyCertificate(btn.dataset.buyCert)));
    bindPayment();
    document.querySelectorAll("[data-close-quiz]").forEach(btn => btn.addEventListener("click", () => { state.quizCourse = null; state.view = "courses"; render(); }));
    document.querySelectorAll("[data-duo-answer]").forEach(btn => btn.addEventListener("click", () => handleDuoAnswer(btn)));
    document.querySelectorAll("[data-next-duo]").forEach(btn => btn.addEventListener("click", () => { window.clearTimeout(state.quizAdvanceTimer); state.quizCourse = btn.dataset.nextDuo || state.quizCourse; render(); }));
    document.querySelectorAll("[data-quiz-retry]").forEach(btn => btn.addEventListener("click", () => { resetQuizState(user, btn.dataset.quizRetry); state.quizCourse = btn.dataset.quizRetry; render(); }));
    document.querySelectorAll("[data-quiz-finish]").forEach(btn => btn.addEventListener("click", () => {
      const c = IMPERIA_DATA.courses.find(course => course.id === btn.dataset.quizFinish);
      const qState = getQuizState(user, btn.dataset.quizFinish);
      const total = c?.quiz?.questions?.length || 1;
      const percent = pct(qState.score || 0, total);
      if (c && percent >= (c.quiz?.passingScore || 70)) {
        ImperiaStore.completeModule(c.id, c.modules[c.modules.length - 1].id);
        ImperiaStore.addXpCoins(35, 18, `quiz-final:${btn.dataset.quizFinish}`);
        toast("Logro guardado. Curso aprobado y certificado habilitado para pago.");
      } else {
        toast("Aún no aprobaste. Reintenta el quiz para guardar el logro.");
      }
      resetQuizState(user, btn.dataset.quizFinish);
      state.quizCourse = null;
      state.view = "courses";
      render();
    }));
    document.querySelectorAll("[data-logout]").forEach(btn => btn.addEventListener("click", () => {
      const nextAuthMode = btn.dataset.authMode || "login";
      ImperiaStore.logout();
      state.authMode = nextAuthMode;
      render();
    }));
    document.querySelectorAll("[data-reset]").forEach(btn => btn.addEventListener("click", () => { if (confirm("¿Reiniciar todos los datos locales de IMPERIA?")) { ImperiaStore.resetDemo(); location.reload(); } }));
    document.querySelectorAll("[data-mission]").forEach(btn => btn.addEventListener("click", () => claimMission(btn.dataset.mission)));
    document.querySelectorAll("[data-download-cert]").forEach(btn => btn.addEventListener("click", () => downloadCertificate(btn.dataset.downloadCert)));
    document.querySelectorAll("[data-download-course]").forEach(btn => btn.addEventListener("click", () => downloadCourse(btn.dataset.downloadCourse)));
    document.querySelectorAll("[data-theme-toggle]").forEach(btn => btn.addEventListener("click", () => {
      const nextTheme = ImperiaTheme.toggle();
      toast(nextTheme === "dark" ? "Modo oscuro activado." : "Modo claro activado.");
      render();
      requestAnimationFrame(() => ImperiaTheme.apply(nextTheme));
    }));
  };




  const quizKey = (user, courseId) => `imperia_quiz_${user.id}_${courseId}`;
  const getQuizState = (user, courseId) => {
    try { return JSON.parse(localStorage.getItem(quizKey(user, courseId))) || { index: 0, score: 0, answers: [] }; }
    catch { return { index: 0, score: 0, answers: [] }; }
  };
  const setQuizState = (user, courseId, value) => localStorage.setItem(quizKey(user, courseId), JSON.stringify(value));
  const resetQuizState = (user, courseId) => localStorage.removeItem(quizKey(user, courseId));

  const renderFullQuiz = (user, courseId) => {
    const course = IMPERIA_DATA.courses.find(c => c.id === courseId);
    if (!course?.quiz) return notFound();
    const quiz = course.quiz;
    const qState = getQuizState(user, courseId);
    const total = quiz.questions.length;
    const index = Math.min(qState.index || 0, total);
    const finished = index >= total;
    if (finished) {
      const score = qState.score || 0;
      const percent = pct(score, total);
      const passed = percent >= (quiz.passingScore || 70);
      return `<section class="quiz-shell finish" data-aos="zoom-in">
        <div class="quiz-result-card ${passed ? "passed" : "retry"}">
          <div class="quiz-result-icon">${icon(passed ? "graduation" : "bolt")}</div>
          <h1>${passed ? "¡Curso aprobado!" : "Puedes mejorar"}</h1>
          <p class="muted">Puntaje: ${score}/${total} · ${percent}%</p>
          <div class="progress-track tall"><span style="width:${percent}%"></span></div>
          <p>${passed ? "Einstein registró tu logro y sumó recompensas en este dispositivo." : "Repite el quiz para reforzar conceptos clave."}</p>
          <div class="row quiz-actions">
            ${passed
              ? `<button class="btn primary" type="button" data-quiz-finish="${course.id}">Guardar logro</button><button class="btn ghost" type="button" data-quiz-retry="${course.id}">Reintentar</button>`
              : `<button class="btn primary" type="button" data-quiz-retry="${course.id}">Reintentar quiz</button><button class="btn ghost" type="button" data-close-quiz>Volver al curso</button>`}
          </div>
        </div>
      </section>`;
    }
    const q = quiz.questions[index];
    const progress = pct(index, total);
    const lives = ImperiaStore.livesToday(user);
    return `<section class="quiz-shell" data-course-quiz="${course.id}">
      <div class="quiz-topbar">
        <button class="btn ghost circle" type="button" data-close-quiz>${icon("x")}</button>
        <div class="quiz-progress"><span style="width:${progress}%"></span></div>
        <div class="quiz-life">${icon("heart")} ${lives.unlimited ? "∞" : lives.value}</div>
      </div>
      <article id="quizCard" class="quiz-card-duo animate__animated animate__fadeInRight">
        <div class="quiz-meta"><span>${icon(course.icon)}</span><div><strong>${esc(course.title)}</strong><small>Pregunta ${index + 1} de ${total}</small></div></div>
        <h1>${esc(q.question)}</h1>
        <div class="quiz-options-duo">${q.options.map((option, i) => `<button type="button" data-duo-answer="${i}" data-course-id="${course.id}" class="quiz-choice">${esc(option)}</button>`).join("")}</div>
      </article>
      <div id="duoFeedback" class="duo-feedback"><div><h3 id="duoTitle"></h3><p id="duoText"></p></div><button class="btn primary" type="button" data-next-duo="${course.id}">Continuar</button></div>
    </section>`;
  };


  const bindPayment = () => {
    document.querySelectorAll("[data-payment-method]").forEach(btn => btn.addEventListener("click", () => {
      state.checkoutMethod = btn.dataset.paymentMethod;
      render();
    }));

    const form = $("#paymentForm");
    if (!form) return;

    const transferDate = $("#transferDate");
    if (transferDate && !transferDate.value) transferDate.value = today();

    const onlyDigits = (selector) => {
      const input = $(selector);
      if (!input) return;
      input.addEventListener("input", () => input.value = input.value.replace(/\D/g, ""));
    };
    ["#cardCvv", "#cardDni", "#walletPhone", "#walletCode", "#transferOperation"].forEach(onlyDigits);

    const cardNumber = $("#cardNumber");
    if (cardNumber) cardNumber.addEventListener("input", () => {
      cardNumber.value = formatCardNumber(cardNumber.value);
      const preview = $("#previewNumber");
      if (preview) preview.textContent = cardNumber.value || "•••• •••• •••• ••••";
    });

    const cardName = $("#cardName");
    if (cardName) cardName.addEventListener("input", () => {
      const preview = $("#previewName");
      if (preview) preview.textContent = cardName.value.trim().toUpperCase() || "NOMBRE DEL TITULAR";
    });

    const cardExp = $("#cardExp");
    if (cardExp) cardExp.addEventListener("input", () => {
      let value = cardExp.value.replace(/\D/g, "").slice(0, 4);
      if (value.length > 2) value = value.slice(0, 2) + "/" + value.slice(2);
      cardExp.value = value;
      const preview = $("#previewExp");
      if (preview) preview.textContent = value || "MM/AA";
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const payload = collectPaymentPayload();
      const errors = validatePayment(payload);
      showErrors("paymentErrors", errors);
      if (errors.length) return;
      processPayment(payload);
    });
  };

  const formatCardNumber = (value) => value.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const collectPaymentPayload = () => {
    const method = state.checkoutMethod;
    const context = {
      paymentType: $("#paymentType")?.value || "premium",
      courseId: $("#paymentCourseId")?.value || "",
      amount: $("#paymentAmount")?.value || "",
      title: $("#paymentTitle")?.value || "",
      referralCode: normalizeReferral($("#referralCode")?.value || "")
    };
    if (method === "card") return {
      ...context,
      method,
      methodLabel: "Tarjeta",
      cardName: $("#cardName")?.value || "",
      cardNumber: ($("#cardNumber")?.value || "").replace(/\D/g, ""),
      cardExp: $("#cardExp")?.value || "",
      cardCvv: $("#cardCvv")?.value || "",
      cardDni: $("#cardDni")?.value || "",
      terms: $("#paymentTerms")?.checked || false
    };
    if (method === "yape") return {
      ...context,
      method,
      methodLabel: "Yape",
      phone: $("#walletPhone")?.value || "",
      code: $("#walletCode")?.value || "",
      name: $("#walletName")?.value || "",
      terms: $("#paymentTerms")?.checked || false
    };
    if (method === "plin") return {
      ...context,
      method,
      methodLabel: "Plin",
      phone: $("#walletPhone")?.value || "",
      code: $("#walletCode")?.value || "",
      bank: $("#walletBank")?.value || "",
      terms: $("#paymentTerms")?.checked || false
    };
    return {
      ...context,
      method,
      methodLabel: "Transferencia bancaria",
      bank: $("#transferBank")?.value || "",
      code: $("#transferOperation")?.value || "",
      name: $("#transferHolder")?.value || "",
      date: $("#transferDate")?.value || "",
      terms: $("#paymentTerms")?.checked || false
    };
  };

  const validatePayment = (p) => {
    const errors = [];
    if (!p.terms) errors.push("Confirma que entiendes que el pago es una simulación local.");
    if (p.referralCode && !referralOwner(p.referralCode, ImperiaStore.currentUser()?.id)) errors.push("El código de referido no existe, no está activo o pertenece a tu propia cuenta.");
    if (p.method === "card") {
      if (p.cardName.trim().split(/\s+/).length < 2) errors.push("Ingresa nombre y apellido del titular.");
      if (!/^\d{13,16}$/.test(p.cardNumber) || !luhn(p.cardNumber)) errors.push("Ingresa un número de tarjeta válido. Puedes probar con 4242 4242 4242 4242.");
      if (!validExpiry(p.cardExp)) errors.push("Ingresa una fecha de vencimiento válida en formato MM/AA.");
      if (!/^\d{3,4}$/.test(p.cardCvv)) errors.push("El CVV debe tener 3 o 4 dígitos.");
      if (!/^\d{8}$/.test(p.cardDni)) errors.push("El DNI debe tener 8 dígitos.");
    }
    if (p.method === "yape") {
      if (!/^9\d{8}$/.test(p.phone)) errors.push("El celular de Yape debe tener 9 dígitos y empezar con 9.");
      if (!/^\d{6,12}$/.test(p.code)) errors.push("El código de operación de Yape debe tener entre 6 y 12 dígitos.");
      if (p.name.trim().split(/\s+/).length < 2) errors.push("Ingresa nombre y apellido del pagador.");
    }
    if (p.method === "plin") {
      if (!/^9\d{8}$/.test(p.phone)) errors.push("El celular de Plin debe tener 9 dígitos y empezar con 9.");
      if (!/^\d{6,12}$/.test(p.code)) errors.push("El número de operación de Plin debe tener entre 6 y 12 dígitos.");
    }
    if (p.method === "bank") {
      if (!/^\d{6,14}$/.test(p.code)) errors.push("El número de operación bancaria debe tener entre 6 y 14 dígitos.");
      if (p.name.trim().split(/\s+/).length < 2) errors.push("Ingresa nombre y apellido del remitente.");
      if (!p.date) errors.push("Selecciona la fecha de la transferencia.");
    }
    return errors;
  };

  const validExpiry = (value) => {
    const match = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(value);
    if (!match) return false;
    const month = Number(match[1]);
    const year = 2000 + Number(match[2]);
    const now = new Date();
    const end = new Date(year, month, 0, 23, 59, 59);
    return end >= new Date(now.getFullYear(), now.getMonth(), 1);
  };

  const luhn = (number) => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = number.length - 1; i >= 0; i--) {
      let digit = Number(number[i]);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  const processPayment = (payload) => {
    const button = $(".pay-button");
    if (button) {
      button.disabled = true;
      button.innerHTML = "Procesando pago simulado...";
    }
    const panel = $(".payment-card");
    if (panel) panel.classList.add("is-processing");
    setTimeout(() => {
      const reference = paymentReference(payload);
      const type = payload.paymentType || "premium";
      const pricing = pricingForPayment(payload);
      payload.amount = pricing.totalLabel;
      payload.discount = pricing.discount ? `${pricing.discountLabel} · ${pricing.reason}` : null;
      if (type === "course") {
        if (!payload.courseId) {
          state.paymentProcessing = false;
          toast("No se encontró el curso para activar.");
          render();
          return;
        }
        ImperiaStore.buyCourse(payload.courseId, { method: payload.method, methodLabel: payload.methodLabel, reference, amount: payload.amount || "S/ 80.00", discount: payload.discount, referralCode: payload.referralCode });
        state.paymentProcessing = false;
        state.selectedCourse = payload.courseId;
        state.selectedModule = null;
        state.view = "courses";
        toast(`Pago simulado aprobado: curso exclusivo activado por ${payload.amount}${payload.discount ? " con descuento." : "."}`);
        render();
        return;
      }
      ImperiaStore.activatePremium({ method: payload.method, methodLabel: payload.methodLabel, reference, amount: payload.amount || "S/ 25.00", discount: payload.discount, referralCode: payload.referralCode });
      state.paymentProcessing = false;
      toast(`Pago simulado aprobado por ${payload.amount}. IMPERIA PRO activada: anuncios ocultos, conferencias disponibles y vidas ilimitadas.`);
      render();
    }, 1100);
  };

  const paymentReference = (payload) => {
    if (payload.method === "card") return "•••• " + payload.cardNumber.slice(-4);
    if (payload.method === "yape" || payload.method === "plin") return payload.phone + " · Op. " + payload.code;
    return payload.bank + " · Op. " + payload.code;
  };



  const handleDuoAnswer = (btn) => {
    const user = ImperiaStore.currentUser();
    const courseId = btn.dataset.courseId;
    const course = IMPERIA_DATA.courses.find(c => c.id === courseId);
    if (!user || !course?.quiz?.questions?.length) return;

    const qState = getQuizState(user, courseId);
    const currentIndex = Math.min(qState.index || 0, course.quiz.questions.length);
    const q = course.quiz.questions[currentIndex];
    if (!q) {
      render();
      return;
    }

    const selected = Number(btn.dataset.duoAnswer);
    const ok = selected === q.correctIndex;

    document.querySelectorAll("[data-duo-answer]").forEach(option => {
      option.disabled = true;
      const idx = Number(option.dataset.duoAnswer);
      option.classList.toggle("correct", idx === q.correctIndex);
      option.classList.toggle("wrong", idx === selected && !ok);
    });

    const nextIndex = currentIndex + 1;
    const next = {
      index: nextIndex,
      score: (qState.score || 0) + (ok ? 1 : 0),
      answers: [...(qState.answers || []), { questionId: q.id, selected, ok }]
    };
    setQuizState(user, courseId, next);

    const card = document.getElementById("quizCard");
    if (card) {
      card.classList.remove("animate__fadeInRight");
      card.classList.add(ok ? "animate__bounce" : "animate__shakeX");
    }

    const feedback = document.getElementById("duoFeedback");
    const title = document.getElementById("duoTitle");
    const text = document.getElementById("duoText");
    const continueBtn = document.querySelector("[data-next-duo]");
    const isLast = nextIndex >= course.quiz.questions.length;

    if (feedback && title && text) {
      feedback.classList.remove("success", "danger");
      feedback.classList.add("show", ok ? "success" : "danger");
      title.textContent = ok ? "¡Correcto!" : "Respuesta registrada";
      text.textContent = q.explanation || (ok ? "Muy bien. Avanzamos a la siguiente pregunta." : "Revisa la explicación. Podrás reforzar el concepto al terminar.");
    }

    if (continueBtn) {
      continueBtn.textContent = isLast ? "Ver resultado" : "Siguiente pregunta";
      continueBtn.disabled = false;
      continueBtn.classList.add("pulse-next-v57");
    }

    if (ok) ImperiaStore.addXpCoins(4, 2, `duo:${courseId}:${q.id}`);
    if (!ok && !ImperiaStore.hasPremium(user)) ImperiaStore.consumeLife();

    // Avance automático para que el quiz no se quede detenido después de una respuesta correcta.
    // El botón "Siguiente pregunta" también queda disponible si el usuario quiere avanzar manualmente.
    if (ok) {
      window.clearTimeout(state.quizAdvanceTimer);
      state.quizAdvanceTimer = window.setTimeout(() => {
        if (state.quizCourse === courseId) render();
      }, 950);
    }
  };

  const handleQuiz = (btn) => {
    const id = btn.dataset.quiz;
    const selected = Number(btn.dataset.answer);
    const [courseId, moduleId, index] = id.split(":");
    const course = IMPERIA_DATA.courses.find(c => c.id === courseId);
    const module = course.modules.find(m => m.id === moduleId);
    const activity = module.activities[Number(index)];
    const card = document.querySelector(`[data-quiz-card="${CSS.escape(id)}"]`);
    card.querySelectorAll(".question-option").forEach((option, i) => {
      option.classList.remove("correct", "wrong");
      if (i === activity.answer) option.classList.add("correct");
      if (i === selected && selected !== activity.answer) option.classList.add("wrong");
    });
    const fb = document.querySelector(`[data-feedback="${CSS.escape(id)}"]`);
    fb.textContent = selected === activity.answer ? activity.feedback : "Revisa la explicación e inténtalo de nuevo.";
    if (selected === activity.answer) { ImperiaStore.addXpCoins(5, 2, `quiz:${id}`); ImperiaStore.gainLife(); toast("Respuesta correcta: +XP, +monedas y +1 vida."); }
  };

  const handleComplete = (btn) => {
    const id = btn.dataset.completeCheck;
    const input = document.querySelector(`[data-complete-input="${CSS.escape(id)}"]`);
    const feedback = document.querySelector(`[data-complete-feedback="${CSS.escape(id)}"]`);
    const expected = (btn.dataset.expected || "").trim().toLowerCase();
    const value = (input.value || "").trim().toLowerCase();
    if (value === expected || (expected === "deuda" && value === "deudas")) {
      feedback.textContent = "Correcto. Has ganado +5 XP.";
      feedback.style.color = "var(--success)";
      ImperiaStore.addXpCoins(5, 2, `complete:${id}`);
    } else {
      feedback.textContent = "Aún no. Revisa la pista y vuelve a intentar.";
      feedback.style.color = "var(--danger)";
    }
  };

  const handleSample = (btn) => {
    const box = document.querySelector(`[data-sample-box="${CSS.escape(btn.dataset.sample)}"]`);
    box.textContent = btn.dataset.sampleText;
  };

  const renderMini = (kind) => {
    const holder = $("#miniGame");
    if (!holder) return;
    if (kind === "budget") holder.innerHTML = miniBudget();
    if (kind === "quickquiz") holder.innerHTML = miniQuiz();
    if (kind === "savings") holder.innerHTML = miniSavings();
    if (kind === "price") holder.innerHTML = miniPrice();
    if (kind === "inventory") holder.innerHTML = miniInventory();
    if (kind === "cashflow") holder.innerHTML = miniCashflow();
    bindMiniGame(kind);
    holder.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const miniBudget = () => `<div class="app-card mini-tool-panel"><h2>${icon("chart")} Simulador de presupuesto 50/30/20</h2><div class="form-grid"><div class="field"><label>Ingreso mensual</label><input class="input" id="budgetIncome" type="number" value="1500"></div></div><button class="btn primary" type="button" id="calcBudget">Calcular</button><div id="budgetResult" class="section"></div></div>`;
  const miniQuiz = () => `<div class="app-card mini-tool-panel"><h2>${icon("bolt")} Quiz relámpago</h2><p>¿Qué representa un fondo de emergencia?</p><button class="question-option" type="button" data-mini-answer="wrong">Dinero para compras impulsivas</button><button class="question-option" type="button" data-mini-answer="right">Dinero para imprevistos</button><button class="question-option" type="button" data-mini-answer="wrong">Dinero que nunca se registra</button><p id="miniFeedback" class="muted small"></p></div>`;
  const miniSavings = () => `<div class="app-card mini-tool-panel"><h2>${icon("bank")} Reto de ahorro</h2><div class="form-grid"><div class="field"><label>Meta</label><input class="input" id="saveGoal" type="number" value="400"></div><div class="field"><label>Semanas</label><input class="input" id="saveWeeks" type="number" value="8"></div></div><button class="btn purple" type="button" id="calcSavings">Crear plan</button><div id="savingResult" class="section"></div></div>`;
  const miniPrice = () => `<div class="app-card mini-tool-panel"><h2>${icon("card")} Calculadora de precio de venta</h2><p class="muted small">Ideal para emprendedores: define un precio mínimo con margen de ganancia.</p><div class="form-grid"><div class="field"><label>Costo unitario</label><input class="input" id="priceCost" type="number" value="12"></div><div class="field"><label>Margen deseado (%)</label><input class="input" id="priceMargin" type="number" value="35"></div><div class="field"><label>Costo fijo estimado</label><input class="input" id="priceFixed" type="number" value="3"></div></div><button class="btn primary" type="button" id="calcPrice">Calcular precio</button><div id="priceResult" class="section"></div></div>`;
  const miniInventory = () => `<div class="app-card mini-tool-panel"><h2>${icon("boxes")} Clasificador de inventario ABC</h2><p class="muted small">Calcula la importancia del producto según valor mensual. Úsalo para priorizar compras.</p><div class="form-grid"><div class="field"><label>Producto</label><input class="input" id="abcName" value="Producto estrella"></div><div class="field"><label>Venta mensual estimada</label><input class="input" id="abcQty" type="number" value="120"></div><div class="field"><label>Valor unitario</label><input class="input" id="abcValue" type="number" value="8"></div></div><button class="btn gold" type="button" id="calcAbc">Clasificar</button><div id="abcResult" class="section"></div></div>`;
  const miniCashflow = () => `<div class="app-card mini-tool-panel"><h2>${icon("coins")} Reto: protege tu flujo de caja</h2><p class="muted small">Tienes S/ 300 para esta semana. Elige la mejor decisión.</p><div class="cashflow-options"><button class="question-option" type="button" data-cashflow="wrong">Comprar decoración por S/ 250</button><button class="question-option" type="button" data-cashflow="right">Reponer inventario clave por S/ 180 y guardar S/ 120</button><button class="question-option" type="button" data-cashflow="wrong">Pagar publicidad sin medir por S/ 300</button></div><p id="cashflowFeedback" class="muted small"></p></div>`;

  const bindMiniGame = (kind) => {
    if (kind === "budget") $("#calcBudget").addEventListener("click", () => {
      const income = Number($("#budgetIncome").value || 0);
      $("#budgetResult").innerHTML = `<div class="three-grid"><div class="app-card">Necesidades<br><strong>S/ ${(income * .5).toFixed(2)}</strong></div><div class="app-card">Deseos<br><strong>S/ ${(income * .3).toFixed(2)}</strong></div><div class="app-card">Ahorro/deuda<br><strong>S/ ${(income * .2).toFixed(2)}</strong></div></div>`;
      ImperiaStore.addXpCoins(12, 6, `mini:budget:${today()}`);
      toast("Simulación completada: +12 XP.");
    });
    if (kind === "quickquiz") document.querySelectorAll("[data-mini-answer]").forEach(btn => btn.addEventListener("click", () => {
      const ok = btn.dataset.miniAnswer === "right";
      $("#miniFeedback").textContent = ok ? "Correcto. +10 XP" : "No es correcto. Intenta de nuevo.";
      if (ok) { ImperiaStore.addXpCoins(10, 5, `mini:quickquiz:${today()}`); ImperiaStore.gainLife(); toast("Quiz correcto: ganaste +1 vida."); }
    }));
    if (kind === "savings") $("#calcSavings").addEventListener("click", () => {
      const goal = Number($("#saveGoal").value || 0);
      const weeks = Math.max(1, Number($("#saveWeeks").value || 1));
      $("#savingResult").innerHTML = `<div class="app-card">Debes separar aproximadamente <strong>S/ ${(goal / weeks).toFixed(2)}</strong> por semana para lograr S/ ${goal.toFixed(2)} en ${weeks} semanas.</div>`;
      ImperiaStore.addXpCoins(12, 6, `mini:savings:${today()}`);
      toast("Reto creado: +12 XP.");
    });
    if (kind === "price") $("#calcPrice").addEventListener("click", () => {
      const cost = Number($("#priceCost").value || 0);
      const margin = Number($("#priceMargin").value || 0);
      const fixed = Number($("#priceFixed").value || 0);
      const price = (cost + fixed) / Math.max(.01, (1 - margin / 100));
      $("#priceResult").innerHTML = `<div class="app-card result-card"><span class="badge premium">Precio sugerido</span><h3>S/ ${price.toFixed(2)}</h3><p class="muted small">Cubre S/ ${(cost + fixed).toFixed(2)} de costo total y deja margen aproximado de ${margin}%.</p></div>`;
      ImperiaStore.addXpCoins(14, 7, `mini:price:${today()}`);
      toast("Precio calculado: +14 XP.");
    });
    if (kind === "inventory") $("#calcAbc").addEventListener("click", () => {
      const name = $("#abcName").value || "Producto";
      const qty = Number($("#abcQty").value || 0);
      const value = Number($("#abcValue").value || 0);
      const total = qty * value;
      const category = total >= 800 ? "A" : total >= 300 ? "B" : "C";
      const action = category === "A" ? "Prioridad alta: controla stock cada semana." : category === "B" ? "Prioridad media: revisa cada 15 días." : "Prioridad baja: evita sobrecomprar.";
      $("#abcResult").innerHTML = `<div class="app-card result-card"><span class="badge ${category === "A" ? "premium" : "base"}">Clase ${category}</span><h3>${esc(name)} · S/ ${total.toFixed(2)} mensual</h3><p class="muted small">${action}</p></div>`;
      ImperiaStore.addXpCoins(14, 7, `mini:abc:${today()}`);
      toast("Inventario clasificado: +14 XP.");
    });
    if (kind === "cashflow") document.querySelectorAll("[data-cashflow]").forEach(btn => btn.addEventListener("click", () => {
      const ok = btn.dataset.cashflow === "right";
      document.querySelectorAll("[data-cashflow]").forEach(b => b.disabled = true);
      $("#cashflowFeedback").textContent = ok ? "Correcto: mantienes inventario y liquidez. +15 XP y +8 monedas." : "Riesgo: esa decisión deja poca caja para operar. Inténtalo nuevamente luego.";
      if (ok) { ImperiaStore.addXpCoins(15, 8, `mini:cashflow:${today()}`); toast("Reto superado: protegiste tu caja."); }
    }));
  };

  const handleBuy = (itemId) => {
    try {
      ImperiaStore.buyItem(itemId);
      toast("Tienda actualizada.");
      render();
    } catch (error) {
      toast(error.message);
      if (error.message.includes("IMPERIA PRO")) { state.view = "premium"; render(); }
    }
  };

  const handleBuyCourse = (courseId) => {
    const user = ImperiaStore.currentUser();
    const course = IMPERIA_DATA.courses.find(c => c.id === courseId);
    if (!course) { toast("El curso no existe."); return; }
    if (ImperiaStore.hasCourseAccess(user, courseId)) {
      state.selectedCourse = courseId;
      state.selectedModule = null;
      state.view = "courses";
      render();
      return;
    }
    state.selectedCourse = courseId;
    state.selectedModule = null;
    state.view = "courses";
    toast("Completa la simulación de pago para activar este curso por S/ 80.");
    render();
  };

  const handleBuyCertificate = (certId) => {
    try {
      ImperiaStore.buyCertificate(certId);
      toast("Pago simulado aprobado: certificado habilitado por S/ 35.");
      state.view = "certificates";
      render();
    } catch (error) { toast(error.message); }
  };

  const claimMission = (missionId) => {
    const user = ImperiaStore.currentUser();
    const mission = IMPERIA_DATA.missions.find(m => m.id === missionId);
    const missions = user.progress?.missions || {};
    const doneToday = missions[today()] || [];
    if (doneToday.includes(missionId)) return;
    missions[today()] = [...doneToday, missionId];
    ImperiaStore.updateProgress({ missions });
    const multiplier = ImperiaStore.hasPremium(user) ? 2 : 1;
    ImperiaStore.addXpCoins(mission.rewardXp * multiplier, mission.rewardCoins * multiplier, `mission:${today()}:${missionId}`);
    toast(`Misión cobrada: +${mission.rewardXp * multiplier} XP.`);
    render();
  };

  const slugify = (value) => String(value || "imperia")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  const downloadBlob = (content, filename, type = "text/plain;charset=utf-8") => {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const certificateAssetUrl = (path) => {
    try { return new URL(path, location.href).href; }
    catch { return path; }
  };

  const certificateTemplate = (user, course, cert) => `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Certificado UTP - ${esc(course.title)}</title>
<style>
  :root{
    --utp-blue:#002b5c;
    --utp-red:#e30613;
    --utp-dark:#1f2937;
    --utp-gray:#5f6b7a;
    --utp-line:#d9e2ef;
  }
  *{box-sizing:border-box}
  body{
    margin:0;
    font-family:Arial,Helvetica,sans-serif;
    background:#eef3f8;
    color:var(--utp-dark);
  }
  .sheet{
    width:1120px;
    min-height:792px;
    max-width:calc(100% - 32px);
    margin:24px auto;
    background:#fff;
    position:relative;
    overflow:hidden;
    border:1px solid #d9e2ef;
    box-shadow:0 24px 80px rgba(0,43,92,.18);
  }
  .sheet::before{
    content:"";
    position:absolute;
    inset:0;
    border:18px solid var(--utp-blue);
    pointer-events:none;
  }
  .sheet::after{
    content:"";
    position:absolute;
    top:18px;
    right:18px;
    width:0;
    height:0;
    border-top:110px solid var(--utp-red);
    border-left:110px solid transparent;
    pointer-events:none;
  }
  .content{
    position:relative;
    z-index:1;
    padding:54px 70px 44px;
    min-height:792px;
    display:flex;
    flex-direction:column;
  }
  .top{
    display:flex;
    justify-content:space-between;
    align-items:flex-start;
    gap:24px;
  }
  .logo-utp{
    width:190px;
    max-height:88px;
    object-fit:contain;
  }
  .code{
    text-align:right;
    color:var(--utp-gray);
    font-size:14px;
    line-height:1.6;
    margin-right:28px;
  }
  .code strong{color:var(--utp-blue)}
  .title{
    text-align:center;
    margin:44px 0 24px;
  }
  .title .label{
    display:inline-block;
    padding:8px 18px;
    border:1px solid var(--utp-line);
    border-radius:999px;
    color:var(--utp-blue);
    font-weight:800;
    letter-spacing:3px;
    font-size:14px;
    text-transform:uppercase;
  }
  h1{
    margin:20px 0 8px;
    color:var(--utp-blue);
    font-size:54px;
    letter-spacing:4px;
    text-transform:uppercase;
  }
  .subtitle{
    margin:0;
    color:var(--utp-red);
    font-size:18px;
    font-weight:800;
    letter-spacing:2px;
    text-transform:uppercase;
  }
  .body{
    text-align:center;
    max-width:850px;
    margin:0 auto;
    line-height:1.65;
    color:var(--utp-gray);
    font-size:22px;
  }
  .student{
    margin:22px auto 10px;
    color:var(--utp-dark);
    font-size:42px;
    font-weight:800;
    line-height:1.15;
    border-bottom:2px solid var(--utp-line);
    display:inline-block;
    padding:0 36px 10px;
  }
  .course{
    color:var(--utp-blue);
    font-size:30px;
    font-weight:900;
    line-height:1.25;
    margin:14px auto 10px;
    max-width:860px;
  }
  .meta{
    margin:30px auto 34px;
    display:grid;
    grid-template-columns:repeat(3,1fr);
    gap:14px;
    width:100%;
    max-width:850px;
  }
  .meta .box{
    border:1px solid var(--utp-line);
    border-radius:14px;
    padding:14px 16px;
    background:#f8fafc;
    text-align:left;
  }
  .meta span{
    display:block;
    color:var(--utp-gray);
    font-size:12px;
    text-transform:uppercase;
    font-weight:800;
    letter-spacing:1px;
  }
  .meta strong{
    display:block;
    margin-top:6px;
    color:var(--utp-dark);
    font-size:16px;
  }
  .signatures{
    margin-top:auto;
    display:grid;
    grid-template-columns:1fr 1fr;
    gap:52px;
    align-items:end;
    padding:8px 18px 0;
  }
  .signature{
    text-align:center;
  }
  .signature img{
    height:74px;
    max-width:260px;
    object-fit:contain;
    margin-bottom:-4px;
  }
  .signature .line{
    height:1px;
    background:#1f2937;
    width:82%;
    margin:0 auto 10px;
  }
  .signature strong{
    display:block;
    color:var(--utp-dark);
    font-size:14px;
    text-transform:uppercase;
    line-height:1.3;
  }
  .signature span{
    display:block;
    color:var(--utp-gray);
    font-size:13px;
    line-height:1.35;
    margin-top:4px;
  }
  .footer{
    margin-top:26px;
    padding-top:12px;
    border-top:1px solid var(--utp-line);
    color:var(--utp-gray);
    font-size:12px;
    text-align:center;
  }
  .watermark{
    position:absolute;
    inset:auto 40px 28px auto;
    font-size:74px;
    font-weight:900;
    color:rgba(0,43,92,.045);
    letter-spacing:4px;
    pointer-events:none;
  }
  @media print{
    @page{size:landscape;margin:0}
    body{background:#fff}
    .sheet{margin:0;max-width:none;width:100vw;min-height:100vh;box-shadow:none;border:0}
    .content{min-height:100vh}
  }
  @media (max-width:760px){
    .sheet{min-height:auto}
    .content{padding:44px 34px}
    .top{flex-direction:column;align-items:center;text-align:center}
    .code{text-align:center;margin-right:0}
    h1{font-size:34px}
    .student{font-size:28px;padding-left:10px;padding-right:10px}
    .course{font-size:22px}
    .body{font-size:17px}
    .meta{grid-template-columns:1fr}
    .signatures{grid-template-columns:1fr;gap:28px}
  }
</style>
</head>
<body>
  <main class="sheet">
    <div class="content">
      <div class="top">
        <img class="logo-utp" src="${certificateAssetUrl("img/logo utp.png")}" alt="Universidad Tecnológica del Perú">
        <div class="code">
          <div><strong>Código:</strong> ${esc(cert.id)}</div>
          <div><strong>Fecha:</strong> ${new Date(cert.issuedAt).toLocaleDateString("es-PE")}</div>
        </div>
      </div>

      <section class="title">
        <div class="label">Certificado de finalización</div>
        <h1>Certificado</h1>
        <p class="subtitle">Educación Financiera y Contable</p>
      </section>

      <section class="body">
        <p>Se otorga el presente certificado a:</p>
        <div class="student">${esc(user.fullName)}</div>
        <p>por haber culminado satisfactoriamente el curso:</p>
        <div class="course">${esc(course.title)}</div>
      </section>

      <section class="meta">
        <div class="box"><span>Modalidad</span><strong>Virtual</strong></div>
        <div class="box"><span>Duración</span><strong>${esc(course.duration)}</strong></div>
        <div class="box"><span>Plataforma</span><strong>IMPERIA</strong></div>
      </section>

      <section class="signatures">
        <div class="signature">
          <img src="${certificateAssetUrl("img/firma 1.jpeg")}" alt="Firma Antonio Fernando Maestre Sattui">
          <div class="line"></div>
          <strong>ANTONIO FERNANDO MAESTRE SATTUI</strong>
          <span>Coordinador Servicio de Atención al Estudiante</span>
        </div>
        <div class="signature">
          <img src="${certificateAssetUrl("img/firma 2.jpeg")}" alt="Firma Juan Antonio Trelles Castillo">
          <div class="line"></div>
          <strong>JUAN ANTONIO TRELLES CASTILLO</strong>
          <span>Secretario General</span>
        </div>
      </section>

      <div class="footer">
        Este certificado se habilita únicamente al culminar todas las clases del curso dentro de la plataforma IMPERIA.
      </div>
      <div class="watermark">UTP</div>
    </div>
  </main>
</body>
</html>`;

  const downloadCertificate = (certId) => {
    const user = ImperiaStore.currentUser();
    const cert = user?.progress?.certificates?.find(c => c.id === certId);
    if (!user || !cert) {
      toast("Certificado no disponible.");
      return;
    }
    const completed = user.progress?.completedCourses?.includes(cert.courseId);
    if (!completed) {
      toast("Debes culminar el curso para descargar el certificado.");
      return;
    }
    const paid = !!cert.paid || !!(user.progress?.paidCertificates || []).includes(cert.id);
    if (!paid) {
      toast("Debes pagar S/ 35 para descargar este certificado.");
      state.view = "certificates";
      render();
      return;
    }
    const course = IMPERIA_DATA.courses.find(c => c.id === cert.courseId);
    if (!course) {
      toast("Curso no encontrado.");
      return;
    }
    const html = certificateTemplate(user, course, cert);
    downloadBlob(html, `Certificado_UTP_IMPERIA_${slugify(course.title)}_${cert.id}.html`, "text/html;charset=utf-8");
    toast("Certificado descargado.");
  };

  const courseDownloadTemplate = (user, course) => {
    const lines = [];
    lines.push("IMPERIA - Material del curso");
    lines.push("");
    lines.push(`Estudiante: ${user.fullName}`);
    lines.push(`Curso: ${course.title}`);
    lines.push(`Nivel: ${course.level}`);
    lines.push(`Duración: ${course.duration}`);
    lines.push(`Módulos: ${course.modules.length}`);
    lines.push("");
    lines.push("RESUMEN");
    lines.push(course.summary);
    lines.push("");
    lines.push("CONTENIDO DEL CURSO");
    course.modules.forEach((module, index) => {
      lines.push("");
      lines.push(`${index + 1}. ${module.title}`);
      lines.push(`Tipo: ${module.type} · ${module.minutes} min`);
      (module.activities || []).forEach((activity, i) => {
        lines.push(`   ${index + 1}.${i + 1} ${activity.title || activity.question || activity.prompt || "Actividad"}`);
        if (activity.text) lines.push(`       ${activity.text}`);
        if (activity.tip) lines.push(`       Tip: ${activity.tip}`);
        if (activity.prompt) lines.push(`       Instrucción: ${activity.prompt}`);
        if (activity.question) {
          lines.push(`       Pregunta: ${activity.question}`);
          (activity.options || []).forEach((opt, optIndex) => lines.push(`       - ${String.fromCharCode(65 + optIndex)}. ${opt}`));
        }
      });
    });
    lines.push("");
    lines.push("NOTA");
    lines.push("Este material corresponde al contenido educativo revisado dentro de IMPERIA.");
    return lines.join("\n");
  };

  const downloadCourse = (courseId) => {
    const user = ImperiaStore.currentUser();
    const course = IMPERIA_DATA.courses.find(c => c.id === courseId);
    if (!user || !course) {
      toast("Curso no disponible.");
      return;
    }
    const completed = user.progress?.completedCourses?.includes(course.id);
    if (!completed) {
      toast("Debes culminar el curso para descargar el material.");
      state.selectedCourse = course.id;
      state.view = "courses";
      render();
      return;
    }
    const content = courseDownloadTemplate(user, course);
    downloadBlob(content, `Curso_IMPERIA_${slugify(course.title)}.txt`);
    toast("Material del curso descargado.");
  };

  window.addEventListener("hashchange", () => {
    const nextView = (location.hash || "").replace("#", "");
    if (validViews.includes(nextView) && nextView !== state.view) {
      state.view = nextView;
      state.selectedCourse = null;
      state.selectedModule = null;
      render();
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    window.setTimeout(() => document.body.classList.add("splash-done"), 1450);
    window.setTimeout(() => {
      const splash = document.getElementById("imperiaSplash");
      if (splash) splash.remove();
    }, 2050);
    render();
  });
  return { render };
})();
window.App = App;
