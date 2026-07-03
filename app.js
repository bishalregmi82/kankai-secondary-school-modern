const cmsConfig = {
  activeLanguage: localStorage.getItem("kss-language") || "en",
  fallbackLanguage: "en",
  missingTranslationBehavior: "fallback",
  languages: [
    { code: "en", name: "English", status: "published" },
    { code: "np", name: "Nepali", status: "published" }
  ]
};

const CMS_API_URL = window.KSS_CMS_API_URL || window.kssCmsAuth?.apiUrl || "https://kankai-school-cms.onrender.com";
const CMS_SESSION_KEY = "kss-cms-session";
let noticesLoadedFromCms = false;

function escapeHtml(value = "") {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[char]));
}

function readCmsSession() {
  try {
    return JSON.parse(sessionStorage.getItem(CMS_SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

async function cmsFetch(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  if (options.body && !(options.body instanceof FormData)) headers["Content-Type"] = "application/json";
  const csrf = window.kssCmsAuth?.csrf?.() || readCmsSession()?.csrf;
  if (csrf && options.method && options.method !== "GET") headers["x-csrf-token"] = csrf;
  const response = await fetch(`${CMS_API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include"
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) throw new Error(payload?.error || "CMS request failed");
  return payload;
}

const translations = {
  en: {
    nav: { about: "About", academics: "Academics", admission: "Admission", notices: "Notices", events: "Events", faculty: "Faculty", results: "Results", admin: "Admin" },
    heroTitle: "Kankai Secondary School",
    heroSubtitle: "Learning, character and community for Surunga.",
    homeAboutTitle: "A public institution rooted in Surunga and built for the future.",
    homeAboutP1: "Kankai Secondary School is a pioneer community school in Surunga, Kankai Municipality, Jhapa. It serves learners from the town and surrounding villages, with programs from early grades through secondary level and an inclusive pathway for hearing-impaired students.",
    homeAboutP2: "This homepage is now the About page: a focused introduction to the school, its values, and its public education role. Other major areas open as their own pages from the navigation.",
    principalTitle: "Principal's Message",
    principalBody: "Our mission is to create disciplined, confident and compassionate learners ready to contribute to Nepal and the world.",
    historyTitle: "Milestones that define Kankai.",
    academicsH1: "Programs, curriculum and learning pathways.",
    academicsIntro: "Dedicated page for Nursery, Kindergarten, Primary, Lower Secondary, Secondary, English Medium, Nepali Medium, departments, calendar and examination system.",
    admissionH1: "Apply online and track the admission process.",
    admissionIntro: "Admission process, required documents, fee notes, scholarship, transportation, FAQs and prospectus download live here.",
    noticesH1: "Search, filter, print and share school notices.",
    noticesIntro: "Pinned notices, PDF attachments, images, archives, publish dates and expiry dates are designed for CMS publishing.",
    eventsH1: "Upcoming events, past programs and school achievements.",
    eventsIntro: "Annual day, sports, competitions, SEE results, photo gallery and video gallery are organized here.",
    facultyH1: "Select a faculty group.",
    facultyIntro: "Each faculty group opens its own page with teacher cards, qualifications, experience, subject focus and department context.",
    resultsH1: "Secure result lookup for students and guardians.",
    resultsIntro: "Search by student ID, symbol number or class. Production mode includes printable mark sheets and access logs.",
    adminH1: "Everything editable from one calm dashboard.",
    adminIntro: "Homepage content, notices, events, teacher management, media library, results, downloads, SEO, roles and audit logs.",
    footerSchool: "Kankai Secondary School",
    footerBody: "Modern learning, inclusive values and service to Surunga, Jhapa.",
    quickLinks: "Quick Links",
    connect: "Connect",
    staffLogin: "Staff login",
    currentWebsite: "Current website"
  },
  np: {
    nav: { about: "हाम्रो बारेमा", academics: "शैक्षिक", admission: "भर्ना", notices: "सूचना", events: "कार्यक्रम", faculty: "संकाय", results: "नतिजा", admin: "प्रशासन" },
    heroTitle: "कन्काई माध्यमिक विद्यालय",
    heroSubtitle: "सुरुङ्गाका लागि सिकाइ, चरित्र र समुदाय।",
    homeAboutTitle: "सुरुङ्गामा जरा गाडेको र भविष्यका लागि तयार सार्वजनिक संस्था।",
    homeAboutP1: "कन्काई माध्यमिक विद्यालय सुरुङ्गा, कन्काई नगरपालिका, झापाको अग्रणी सामुदायिक विद्यालय हो। यसले सुरुङ्गा र आसपासका गाउँका विद्यार्थीलाई प्रारम्भिक तहदेखि माध्यमिक तहसम्म सेवा दिन्छ।",
    homeAboutP2: "यो गृहपृष्ठ विद्यालयको परिचय, मूल्य र सार्वजनिक शिक्षामा यसको भूमिकामा केन्द्रित छ। अन्य मुख्य क्षेत्रहरू नेभिगेसनबाट छुट्टाछुट्टै पृष्ठमा खुल्छन्।",
    principalTitle: "प्रधानाध्यापकको सन्देश",
    principalBody: "हाम्रो उद्देश्य अनुशासित, आत्मविश्वासी र संवेदनशील विद्यार्थी तयार गर्नु हो।",
    historyTitle: "कन्काईलाई चिनाउने मुख्य उपलब्धिहरू।",
    academicsH1: "कार्यक्रम, पाठ्यक्रम र सिकाइ मार्गहरू।",
    academicsIntro: "नर्सरी, किन्डरगार्टेन, प्राथमिक, निम्न माध्यमिक, माध्यमिक, अंग्रेजी माध्यम, नेपाली माध्यम, विभाग, पात्रो र परीक्षा प्रणाली यहाँ छन्।",
    admissionH1: "अनलाइन भर्ना आवेदन र प्रक्रिया ट्र्याक गर्नुहोस्।",
    admissionIntro: "भर्ना प्रक्रिया, आवश्यक कागजात, शुल्क, छात्रवृत्ति, यातायात, प्रश्नोत्तर र प्रोसपेक्टस यहाँ छन्।",
    noticesH1: "विद्यालय सूचना खोज्नुहोस्, छान्नुहोस्, प्रिन्ट गर्नुहोस् र सेयर गर्नुहोस्।",
    noticesIntro: "पिन गरिएका सूचना, PDF, तस्बिर, अभिलेख, प्रकाशन मिति र समाप्ति मिति CMS बाट व्यवस्थापन हुन्छन्।",
    eventsH1: "आगामी कार्यक्रम, विगतका गतिविधि र उपलब्धिहरू।",
    eventsIntro: "वार्षिकोत्सव, खेलकुद, प्रतियोगिता, SEE नतिजा, फोटो र भिडियो ग्यालरी यहाँ व्यवस्थित छन्।",
    facultyH1: "संकाय समूह छान्नुहोस्।",
    facultyIntro: "प्रत्येक संकाय समूहको आफ्नै पृष्ठ छ, जसमा शिक्षक, योग्यता, अनुभव र विषय विवरण छन्।",
    resultsH1: "विद्यार्थी र अभिभावकका लागि सुरक्षित नतिजा खोजी।",
    resultsIntro: "विद्यार्थी ID, सिम्बोल नम्बर वा कक्षाबाट खोज्नुहोस्। उत्पादन मोडमा प्रिन्ट गर्न मिल्ने मार्कसिट उपलब्ध हुन्छ।",
    adminH1: "सबै सामग्री एउटै सरल ड्यासबोर्डबाट सम्पादनयोग्य।",
    adminIntro: "गृहपृष्ठ सामग्री, सूचना, कार्यक्रम, शिक्षक, मिडिया, नतिजा, डाउनलोड, SEO, भूमिका र अडिट लग।",
    footerSchool: "कन्काई माध्यमिक विद्यालय",
    footerBody: "सुरुङ्गा, झापाका लागि आधुनिक सिकाइ र समावेशी मूल्य।",
    quickLinks: "छिटो लिंक",
    connect: "सम्पर्क",
    staffLogin: "कर्मचारी लगइन",
    currentWebsite: "हालको वेबसाइट"
  }
};

const data = {
  typing: [
    "Learning, character and community for Surunga.",
    "A modern public school experience for Jhapa.",
    "Inclusive education with discipline and care."
  ],
  timeline: [
    ["1960", "Kankai school legacy begins in Surunga's public education story."],
    ["2014", "Kankai Municipality forms by merging Ghailadubba and Surunga."],
    ["Today", "Around 3,000 learners are served yearly from Surunga and nearby villages."],
    ["Next", "Digital CMS, online admission, results, media library and multilingual access."]
  ],
  programs: [
    ["Nursery and Kindergarten", "Play-based foundations, language confidence and caring routines.", "N"],
    ["Primary", "Reading, numeracy, science curiosity and creative expression.", "P"],
    ["Lower Secondary", "Subject depth, projects, sports and guided digital literacy.", "L"],
    ["Secondary", "SEE preparation, examination discipline and career orientation.", "S"],
    ["English Medium", "English communication with strong local cultural grounding.", "EN"],
    ["Nepali Medium", "Accessible community education for families across the municipality.", "NP"]
  ],
  notices: [
    { title: { en: "Admission open for Nursery to Grade 10", np: "नर्सरीदेखि कक्षा १० सम्म भर्ना खुल्यो" }, category: { en: "Admission", np: "भर्ना" }, date: "2083-01-15", pinned: true, status: { en: "published", np: "published" } },
    { title: { en: "First terminal examination routine published", np: "पहिलो त्रैमासिक परीक्षा तालिका प्रकाशित" }, category: { en: "Exam", np: "परीक्षा" }, date: "2083-02-02", pinned: true, status: { en: "published", np: "published" } },
    { title: { en: "Scholarship document verification notice", np: "छात्रवृत्ति कागजात प्रमाणीकरण सूचना" }, category: { en: "General", np: "सामान्य" }, date: "2083-02-12", pinned: false, status: { en: "published", np: "draft" } },
    { title: { en: "Transportation route update for Surunga area", np: "सुरुङ्गा क्षेत्रको यातायात रुट अद्यावधिक" }, category: { en: "General", np: "सामान्य" }, date: "2083-02-18", pinned: false, status: { en: "published", np: "published" } },
    { title: { en: "SEE result celebration and topper felicitation", np: "" }, category: { en: "Exam", np: "परीक्षा" }, date: "2083-03-05", pinned: false, status: { en: "published", np: "draft" } }
  ],
  events: [
    ["Sports week", "Inter-house football, volleyball and athletics."],
    ["Science exhibition", "Student projects from lab and community research."],
    ["Parent interaction", "Academic planning and student wellbeing session."],
    ["Cultural program", "Dance, music, art and local heritage performance."]
  ],
  facultyCategories: [
    ["Basic ECD", "Early childhood care, play-based learning and readiness support.", "faculty-basic-ecd.html", "ECD"],
    ["Basic Level", "Foundational literacy, numeracy and integrated subject teaching.", "faculty-basic-level.html", "BL"],
    ["Science", "Lab-based science, mathematics, technology and SEE preparation.", "faculty-science.html", "SC"],
    ["Education", "Pedagogy, child development, classroom practice and learning support.", "faculty-education.html", "ED"],
    ["Humanities", "Language, social studies, civic learning and cultural expression.", "faculty-humanities.html", "HU"],
    ["Management", "Accounting, economics, entrepreneurship and leadership studies.", "faculty-management.html", "MG"]
  ],
  facultyDetails: {
    "basic-ecd": [
      ["Mina Karki", "Early Childhood Facilitator", "B.Ed., 10 years", "Play-based foundations"],
      ["Saraswati Poudel", "ECD Teacher", "Diploma ECD, 8 years", "Language readiness"],
      ["Rupa Thapa", "Care and Activity Lead", "B.Ed., 6 years", "Motor skills and art"]
    ],
    "basic-level": [
      ["Prakash Adhikari", "Basic Level Coordinator", "M.A., 11 years", "Social Studies"],
      ["Sita Rai", "English Teacher", "M.A., 9 years", "English language"],
      ["Nirmala Khadka", "Primary Teacher", "B.Ed., 7 years", "Integrated curriculum"]
    ],
    science: [
      ["Anita Sharma", "Science Department", "M.Ed., 12 years", "Biology and lab work"],
      ["Raj Kumar Mainali", "Mathematics", "M.Sc., 15 years", "Mathematics"],
      ["Bikash Limbu", "Computer", "BIT, 7 years", "Computer science"]
    ],
    education: [
      ["Kamala Dahal", "Education Faculty", "M.Ed., 13 years", "Pedagogy"],
      ["Hari Prasad Nepal", "Teaching Practice", "M.Ed., 16 years", "Curriculum studies"],
      ["Sunita Subedi", "Assessment Lead", "B.Ed., 9 years", "Educational evaluation"]
    ],
    humanities: [
      ["Sita Rai", "English", "M.A., 9 years", "English literature"],
      ["Prakash Adhikari", "Social Studies", "M.A., 11 years", "Civics and history"],
      ["Mohan Bista", "Nepali", "M.A., 12 years", "Nepali language"]
    ],
    management: [
      ["Ramesh Ghimire", "Accountancy", "MBS, 10 years", "Accounting"],
      ["Sabina Pathak", "Economics", "M.A., 8 years", "Economics"],
      ["Dinesh Kafle", "Business Studies", "MBA, 7 years", "Entrepreneurship"]
    ]
  },
  facilities: [
    ["Science Lab", "Practical experiments and guided exploration.", "SL"],
    ["Computer Lab", "Digital literacy, typing, research and coding basics.", "CL"],
    ["Library", "Reading culture, references and quiet study.", "LB"],
    ["Transportation", "Route management for surrounding communities.", "TR"],
    ["Playground", "Sports, assembly and physical wellbeing.", "PG"],
    ["Smart Classroom", "Multimedia lessons and interactive teaching.", "SC"]
  ],
  gallery: [
    ["Campus life", "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80"],
    ["Library", "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80"],
    ["Lab work", "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=900&q=80"],
    ["Sports", "https://images.unsplash.com/photo-1526232761682-d26e03ac148e?auto=format&fit=crop&w=900&q=80"],
    ["Graduation", "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=900&q=80"]
  ]
};

const mediaLibrary = {
  hero: {
    mode: "per-language",
    alt: { en: "Students walking across a bright school campus", np: "उज्यालो विद्यालय परिसरमा हिँडिरहेका विद्यार्थीहरू" },
    image: {
      en: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=2200&q=80",
      np: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=2200&q=80"
    }
  },
  prospectus: {
    mode: "per-language",
    file: { en: "prospectus-en.pdf", np: "prospectus-np.pdf" }
  }
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

ensureLanguageSwitcher();

window.addEventListener("load", () => {
  $("#loader")?.classList.add("done");
  startTyping();
  animateCounters();
  enableInlineEditingPreview();
});

function ensureLanguageSwitcher() {
  if ($("#langToggle")) return;
  const actions = $(".nav-actions");
  if (!actions) return;
  const button = document.createElement("button");
  button.className = "icon-btn";
  button.id = "langToggle";
  button.type = "button";
  button.setAttribute("aria-label", "Switch language");
  button.textContent = cmsConfig.activeLanguage.toUpperCase();
  actions.insertBefore(button, actions.firstChild);
}

function hasAdminPreviewSession() {
  try {
    const session = JSON.parse(sessionStorage.getItem("kss-cms-session") || "null");
    return Boolean(session?.expiresAt && session.expiresAt > Date.now());
  } catch {
    return false;
  }
}

function enableInlineEditingPreview() {
  if (!hasAdminPreviewSession() || location.pathname.endsWith("admin.html")) return;
  document.documentElement.classList.add("cms-authenticated");
  const editableSelectors = "h1, h2, h3, p, .btn, .brand strong, .footer a, .nav-links a, img, .hero-media, section";
  $$(editableSelectors).forEach((node, index) => {
    if (node.closest(".site-header") && node.matches("section")) return;
    node.setAttribute("data-cms-key", node.getAttribute("data-cms-key") || `cms.item.${index}`);
    node.classList.add("cms-editable");
    const label = node.matches("img,.hero-media") ? "Replace Image" : node.matches("section") ? "Edit Section" : node.matches("a,.btn") ? "Edit Link" : "Edit";
    node.setAttribute("data-cms-label", label);
  });
}

document.addEventListener("scroll", () => {
  const progress = $("#progress");
  if (!progress) return;
  const total = document.documentElement.scrollHeight - innerHeight;
  progress.style.width = `${total > 0 ? (scrollY / total) * 100 : 0}%`;
});

$("#navToggle")?.addEventListener("click", () => {
  const links = $("#navLinks");
  links?.classList.toggle("open");
  $("#navToggle").setAttribute("aria-expanded", links?.classList.contains("open") ? "true" : "false");
});

$("#themeToggle")?.addEventListener("click", () => {
  document.documentElement.dataset.theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
});

let currentLang = cmsConfig.activeLanguage;
$("#langToggle")?.addEventListener("click", () => {
  const published = cmsConfig.languages.filter((language) => language.status === "published");
  const index = published.findIndex((language) => language.code === currentLang);
  currentLang = published[(index + 1) % published.length].code;
  localStorage.setItem("kss-language", currentLang);
  applyLanguage();
  render();
});

function startTyping() {
  const node = $("#typing");
  if (!node) return;
  let phrase = 0;
  let char = 0;
  setInterval(() => {
    node.textContent = data.typing[phrase].slice(0, char);
    char += 1;
    if (char > data.typing[phrase].length + 12) {
      phrase = (phrase + 1) % data.typing.length;
      char = 0;
    }
  }, 70);
}

function t(key) {
  const active = translations[currentLang]?.[key];
  const fallback = translations[cmsConfig.fallbackLanguage]?.[key];
  if (active) return active;
  if (cmsConfig.missingTranslationBehavior === "blank") return "";
  if (cmsConfig.missingTranslationBehavior === "placeholder") return `[Missing ${currentLang}: ${key}]`;
  return fallback || "";
}

function localized(value) {
  if (value == null) return "";
  if (typeof value !== "object") return value;
  const active = value[currentLang];
  const fallback = value[cmsConfig.fallbackLanguage];
  if (active) return active;
  if (cmsConfig.missingTranslationBehavior === "blank") return "";
  if (cmsConfig.missingTranslationBehavior === "placeholder") return `[Missing ${currentLang}]`;
  return fallback || "";
}

function applyLanguage() {
  document.documentElement.lang = currentLang === "np" ? "ne" : currentLang;
  $("#langToggle") && ($("#langToggle").textContent = currentLang.toUpperCase());
  const nav = translations[currentLang]?.nav || translations.en.nav;
  Object.entries({
    "index.html": nav.about,
    "academics.html": nav.academics,
    "admission.html": nav.admission,
    "notices.html": nav.notices,
    "events.html": nav.events,
    "faculty.html": nav.faculty,
    "results.html": nav.results,
    "admin.html": nav.admin
  }).forEach(([href, label]) => {
    $$(`.nav-links a[href="${href}"]`).forEach((node) => node.textContent = label);
  });
  const pageMap = {
    "/index.html": ["heroTitle", "heroSubtitle"],
    "/academics.html": ["academicsH1", "academicsIntro"],
    "/admission.html": ["admissionH1", "admissionIntro"],
    "/notices.html": ["noticesH1", "noticesIntro"],
    "/events.html": ["eventsH1", "eventsIntro"],
    "/faculty.html": ["facultyH1", "facultyIntro"],
    "/results.html": ["resultsH1", "resultsIntro"],
    "/admin.html": ["adminH1", "adminIntro"]
  };
  const path = location.pathname.endsWith("/") ? "/index.html" : location.pathname.slice(location.pathname.lastIndexOf("/"));
  const pageKeys = pageMap[path];
  if (pageKeys) {
    const [h1Key, introKey] = pageKeys;
    $("h1") && ($("h1").textContent = t(h1Key));
    $(".page-hero p") && ($(".page-hero p").textContent = t(introKey));
  }
  $("#typing") && ($("#typing").textContent = t("heroSubtitle"));
  const heroMedia = $(".hero-media");
  if (heroMedia) {
    heroMedia.style.backgroundImage = `url("${localized(mediaLibrary.hero.image)}")`;
    heroMedia.setAttribute("aria-label", localized(mediaLibrary.hero.alt));
  }
  const aboutTitle = $("#about .copy h2");
  if (aboutTitle) aboutTitle.textContent = t("homeAboutTitle");
  const aboutParagraphs = $$("#about .copy p");
  if (aboutParagraphs[0]) aboutParagraphs[0].textContent = t("homeAboutP1");
  if (aboutParagraphs[1]) aboutParagraphs[1].textContent = t("homeAboutP2");
  const principalTitle = $(".principal-card h3");
  if (principalTitle) principalTitle.textContent = t("principalTitle");
  const principalBody = $(".principal-card p");
  if (principalBody) principalBody.textContent = t("principalBody");
  const footerTitle = $(".footer h2");
  if (footerTitle) footerTitle.textContent = t("footerSchool");
  const footerBody = $(".footer p");
  if (footerBody) footerBody.textContent = t("footerBody");
  $$(".footer h3").forEach((node) => {
    if (node.textContent.includes("Quick") || node.textContent.includes("Pages")) node.textContent = t("quickLinks");
    if (node.textContent.includes("Connect")) node.textContent = t("connect");
  });
  $$("[href='https://kankaiss.edu.np/']").forEach((node) => node.textContent = t("currentWebsite"));
  $$("[href='admin.html']").forEach((node) => node.textContent = t("staffLogin"));
}

function animateCounters() {
  $$("[data-count]").forEach((node) => {
    const target = Number(node.dataset.count);
    const duration = 1300;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      node.textContent = Math.floor(target * progress).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("visible");
  });
}, { threshold: .12 });
$$(".reveal").forEach((node) => observer.observe(node));

function render() {
  applyLanguage();
  loadPublicContent();
  loadPublicSeo();
  if ($("#timeline")) {
    $("#timeline").innerHTML = data.timeline.map(([year, text]) => `<article><strong>${year}</strong><p>${text}</p></article>`).join("");
  }
  if ($("#programGrid")) {
    $("#programGrid").innerHTML = data.programs.map(([title, text, icon]) => `<article class="program-card"><span class="icon">${icon}</span><h3>${title}</h3><p>${text}</p></article>`).join("");
  }
  if ($("#admissionSteps")) {
    $("#admissionSteps").innerHTML = ["Online inquiry", "Document verification", "Level interaction", "Admission confirmation"].map((step, i) => `<article><span>${i + 1}</span><div><h3>${step}</h3><p>CMS-managed guidance, required documents and fee notes for guardians.</p></div></article>`).join("");
  }
  if ($("#noticeGrid")) {
    renderNotices();
    loadPublicNotices();
  }
  if ($("#eventList")) {
    $("#eventList").innerHTML = data.events.map(([title, text]) => `<article><small>Campus</small><h3>${title}</h3><p>${text}</p></article>`).join("");
    loadPublicEvents();
  }
  if ($("#facultyCategoryGrid")) {
    $("#facultyCategoryGrid").innerHTML = data.facultyCategories.map(([title, text, url, icon]) => `<a class="program-card faculty-category" href="${url}"><span class="icon">${icon}</span><h3>${title}</h3><p>${text}</p><strong>View faculty</strong></a>`).join("");
    loadPublicFaculty();
  }
  if ($("#facultyDetailGrid")) {
    const key = document.body.dataset.facultyPage;
    const teachers = data.facultyDetails[key] || [];
    $("#facultyDetailGrid").innerHTML = teachers.map(([name, role, exp, subject]) => `<article class="faculty-card"><div class="avatar">${name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div><h3>${name}</h3><p>${role}</p><small>${exp}</small><p><strong>${subject}</strong></p></article>`).join("");
    loadPublicFaculty();
  }
  if ($("#facilityGrid")) {
    $("#facilityGrid").innerHTML = data.facilities.map(([title, text, icon]) => `<article class="facility-card"><span class="icon">${icon}</span><h3>${title}</h3><p>${text}</p></article>`).join("");
  }
  if ($("#galleryGrid")) {
    $("#galleryGrid").innerHTML = data.gallery.map(([title, img]) => `<a class="gallery-item" href="${img}" target="_blank" rel="noreferrer"><img src="${img}" alt="${title}"><span>${title}</span></a>`).join("");
  }
  if ($("#adminPanel")) renderAdmin("dashboard");
}

function normalizePublicNotice(notice) {
  return {
    id: notice.id,
    slug: notice.slug,
    title: { [currentLang]: notice.title },
    body: { [currentLang]: notice.body || "" },
    category: { [currentLang]: notice.category || "General", en: notice.category || "General" },
    date: (notice.publishAt || "").slice(0, 10) || new Date().toISOString().slice(0, 10),
    pinned: Boolean(notice.pinned),
    status: { [currentLang]: "published" }
  };
}

function normalizeAdminNotice(notice) {
  const title = {};
  const body = {};
  const category = {};
  const status = {};
  (notice.translations || []).forEach((translation) => {
    const code = translation.language?.code || "en";
    title[code] = translation.title;
    body[code] = translation.body;
    category[code] = translation.category;
    status[code] = String(translation.status || "DRAFT").toLowerCase();
  });
  return {
    id: notice.id,
    slug: notice.slug,
    title: Object.keys(title).length ? title : { en: notice.title },
    body: Object.keys(body).length ? body : { en: notice.body || "" },
    category: Object.keys(category).length ? category : { en: notice.category || "General" },
    date: (notice.publishAt || "").slice(0, 10) || new Date().toISOString().slice(0, 10),
    publishAt: notice.publishAt,
    expireAt: notice.expireAt,
    pinned: Boolean(notice.pinned),
    status: Object.keys(status).length ? status : { en: "draft" }
  };
}

async function loadPublicNotices() {
  if (!$("#noticeGrid") || noticesLoadedFromCms) return;
  try {
    const payload = await cmsFetch(`/api/public/notices?lang=${encodeURIComponent(currentLang)}`);
    if (payload?.notices?.length) {
      data.notices = payload.notices.map(normalizePublicNotice);
    }
    noticesLoadedFromCms = true;
    renderNotices();
  } catch {
    noticesLoadedFromCms = true;
  }
}

async function loadPublicContent() {
  try {
    const payload = await cmsFetch(`/api/public/content?lang=${encodeURIComponent(currentLang)}&path=${encodeURIComponent(location.pathname)}`);
    Object.entries(payload.content || {}).forEach(([key, value]) => {
      if (translations[currentLang] && key in translations[currentLang]) translations[currentLang][key] = value;
    });
    applyLanguage();
  } catch {}
}

async function loadPublicSeo() {
  try {
    const path = location.pathname.endsWith("/") ? "/" : `/${location.pathname.split("/").pop()}`;
    const payload = await cmsFetch(`/api/public/seo?lang=${encodeURIComponent(currentLang)}&path=${encodeURIComponent(path)}`);
    if (!payload.seo) return;
    document.title = payload.seo.title || document.title;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", payload.seo.description || "");
  } catch {}
}

async function loadPublicEvents() {
  if (!$("#eventList")) return;
  try {
    const payload = await cmsFetch("/api/public/events");
    if (payload.events?.length) {
      data.events = payload.events.map((event) => [event.title, event.body, event.category, (event.startsAt || "").slice(0, 10)]);
      $("#eventList").innerHTML = data.events.map(([title, text, category, date]) => `<article><small>${escapeHtml(category || "Campus")} &middot; ${escapeHtml(date || "")}</small><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p></article>`).join("");
    }
  } catch {}
}

async function loadPublicFaculty() {
  if (!$("#facultyCategoryGrid") && !$("#facultyDetailGrid")) return;
  try {
    const payload = await cmsFetch("/api/public/faculty");
    if (!payload.departments?.length) return;
    const slugMap = {
      "basic ecd": "basic-ecd",
      "basic level": "basic-level",
      science: "science",
      education: "education",
      humanities: "humanities",
      management: "management"
    };
    data.facultyCategories = payload.departments.map((department) => {
      const slug = slugMap[department.name.toLowerCase()] || slugify(department.name);
      return [department.name, `${department.teachers.length} teacher records managed in CMS.`, `faculty-${slug}.html`, department.name.slice(0, 2).toUpperCase()];
    });
    data.facultyDetails = Object.fromEntries(payload.departments.map((department) => {
      const slug = slugMap[department.name.toLowerCase()] || slugify(department.name);
      return [slug, department.teachers.map((teacher) => [teacher.name, teacher.subject, teacher.qualification, teacher.experience])];
    }));
    if ($("#facultyCategoryGrid")) $("#facultyCategoryGrid").innerHTML = data.facultyCategories.map(([title, text, url, icon]) => `<a class="program-card faculty-category" href="${url}"><span class="icon">${escapeHtml(icon)}</span><h3>${escapeHtml(title)}</h3><p>${escapeHtml(text)}</p><strong>View faculty</strong></a>`).join("");
    if ($("#facultyDetailGrid")) {
      const key = document.body.dataset.facultyPage;
      const teachers = data.facultyDetails[key] || [];
      $("#facultyDetailGrid").innerHTML = teachers.map(([name, role, exp, subject]) => `<article class="faculty-card"><div class="avatar">${escapeHtml(name.split(" ").map((part) => part[0]).join("").slice(0, 2))}</div><h3>${escapeHtml(name)}</h3><p>${escapeHtml(role)}</p><small>${escapeHtml(exp)}</small><p><strong>${escapeHtml(subject)}</strong></p></article>`).join("");
    }
  } catch {}
}

function renderNotices() {
  const search = ($("#noticeSearch")?.value || "").toLowerCase();
  const filter = $("#noticeFilter")?.value || "all";
  const notices = data.notices.filter((notice) => {
    const title = localized(notice.title).toLowerCase();
    const category = localized(notice.category);
    const isPublished = notice.status?.[currentLang] === "published";
    const matchesSearch = title.includes(search);
    const matchesFilter = filter === "all" || category === filter || notice.category.en === filter;
    return isPublished && matchesSearch && matchesFilter;
  });
  $("#noticeGrid").innerHTML = notices.map((notice) => `<article class="notice-card ${notice.pinned ? "pinned" : ""}"><small>${escapeHtml(localized(notice.category))} &middot; ${escapeHtml(notice.date)}</small><h3>${escapeHtml(localized(notice.title))}</h3><p>${escapeHtml(localized(notice.body) || (notice.pinned ? "Pinned notice with language-aware PDF/image attachment support." : "Archive-ready notice with independent language publishing."))}</p><button class="text-btn" onclick="window.print()">Print notice</button></article>`).join("") || `<article class="notice-card"><h3>No notices found</h3><p>Please check another language or category.</p></article>`;
}

$("#noticeSearch")?.addEventListener("input", renderNotices);
$("#noticeFilter")?.addEventListener("change", renderNotices);

function slugify(value) {
  const slug = String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return slug || `notice-${Date.now()}`;
}

function noticeAdminTemplate() {
  return `<h3>Notice Management</h3>${languageTabs()}<p>Create, edit, schedule, pin, expire and publish multilingual notices. You are editing only the selected language tab.</p><div class="cms-notice-editor"><form id="noticeForm" class="cms-editor-grid"><input type="hidden" name="id"><label>Notice title<input name="title" required maxlength="240" placeholder="Admission notice"></label><label>Category<input name="category" required maxlength="120" placeholder="Admission"></label><label>Publish date<input name="publishAt" type="date" required></label><label>Status<select name="status"><option value="PUBLISHED">Published</option><option value="DRAFT">Draft</option><option value="SCHEDULED">Scheduled</option><option value="ARCHIVED">Archived</option></select></label><label class="check-row"><input name="pinned" type="checkbox"> Pin this notice</label><label class="wide">Notice details<textarea name="body" rows="5" placeholder="Write the full notice here."></textarea></label><div class="cms-actions wide"><button class="btn primary" type="submit">Save notice</button><button class="btn" type="button" id="noticeReset">New notice</button><span id="noticeAdminMessage" class="cms-message"></span></div></form><div class="cms-list" id="noticeAdminList"><article><span>Loading notices from CMS...</span><strong>Please wait</strong></article></div></div>`;
}

function noticeTranslationFor(notice, languageCode) {
  const translation = (notice.translations || []).find((item) => item.language?.code === languageCode);
  const fallback = (notice.translations || []).find((item) => item.language?.code === "en");
  return translation || fallback || {};
}

function renderNoticeAdminList(notices) {
  const list = $("#noticeAdminList");
  if (!list) return;
  if (!notices.length) {
    list.innerHTML = `<article><span>No notices are saved yet.</span><strong>Create the first notice above</strong></article>`;
    return;
  }
  list.innerHTML = notices.map((notice) => {
    const translation = noticeTranslationFor(notice, currentLang);
    const status = String(translation.status || "DRAFT").toLowerCase();
    return `<article><span>${escapeHtml(translation.title || notice.title || "[Missing translation]")}<small>${escapeHtml(translation.category || notice.category || "General")} &middot; ${escapeHtml((translation.publishAt || notice.publishAt || "").slice(0, 10))}</small></span><strong>${notice.pinned ? "Pinned, " : ""}${escapeHtml(status)}</strong><button class="text-btn" type="button" data-edit-notice="${notice.id}">Edit</button><button class="text-btn danger" type="button" data-delete-notice="${notice.id}">Delete</button></article>`;
  }).join("");
}

function resetNoticeForm() {
  const form = $("#noticeForm");
  if (!form) return;
  form.reset();
  form.elements.id.value = "";
  form.elements.publishAt.value = new Date().toISOString().slice(0, 10);
  form.elements.status.value = "PUBLISHED";
  $("#noticeAdminMessage").textContent = "";
}

async function loadAdminNotices() {
  try {
    const payload = await cmsFetch("/api/admin/notices");
    window.kssAdminNotices = payload.notices || [];
    data.notices = window.kssAdminNotices.map(normalizeAdminNotice);
    renderNoticeAdminList(window.kssAdminNotices);
  } catch (error) {
    $("#noticeAdminList").innerHTML = `<article><span>Could not load notices.</span><strong>${escapeHtml(error.message)}</strong></article>`;
  }
}

function setupNoticeAdmin() {
  resetNoticeForm();
  loadAdminNotices();

  $("#noticeReset")?.addEventListener("click", resetNoticeForm);

  $("#noticeForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const message = $("#noticeAdminMessage");
    const publishAt = form.elements.publishAt.value || new Date().toISOString().slice(0, 10);
    const title = form.elements.title.value.trim();
    const category = form.elements.category.value.trim();
    const body = form.elements.body.value.trim();
    const existing = (window.kssAdminNotices || []).find((notice) => notice.id === form.elements.id.value);
    const fallback = existing ? noticeTranslationFor(existing, "en") : {};
    const payload = {
      title: fallback.title || title,
      slug: existing?.slug || slugify(title),
      body: fallback.body || body,
      category: fallback.category || category,
      pinned: form.elements.pinned.checked,
      publishAt: new Date(publishAt).toISOString(),
      translations: [{
        languageCode: currentLang,
        title,
        body,
        category,
        status: form.elements.status.value,
        publishAt: new Date(publishAt).toISOString()
      }]
    };

    message.textContent = "Saving...";
    try {
      await cmsFetch(form.elements.id.value ? `/api/admin/notices/${form.elements.id.value}` : "/api/admin/notices", {
        method: form.elements.id.value ? "PUT" : "POST",
        body: JSON.stringify(payload)
      });
      message.textContent = "Saved.";
      resetNoticeForm();
      await loadAdminNotices();
    } catch (error) {
      message.textContent = error.message;
    }
  });

  $("#noticeAdminList")?.addEventListener("click", async (event) => {
    const editButton = event.target.closest("[data-edit-notice]");
    const deleteButton = event.target.closest("[data-delete-notice]");
    if (editButton) {
      const notice = (window.kssAdminNotices || []).find((item) => item.id === editButton.dataset.editNotice);
      if (!notice) return;
      const translation = noticeTranslationFor(notice, currentLang);
      const form = $("#noticeForm");
      form.elements.id.value = notice.id;
      form.elements.title.value = translation.title || notice.title || "";
      form.elements.category.value = translation.category || notice.category || "";
      form.elements.body.value = translation.body || notice.body || "";
      form.elements.publishAt.value = (translation.publishAt || notice.publishAt || new Date().toISOString()).slice(0, 10);
      form.elements.status.value = translation.status || "DRAFT";
      form.elements.pinned.checked = Boolean(notice.pinned);
      $("#noticeAdminMessage").textContent = `Editing ${currentLang.toUpperCase()} notice.`;
    }
    if (deleteButton) {
      const ok = confirm("Delete this notice permanently?");
      if (!ok) return;
      try {
        await cmsFetch(`/api/admin/notices/${deleteButton.dataset.deleteNotice}`, { method: "DELETE" });
        await loadAdminNotices();
      } catch (error) {
        $("#noticeAdminMessage").textContent = error.message;
      }
    }
  });
}

const adminState = {};

function simpleEditorTemplate(kind, fields) {
  return `<div class="cms-notice-editor"><form id="${kind}Form" class="cms-editor-grid">${fields}<div class="cms-actions wide"><button class="btn primary" type="submit">Save</button><button class="btn" type="reset">Clear</button><span id="${kind}Message" class="cms-message"></span></div></form><div class="cms-list" id="${kind}List"><article><span>Loading from CMS...</span><strong>Please wait</strong></article></div></div>`;
}

function setupContentAdmin() {
  const keys = ["heroTitle", "heroSubtitle", "homeAboutTitle", "homeAboutP1", "homeAboutP2", "principalTitle", "principalBody", "footerSchool", "footerBody"];
  $("#contentKeyList").innerHTML = keys.map((key) => `<button class="text-btn" type="button" data-content-key="${key}">${key}</button>`).join("");
  $("#contentValue").value = t("heroTitle");
  $("#contentKey").value = "heroTitle";
  $("#contentKeyList").addEventListener("click", (event) => {
    const button = event.target.closest("[data-content-key]");
    if (!button) return;
    $("#contentKey").value = button.dataset.contentKey;
    $("#contentValue").value = translations[currentLang]?.[button.dataset.contentKey] || "";
  });
  $("#contentForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const message = $("#contentMessage");
    message.textContent = "Saving...";
    try {
      await cmsFetch("/api/admin/content/translation", {
        method: "PUT",
        body: JSON.stringify({
          key: $("#contentKey").value.trim(),
          languageCode: currentLang,
          value: $("#contentValue").value,
          status: $("#contentStatus").value
        })
      });
      if (translations[currentLang]) translations[currentLang][$("#contentKey").value.trim()] = $("#contentValue").value;
      applyLanguage();
      message.textContent = "Saved.";
    } catch (error) {
      message.textContent = error.message;
    }
  });
}

async function setupMediaAdmin() {
  async function loadMedia() {
    const list = $("#mediaList");
    try {
      const payload = await cmsFetch("/api/admin/media");
      adminState.media = payload.media || [];
      list.innerHTML = adminState.media.map((item) => `<article><span>${item.type?.startsWith("image/") ? `<img src="${item.url}" alt="">` : ""}${escapeHtml(item.alt || item.publicId)}<small>${escapeHtml(item.type)} &middot; ${new Date(item.createdAt).toLocaleDateString()}</small></span><a class="text-btn" href="${item.url}" target="_blank" rel="noreferrer">Preview</a><button class="text-btn danger" type="button" data-delete-media="${item.id}">Delete</button></article>`).join("") || `<article><span>No files uploaded yet.</span><strong>Use upload above</strong></article>`;
    } catch (error) {
      list.innerHTML = `<article><span>Could not load media.</span><strong>${escapeHtml(error.message)}</strong></article>`;
    }
  }
  $("#mediaForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const files = $("#mediaFiles").files;
    if (!files.length) return;
    const body = new FormData();
    [...files].forEach((file) => body.append("files", file));
    $("#mediaMessage").textContent = "Uploading...";
    try {
      await cmsFetch("/api/admin/media/upload", { method: "POST", body });
      $("#mediaMessage").textContent = "Uploaded.";
      $("#mediaForm").reset();
      await loadMedia();
    } catch (error) {
      $("#mediaMessage").textContent = error.message;
    }
  });
  $("#mediaList").addEventListener("click", async (event) => {
    const button = event.target.closest("[data-delete-media]");
    if (!button || !confirm("Delete this media file from CMS?")) return;
    await cmsFetch(`/api/admin/media/${button.dataset.deleteMedia}`, { method: "DELETE" });
    await loadMedia();
  });
  await loadMedia();
}

function eventPayload(form) {
  const title = form.elements.title.value.trim();
  return {
    title,
    slug: form.elements.slug.value.trim() || slugify(title),
    body: form.elements.body.value.trim(),
    category: form.elements.category.value.trim() || "Campus",
    startsAt: new Date(form.elements.startsAt.value || new Date().toISOString().slice(0, 10)).toISOString()
  };
}

async function setupEventsAdmin() {
  async function loadEvents() {
    const payload = await cmsFetch("/api/admin/events");
    adminState.events = payload.events || [];
    $("#eventAdminList").innerHTML = adminState.events.map((event) => `<article><span>${escapeHtml(event.title)}<small>${escapeHtml(event.category)} &middot; ${(event.startsAt || "").slice(0, 10)}</small></span><button class="text-btn" type="button" data-edit-event="${event.id}">Edit</button><button class="text-btn danger" type="button" data-delete-event="${event.id}">Delete</button></article>`).join("") || `<article><span>No events yet.</span><strong>Create one above</strong></article>`;
  }
  $("#eventForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    $("#eventMessage").textContent = "Saving...";
    await cmsFetch(form.elements.id.value ? `/api/admin/events/${form.elements.id.value}` : "/api/admin/events", { method: form.elements.id.value ? "PUT" : "POST", body: JSON.stringify(eventPayload(form)) });
    $("#eventMessage").textContent = "Saved.";
    form.reset();
    await loadEvents();
  });
  $("#eventAdminList").addEventListener("click", async (event) => {
    const edit = event.target.closest("[data-edit-event]");
    const del = event.target.closest("[data-delete-event]");
    if (edit) {
      const item = adminState.events.find((row) => row.id === edit.dataset.editEvent);
      const form = $("#eventForm");
      form.elements.id.value = item.id;
      form.elements.title.value = item.title;
      form.elements.slug.value = item.slug;
      form.elements.category.value = item.category;
      form.elements.startsAt.value = (item.startsAt || "").slice(0, 10);
      form.elements.body.value = item.body;
    }
    if (del && confirm("Delete this event?")) {
      await cmsFetch(`/api/admin/events/${del.dataset.deleteEvent}`, { method: "DELETE" });
      await loadEvents();
    }
  });
  await loadEvents();
}

async function setupFacultyAdmin() {
  async function loadFaculty() {
    const payload = await cmsFetch("/api/admin/faculty");
    adminState.departments = payload.departments || [];
    $("#teacherDepartment").innerHTML = adminState.departments.map((department) => `<option value="${department.id}">${escapeHtml(department.name)}</option>`).join("");
    $("#facultyAdminList").innerHTML = adminState.departments.map((department) => `<article><span>${escapeHtml(department.name)}<small>${department.teachers.length} teachers</small></span><strong>${department.teachers.map((teacher) => escapeHtml(teacher.name)).join(", ") || "No teachers"}</strong></article>`).join("") || `<article><span>No departments yet.</span><strong>Add one above</strong></article>`;
  }
  $("#departmentForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    await cmsFetch("/api/admin/faculty/departments", { method: "POST", body: JSON.stringify({ name: $("#departmentName").value.trim() }) });
    event.currentTarget.reset();
    await loadFaculty();
  });
  $("#teacherForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    await cmsFetch("/api/admin/faculty/teachers", {
      method: "POST",
      body: JSON.stringify({
        name: form.elements.name.value.trim(),
        qualification: form.elements.qualification.value.trim(),
        experience: form.elements.experience.value.trim(),
        subject: form.elements.subject.value.trim(),
        email: form.elements.email.value.trim(),
        photoUrl: form.elements.photoUrl.value.trim(),
        departmentId: form.elements.departmentId.value
      })
    });
    form.reset();
    await loadFaculty();
  });
  await loadFaculty();
}

async function setupResultsAdmin() {
  async function loadResults() {
    const payload = await cmsFetch("/api/admin/results");
    adminState.results = payload.results || [];
    $("#resultAdminList").innerHTML = adminState.results.map((result) => `<article><span>${escapeHtml(result.studentName)}<small>${escapeHtml(result.studentId)} / ${escapeHtml(result.symbolNumber)} / ${escapeHtml(result.className)}</small></span><strong>GPA ${result.gpa} ${result.published ? "Published" : "Draft"}</strong><button class="text-btn danger" type="button" data-delete-result="${result.id}">Delete</button></article>`).join("") || `<article><span>No results yet.</span><strong>Add one above</strong></article>`;
  }
  $("#resultAdminForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    await cmsFetch("/api/admin/results", {
      method: "POST",
      body: JSON.stringify({
        studentId: form.elements.studentId.value.trim(),
        symbolNumber: form.elements.symbolNumber.value.trim(),
        studentName: form.elements.studentName.value.trim(),
        className: form.elements.className.value.trim(),
        gpa: form.elements.gpa.value,
        remarks: form.elements.remarks.value.trim(),
        published: form.elements.published.checked
      })
    });
    form.reset();
    await loadResults();
  });
  $("#resultAdminList").addEventListener("click", async (event) => {
    const button = event.target.closest("[data-delete-result]");
    if (!button || !confirm("Delete this result?")) return;
    await cmsFetch(`/api/admin/results/${button.dataset.deleteResult}`, { method: "DELETE" });
    await loadResults();
  });
  await loadResults();
}

async function setupMenusAdmin() {
  async function loadMenus() {
    const payload = await cmsFetch("/api/admin/site/menus");
    adminState.menus = payload.menus || [];
    $("#menuSelect").innerHTML = adminState.menus.map((menu) => `<option value="${menu.id}">${escapeHtml(menu.key)} (${escapeHtml(menu.location)})</option>`).join("");
    $("#menuAdminList").innerHTML = adminState.menus.flatMap((menu) => menu.items.map((item) => `<article><span>${escapeHtml(item.labelKey)}<small>${escapeHtml(item.href)}</small></span><strong>${item.enabled ? "Enabled" : "Hidden"}</strong><button class="text-btn danger" type="button" data-delete-menu-item="${item.id}">Delete</button></article>`)).join("") || `<article><span>No menu exists yet.</span><strong>Create a menu first</strong></article>`;
  }
  $("#menuCreateForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    await cmsFetch("/api/admin/site/menus", { method: "POST", body: JSON.stringify({ key: $("#menuKey").value.trim(), location: $("#menuLocation").value.trim() }) });
    event.currentTarget.reset();
    await loadMenus();
  });
  $("#menuItemForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    await cmsFetch("/api/admin/site/menus/items", {
      method: "POST",
      body: JSON.stringify({
        menuId: form.elements.menuId.value,
        labelKey: form.elements.labelKey.value.trim(),
        href: form.elements.href.value.trim(),
        sortOrder: Number(form.elements.sortOrder.value || 0),
        openInNewTab: form.elements.openInNewTab.checked,
        enabled: form.elements.enabled.checked
      })
    });
    form.reset();
    await loadMenus();
  });
  $("#menuAdminList").addEventListener("click", async (event) => {
    const button = event.target.closest("[data-delete-menu-item]");
    if (!button || !confirm("Delete this menu item?")) return;
    await cmsFetch(`/api/admin/site/menus/items/${button.dataset.deleteMenuItem}`, { method: "DELETE" });
    await loadMenus();
  });
  await loadMenus();
}

function setupSeoAdmin() {
  $("#seoForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    $("#seoMessage").textContent = "Saving...";
    try {
      await cmsFetch("/api/admin/seo/translation", {
        method: "PUT",
        body: JSON.stringify({
          path: form.elements.path.value.trim(),
          languageCode: currentLang,
          title: form.elements.title.value.trim(),
          description: form.elements.description.value.trim(),
          keywords: form.elements.keywords.value.split(",").map((item) => item.trim()).filter(Boolean),
          ogTitle: form.elements.ogTitle.value.trim(),
          ogDescription: form.elements.ogDescription.value.trim(),
          ogImage: form.elements.ogImage.value.trim() || undefined,
          canonicalUrl: form.elements.canonicalUrl.value.trim() || undefined,
          status: form.elements.status.value
        })
      });
      $("#seoMessage").textContent = "Saved.";
    } catch (error) {
      $("#seoMessage").textContent = error.message;
    }
  });
}

function renderAdmin(tab) {
  const panel = $("#adminPanel");
  if (!panel) return;
  const translationStatus = buildTranslationStatus();
  const templates = {
    dashboard: `<h3>Dashboard</h3>${languageTabs()}<div class="metric-grid"><div class="metric"><strong>24</strong><span>Live pages</span></div><div class="metric"><strong>5</strong><span>Pinned notices</span></div><div class="metric"><strong>${translationStatus.percent}%</strong><span>${currentLang.toUpperCase()} translated</span></div><div class="metric"><strong>30m</strong><span>Session timeout</span></div></div><div class="cms-list">${translationStatus.items.map(item => `<article><span>${item.area}</span><strong>${item.message}</strong></article>`).join("")}</div>`,
    contentAdmin: `<h3>Homepage/About Content</h3>${languageTabs()}<p>Edit the selected language only. These keys connect to the visible homepage/about text.</p><div class="cms-editor-grid"><label>Content key<input id="contentKey" value="heroTitle"></label><label>Status<select id="contentStatus"><option value="PUBLISHED">Published</option><option value="DRAFT">Draft</option><option value="SCHEDULED">Scheduled</option><option value="ARCHIVED">Archived</option></select></label><label class="wide">Text<textarea id="contentValue" rows="5"></textarea></label><div class="cms-actions wide"><button class="btn primary" id="contentSave" form="contentForm">Save Content</button><span id="contentMessage" class="cms-message"></span></div></div><form id="contentForm"></form><div class="cms-list" id="contentKeyList"></div>`,
    pagesAdmin: `<h3>Page Management</h3><p>Create, edit, duplicate, draft, schedule, publish and archive pages without changing source code.</p><div class="cms-list"><article><span>About homepage</span><strong>Published</strong></article><article><span>Academics</span><strong>Published</strong></article><article><span>Faculty category pages</span><strong>Published</strong></article><article><span>New draft page</span><strong>Draft</strong></article></div>`,
    sectionsAdmin: `<h3>Section Management</h3><p>Add, duplicate, hide, delete and reorder sections with drag-and-drop ordering in production.</p><div class="cms-list"><article><span>Hero</span><strong>Visible</strong></article><article><span>History timeline</span><strong>Visible</strong></article><article><span>Principal message</span><strong>Visible</strong></article><article><span>Temporary campaign</span><strong>Hidden</strong></article></div>`,
    menusAdmin: `<h3>Menu Management</h3>${languageTabs()}<p>Create menus and menu items. Labels can be translated in Content using the same label key.</p><form id="menuCreateForm" class="cms-editor-grid"><label>Menu key<input id="menuKey" value="main"></label><label>Location<input id="menuLocation" value="header"></label><div class="cms-actions wide"><button class="btn primary" type="submit">Create Menu</button></div></form><form id="menuItemForm" class="cms-editor-grid"><label>Menu<select id="menuSelect" name="menuId"></select></label><label>Label key<input name="labelKey" placeholder="nav.notices"></label><label>URL<input name="href" placeholder="notices.html"></label><label>Order<input name="sortOrder" type="number" value="0"></label><label class="check-row"><input name="enabled" type="checkbox" checked> Enabled</label><label class="check-row"><input name="openInNewTab" type="checkbox"> Open in new tab</label><div class="cms-actions wide"><button class="btn primary" type="submit">Add Menu Item</button></div></form><div class="cms-list" id="menuAdminList"></div>`,
    noticesAdmin: noticeAdminTemplate(),
    mediaAdmin: `<h3>Media Library</h3>${languageTabs()}<p>Upload images and PDFs to Cloudinary, preview them, and delete unused files.</p><form id="mediaForm" class="cms-editor-grid"><label class="wide">Choose files<input id="mediaFiles" type="file" multiple accept="image/jpeg,image/png,image/webp,application/pdf"></label><div class="cms-actions wide"><button class="btn primary" type="submit">Upload</button><span id="mediaMessage" class="cms-message"></span></div></form><div class="cms-list media-list" id="mediaList"></div>`,
    eventsAdmin: `<h3>Events</h3>${simpleEditorTemplate("event", `<input type="hidden" name="id"><label>Title<input name="title" required></label><label>Slug<input name="slug" placeholder="sports-week"></label><label>Category<input name="category" value="Campus"></label><label>Date<input name="startsAt" type="date" required></label><label class="wide">Details<textarea name="body" rows="4"></textarea></label>`).replace("eventList", "eventAdminList")}`,
    facultyAdmin: `<h3>Faculty Pages</h3><p>Add departments such as Basic ECD, Basic Level, Science, Education, Humanities and Management, then add teachers under them.</p><form id="departmentForm" class="cms-editor-grid"><label>Department name<input id="departmentName" placeholder="Science"></label><div class="cms-actions"><button class="btn primary" type="submit">Add Department</button></div></form><form id="teacherForm" class="cms-editor-grid"><label>Name<input name="name" required></label><label>Department<select id="teacherDepartment" name="departmentId"></select></label><label>Subject<input name="subject"></label><label>Qualification<input name="qualification"></label><label>Experience<input name="experience"></label><label>Email<input name="email" type="email"></label><label class="wide">Photo URL<input name="photoUrl"></label><div class="cms-actions wide"><button class="btn primary" type="submit">Add Teacher</button></div></form><div class="cms-list" id="facultyAdminList"></div>`,
    resultsAdmin: `<h3>Results</h3>${simpleEditorTemplate("resultAdmin", `<label>Student ID<input name="studentId" required></label><label>Symbol number<input name="symbolNumber" required></label><label>Student name<input name="studentName" required></label><label>Class<input name="className" required></label><label>GPA<input name="gpa" type="number" step="0.01" min="0" max="4" required></label><label>Remarks<input name="remarks" value="Passed"></label><label class="check-row"><input name="published" type="checkbox"> Published</label>`).replace("resultAdminList", "resultAdminList")}`,
    seoAdmin: `<h3>SEO Editor</h3>${languageTabs()}<p>Save page title, descriptions and Open Graph details separately for each language.</p><form id="seoForm" class="cms-editor-grid"><label>Page path<input name="path" value="/index.html"></label><label>Status<select name="status"><option value="PUBLISHED">Published</option><option value="DRAFT">Draft</option><option value="SCHEDULED">Scheduled</option><option value="ARCHIVED">Archived</option></select></label><label class="wide">SEO title<input name="title" value="${escapeHtml(document.title)}"></label><label class="wide">Meta description<textarea name="description" rows="3"></textarea></label><label class="wide">Keywords, separated by comma<input name="keywords"></label><label>Open Graph title<input name="ogTitle"></label><label>Open Graph image URL<input name="ogImage"></label><label class="wide">Open Graph description<textarea name="ogDescription" rows="2"></textarea></label><label class="wide">Canonical URL<input name="canonicalUrl"></label><div class="cms-actions wide"><button class="btn primary" type="submit">Save SEO</button><span id="seoMessage" class="cms-message"></span></div></form>`,
    rolesAdmin: `<h3>Roles and Permissions</h3><p>JWT auth with refresh tokens, secure cookies, RBAC and audit logs.</p><div class="cms-list"><article><span>Super Admin</span><strong>All permissions</strong></article><article><span>Editor</span><strong>Content only</strong></article><article><span>Teacher</span><strong>Results and downloads</strong></article></div>`,
    usersAdmin: `<h3>User Management</h3><p>Owner, Administrator, Editor and Viewer roles have configurable permissions.</p><div class="cms-list"><article><span>Owner</span><strong>Manage billing, users, content, backups</strong></article><article><span>Administrator</span><strong>Manage all content and users</strong></article><article><span>Editor</span><strong>Edit and publish assigned content</strong></article><article><span>Viewer</span><strong>Read-only dashboard access</strong></article></div>`,
    auditAdmin: `<h3>Audit Log</h3><p>Production records login attempts, logouts, content edits, image replacements, uploads, password changes and user changes.</p><div class="cms-list">${(JSON.parse(localStorage.getItem("kss-cms-audit") || "[]").slice(0, 5).map(log => `<article><span>${log.action}</span><strong>${log.at}</strong></article>`).join("") || `<article><span>No local preview audit records yet</span><strong>Ready</strong></article>`)}</div>`,
    backupAdmin: `<h3>Backups</h3><p>Manual and scheduled backups include PostgreSQL data, uploaded media, generated files and CMS settings.</p><div class="cms-list"><article><span>Daily database backup</span><strong>02:00 NPT</strong></article><article><span>Media backup</span><strong>Cloudinary + object storage</strong></article><article><span>Restore point</span><strong>Selectable by date</strong></article></div>`,
    securityAdmin: `<h3>Security Controls</h3><p>Production uses Argon2 or bcrypt hashing, HTTP-only secure cookies, CSRF tokens, rate limits, lockout, 2FA, upload validation, security headers and protected admin APIs.</p><div class="cms-list"><article><span>Admin route</span><strong>Hidden and noindex</strong></article><article><span>Login lockout</span><strong>5 failed attempts</strong></article><article><span>Session timeout</span><strong>30 minutes</strong></article><article><span>OWASP controls</span><strong>Enabled in deployment blueprint</strong></article></div>`
  };
  panel.innerHTML = templates[tab];
  if (tab === "noticesAdmin") setupNoticeAdmin();
  if (tab === "contentAdmin") setupContentAdmin();
  if (tab === "mediaAdmin") setupMediaAdmin();
  if (tab === "eventsAdmin") setupEventsAdmin();
  if (tab === "facultyAdmin") setupFacultyAdmin();
  if (tab === "resultsAdmin") setupResultsAdmin();
  if (tab === "menusAdmin") setupMenusAdmin();
  if (tab === "seoAdmin") setupSeoAdmin();
}

function languageTabs() {
  return `<div class="language-tabs">${cmsConfig.languages.map((language) => `<button class="language-tab ${language.code === currentLang ? "active" : ""}" data-lang="${language.code}">${language.name} <small>${language.status}</small></button>`).join("")}</div>`;
}

function buildTranslationStatus() {
  const checks = [
    { area: "Homepage", keys: ["heroTitle", "heroSubtitle", "homeAboutTitle", "homeAboutP1", "homeAboutP2"] },
    { area: "Navigation", keys: Object.values(translations.en.nav).map((_, index) => `nav-${index}`), custom: () => Object.values(translations[currentLang]?.nav || {}).filter(Boolean).length },
    { area: "Notices", keys: data.notices.map((_, index) => `notice-${index}`), custom: () => data.notices.filter((notice) => localized(notice.title)).length },
    { area: "Media", keys: ["hero-image", "hero-alt", "prospectus"], custom: () => [localized(mediaLibrary.hero.image), localized(mediaLibrary.hero.alt), localized(mediaLibrary.prospectus.file)].filter(Boolean).length }
  ];
  let complete = 0;
  let total = 0;
  const items = checks.map((check) => {
    const count = check.custom ? check.custom() : check.keys.filter((key) => translations[currentLang]?.[key]).length;
    const max = check.keys.length;
    complete += count;
    total += max;
    return { area: check.area, message: count === max ? "Complete" : `Missing ${max - count} translations` };
  });
  return { percent: Math.round((complete / total) * 100), items };
}

$$(".admin-tab").forEach((button) => {
  button.addEventListener("click", () => {
    $$(".admin-tab").forEach((node) => node.classList.remove("active"));
    button.classList.add("active");
    renderAdmin(button.dataset.admin);
  });
});

document.addEventListener("click", (event) => {
  const tab = event.target.closest(".language-tab");
  if (!tab) return;
  currentLang = tab.dataset.lang;
  localStorage.setItem("kss-language", currentLang);
  noticesLoadedFromCms = false;
  applyLanguage();
  if ($("#noticeGrid")) loadPublicNotices();
  const activeAdmin = $(".admin-tab.active")?.dataset.admin || "dashboard";
  renderAdmin(activeAdmin);
});

$("#resultForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = $("#resultInput").value.trim() || "KSS-2083-001";
  $("#resultCard").innerHTML = `<small>${escapeHtml(value)}</small><h3>Checking result...</h3><p>Please wait.</p>`;
  cmsFetch(`/api/public/results/lookup?q=${encodeURIComponent(value)}`).then((payload) => {
    const result = payload.result;
    $("#resultCard").innerHTML = `<small>${escapeHtml(result.studentId)} / ${escapeHtml(result.symbolNumber)}</small><h3>${escapeHtml(result.studentName)} - GPA ${escapeHtml(result.gpa)}</h3><p>${escapeHtml(result.className)}. ${escapeHtml(result.remarks)}</p>`;
  }).catch(() => {
    $("#resultCard").innerHTML = `<small>${escapeHtml(value)}</small><h3>Result not found</h3><p>Please check the Student ID or Symbol Number and try again.</p>`;
  });
});

$("#apply")?.addEventListener("submit", (event) => {
  event.preventDefault();
  $("#applyNote").textContent = "Inquiry saved locally for this preview. Production sends email and stores it in PostgreSQL.";
});

$("#contactForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  $("#contactNote").textContent = "Message prepared. Production delivery uses Nodemailer with rate limiting.";
});

$("[data-open-modal]")?.addEventListener("click", () => {
  $("#modal")?.classList.add("open");
  $("#modal")?.setAttribute("aria-hidden", "false");
});
$("#closeModal")?.addEventListener("click", () => {
  $("#modal")?.classList.remove("open");
  $("#modal")?.setAttribute("aria-hidden", "true");
});

applyLanguage();
render();
