"use client";

import { useEffect, useState } from "react";

const languages = [
  { code: "en", label: "English" },
  { code: "bn", label: "বাংলা" },
  { code: "fr", label: "Français" },
  { code: "es", label: "Español" },
  { code: "ar", label: "العربية" },
];

const translations = {
  bn: {
    Destinations: "গন্তব্য",
    "Trip planner": "ভ্রমণ পরিকল্পনা",
    "Travel guide": "ভ্রমণ নির্দেশিকা",
    Safety: "নিরাপত্তা",
    "Every season tells a different story.": "প্রতিটি ঋতু বলে ভিন্ন গল্প।",
    "Best time to visit": "ভ্রমণের সেরা সময়",
    "Smart trip planner": "স্মার্ট ভ্রমণ পরিকল্পনাকারী",
    "Build your itinerary in seconds.": "মুহূর্তেই আপনার ভ্রমণসূচি তৈরি করুন।",
    "Everything to know before you land.": "পৌঁছানোর আগে যা জানা দরকার।",
    "Traveler toolkit": "ভ্রমণকারীর টুলকিট",
    "Handy tools for the road.": "পথের জন্য দরকারি টুল।",
    "Taste of Bangladesh": "বাংলাদেশের স্বাদ",
    "Eat your way across the country.": "খেতে খেতে ঘুরে দেখুন সারা দেশ।",
    "Speak a little Bangla": "একটু বাংলা বলুন",
    "A few words go a long way.": "কয়েকটি শব্দই অনেক দূর নিয়ে যায়।",
    "Confidence while exploring": "আত্মবিশ্বাসের সঙ্গে ঘুরে দেখুন",
    "Save these numbers": "এই নম্বরগুলো সংরক্ষণ করুন",
    "Frequently asked questions": "সচরাচর জিজ্ঞাসা",
    "Good to know": "জেনে রাখুন",
    "Currency converter": "মুদ্রা রূপান্তর",
    "Live weather": "সরাসরি আবহাওয়া",
    "Time in Bangladesh": "বাংলাদেশের সময়",
    "Register your visit": "আপনার ভ্রমণ নিবন্ধন করুন",
    "Tourism BD": "ট্যুরিজম বিডি",
    Discover: "আবিষ্কার",
    Register: "নিবন্ধন",
    Routes: "রুট",
    Login: "লগইন",
    "Welcome to Bangladesh": "বাংলাদেশে স্বাগতম",
    "A beautiful country is waiting for you.": "একটি সুন্দর দেশ আপনার অপেক্ষায়।",
    "Come for the rivers, tea gardens, beaches, mangrove forests, ancient cities, and the generosity of people who make every trip feel personal.":
      "নদী, চা বাগান, সমুদ্রসৈকত, ম্যানগ্রোভ বন, প্রাচীন শহর এবং আন্তরিক মানুষের আতিথেয়তার জন্য বাংলাদেশে আসুন।",
    "Start your Bangladesh journey": "আপনার বাংলাদেশ যাত্রা শুরু করুন",
    "Discover highlights": "বিশেষ আকর্ষণ দেখুন",
    "For international travelers": "আন্তর্জাতিক ভ্রমণকারীদের জন্য",
    "Plan confidently before you arrive": "আসার আগে আত্মবিশ্বাসের সঙ্গে পরিকল্পনা করুন",
    "Register your arrival, save your route, and access a dashboard built for safer, smoother travel across Bangladesh.":
      "আপনার আগমন নিবন্ধন করুন, রুট সংরক্ষণ করুন এবং বাংলাদেশ ভ্রমণের জন্য নিরাপদ ড্যাশবোর্ড ব্যবহার করুন।",
    "Why visit Bangladesh": "কেন বাংলাদেশ ভ্রমণ করবেন",
    "Small country, big-hearted journeys.": "ছোট দেশ, বড় হৃদয়ের ভ্রমণ।",
    "International visitor registration": "আন্তর্জাতিক দর্শনার্থী নিবন্ধন",
    "Tell us your first plan, then travel with more confidence.":
      "আপনার প্রথম পরিকল্পনা জানান, তারপর আরও আত্মবিশ্বাস নিয়ে ভ্রমণ করুন।",
    "Travel services": "ভ্রমণ সেবা",
    "Designed for guests arriving from around the world.":
      "বিশ্বের নানা প্রান্ত থেকে আসা অতিথিদের জন্য তৈরি।",
    "Signature routes": "বিশেষ ভ্রমণ রুট",
    "Choose your first Bangladesh story.": "আপনার প্রথম বাংলাদেশ গল্প বেছে নিন।",
    "Ready when you are": "আপনি প্রস্তুত হলেই প্রস্তুত",
    "Login to dashboard": "ড্যাশবোর্ডে লগইন",
    "Full name": "পূর্ণ নাম",
    "Passport country": "পাসপোর্টের দেশ",
    "Arrival city": "আগমনের শহর",
    "Arrival date": "আগমনের তারিখ",
    "Hotel or first stay": "হোটেল বা প্রথম থাকার স্থান",
    "Emergency contact": "জরুরি যোগাযোগ",
    "Planned route": "পরিকল্পিত রুট",
    "Save visitor safety profile": "দর্শনার্থী নিরাপত্তা প্রোফাইল সংরক্ষণ করুন",
    "Sign in to your dashboard": "আপনার ড্যাশবোর্ডে সাইন ইন করুন",
    "Email": "ইমেইল",
    "Password": "পাসওয়ার্ড",
    "Administration dashboard": "অ্যাডমিন ড্যাশবোর্ড",
    "Manage visitors, guides, and support requests.": "দর্শনার্থী, গাইড ও সহায়তা অনুরোধ পরিচালনা করুন।",
    Visitors: "দর্শনার্থী",
    "Tour guides": "ট্যুর গাইড",
    "Support center": "সহায়তা কেন্দ্র",
    Requests: "অনুরোধ",
    "Registered tourist dashboard": "নিবন্ধিত পর্যটক ড্যাশবোর্ড",
  },
  fr: {
    Destinations: "Destinations",
    "Trip planner": "Planificateur",
    "Travel guide": "Guide pratique",
    Safety: "Sécurité",
    "Best time to visit": "Meilleure période",
    "Every season tells a different story.": "Chaque saison raconte une histoire différente.",
    "Smart trip planner": "Planificateur intelligent",
    "Build your itinerary in seconds.": "Créez votre itinéraire en quelques secondes.",
    "Everything to know before you land.": "Tout savoir avant d'atterrir.",
    "Handy tools for the road.": "Des outils pratiques pour la route.",
    "Eat your way across the country.": "Découvrez le pays par sa cuisine.",
    "A few words go a long way.": "Quelques mots suffisent.",
    "Frequently asked questions": "Questions fréquentes",
    "Save these numbers": "Enregistrez ces numéros",
    "Tourism BD": "Tourisme BD",
    Discover: "Découvrir",
    Register: "S'inscrire",
    Routes: "Itinéraires",
    Login: "Connexion",
    "Welcome to Bangladesh": "Bienvenue au Bangladesh",
    "A beautiful country is waiting for you.": "Un beau pays vous attend.",
    "Come for the rivers, tea gardens, beaches, mangrove forests, ancient cities, and the generosity of people who make every trip feel personal.":
      "Venez pour les rivières, les jardins de thé, les plages, les mangroves, les villes anciennes et l'accueil chaleureux.",
    "Start your Bangladesh journey": "Commencer votre voyage",
    "Discover highlights": "Voir les incontournables",
    "For international travelers": "Pour les voyageurs internationaux",
    "Plan confidently before you arrive": "Planifiez sereinement avant votre arrivée",
    "Why visit Bangladesh": "Pourquoi visiter le Bangladesh",
    "Small country, big-hearted journeys.": "Petit pays, grands voyages humains.",
    "International visitor registration": "Inscription des visiteurs internationaux",
    "Tell us your first plan, then travel with more confidence.":
      "Partagez votre premier plan, puis voyagez avec plus de confiance.",
    "Travel services": "Services de voyage",
    "Designed for guests arriving from around the world.":
      "Conçu pour les visiteurs venus du monde entier.",
    "Signature routes": "Itinéraires emblématiques",
    "Choose your first Bangladesh story.": "Choisissez votre première histoire au Bangladesh.",
    "Login to dashboard": "Accéder au tableau de bord",
    "Full name": "Nom complet",
    "Passport country": "Pays du passeport",
    "Arrival city": "Ville d'arrivée",
    "Arrival date": "Date d'arrivée",
    "Hotel or first stay": "Hôtel ou premier séjour",
    "Emergency contact": "Contact d'urgence",
    "Planned route": "Itinéraire prévu",
    "Save visitor safety profile": "Enregistrer le profil de sécurité",
    "Sign in to your dashboard": "Connectez-vous à votre tableau de bord",
    Email: "E-mail",
    Password: "Mot de passe",
    "Administration dashboard": "Tableau de bord admin",
    "Manage visitors, guides, and support requests.":
      "Gérez les visiteurs, les guides et les demandes d'assistance.",
    Visitors: "Visiteurs",
    "Tour guides": "Guides touristiques",
    "Support center": "Centre d'assistance",
    Requests: "Demandes",
  },
  es: {
    Destinations: "Destinos",
    "Trip planner": "Planificador",
    "Travel guide": "Guía de viaje",
    Safety: "Seguridad",
    "Best time to visit": "Mejor época para visitar",
    "Every season tells a different story.": "Cada estación cuenta una historia distinta.",
    "Smart trip planner": "Planificador inteligente",
    "Build your itinerary in seconds.": "Crea tu itinerario en segundos.",
    "Everything to know before you land.": "Todo lo que debes saber antes de llegar.",
    "Handy tools for the road.": "Herramientas útiles para el camino.",
    "Eat your way across the country.": "Recorre el país a través de su comida.",
    "A few words go a long way.": "Unas pocas palabras llegan lejos.",
    "Frequently asked questions": "Preguntas frecuentes",
    "Save these numbers": "Guarda estos números",
    "Tourism BD": "Turismo BD",
    Discover: "Descubrir",
    Register: "Registrarse",
    Routes: "Rutas",
    Login: "Iniciar sesión",
    "Welcome to Bangladesh": "Bienvenido a Bangladesh",
    "A beautiful country is waiting for you.": "Un país hermoso te espera.",
    "Come for the rivers, tea gardens, beaches, mangrove forests, ancient cities, and the generosity of people who make every trip feel personal.":
      "Ven por los ríos, jardines de té, playas, manglares, ciudades antiguas y una hospitalidad inolvidable.",
    "Start your Bangladesh journey": "Comienza tu viaje por Bangladesh",
    "Discover highlights": "Ver destacados",
    "For international travelers": "Para viajeros internacionales",
    "Plan confidently before you arrive": "Planifica con confianza antes de llegar",
    "Why visit Bangladesh": "Por qué visitar Bangladesh",
    "Small country, big-hearted journeys.": "País pequeño, viajes con gran corazón.",
    "International visitor registration": "Registro de visitantes internacionales",
    "Tell us your first plan, then travel with more confidence.":
      "Cuéntanos tu primer plan y viaja con más confianza.",
    "Travel services": "Servicios de viaje",
    "Designed for guests arriving from around the world.":
      "Diseñado para visitantes de todo el mundo.",
    "Signature routes": "Rutas principales",
    "Choose your first Bangladesh story.": "Elige tu primera historia en Bangladesh.",
    "Login to dashboard": "Entrar al panel",
    "Full name": "Nombre completo",
    "Passport country": "País del pasaporte",
    "Arrival city": "Ciudad de llegada",
    "Arrival date": "Fecha de llegada",
    "Hotel or first stay": "Hotel o primera estancia",
    "Emergency contact": "Contacto de emergencia",
    "Planned route": "Ruta planificada",
    "Save visitor safety profile": "Guardar perfil de seguridad",
    "Sign in to your dashboard": "Inicia sesión en tu panel",
    Email: "Correo",
    Password: "Contraseña",
    "Administration dashboard": "Panel de administración",
    "Manage visitors, guides, and support requests.":
      "Gestiona visitantes, guías y solicitudes de soporte.",
    Visitors: "Visitantes",
    "Tour guides": "Guías turísticos",
    "Support center": "Centro de soporte",
    Requests: "Solicitudes",
  },
  ar: {
    Destinations: "الوجهات",
    "Trip planner": "مخطط الرحلة",
    "Travel guide": "دليل السفر",
    Safety: "السلامة",
    "Best time to visit": "أفضل وقت للزيارة",
    "Smart trip planner": "مخطط رحلات ذكي",
    "Build your itinerary in seconds.": "أنشئ برنامج رحلتك في ثوانٍ.",
    "Frequently asked questions": "الأسئلة الشائعة",
    "Save these numbers": "احفظ هذه الأرقام",
    "Tourism BD": "سياحة بنغلاديش",
    Discover: "استكشف",
    Register: "تسجيل",
    Routes: "المسارات",
    Login: "تسجيل الدخول",
    "Welcome to Bangladesh": "مرحباً بكم في بنغلاديش",
    "A beautiful country is waiting for you.": "بلد جميل ينتظرك.",
    "Start your Bangladesh journey": "ابدأ رحلتك في بنغلاديش",
    "Discover highlights": "اكتشف المعالم",
    "For international travelers": "للمسافرين الدوليين",
    "Plan confidently before you arrive": "خطط بثقة قبل الوصول",
    "Why visit Bangladesh": "لماذا تزور بنغلاديش",
    "Small country, big-hearted journeys.": "بلد صغير ورحلات بروح كبيرة.",
    "International visitor registration": "تسجيل الزوار الدوليين",
    "Travel services": "خدمات السفر",
    "Signature routes": "مسارات مميزة",
    "Choose your first Bangladesh story.": "اختر قصتك الأولى في بنغلاديش.",
    "Login to dashboard": "الدخول إلى لوحة التحكم",
    "Full name": "الاسم الكامل",
    "Passport country": "بلد جواز السفر",
    "Arrival city": "مدينة الوصول",
    "Arrival date": "تاريخ الوصول",
    "Emergency contact": "جهة اتصال للطوارئ",
    "Planned route": "المسار المخطط",
    "Sign in to your dashboard": "سجل الدخول إلى لوحة التحكم",
    Email: "البريد الإلكتروني",
    Password: "كلمة المرور",
    "Administration dashboard": "لوحة الإدارة",
    Visitors: "الزوار",
    "Tour guides": "المرشدون السياحيون",
    "Support center": "مركز الدعم",
    Requests: "الطلبات",
  },
};

const originalText = new WeakMap();
const originalAttributes = new WeakMap();

function translateText(text, dictionary) {
  const key = text.trim().replace(/\s+/g, " ");

  if (!key || !dictionary[key]) {
    return text;
  }

  const leading = text.match(/^\s*/)?.[0] || "";
  const trailing = text.match(/\s*$/)?.[0] || "";
  return `${leading}${dictionary[key]}${trailing}`;
}

function applyLanguage(code) {
  const dictionary = translations[code] || {};
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;

      if (
        !parent ||
        parent.closest(".language-translator") ||
        ["SCRIPT", "STYLE", "TEXTAREA"].includes(parent.tagName)
      ) {
        return NodeFilter.FILTER_REJECT;
      }

      return node.nodeValue.trim()
        ? NodeFilter.FILTER_ACCEPT
        : NodeFilter.FILTER_REJECT;
    },
  });

  const nodes = [];
  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  nodes.forEach((node) => {
    if (!originalText.has(node)) {
      originalText.set(node, node.nodeValue);
    }

    const source = originalText.get(node);
    node.nodeValue = code === "en" ? source : translateText(source, dictionary);
  });

  document
    .querySelectorAll("input[placeholder], textarea[placeholder], [aria-label]")
    .forEach((element) => {
      if (element.closest(".language-translator")) {
        return;
      }

      if (!originalAttributes.has(element)) {
        originalAttributes.set(element, {
          ariaLabel: element.getAttribute("aria-label"),
          placeholder: element.getAttribute("placeholder"),
        });
      }

      const source = originalAttributes.get(element);

      if (source.placeholder) {
        element.setAttribute(
          "placeholder",
          code === "en"
            ? source.placeholder
            : translateText(source.placeholder, dictionary),
        );
      }

      if (source.ariaLabel) {
        element.setAttribute(
          "aria-label",
          code === "en"
            ? source.ariaLabel
            : translateText(source.ariaLabel, dictionary),
        );
      }
    });

  document.documentElement.lang = code;
  document.documentElement.dir = code === "ar" ? "rtl" : "ltr";
}

export default function LanguageTranslator() {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    let savedLanguage = null;
    try {
      savedLanguage = window.localStorage.getItem("tourism_bd_language");
    } catch {
      // Storage may be blocked; fall back to English.
    }
    if (savedLanguage && languages.some((item) => item.code === savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    applyLanguage(language);
    try {
      window.localStorage.setItem("tourism_bd_language", language);
    } catch {
      // Remembering the language is optional.
    }
  }, [language]);

  return (
    <aside className="language-translator" aria-label="Language translator">
      <label>
        <span className="translator-label">Language</span>
        <select
          value={language}
          onChange={(event) => setLanguage(event.target.value)}
        >
          {languages.map((item) => (
            <option key={item.code} value={item.code}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
    </aside>
  );
}
