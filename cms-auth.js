(function () {
  const CMS_API_URL = window.KSS_CMS_API_URL || "https://kankai-school-cms.onrender.com";
  const SESSION_KEY = "kss-cms-session";
  const LOCK_KEY = "kss-cms-lock";
  const ATTEMPT_KEY = "kss-cms-attempts";
  const SESSION_MS = 30 * 60 * 1000;
  const LOCK_MS = 5 * 60 * 1000;
  const path = location.pathname.slice(location.pathname.lastIndexOf("/") + 1);

  function now() {
    return Date.now();
  }

  function readJson(key) {
    try {
      return JSON.parse(sessionStorage.getItem(key) || localStorage.getItem(key) || "null");
    } catch {
      return null;
    }
  }

  function writeSession(user) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      role: user?.role || "Owner",
      email: user?.email || "admin",
      issuedAt: now(),
      expiresAt: now() + SESSION_MS,
      csrf: crypto.randomUUID ? crypto.randomUUID() : String(now())
    }));
  }

  function validSession() {
    const session = readJson(SESSION_KEY);
    return Boolean(session && session.expiresAt > now());
  }

  function audit(action, detail) {
    const logs = JSON.parse(localStorage.getItem("kss-cms-audit") || "[]");
    logs.unshift({ action, detail, at: new Date().toISOString(), user: detail?.user || "anonymous" });
    localStorage.setItem("kss-cms-audit", JSON.stringify(logs.slice(0, 50)));
  }

  if (path === "admin.html" && !validSession()) {
    location.replace("kss-secure-cms-gate-83.html");
    return;
  }

  if (path === "admin.html") {
    document.documentElement.classList.add("cms-authenticated");
    window.kssCmsAuth = {
      logout() {
        audit("logout", { user: readJson(SESSION_KEY)?.email || "admin" });
        fetch(`${CMS_API_URL}/api/auth/logout`, {
          method: "POST",
          credentials: "include"
        }).catch(() => {});
        sessionStorage.removeItem(SESSION_KEY);
        location.replace("kss-secure-cms-gate-83.html");
      },
      audit,
      session: readJson(SESSION_KEY)
    };
  }

  if (path !== "kss-secure-cms-gate-83.html") return;

  window.addEventListener("DOMContentLoaded", () => {
    const form = document.querySelector("#adminLogin");
    const message = document.querySelector("#loginMessage");
    const credentialFields = [form.schoolAccessId, form.schoolAccessSecret];
    function clearCredentialFields() {
      credentialFields.forEach((field) => {
        if (document.activeElement !== field) field.value = "";
      });
    }
    form.reset();
    clearCredentialFields();
    setTimeout(clearCredentialFields, 100);
    setTimeout(clearCredentialFields, 750);
    setTimeout(clearCredentialFields, 1500);
    credentialFields.forEach((field) => {
      field.addEventListener("focus", () => field.removeAttribute("readonly"));
      field.addEventListener("pointerdown", () => field.removeAttribute("readonly"));
      field.addEventListener("keydown", () => field.removeAttribute("readonly"));
    });
    const lock = readJson(LOCK_KEY);
    if (lock?.until > now()) {
      message.textContent = "Too many attempts. Try again later.";
      form.querySelector("button").disabled = true;
      return;
    }

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const email = form.schoolAccessId.value.trim().toLowerCase();
      const password = form.schoolAccessSecret.value;
      const otp = form.schoolAccessCode.value.trim();
      const attempts = Number(localStorage.getItem(ATTEMPT_KEY) || "0");
      const button = form.querySelector("button");

      button.disabled = true;
      message.textContent = "Signing in...";

      try {
        const response = await fetch(`${CMS_API_URL}/api/auth/login`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            twoFactorCode: otp || undefined
          })
        });

        if (!response.ok) throw new Error("Invalid login details.");

        const profile = await fetch(`${CMS_API_URL}/api/auth/me`, {
          credentials: "include"
        }).then((res) => res.ok ? res.json() : null).catch(() => null);

        sessionStorage.clear();
        localStorage.removeItem(ATTEMPT_KEY);
        writeSession(profile?.user);
        audit("login_success", { user: email });
        location.replace("admin.html");
        return;
      } catch {
        button.disabled = false;
      }

      const nextAttempts = attempts + 1;
      localStorage.setItem(ATTEMPT_KEY, String(nextAttempts));
      audit("login_failed", { user: email || "unknown" });
      if (nextAttempts >= 5) {
        localStorage.setItem(LOCK_KEY, JSON.stringify({ until: now() + LOCK_MS }));
        message.textContent = "Too many attempts. Try again later.";
        button.disabled = true;
      } else {
        message.textContent = "Invalid login details.";
      }
    });
  });
})();
