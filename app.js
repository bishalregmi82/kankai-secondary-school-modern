const cmsConfig = {
  activeLanguage: localStorage.getItem("kss-language") || "en",
  fallbackLanguage: "en",
  missingTranslationBehavior: "fallback",
  languages: [
    { code: "en", name: "English", status: "published" },
    { code: "np", name: "Nepali", status: "published" }
  ]
};

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
  if ($("#timeline")) {
    $("#timeline").innerHTML = data.timeline.map(([year, text]) => `<article><strong>${year}</strong><p>${text}</p></article>`).join("");
  }
  if ($("#programGrid")) {
    $("#programGrid").innerHTML = data.programs.map(([title, text, icon]) => `<article class="program-card"><span class="icon">${icon}</span><h3>${title}</h3><p>${text}</p></article>`).join("");
  }
  if ($("#admissionSteps")) {
    $("#admissionSteps").innerHTML = ["Online inquiry", "Document verification", "Level interaction", "Admission confirmation"].map((step, i) => `<article><span>${i + 1}</span><div><h3>${step}</h3><p>CMS-managed guidance, required documents and fee notes for guardians.</p></div></article>`).join("");
  }
  if ($("#noticeGrid")) renderNotices();
  if ($("#eventList")) {
    $("#eventList").innerHTML = data.events.map(([title, text]) => `<article><small>Campus</small><h3>${title}</h3><p>${text}</p></article>`).join("");
  }
  if ($("#facultyCategoryGrid")) {
    $("#facultyCategoryGrid").innerHTML = data.facultyCategories.map(([title, text, url, icon]) => `<a class="program-card faculty-category" href="${url}"><span class="icon">${icon}</span><h3>${title}</h3><p>${text}</p><strong>View faculty</strong></a>`).join("");
  }
  if ($("#facultyDetailGrid")) {
    const key = document.body.dataset.facultyPage;
    const teachers = data.facultyDetails[key] || [];
    $("#facultyDetailGrid").innerHTML = teachers.map(([name, role, exp, subject]) => `<article class="faculty-card"><div class="avatar">${name.split(" ").map((part) => part[0]).join("").slice(0, 2)}</div><h3>${name}</h3><p>${role}</p><small>${exp}</small><p><strong>${subject}</strong></p></article>`).join("");
  }
  if ($("#facilityGrid")) {
    $("#facilityGrid").innerHTML = data.facilities.map(([title, text, icon]) => `<article class="facility-card"><span class="icon">${icon}</span><h3>${title}</h3><p>${text}</p></article>`).join("");
  }
  if ($("#galleryGrid")) {
    $("#galleryGrid").innerHTML = data.gallery.map(([title, img]) => `<a class="gallery-item" href="${img}" target="_blank" rel="noreferrer"><img src="${img}" alt="${title}"><span>${title}</span></a>`).join("");
  }
  if ($("#adminPanel")) renderAdmin("dashboard");
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
  $("#noticeGrid").innerHTML = notices.map((notice) => `<article class="notice-card ${notice.pinned ? "pinned" : ""}"><small>${localized(notice.category)} &middot; ${notice.date}</small><h3>${localized(notice.title)}</h3><p>${notice.pinned ? "Pinned notice with language-aware PDF/image attachment support." : "Archive-ready notice with independent language publishing."}</p><button class="text-btn" onclick="window.print()">Print notice</button></article>`).join("");
}

$("#noticeSearch")?.addEventListener("input", renderNotices);
$("#noticeFilter")?.addEventListener("change", renderNotices);

function renderAdmin(tab) {
  const panel = $("#adminPanel");
  if (!panel) return;
  const translationStatus = buildTranslationStatus();
  const templates = {
    dashboard: `<h3>Dashboard</h3>${languageTabs()}<div class="metric-grid"><div class="metric"><strong>24</strong><span>Live pages</span></div><div class="metric"><strong>5</strong><span>Pinned notices</span></div><div class="metric"><strong>${translationStatus.percent}%</strong><span>${currentLang.toUpperCase()} translated</span></div><div class="metric"><strong>30m</strong><span>Session timeout</span></div></div><div class="cms-list">${translationStatus.items.map(item => `<article><span>${item.area}</span><strong>${item.message}</strong></article>`).join("")}</div>`,
    contentAdmin: `<h3>Universal Content Editing</h3>${languageTabs()}<p>Every heading, paragraph, button, link, contact detail, footer item, FAQ, announcement and SEO field is stored as a content item with revisions.</p><div class="cms-editor-grid"><label>Content key<input value="home.hero.title"></label><label>Language value<textarea rows="4">${t("heroTitle")}</textarea></label><label>Status<select><option>Draft</option><option selected>Published</option><option>Scheduled</option><option>Archived</option></select></label><div class="cms-actions"><button class="btn primary" type="button">Autosave Draft</button><button class="btn primary" type="button">Publish ${currentLang.toUpperCase()}</button></div></div>`,
    pagesAdmin: `<h3>Page Management</h3><p>Create, edit, duplicate, draft, schedule, publish and archive pages without changing source code.</p><div class="cms-list"><article><span>About homepage</span><strong>Published</strong></article><article><span>Academics</span><strong>Published</strong></article><article><span>Faculty category pages</span><strong>Published</strong></article><article><span>New draft page</span><strong>Draft</strong></article></div>`,
    sectionsAdmin: `<h3>Section Management</h3><p>Add, duplicate, hide, delete and reorder sections with drag-and-drop ordering in production.</p><div class="cms-list"><article><span>Hero</span><strong>Visible</strong></article><article><span>History timeline</span><strong>Visible</strong></article><article><span>Principal message</span><strong>Visible</strong></article><article><span>Temporary campaign</span><strong>Hidden</strong></article></div>`,
    menusAdmin: `<h3>Menu Management</h3>${languageTabs()}<p>Navigation and footer labels are editable per language. Public admin links are not shown.</p><div class="cms-list">${Object.entries(translations[currentLang]?.nav || translations.en.nav).map(([key, value]) => `<article><span>${key}</span><strong>${value}</strong></article>`).join("")}</div>`,
    noticesAdmin: `<h3>Notice Management</h3>${languageTabs()}<p>Create, edit, schedule, pin, expire, upload PDF and publish multilingual notices. Each language has its own draft, published, scheduled and archived state.</p><div class="cms-list">${data.notices.map(n => `<article><span>${localized(n.title) || "[Missing translation]"}</span><strong>${n.status?.[currentLang] || "draft"}</strong></article>`).join("")}</div>`,
    mediaAdmin: `<h3>Media Library</h3>${languageTabs()}<p>For each image or file choose one shared asset for all languages, or upload separate language versions.</p><div class="cms-list"><article><span>Hero image</span><strong>${mediaLibrary.hero.mode}</strong></article><article><span>Prospectus PDF</span><strong>${localized(mediaLibrary.prospectus.file)}</strong></article><article><span>Alt text</span><strong>${localized(mediaLibrary.hero.alt)}</strong></article></div>`,
    seoAdmin: `<h3>SEO Editor</h3>${languageTabs()}<p>Dynamic meta tags, Open Graph, canonical URLs, keywords, Twitter cards and JSON-LD schema per language.</p><div class="cms-list"><article><span>SEO title (${currentLang.toUpperCase()})</span><strong>${document.title}</strong></article><article><span>Canonical strategy</span><strong>/en/page and /np/page aliases</strong></article></div>`,
    rolesAdmin: `<h3>Roles and Permissions</h3><p>JWT auth with refresh tokens, secure cookies, RBAC and audit logs.</p><div class="cms-list"><article><span>Super Admin</span><strong>All permissions</strong></article><article><span>Editor</span><strong>Content only</strong></article><article><span>Teacher</span><strong>Results and downloads</strong></article></div>`,
    usersAdmin: `<h3>User Management</h3><p>Owner, Administrator, Editor and Viewer roles have configurable permissions.</p><div class="cms-list"><article><span>Owner</span><strong>Manage billing, users, content, backups</strong></article><article><span>Administrator</span><strong>Manage all content and users</strong></article><article><span>Editor</span><strong>Edit and publish assigned content</strong></article><article><span>Viewer</span><strong>Read-only dashboard access</strong></article></div>`,
    auditAdmin: `<h3>Audit Log</h3><p>Production records login attempts, logouts, content edits, image replacements, uploads, password changes and user changes.</p><div class="cms-list">${(JSON.parse(localStorage.getItem("kss-cms-audit") || "[]").slice(0, 5).map(log => `<article><span>${log.action}</span><strong>${log.at}</strong></article>`).join("") || `<article><span>No local preview audit records yet</span><strong>Ready</strong></article>`)}</div>`,
    backupAdmin: `<h3>Backups</h3><p>Manual and scheduled backups include PostgreSQL data, uploaded media, generated files and CMS settings.</p><div class="cms-list"><article><span>Daily database backup</span><strong>02:00 NPT</strong></article><article><span>Media backup</span><strong>Cloudinary + object storage</strong></article><article><span>Restore point</span><strong>Selectable by date</strong></article></div>`,
    securityAdmin: `<h3>Security Controls</h3><p>Production uses Argon2 or bcrypt hashing, HTTP-only secure cookies, CSRF tokens, rate limits, lockout, 2FA, upload validation, security headers and protected admin APIs.</p><div class="cms-list"><article><span>Admin route</span><strong>Hidden and noindex</strong></article><article><span>Login lockout</span><strong>5 failed attempts</strong></article><article><span>Session timeout</span><strong>30 minutes</strong></article><article><span>OWASP controls</span><strong>Enabled in deployment blueprint</strong></article></div>`
  };
  panel.innerHTML = templates[tab];
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
  applyLanguage();
  const activeAdmin = $(".admin-tab.active")?.dataset.admin || "dashboard";
  renderAdmin(activeAdmin);
});

$("#resultForm")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const value = $("#resultInput").value.trim() || "KSS-2083-001";
  $("#resultCard").innerHTML = `<small>${value}</small><h3>Passed with distinction</h3><p>GPA 3.72. Printable mark sheet and guardian copy available in the production portal.</p>`;
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
