
"use strict";

/* =========================================
   1. Select page elements
========================================= */

const html = document.documentElement;
const langToggle = document.getElementById("lang-toggle");
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");
const navigationItems = document.querySelectorAll("#nav-links a");
const yearElement = document.getElementById("current-year");

/* =========================================
   2. Page translations
========================================= */

const pageTranslations = {
    ar: {
        title: "أصيل علي | مطور ويب وLaravel",
        description:
            "الموقع الشخصي لأصيل علي، مطور ويب مهتم ببناء مواقع وتطبيقات الويب باستخدام Laravel وPHP.",
        menuOpen: "فتح القائمة",
        menuClose: "إغلاق القائمة",
        navigationLabel: "القائمة الرئيسية",
        skipLink: "انتقل إلى المحتوى"
    },

    en: {
        title: "Aseel Ali | Web Developer & Laravel",
        description:
            "Personal portfolio of Aseel Ali, a web developer focused on building websites and web applications with Laravel and PHP.",
        menuOpen: "Open navigation menu",
        menuClose: "Close navigation menu",
        navigationLabel: "Main navigation",
        skipLink: "Skip to content"
    }
};

/* =========================================
   3. Read and save preferred language
========================================= */

function getSavedLanguage() {
    try {
        const savedLanguage = localStorage.getItem("aseel-portfolio-language");

        if (savedLanguage === "ar" || savedLanguage === "en") {
            return savedLanguage;
        }
    } catch (error) {
        // Storage may be unavailable in some browser contexts.
    }

    return "ar";
}

function saveLanguage(language) {
    try {
        localStorage.setItem("aseel-portfolio-language", language);
    } catch (error) {
        // The page still works if storage is unavailable.
    }
}

/* =========================================
   4. Apply the selected language
========================================= */

function setLanguage(language) {
    if (language !== "ar" && language !== "en") {
        language = "ar";
    }

    const isArabic = language === "ar";
    const translation = pageTranslations[language];

    // Update document language and text direction.
    html.lang = language;
    html.dir = isArabic ? "rtl" : "ltr";

    // Translate all elements with both language attributes.
    document.querySelectorAll("[data-ar][data-en]").forEach((element) => {
        element.textContent = element.getAttribute(`data-${language}`);
    });

    // Update the page title and search description.
    document.title = translation.title;

    const descriptionMeta = document.querySelector(
        'meta[name="description"]'
    );

    if (descriptionMeta) {
        descriptionMeta.setAttribute("content", translation.description);
    }

    // Update the language button.
    if (langToggle) {
        langToggle.textContent = isArabic ? "English" : "العربية";
        langToggle.setAttribute(
            "aria-label",
            isArabic ? "Switch to English" : "التبديل إلى العربية"
        );
    }

    // Update navigation accessibility labels.
    const navigation = document.querySelector(".navbar");

    if (navigation) {
        navigation.setAttribute("aria-label", translation.navigationLabel);
    }

    const skipLink = document.querySelector(".skip-link");

    if (skipLink) {
        skipLink.textContent = translation.skipLink;
    }

    updateMenuLabels(language);

    saveLanguage(language);
}

/* =========================================
   5. Mobile navigation
========================================= */

function updateMenuLabels(language = html.lang) {
    if (!menuToggle) return;

    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    const translation = pageTranslations[language] || pageTranslations.ar;

    menuToggle.setAttribute(
        "aria-label",
        isOpen ? translation.menuClose : translation.menuOpen
    );
}

function openMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.add("is-open");
    menuToggle.setAttribute("aria-expanded", "true");
    updateMenuLabels();
}

function closeMenu() {
    if (!menuToggle || !navLinks) return;

    navLinks.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
    updateMenuLabels();
}

function toggleMenu() {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

    if (isOpen) {
        closeMenu();
    } else {
        openMenu();
    }
}

if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", toggleMenu);

    // Close the menu after choosing a navigation link.
    navigationItems.forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    // Close the menu with Escape.
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });

    // Close the mobile menu when returning to desktop width.
    window.addEventListener("resize", () => {
        if (window.innerWidth > 760) {
            closeMenu();
        }
    });
}

/* =========================================
   6. Language switch button
========================================= */

if (langToggle) {
    langToggle.addEventListener("click", () => {
        const nextLanguage = html.lang === "ar" ? "en" : "ar";

        setLanguage(nextLanguage);
    });
}

/* =========================================
   7. Dynamic copyright year
========================================= */

if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
}

/* =========================================
   8. Initialize the page
========================================= */

setLanguage(getSavedLanguage());

console.log("Aseel Portfolio initialized successfully.");
