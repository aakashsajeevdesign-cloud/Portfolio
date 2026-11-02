const projects = [
  {
    id: 1,
    title: "The Cakery",
    category: "web-development",
    description: "A warm, conversion-focused online storefront for a contemporary bakery.",
    image: "https://res.cloudinary.com/ozzeyzin/image/upload/f_auto,q_auto/Cakery_coverpic",
    year: "2026",
    projectType: "E-commerce Website",
    projectUrl: "https://thecakery.in/"
  },
  {
    id: 2,
    title: "The Cakery App",
    category: "app-development",
    description: "An approachable mobile ordering experience designed around quick, confident purchases.",
    image: "https://res.cloudinary.com/ozzeyzin/image/upload/f_auto,q_auto/The_Cakery_App_Showcase",
    year: "2026",
    projectType: "Mobile Application",
    projectUrl: "https://thecakery.in/app"
  },
  {
    id: 3,
    title: "Mobile UI Collection",
    category: "ui-ux",
    description: "A collection of clear, accessible interfaces for useful everyday digital products.",
    image: "https://res.cloudinary.com/ozzeyzin/image/upload/f_auto,q_auto/image_1",
    year: "2026",
    projectType: "Interface Design",
    projectUrl: "https://www.figma.com/design/XLliRrZKvNY4VlQnXX4SjW/MOBILE-UI-DESIGNS?node-id=19-15&t=4JauXl9zvg637wSG-1"
  },
  {
    id: 4,
    title: "Shervider Brand Artwork",
    category: "graphic-design",
    description: "A bold visual identity direction and collection of brand-ready promotional artwork.",
    image: "https://res.cloudinary.com/ozzeyzin/image/upload/f_auto,q_auto/shervider",
    year: "2025",
    projectType: "Brand & Art Direction",
    projectUrl: "https://canva.link/qmj4dygmj44rww4"
  }
];

const categories = {
  "app-development": {
    label: "App Development",
    description: "Intuitive mobile products shaped through thoughtful flows, useful interactions and polished interfaces."
  },
  "web-development": {
    label: "Web Development",
    description: "Modern, responsive websites built for clear performance, effortless navigation and memorable experiences."
  },
  "ui-ux": {
    label: "UI/UX Design",
    description: "User-focused digital experiences that balance accessibility, clarity, identity and product goals."
  },
  "graphic-design": {
    label: "Graphic Design",
    description: "Distinct visual identities, campaign artwork and brand communication with a memorable design voice."
  }
};

const grid = document.querySelector("#project-grid");
const emptyState = document.querySelector("#archive-empty");
const categoryNav = document.querySelector("#category-nav");
const params = new URLSearchParams(window.location.search);
const requestedCategory = params.get("category");
const activeCategory = Object.prototype.hasOwnProperty.call(categories, requestedCategory)
  ? requestedCategory
  : "app-development";

document.querySelector("#archive-year").textContent = new Date().getFullYear();

Object.entries(categories).forEach(([slug, category]) => {
  const link = document.createElement("a");
  link.href = `projects.html?category=${slug}`;
  link.textContent = category.label;
  link.className = "category-link";
  link.classList.toggle("is-active", slug === activeCategory);
  if (slug === activeCategory) link.setAttribute("aria-current", "page");
  categoryNav.append(link);
});

const category = categories[activeCategory];
const filteredProjects = projects.filter(project => project.category === activeCategory);

document.querySelector("#archive-title").textContent = category.label;
document.querySelector("#archive-description").textContent = category.description;
document.querySelector("#project-count").textContent = filteredProjects.length;
document.querySelector("#project-count-label").textContent = filteredProjects.length === 1 ? "project" : "projects";
document.title = `${category.label} Projects | Aakash Sajeev K`;

const projectMarkup = filteredProjects.map((project, index) => `
  <article class="archive-project">
    <a class="archive-project-image" href="${project.projectUrl}" target="_blank" rel="noopener noreferrer" aria-label="View ${project.title}">
      <img src="${project.image}" alt="${project.title} project cover" loading="${index < 2 ? "eager" : "lazy"}">
      <span class="archive-project-arrow" aria-hidden="true">↗</span>
    </a>
    <div class="archive-project-meta">
      <p>${String(index + 1).padStart(2, "0")}</p>
      <p>${project.year} · ${project.projectType}</p>
    </div>
    <h2>${project.title}</h2>
    <p class="archive-project-description">${project.description}</p>
    <a class="archive-project-link" href="${project.projectUrl}" target="_blank" rel="noopener noreferrer" aria-label="View ${project.title} project">View Project <span aria-hidden="true">↗</span></a>
  </article>
`).join("");

grid.innerHTML = projectMarkup;
emptyState.hidden = filteredProjects.length !== 0;

if (window.gsap && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  gsap.from(".archive-hero > .archive-container > *", { opacity: 0, y: 18, duration: 0.65, stagger: 0.08, ease: "power2.out" });
  gsap.from(".archive-project", { opacity: 0, y: 24, duration: 0.7, stagger: 0.08, delay: 0.15, ease: "power2.out" });
}
