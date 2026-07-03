(function () {
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

  function writeSession() {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({
      role: "Owner",
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
        audit("logout", { user: "vishalregmi82@gmail.com" });
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
    const lock = readJson(LOCK_KEY);
    if (lock?.until > now()) {
      message.textContent = "Too many attempts. Try again later.";
      form.querySelector("button").disabled = true;
      return;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const email = form.email.value.trim().toLowerCase();
      const password = form.password.value;
      const otp = form.otp.value.trim();
      const attempts = Number(localStorage.getItem(ATTEMPT_KEY) || "0");

      if (email === "vishalregmi82@gmail.com" && password === "ChangeMe!2083" && (!otp || otp === "123456")) {
        sessionStorage.clear();
        localStorage.removeItem(ATTEMPT_KEY);
        writeSession();
        audit("login_success", { user: email });
        location.replace("admin.html");
        return;
      }

      const nextAttempts = attempts + 1;
      localStorage.setItem(ATTEMPT_KEY, String(nextAttempts));
      audit("login_failed", { user: email || "unknown" });
      if (nextAttempts >= 5) {
        localStorage.setItem(LOCK_KEY, JSON.stringify({ until: now() + LOCK_MS }));
        message.textContent = "Too many attempts. Try again later.";
        form.querySelector("button").disabled = true;
      } else {
        message.textContent = "Invalid login details.";
      }
    });
  });
})();
