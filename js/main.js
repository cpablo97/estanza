(() => {
  "use strict";

  /* ----------------------------------------------------------
     Mobile hamburger menu
     ---------------------------------------------------------- */
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");

  function closeMenu() {
    sidebar.classList.remove("is-open");
    overlay.classList.remove("is-open");
    hamburger.setAttribute("aria-expanded", "false");
  }

  function toggleMenu() {
    const isOpen = sidebar.classList.toggle("is-open");
    overlay.classList.toggle("is-open", isOpen);
    hamburger.setAttribute("aria-expanded", String(isOpen));
  }

  hamburger.addEventListener("click", toggleMenu);
  overlay.addEventListener("click", closeMenu);

  sidebar.querySelectorAll("a, button.logo").forEach((el) => {
    el.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 900px)").matches) closeMenu();
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMenu();
  });

  /* ----------------------------------------------------------
     Logo -> scroll to top
     ---------------------------------------------------------- */
  document.querySelector(".logo")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ----------------------------------------------------------
     Services carousel
     ---------------------------------------------------------- */
  const carousel = document.querySelector("[data-carousel]");
  if (carousel) {
    const track = carousel.querySelector("[data-track]");
    const cards = Array.from(track.children);
    const currentEl = carousel.querySelector("[data-current]");
    const totalEl = carousel.querySelector("[data-total]");
    const prevBtn = carousel.querySelector('[data-dir="-1"]');
    const nextBtn = carousel.querySelector('[data-dir="1"]');

    let index = 0;
    const total = cards.length;
    totalEl.textContent = String(total);

    function render() {
      track.style.transform = `translateX(-${index * 100}%)`;
      currentEl.textContent = String(index + 1);
    }

    function goTo(newIndex) {
      index = (newIndex + total) % total;
      render();
    }

    prevBtn.addEventListener("click", () => goTo(index - 1));
    nextBtn.addEventListener("click", () => goTo(index + 1));

    // Sidebar service links jump straight to a given slide
    document.querySelectorAll(".nav-link[data-slide]").forEach((link) => {
      link.addEventListener("click", () => {
        goTo(parseInt(link.dataset.slide, 10));
      });
    });

    // Swipe support
    let startX = null;
    track.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", (e) => {
      if (startX === null) return;
      const delta = e.changedTouches[0].clientX - startX;
      if (Math.abs(delta) > 40) goTo(delta < 0 ? index + 1 : index - 1);
      startX = null;
    });

    // Keyboard support when carousel is focused/hovered
    carousel.setAttribute("tabindex", "0");
    carousel.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") goTo(index + 1);
      if (e.key === "ArrowLeft") goTo(index - 1);
    });

    render();
  }

  /* ----------------------------------------------------------
     Active nav link on scroll
     ---------------------------------------------------------- */
  const navLinks = Array.from(document.querySelectorAll('.nav-link[href^="#"]'));
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  if ("IntersectionObserver" in window && sections.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = `#${entry.target.id}`;
          navLinks.forEach((link) => {
            link.classList.toggle("is-active", link.getAttribute("href") === id);
          });
        });
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    sections.forEach((section) => observer.observe(section));
  }

  /* ----------------------------------------------------------
     Contact form — client-side validation only
     ---------------------------------------------------------- */
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        status.textContent = "Por favor completa los campos requeridos.";
        status.className = "form-status is-error";
        return;
      }

      const data = Object.fromEntries(new FormData(form).entries());
      console.log("Estanza contact form submission:", data);

      status.textContent = "¡Gracias! Te contactaremos pronto.";
      status.className = "form-status is-success";
      form.reset();
    });
  }
})();
