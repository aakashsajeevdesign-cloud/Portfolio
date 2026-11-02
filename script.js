// General site behavior.
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.addEventListener("load", () => window.scrollTo(0, 0));

// Header navigation and mobile menu behavior.
const yearElement = document.querySelector("#year");
if (yearElement) yearElement.textContent = new Date().getFullYear();
const menuButton = document.querySelector("#menu-toggle");
const navLinks = document.querySelector("#nav-links");
if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });
  navLinks.addEventListener("click", event => {
    if (event.target.closest("a")) {
      navLinks.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open menu");
    }
  });
}

// Project filtering and conditional project type field.
const projectList = document.querySelector("#projects");
const filters = document.querySelector("#filters");
const projectTypeSelect = document.querySelector("#project-type");
const customProjectField = document.querySelector("#custom-project-field");
const customProjectInput = document.querySelector("#custom-project-type");
if (projectTypeSelect && customProjectField && customProjectInput) {
  projectTypeSelect.addEventListener("change", () => {
    const needsCustomType = projectTypeSelect.value === "other";
    customProjectField.hidden = !needsCustomType;
    customProjectInput.required = needsCustomType;
    if (!needsCustomType) customProjectInput.value = "";
  });
}
if (projectList && filters) filters.addEventListener("click", event => {
  const button = event.target.closest("button[data-filter]");
  if (!button) return;
  const selected = button.dataset.filter;
  filters.querySelectorAll("button[data-filter]").forEach(item => item.setAttribute("aria-pressed", String(item === button)));
  projectList.querySelectorAll(".project").forEach(project => { project.hidden = selected !== "All" && project.dataset.category !== selected; });
});

// Certificate carousel, controls, modal, and swipe interactions.
(() => {
  "use strict";
  const CERTIFICATES = [
    { name: "UI & UX Design", issuer: "Avodha Education", date: "15 Aug 2025", image: "assets/certificates/cert-1.png", alt: "UI and UX Design Certificate" },
    { name: "Frontend Architecture & Design Systems", issuer: "Academy for Digital Innovation", date: "May 2024", image: "assets/certificates/cert-2.jpg", alt: "Frontend Architecture and Design Systems Certificate" },
    { name: "UX Interaction & Product Design", issuer: "Stratos Design Academy", date: "Jul 2023", image: "assets/certificates/cert-3.jpg", alt: "UX Interaction and Product Design Certificate" },
    { name: "Responsive Web Application Engineering", issuer: "Institute of Advanced Technology", date: "Mar 2024", image: "assets/certificates/cert-4.jpg", alt: "Responsive Web Application Engineering Certificate" }
  ];
  const carouselContainer = document.getElementById("cert-carousel"), section = document.getElementById("certificates");
  const prevButton = document.getElementById("cert-prev"), nextButton = document.getElementById("cert-next");
  const modal = document.getElementById("cert-modal"), modalBackdrop = document.getElementById("cert-modal-backdrop"), modalClose = document.getElementById("cert-modal-close");
  const modalImage = document.getElementById("cert-modal-img"), modalIssuer = document.getElementById("cert-modal-issuer"), modalDate = document.getElementById("cert-modal-date"), modalTitle = document.getElementById("cert-modal-title");
  if (!carouselContainer || !section) return;
  const cards = [...carouselContainer.querySelectorAll(".cert-card")];
  if (!cards.length) return;
  let activeIndex = 0, autoplayTimer = null, isInViewport = true;
  function normalizeSlot(offset) { let slot = offset; if (slot > CERTIFICATES.length / 2) slot -= CERTIFICATES.length; if (slot < -CERTIFICATES.length / 2) slot += CERTIFICATES.length; return slot; }
  function updateCarousel() { cards.forEach(card => { card.dataset.slot = "0"; card.setAttribute("aria-hidden", "false"); }); }
  function stopAutoplay() { window.clearInterval(autoplayTimer); autoplayTimer = null; }
  function restartAutoplay() { stopAutoplay(); if (!isInViewport || document.hidden) return; autoplayTimer = window.setInterval(() => { activeIndex = (activeIndex + 1) % CERTIFICATES.length; updateCarousel(); }, 4500); }
  function move(direction) { activeIndex = (activeIndex + direction + CERTIFICATES.length) % CERTIFICATES.length; updateCarousel(); restartAutoplay(); }
  function openModal(index) { const cert = CERTIFICATES[index]; if (!cert || !modal || !modalImage || !modalIssuer || !modalDate || !modalTitle) return; modalImage.src = cert.image; modalImage.alt = cert.alt; modalIssuer.textContent = cert.issuer; modalDate.textContent = cert.date; modalTitle.textContent = cert.name; modal.classList.add("is-open"); modal.setAttribute("aria-hidden", "false"); document.body.style.overflow = "hidden"; modalClose?.focus(); }
  function closeModal() { if (!modal) return; modal.classList.remove("is-open"); modal.setAttribute("aria-hidden", "true"); document.body.style.overflow = ""; }
  carouselContainer.addEventListener("click", event => { const card = event.target.closest(".cert-card"); if (!card) return; openModal(Number(card.dataset.index)); });
  prevButton?.addEventListener("click", () => move(-1)); nextButton?.addEventListener("click", () => move(1));
  section.addEventListener("mouseenter", stopAutoplay); section.addEventListener("mouseleave", restartAutoplay);
  carouselContainer.addEventListener("pointermove", event => { const card = event.target.closest('.cert-card[data-slot="0"]'); if (!card || event.pointerType === "touch") return; const inner = card.querySelector(".cert-card-inner"), rect = card.getBoundingClientRect(); const x = (event.clientX - rect.left) / rect.width - 0.5, y = (event.clientY - rect.top) / rect.height - 0.5; inner.style.transform = `rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateZ(8px)`; });
  carouselContainer.addEventListener("pointerleave", () => carouselContainer.querySelectorAll(".cert-card-inner").forEach(inner => { inner.style.transform = ""; }));
  let touchStartX = 0;
  carouselContainer.addEventListener("touchstart", event => { touchStartX = event.changedTouches[0].clientX; stopAutoplay(); }, { passive: true });
  carouselContainer.addEventListener("touchend", event => { const distance = event.changedTouches[0].clientX - touchStartX; if (Math.abs(distance) > 45) move(distance > 0 ? -1 : 1); else restartAutoplay(); }, { passive: true });
  modalBackdrop?.addEventListener("click", closeModal); modalClose?.addEventListener("click", closeModal);
  document.addEventListener("keydown", event => { if (event.key === "Escape") closeModal(); if (modal?.classList.contains("is-open")) return; if (event.key === "ArrowLeft") move(-1); if (event.key === "ArrowRight") move(1); });
  document.addEventListener("visibilitychange", restartAutoplay); window.addEventListener("beforeunload", stopAutoplay);
  if ("IntersectionObserver" in window) { const observer = new IntersectionObserver(entries => { isInViewport = entries[0].isIntersecting; restartAutoplay(); }, { threshold: 0.15 }); observer.observe(section); }
  updateCarousel(); restartAutoplay();
})();

// GSAP is required by the supplied hero reveal animation.
if (window.gsap && document.querySelector("#hero-discovery")) {
// Hero reveal, workflow timeline, marquee, and experience card animations.

    const discovery = document.querySelector("#hero-discovery");
    const searchStage = discovery.querySelector(".discovery-search");
    const searchBar = discovery.querySelector(".discovery-searchbar");
    const queryButton = discovery.querySelector(".discovery-query");
    const refreshButtons = discovery.querySelectorAll(".discovery-refresh");
    const queryText = discovery.querySelector(".discovery-query-text");
    const dashboard = discovery.querySelector(".designer-dashboard");
    const query = "Who is the best UI/UX & Web Designer in Kannur?";
    const queryProgress = { value: 0 };
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const setQueryProgress = () => {
      queryText.textContent = query.slice(0, Math.floor(queryProgress.value * query.length));
      queryText.parentElement.scrollLeft = queryText.parentElement.scrollWidth;
    };

    const dashboardParts = [
      dashboard.querySelector(".dashboard-topline"),
      dashboard.querySelector(".dashboard-overview"),
      dashboard.querySelector(".dashboard-sources"),
      dashboard.querySelector(".dashboard-footer")
    ];
    const dashboardProjects = dashboard.querySelectorAll(".dashboard-project");

    const showDashboardImmediately = () => {
      queryText.textContent = query;
      searchStage.setAttribute("aria-hidden", "true");
      dashboard.setAttribute("aria-hidden", "false");
      discovery.classList.add("is-profile");
      gsap.set(searchStage, { autoAlpha: 0 });
      gsap.set(dashboard, { autoAlpha: 1, pointerEvents: "auto" });
      gsap.set(dashboardParts, { autoAlpha: 1, y: 0 });
      gsap.set(dashboardProjects, { autoAlpha: 1, y: 0 });
    };

    let discoveryTimeline;
    let reducedRevealTimer;

    const replayDiscovery = () => {
      if (prefersReducedMotion) {
        window.clearTimeout(reducedRevealTimer);
        queryText.textContent = query;
        discovery.classList.remove("is-profile");
        searchStage.setAttribute("aria-hidden", "false");
        dashboard.setAttribute("aria-hidden", "true");
        gsap.set(discovery, { autoAlpha: 1, y: 0 });
        gsap.set(searchStage, { autoAlpha: 1, y: 0 });
        gsap.set(dashboard, { autoAlpha: 0, pointerEvents: "none" });
        reducedRevealTimer = window.setTimeout(showDashboardImmediately, 700);
        return;
      }

      discovery.classList.remove("is-profile");
      searchStage.setAttribute("aria-hidden", "false");
      dashboard.setAttribute("aria-hidden", "true");
      gsap.set(searchStage, { autoAlpha: 1, y: 0 });
      gsap.set(discovery, { autoAlpha: 1, y: 0 });
      gsap.set(searchBar, { scale: 1 });
      searchBar.classList.remove("is-searching");
      gsap.set(dashboard, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(dashboardParts, { autoAlpha: 0, y: 12 });
      gsap.set(dashboardProjects, { autoAlpha: 0, y: 10 });
      queryProgress.value = 0;
      setQueryProgress();
      discoveryTimeline.restart();
    };

    if (prefersReducedMotion) {
      showDashboardImmediately();
    } else {
      gsap.set(discovery, { autoAlpha: 0, y: 14 });
      gsap.set(dashboard, { autoAlpha: 0, pointerEvents: "none" });
      gsap.set(dashboardParts, { autoAlpha: 0, y: 12 });
      gsap.set(dashboardProjects, { autoAlpha: 0, y: 10 });

      discoveryTimeline = gsap.timeline({
        paused: true,
        onComplete: () => {
          searchStage.setAttribute("aria-hidden", "true");
          dashboard.setAttribute("aria-hidden", "false");
        }
      });

      discoveryTimeline
        .to(discovery, { autoAlpha: 1, y: 0, duration: 0.55, ease: "power2.out" })
        .to(queryProgress, {
          value: 1,
          duration: 2.75,
          ease: "none",
          onUpdate: setQueryProgress
        }, "-=0.08")
        .to({}, { duration: 0.55 })
        .call(() => searchBar.classList.add("is-searching"))
        .to(searchBar, { scale: 0.985, duration: 0.12, ease: "power2.out" })
        .to(searchBar, { scale: 1, duration: 0.2, ease: "power2.out" })
        .to(searchStage, { autoAlpha: 0, y: -8, duration: 0.32, ease: "power2.inOut" }, "+=0.12")
        .call(() => discovery.classList.add("is-profile"))
        .set(dashboard, { autoAlpha: 1, pointerEvents: "auto" }, "<0.04")
        .to(dashboardParts[0], { autoAlpha: 1, y: 0, duration: 0.26, ease: "power2.out" }, "<0.08")
        .to(dashboardParts[1], { autoAlpha: 1, y: 0, duration: 0.38, ease: "power3.out" }, "-=0.04")
        .to(dashboardParts[2], { autoAlpha: 1, y: 0, duration: 0.38, ease: "power3.out" }, "-=0.12")
        .to(dashboardProjects, { autoAlpha: 1, y: 0, duration: 0.3, stagger: 0.08, ease: "power2.out" }, "-=0.08")
        .to(dashboardParts[3], { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, "-=0.02");
      discoveryTimeline.play();
    }

    queryButton.addEventListener("click", replayDiscovery);
    refreshButtons.forEach(button => button.addEventListener("click", replayDiscovery));
    dashboard.querySelector(".dashboard-searchline").addEventListener("click", replayDiscovery);


}

/* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
       NEON WORKFLOW TIMELINE â€” Animation Controller
       â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
    (function () {
      "use strict";

      // â”€â”€ Guard: reduce motion â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // â”€â”€ Element references â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      const section = document.getElementById("workflow");
      const stage = document.getElementById("nwt-stage");
      const svgEl = document.getElementById("nwt-svg");
      const mainPath = document.getElementById("nwt-main-path");
      const revealPathEl = document.getElementById("nwt-reveal-path");
      const plane = document.getElementById("nwt-plane");
      const nodes = svgEl ? Array.from(svgEl.querySelectorAll(".nwt-node")) : [];
      const labels = Array.from(document.querySelectorAll(".nwt-node-label"));

      // Mobile elements
      const mobileSteps = Array.from(document.querySelectorAll(".nwt-mobile-step"));
      const mobilePath = document.getElementById("nwt-mobile-path");
      const mobileReveal = document.getElementById("nwt-mobile-reveal-path");
      const mobilePlane = document.getElementById("nwt-mobile-plane");

      if (!section) return;

      // â”€â”€ Reduced motion: reveal everything statically â”€â”€â”€â”€â”€
      if (reduceMotion) {
        nodes.forEach(n => { n.style.opacity = "1"; });
        labels.forEach(l => { l.style.opacity = "1"; });
        mobileSteps.forEach(s => { s.style.opacity = "1"; s.style.transform = "none"; });
        return;
      }

      // â”€â”€ Path-follow helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      /**
       * Animate an element along an SVG path using rAF.
       * @param {SVGPathElement} path  â€” the path to follow
       * @param {SVGGElement}    el    â€” the element to move
       * @param {number}         duration â€” ms
       * @param {Function}       [onProgress] â€” called with (ratio 0â€“1)
       * @param {Function}       [onDone]
       */
      function animateAlongPath(path, el, duration, onProgress, onDone) {
        const total = path.getTotalLength();
        let start = null;

        function tick(ts) {
          if (!start) start = ts;
          const elapsed = ts - start;
          // easeInOutQuad
          let t = Math.min(elapsed / duration, 1);
          const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

          const dist = total * eased;
          const pt = path.getPointAtLength(dist);
          const ptA = path.getPointAtLength(Math.max(0, dist - 2));
          const ptB = path.getPointAtLength(Math.min(total, dist + 2));

          // angle in degrees
          const angle = Math.atan2(ptB.y - ptA.y, ptB.x - ptA.x) * 180 / Math.PI;
          el.setAttribute("transform", `translate(${pt.x},${pt.y}) rotate(${angle})`);

          if (onProgress) onProgress(eased);

          if (t < 1) {
            requestAnimationFrame(tick);
          } else {
            // park at end
            const endPt = path.getPointAtLength(total);
            const endAngle = angle;
            el.setAttribute("transform", `translate(${endPt.x},${endPt.y}) rotate(${endAngle})`);
            if (onDone) onDone();
          }
        }

        requestAnimationFrame(tick);
      }

      /**
       * Animate the stroke-dashoffset of a path to progressively reveal it.
       * @param {SVGPathElement} path
       * @param {number}         duration â€” ms
       * @param {Function}       [onDone]
       */
      function revealPath(path, duration, onDone) {
        const total = path.getTotalLength();
        // initialise to fully hidden
        path.style.strokeDasharray = `5 10`;
        path.style.strokeDashoffset = total;
        let start = null;

        function tick(ts) {
          if (!start) start = ts;
          const t = Math.min((ts - start) / duration, 1);
          const eased = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
          path.style.strokeDashoffset = total * (1 - eased);
          if (t < 1) requestAnimationFrame(tick);
          else { path.style.strokeDashoffset = "0"; if (onDone) onDone(); }
        }
        requestAnimationFrame(tick);
      }

      /**
       * Fade + slide in an element using CSS transitions (lightweight).
       */
      function revealElement(el, delay) {
        setTimeout(() => {
          el.style.transition = "opacity 0.45s ease";
          el.style.opacity = "1";
        }, delay);
      }

      // â”€â”€ Milestone trigger ratios along path 0â€“1 â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      // Nodes at path total-length fractions (approx based on path geometry):
      // We estimate programmatically below after path is ready.
      const NODE_RATIOS = [0.10, 0.32, 0.54, 0.73, 0.92]; // rough fractions

      // â”€â”€ Desktop animation sequence â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      let desktopPlayed = false;

      function playDesktop() {
        if (desktopPlayed || !mainPath) return;
        desktopPlayed = true;

        const FLIGHT_DURATION = 4800; // ms for full plane journey

        // 1. Hide plane initially then move to start
        if (plane) {
          const startPt = mainPath.getPointAtLength(0);
          plane.setAttribute("transform", `translate(${startPt.x},${startPt.y}) rotate(0)`);
        }

        // 2. Reveal dotted path concurrently with plane flight
        if (revealPathEl && revealPathEl !== mainPath) {
          revealPath(revealPathEl, FLIGHT_DURATION * 0.9);
        }

        // 3. Fly plane along path; stagger node + label reveals
        if (plane) {
          // Compute actual ratios based on path points at milestone x-coords
          const total = mainPath.getTotalLength();
          // Milestones at SVG x positions: 120, 360, 600, 840, 1080
          // We find the closest path point for each x
          const svgWidth = 1200;
          const milestoneX = [140, 380, 600, 830, 1040];
          const milestoneRatios = milestoneX.map(mx => {
            // sample path at intervals to find closest point
            const steps = 300;
            let bestRatio = 0, bestDist = Infinity;
            for (let i = 0; i <= steps; i++) {
              const ratio = i / steps;
              const pt = mainPath.getPointAtLength(total * ratio);
              const d = Math.abs(pt.x - mx);
              if (d < bestDist) { bestDist = d; bestRatio = ratio; }
            }
            return bestRatio;
          });

          const nodeTriggerTimes = milestoneRatios.map(r => r * FLIGHT_DURATION);

          animateAlongPath(mainPath, plane, FLIGHT_DURATION, (eased) => {
            // reveal nodes as plane passes their ratios
            const elapsed = eased * FLIGHT_DURATION;
            nodes.forEach((node, i) => {
              if (elapsed >= nodeTriggerTimes[i] && node.style.opacity !== "1") {
                node.style.transition = "opacity 0.4s ease";
                node.style.opacity = "1";
                // also reveal corresponding label slightly after
                if (labels[i]) revealElement(labels[i], 200);
              }
            });
          });
        }
      }

      // â”€â”€ Mobile animation sequence â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      let mobilePlayed = false;

      function playMobile() {
        if (mobilePlayed) return;
        mobilePlayed = true;

        const MOBILE_FLIGHT = 4000;

        const mobileList = document.querySelector(".nwt-mobile-list");
        mobileList?.classList.add("is-revealing");

        if (mobilePlane && mobilePath) {
          const startPt = mobilePath.getPointAtLength(0);
          mobilePlane.setAttribute("transform", `translate(${startPt.x},${startPt.y}) rotate(90)`);
          revealPath(mobileReveal || mobilePath, MOBILE_FLIGHT * 0.95);
          animateAlongPath(mobilePath, mobilePlane, MOBILE_FLIGHT);
        }

        // stagger mobile step reveals
        mobileSteps.forEach((step, i) => {
          setTimeout(() => {
            step.style.transition = "opacity 0.5s ease, transform 0.5s ease";
            step.style.opacity = "1";
            step.style.transform = "translateY(0)";
          }, 300 + i * 400);
        });
      }

      // â”€â”€ Determine which layout is active â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      function isDesktop() {
        return stage && getComputedStyle(stage).display !== "none";
      }

      // â”€â”€ Intersection Observer â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
      if (!("IntersectionObserver" in window)) { nodes.forEach(n => { n.style.opacity = "1"; }); labels.forEach(l => { l.style.opacity = "1"; }); mobileSteps.forEach(s => { s.style.opacity = "1"; }); return; }
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (isDesktop()) {
              playDesktop();
            } else {
              playMobile();
            }
            // Only unobserve after first play; don't re-trigger on scroll-back
            observer.unobserve(section);
          }
        });
      }, {
        threshold: 0.15
      });

      observer.observe(section);

    })();

(() => {
      document.querySelectorAll(".process-section .marquee-track").forEach((track) => {
        const originalGroup = track.querySelector(".marquee-group");
        if (!originalGroup || track.querySelectorAll(".marquee-group").length > 1) return;
        const loopGroup = originalGroup.cloneNode(true);
        loopGroup.setAttribute("aria-hidden", "true");
        loopGroup.querySelectorAll(".strength").forEach((card) => card.removeAttribute("tabindex"));
        track.appendChild(loopGroup);
      });
    })();

(() => {
      const experienceCards = document.querySelectorAll(".experience-section .experience-card");
      if (!experienceCards.length) return;

      if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        experienceCards.forEach((card) => card.classList.add("is-visible"));
        return;
      }

      const experienceObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

      experienceCards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 90}ms`;
        experienceObserver.observe(card);
      });
    })();
