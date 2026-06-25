const loader = document.querySelector("[data-loader]");
const progress = document.querySelector("[data-scroll-progress]");
const progressLabel = document.querySelector("[data-progress-label]");
const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = [...document.querySelectorAll(".nav a")];
const revealItems = [...document.querySelectorAll(".reveal")];
const filterButtons = [...document.querySelectorAll("[data-filter]")];
const workCards = [...document.querySelectorAll(".work-card")];
const lightbox = document.querySelector("[data-lightbox]");
const lightboxImage = document.querySelector("[data-lightbox-image]");
const lightboxTitle = document.querySelector("[data-lightbox-title]");
const lightboxClose = document.querySelector("[data-lightbox-close]");
const copyButton = document.querySelector("[data-copy]");
const copyStatus = document.querySelector("[data-copy-status]");
const sectionNames = {
  profil: "Profil",
  sluzby: "Dovednosti",
  portfolio: "Portfolio",
  dokumenty: "Dokumenty",
  kontakt: "Kontakt"
};

window.addEventListener("load", () => {
  window.setTimeout(() => loader?.classList.add("is-hidden"), 450);
});

const setProgress = () => {
  const scrollTop = window.scrollY;
  const height = document.documentElement.scrollHeight - window.innerHeight;
  const percent = height > 0 ? (scrollTop / height) * 100 : 0;
  progress.style.width = `${percent}%`;
  header.classList.toggle("is-scrolled", scrollTop > 10);
};

window.addEventListener("scroll", setProgress, { passive: true });
setProgress();

navToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  document.body.classList.toggle("menu-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.16 }
);

revealItems.forEach((item) => revealObserver.observe(item));

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      if (progressLabel) {
        progressLabel.textContent = sectionNames[entry.target.id] || "Úvod";
      }
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
      });
    });
  },
  { rootMargin: "-35% 0px -55% 0px" }
);

document.querySelectorAll("main section[id]").forEach((section) => sectionObserver.observe(section));

const applyPortfolioFilter = (activeButton) => {
  const selectedFilter = activeButton.dataset.filter;
  filterButtons.forEach((item) => {
    const isActive = item === activeButton;
    item.classList.toggle("active", isActive);
    item.setAttribute("aria-pressed", String(isActive));
  });
  workCards.forEach((card) => {
    const categories = card.dataset.category || "";
    card.classList.toggle("is-hidden", selectedFilter !== "all" && !categories.includes(selectedFilter));
  });
};

filterButtons.forEach((button) => {
  button.setAttribute("aria-pressed", String(button.classList.contains("active")));
});

document.addEventListener("click", (event) => {
  const filterButton = event.target.closest("[data-filter]");
  if (!filterButton) return;
  applyPortfolioFilter(filterButton);
});

document.querySelectorAll("[data-image]").forEach((trigger) => {
  trigger.addEventListener("click", () => {
    lightboxImage.src = trigger.dataset.image;
    lightboxImage.alt = trigger.dataset.title;
    lightboxTitle.textContent = trigger.dataset.title;
    lightbox.showModal();
  });
});

lightboxClose?.addEventListener("click", () => lightbox.close());

lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    lightbox.close();
  }
});

copyButton?.addEventListener("click", async () => {
  const value = copyButton.dataset.copy;
  try {
    await navigator.clipboard.writeText(value);
    copyStatus.textContent = "E-mail zkopírován.";
  } catch {
    copyStatus.textContent = value;
  }
});

const counters = [...document.querySelectorAll("[data-count]")];
const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = Number(entry.target.dataset.count);
      const start = performance.now();
      const duration = 950;

      const tick = (now) => {
        const progressValue = Math.min((now - start) / duration, 1);
        const value = Math.round(target * progressValue);
        entry.target.textContent = value.toLocaleString("cs-CZ");
        if (progressValue < 1) {
          requestAnimationFrame(tick);
        }
      };

      requestAnimationFrame(tick);
      counterObserver.unobserve(entry.target);
    });
  },
  { threshold: 0.8 }
);

counters.forEach((counter) => counterObserver.observe(counter));
