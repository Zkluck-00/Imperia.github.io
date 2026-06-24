const IMPERIA_STORE_KEY = "imperia_final_profesional_v5_professional_fix";

const ImperiaStore = (() => {
  const defaultState = {
    accounts: [],
    currentUserId: null,
    createdAt: new Date().toISOString()
  };


  const demoAccounts = [
    {
      id: "demo_estudiante",
      fullName: "Camila Torres",
      email: "demo.estudiante@gmail.com",
      gender: "Femenino",
      birthdate: "2004-05-14",
      userType: "Estudiante",
      plan: "free",
      xp: 180,
      coins: 220,
      level: 2,
      password: "123456"
    },
    {
      id: "demo_emprendedor",
      fullName: "Luis Ramírez",
      email: "demo.emprendedor@gmail.com",
      gender: "Masculino",
      birthdate: "1992-09-20",
      userType: "Emprendedor",
      plan: "free",
      xp: 460,
      coins: 390,
      level: 3,
      password: "123456"
    },
    {
      id: "demo_premium",
      fullName: "Andrea Vargas",
      email: "demo.premium@gmail.com",
      gender: "Femenino",
      birthdate: "1988-12-03",
      userType: "Trabajador",
      plan: "premium",
      xp: 980,
      coins: 980,
      level: 4,
      password: "123456"
    }
  ];

  const safeParse = (value, fallback) => {
    try { return JSON.parse(value) || fallback; } catch { return fallback; }
  };

  const load = () => {
    const state = safeParse(localStorage.getItem(IMPERIA_STORE_KEY), defaultState);
    if (!Array.isArray(state.accounts)) state.accounts = [];
    const changed = ensureDemoAccounts(state);
    if (changed) save(state);
    return state;
  };

  const save = (state) => localStorage.setItem(IMPERIA_STORE_KEY, JSON.stringify(state));

  const uid = () => "usr_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

  const textHashFallback = (text) => {
    let hash = 2166136261;
    for (let i = 0; i < text.length; i++) {
      hash ^= text.charCodeAt(i);
      hash += (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
    }
    return "fallback_" + (hash >>> 0).toString(16);
  };

  const hashPassword = async (password, salt) => {
    const raw = `${salt}:${password}:IMPERIA_V3`;
    if (window.crypto && window.crypto.subtle && window.TextEncoder) {
      const data = new TextEncoder().encode(raw);
      const digest = await crypto.subtle.digest("SHA-256", data);
      return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, "0")).join("");
    }
    return textHashFallback(raw);
  };

  const currentUser = () => {
    const state = load();
    return state.accounts.find(a => a.id === state.currentUserId) || null;
  };

  const setCurrentUser = (id) => {
    const state = load();
    state.currentUserId = id;
    save(state);
  };

  const updateUser = (patch) => {
    const state = load();
    const index = state.accounts.findIndex(a => a.id === state.currentUserId);
    if (index < 0) return null;
    state.accounts[index] = { ...state.accounts[index], ...patch, updatedAt: new Date().toISOString() };
    save(state);
    return state.accounts[index];
  };

  const addXpCoins = (xp, coins, reason) => {
    const user = currentUser();
    if (!user) return null;
    const completedRewards = user.completedRewards || [];
    if (reason && completedRewards.includes(reason)) return user;
    const nextXp = (user.xp || 0) + xp;
    const nextCoins = (user.coins || 0) + coins;
    const nextLevel = levelFromXp(nextXp);
    return updateUser({
      xp: nextXp,
      coins: nextCoins,
      level: nextLevel,
      completedRewards: reason ? [...completedRewards, reason] : completedRewards
    });
  };

  const levelFromXp = (xp) => {
    if (xp >= 1200) return 5;
    if (xp >= 800) return 4;
    if (xp >= 450) return 3;
    if (xp >= 180) return 2;
    return 1;
  };

  const levelName = (level) => (["", "Einstein Aprendiz", "Einstein Emprendedor", "Einstein Empresario", "Einstein Inversionista", "Einstein Magnate"])[level] || "Einstein Aprendiz";

  const hasPremium = (user) => !!(user && user.plan === "premium" && user.subscription?.status === "active");

  const hasCourseAccess = (user, courseId) => !!(user?.paidCourses || []).includes(courseId);

  const livesToday = (user) => {
    const progress = user?.progress || makeProgress();
    if (hasPremium(user)) return { value: "∞", max: "∞", unlimited: true };
    const todayKey = new Date().toISOString().slice(0, 10);
    const lives = progress.lives || { date: todayKey, value: 5, max: 5 };
    if (lives.date !== todayKey) return { date: todayKey, value: 5, max: 5, unlimited: false };
    return { ...lives, unlimited: false };
  };

  const setLives = (value) => {
    const user = currentUser();
    if (!user || hasPremium(user)) return currentUser();
    const todayKey = new Date().toISOString().slice(0, 10);
    const lives = user.progress?.lives || { date: todayKey, value: 5, max: 5 };
    updateProgress({ lives: { date: todayKey, value: Math.max(0, Math.min(lives.max || 5, value)), max: lives.max || 5 } });
    return currentUser();
  };

  const gainLife = () => {
    const user = currentUser();
    if (!user || hasPremium(user)) return currentUser();
    const lives = livesToday(user);
    return setLives((Number(lives.value) || 0) + 1);
  };

  const consumeLife = () => {
    const user = currentUser();
    if (!user || hasPremium(user)) return true;
    const lives = livesToday(user);
    if ((Number(lives.value) || 0) <= 0) return false;
    setLives((Number(lives.value) || 0) - 1);
    return true;
  };

  const makeProgress = () => ({
    completedModules: [],
    completedCourses: [],
    activityHistory: [],
    purchasedItems: ["lab-coat"],
    equippedItem: "lab-coat",
    certificates: [],
    paidCertificates: [],
    lives: { date: new Date().toISOString().slice(0, 10), value: 5, max: 5 },
    attendance: {},
    missions: {},
    streak: 1,
    lastActiveDate: new Date().toISOString().slice(0, 10)
  });


  const ensureDemoAccounts = (state) => {
    let changed = false;
    demoAccounts.forEach(demo => {
      const exists = state.accounts.some(a => a.email === demo.email);
      if (!exists) {
        state.accounts.push({
          id: demo.id,
          fullName: demo.fullName,
          email: demo.email,
          phone: "",
          gender: demo.gender,
          birthdate: demo.birthdate,
          region: "Piura",
          userType: demo.userType,
          goal: "Ahorrar mejor",
          dailyTime: "10 minutos",
          knowledge: "Estoy empezando",
          interests: ["Finanzas personales", "Créditos"],
          plan: demo.plan,
          xp: demo.xp,
          coins: demo.coins,
          level: demo.level,
          isDemo: true,
          demoPassword: demo.password,
          passwordSalt: "demo_salt_" + demo.id,
          passwordHash: "demo_local_account",
          acceptedTerms: true,
          subscription: demo.plan === "premium"
            ? { status: "active", startedAt: new Date().toISOString(), nextBillingAt: null, lastPayment: { amount: "S/ 25.00", method: "Demo" } }
            : { status: "free", startedAt: null, nextBillingAt: null, lastPayment: null },
          paidCourses: [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          loginAttempts: 0,
          progress: makeProgress(),
          completedRewards: []
        });
        changed = true;
      }
    });
    return changed;
  };

  const createAccount = async (payload) => {
    const state = load();
    const normalizedEmail = payload.email.trim().toLowerCase();
    const normalizedPhone = (payload.phone || "").replace(/\D/g, "");
    if (state.accounts.some(a => a.email === normalizedEmail)) {
      throw new Error("Este correo ya tiene una cuenta registrada.");
    }
    if (normalizedPhone && state.accounts.some(a => a.phone === normalizedPhone)) {
      throw new Error("Este celular ya tiene una cuenta registrada.");
    }
    const salt = uid();
    const passwordHash = await hashPassword(payload.password, salt);
    const account = {
      id: uid(),
      fullName: payload.fullName.trim(),
      email: normalizedEmail,
      phone: normalizedPhone,
      gender: payload.gender || "",
      birthdate: payload.birthdate,
      region: payload.region || "Piura",
      userType: payload.userType || "Estudiante",
      goal: payload.goal || "Ahorrar mejor",
      dailyTime: payload.dailyTime || "10 minutos",
      knowledge: payload.knowledge || "Estoy empezando",
      interests: payload.interests || ["Finanzas personales"],
      plan: "free",
      xp: 0,
      coins: 120,
      level: 1,
      passwordSalt: salt,
      passwordHash,
      acceptedTerms: true,
      subscription: { status: "free", startedAt: null, nextBillingAt: null, lastPayment: null },
      paidCourses: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      loginAttempts: 0,
      progress: makeProgress(),
      completedRewards: []
    };
    state.accounts.push(account);
    state.currentUserId = account.id;
    save(state);
    return account;
  };

  const login = async (identifier, password) => {
    const state = load();
    const raw = identifier.trim().toLowerCase();
    const normalizedPhone = raw.replace(/\D/g, "");
    const account = state.accounts.find(a => a.email === raw || (normalizedPhone && a.phone === normalizedPhone));
    if (!account) throw new Error("No encontramos una cuenta con ese correo.");
    let passwordOk = false;
    if (account.isDemo) {
      passwordOk = password === account.demoPassword;
    } else {
      const testHash = await hashPassword(password, account.passwordSalt);
      passwordOk = testHash === account.passwordHash;
    }
    if (!passwordOk) {
      account.loginAttempts = (account.loginAttempts || 0) + 1;
      save(state);
      throw new Error("La contraseña no coincide.");
    }
    account.loginAttempts = 0;
    account.progress = account.progress || makeProgress();
    account.subscription = account.subscription || { status: "free", startedAt: null, nextBillingAt: null, lastPayment: null };
    account.paidCourses = account.paidCourses || [];
    if (account.plan === "premium" && account.subscription.status !== "active") account.plan = "free";
    account.updatedAt = new Date().toISOString();
    state.currentUserId = account.id;
    save(state);
    return account;
  };


  const continueAsGuest = () => {
    const state = load();
    let guest = state.accounts.find(a => a.isGuest === true);
    if (!guest) {
      guest = {
        id: "guest_local",
        fullName: "Invitado IMPERIA",
        email: "invitado@imperia.local",
        phone: "",
        gender: "",
        birthdate: "",
        region: "Piura",
        userType: "Invitado",
        goal: "Explorar la plataforma",
        dailyTime: "10 minutos",
        knowledge: "Estoy empezando",
        interests: ["Finanzas personales"],
        plan: "free",
        xp: 0,
        coins: 80,
        level: 1,
        isGuest: true,
        acceptedTerms: true,
        subscription: { status: "free", startedAt: null, nextBillingAt: null, lastPayment: null },
        paidCourses: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        progress: makeProgress(),
        completedRewards: []
      };
      state.accounts.push(guest);
    }
    state.currentUserId = guest.id;
    save(state);
    return guest;
  };

  const logout = () => setCurrentUser(null);

  const updateProgress = (progressPatch) => {
    const user = currentUser();
    if (!user) return null;
    const progress = { ...(user.progress || makeProgress()), ...progressPatch };
    return updateUser({ progress });
  };

  const completeModule = (courseId, moduleId) => {
    const user = currentUser();
    if (!user) return null;
    const progress = user.progress || makeProgress();
    const key = `${courseId}:${moduleId}`;
    if (!progress.completedModules.includes(key)) {
      const nextModules = [...progress.completedModules, key];
      const course = IMPERIA_DATA.courses.find(c => c.id === courseId);
      const moduleCount = course ? course.modules.length : 0;
      const completedForCourse = nextModules.filter(k => k.startsWith(courseId + ":")).length;
      let nextCompletedCourses = progress.completedCourses || [];
      let nextCertificates = progress.certificates || [];
      const patch = { completedModules: nextModules };
      if (course && completedForCourse >= moduleCount && !nextCompletedCourses.includes(courseId)) {
        nextCompletedCourses = [...nextCompletedCourses, courseId];
        nextCertificates = [...nextCertificates, {
          id: "CERT-" + courseId.toUpperCase().slice(0, 4) + "-" + Math.random().toString(36).slice(2, 8).toUpperCase(),
          courseId,
          issuedAt: new Date().toISOString(),
          paid: false,
          price: "S/ 35.00",
          status: "pending-payment"
        }];
        patch.completedCourses = nextCompletedCourses;
        patch.certificates = nextCertificates;
      }
      updateProgress(patch);
      const lessonCoins = course && course.plan === "free" ? 5 : 15;
      addXpCoins(30, lessonCoins, `module:${key}`);
      if (course && completedForCourse >= moduleCount) addXpCoins(course.xp, course.plan === "free" ? 0 : course.coins, `course:${courseId}`);
    }
    return currentUser();
  };

  const buyItem = (itemId) => {
    const user = currentUser();
    if (!user) throw new Error("Debes iniciar sesión.");
    const item = IMPERIA_DATA.storeItems.find(i => i.id === itemId);
    if (!item) throw new Error("El artículo no existe.");
    if (item.plan === "premium" && !hasPremium(user)) throw new Error("Este artículo requiere IMPERIA PRO.");
    const progress = user.progress || makeProgress();
    if (progress.purchasedItems.includes(itemId)) {
      updateProgress({ equippedItem: itemId });
      return currentUser();
    }
    if ((user.coins || 0) < item.price) throw new Error("No tienes suficientes ImperiaCoins.");
    updateUser({ coins: user.coins - item.price });
    updateProgress({ purchasedItems: [...progress.purchasedItems, itemId], equippedItem: itemId });
    return currentUser();
  };


  const activatePremium = (payment) => {
    const user = currentUser();
    if (!user) throw new Error("Debes iniciar sesión para activar IMPERIA PRO.");
    const paidAt = new Date();
    const nextBilling = new Date(paidAt);
    nextBilling.setMonth(nextBilling.getMonth() + 1);
    const paymentId = "PAY-IMP-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const alreadyActive = hasPremium(user);
    return updateUser({
      plan: "premium",
      subscription: {
        status: "active",
        startedAt: user.subscription?.startedAt || paidAt.toISOString(),
        nextBillingAt: nextBilling.toISOString(),
        lastPayment: {
          id: paymentId,
          method: payment.method,
          methodLabel: payment.methodLabel,
          reference: payment.reference,
          amount: payment.amount || "S/ 25.00",
          discount: payment.discount || null,
          referralCode: payment.referralCode || "",
          paidAt: paidAt.toISOString()
        }
      }
    });
  };


  const buyCourse = (courseId, payment = {}) => {
    const user = currentUser();
    if (!user) throw new Error("Debes iniciar sesión para comprar un curso.");
    const course = IMPERIA_DATA.courses.find(c => c.id === courseId);
    if (!course) throw new Error("El curso no existe.");
    const paidCourses = user.paidCourses || [];
    if (paidCourses.includes(courseId)) return user;
    const paymentId = "CUR-IMP-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    return updateUser({
      paidCourses: [...paidCourses, courseId],
      lastCoursePayment: { id: paymentId, courseId, amount: payment.amount || "S/ 80.00", method: payment.method || "simulado", methodLabel: payment.methodLabel || "Simulado", reference: payment.reference || "Local", paidAt: new Date().toISOString(), status: "approved-demo" }
    });
  };

  const buyCertificate = (certId) => {
    const user = currentUser();
    if (!user) throw new Error("Debes iniciar sesión para pagar el certificado.");
    const progress = user.progress || makeProgress();
    const certificates = progress.certificates || [];
    const cert = certificates.find(c => c.id === certId);
    if (!cert) throw new Error("Certificado no disponible. Primero culmina el curso.");
    if (cert.paid) return user;
    const paymentId = "CERT-IMP-" + Math.random().toString(36).slice(2, 8).toUpperCase();
    const nextCertificates = certificates.map(c => c.id === certId
      ? { ...c, paid: true, status: "paid", paidAt: new Date().toISOString(), paymentId, amount: "S/ 35.00" }
      : c
    );
    const paidCertificates = Array.from(new Set([...(progress.paidCertificates || []), certId]));
    updateProgress({ certificates: nextCertificates, paidCertificates });
    return updateUser({
      lastCertificatePayment: {
        id: paymentId,
        certId,
        courseId: cert.courseId,
        amount: "S/ 35.00",
        paidAt: new Date().toISOString(),
        status: "approved-demo"
      }
    });
  };

  const resetDemo = () => {
    localStorage.removeItem(IMPERIA_STORE_KEY);
  };

  return {
    load, save, currentUser, setCurrentUser, updateUser, createAccount, login, continueAsGuest, logout,
    updateProgress, completeModule, buyItem, addXpCoins, activatePremium, buyCourse, buyCertificate, hasCourseAccess, livesToday, consumeLife, gainLife, resetDemo, levelName, levelFromXp, hasPremium, makeProgress
  };
})();
