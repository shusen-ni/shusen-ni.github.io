const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const searchButton = document.querySelector(".search-button");
const navLinks = [...document.querySelectorAll(".main-nav a")];
const homeLinks = [...document.querySelectorAll('a[href="#home"]')];
const sectionLinks = navLinks.filter((link) => link.getAttribute("href") !== "#home");
const sections = sectionLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");

function setActiveNav(hash) {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === hash);
  });
}

function resolveTheme(choice) {
  if (choice === "auto") {
    return darkQuery.matches ? "dark" : "light";
  }
  return choice;
}

function applyTheme(choice) {
  root.dataset.theme = choice;
  root.dataset.resolvedTheme = resolveTheme(choice);
  const isDark = root.dataset.resolvedTheme === "dark";
  themeToggle?.classList.toggle("active", isDark);
  themeToggle?.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  themeToggle?.setAttribute("title", isDark ? "Switch to light mode" : "Switch to dark mode");
}

const savedTheme = localStorage.getItem("academic-site-theme") || "auto";
applyTheme(savedTheme);

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.resolvedTheme === "dark" ? "light" : "dark";
  localStorage.setItem("academic-site-theme", nextTheme);
  applyTheme(nextTheme);
});

searchButton?.addEventListener("click", () => {
  const query = window.prompt("Search this page");
  if (query) {
    window.find(query);
  }
});

darkQuery.addEventListener("change", () => {
  if (root.dataset.theme === "auto") {
    applyTheme("auto");
  }
});

homeLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    history.replaceState(null, "", window.location.pathname);
    setActiveNav("#home");
  });
});

window.addEventListener(
  "scroll",
  () => {
    if (window.scrollY < 90) {
      setActiveNav("#home");
    }
  },
  { passive: true },
);

const observer = new IntersectionObserver(
  (entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

    if (!visible) return;

    setActiveNav(`#${visible.target.id}`);
  },
  {
    rootMargin: "-22% 0px -62% 0px",
    threshold: [0.1, 0.25, 0.5],
  },
);

sections.forEach((section) => observer.observe(section));

if (window.scrollY < 90) {
  setActiveNav("#home");
}
