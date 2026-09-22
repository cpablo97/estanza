/* ============================================================
   Estanza — orchestration: menu, carousel, pager, form
   ============================================================ */
(() => {
  "use strict";


  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const stage = $("#stage");
  const scroller = $("#scroller");
  const rooms = $$(".room", scroller);
  const ids = rooms.map((r) => r.id);
  const navLinks = $$('.nav-link[href^="#"]');
  const logo = $(".logo");
  const roomLabel = $("[data-room-label]");
  const roomCurrent = $("[data-room-current]");
  const roomTotal = $("[data-room-total]");
  const navGroups = $$(".nav-group");

  // each room paints its own colour so the slide reveals it like a page turn
  rooms.forEach((r) => { if (r.dataset.bg) r.style.setProperty("--bg", r.dataset.bg); });

  const pad = (n) => String(n).padStart(2, "0");
  if (roomTotal) roomTotal.textContent = pad(rooms.length);
  const year = $("[data-year]");
  if (year) year.textContent = String(new Date().getFullYear());

  /* ----------------------------------------------------------
     Mobile drawer
     ---------------------------------------------------------- */
  const hamburger = $("#hamburger");
  const sidebar = $("#sidebar");
  const overlay = $("#overlay");
  const mobileMQ = window.matchMedia("(max-width: 899px)");

  function setMenu(open) {
    sidebar.classList.toggle("is-open", open);
    overlay.classList.toggle("is-open", open);
    hamburger.setAttribute("aria-expanded", String(open));
    hamburger.setAttribute("aria-label", (open ? hamburger.dataset.labelClose : hamburger.dataset.labelOpen) || hamburger.getAttribute("aria-label"));
    if (mobileMQ.matches) sidebar.inert = !open;
    if (open) $(".nav-link", sidebar)?.focus({ preventScroll: true });
    else if (document.activeElement && sidebar.contains(document.activeElement)) hamburger.focus();
  }
  const closeMenu = () => sidebar.classList.contains("is-open") && setMenu(false);

  if (hamburger && sidebar && overlay) {
    hamburger.addEventListener("click", () => setMenu(!sidebar.classList.contains("is-open")));
    overlay.addEventListener("click", closeMenu);
    sidebar.addEventListener("click", (e) => {
      if (e.target.closest("a") && mobileMQ.matches) closeMenu();
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
    const syncInert = () => { sidebar.inert = mobileMQ.matches && !sidebar.classList.contains("is-open"); };
    mobileMQ.addEventListener("change", syncInert);
    syncInert();
  }

  /* ----------------------------------------------------------
     Services carousel
     ---------------------------------------------------------- */
  const carousel = (() => {
    const root = $("[data-carousel]");
    if (!root) return null;
    const track = $("[data-track]", root);
    const cards = Array.from(track.children);
    const currentEl = $("[data-current]", root);
    const totalEl = $("[data-total]", root);
    const total = cards.length;
    let index = 0;
    let onChange = null;

    totalEl.textContent = String(total);

    function render() {
      track.style.transform = `translateX(-${index * 100}%)`;
      currentEl.textContent = String(index + 1);
      cards.forEach((card, k) => {
        card.classList.toggle("is-current", k === index);
        card.inert = k !== index;
      });
      if (onChange) onChange(index);
    }
    function goTo(i) { index = (i + total) % total; render(); }

    $('[data-dir="-1"]', root).addEventListener("click", () => goTo(index - 1));
    $('[data-dir="1"]', root).addEventListener("click", () => goTo(index + 1));

    let startX = null;
    track.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", (e) => {
      if (startX === null) return;
      const delta = e.changedTouches[0].clientX - startX;
      startX = null;
      if (Math.abs(delta) > 40) goTo(delta < 0 ? index + 1 : index - 1);
    });

    root.setAttribute("tabindex", "0");
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(index + 1); }
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(index - 1); }
    });

    render();
    return { goTo, get index() { return index; }, set onChange(fn) { onChange = fn; } };
  })();

  const slideLinks = $$(".nav-link[data-slide]");
  const servicesIndex = ids.indexOf("servicios");
  let currentRoom = 0;

  function syncSlideLinks() {
    const active = currentRoom === servicesIndex && carousel;
    slideLinks.forEach((a) => {
      const on = !!active && Number(a.dataset.slide) === carousel.index;
      a.classList.toggle("is-active", on);
      if (on) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
  }
  if (carousel) carousel.onChange = syncSlideLinks;

  /* ----------------------------------------------------------
     Room state shared by pager and mobile fallback
     ---------------------------------------------------------- */
  function onRoomChange(i) {
    currentRoom = i;
    const room = rooms[i];
    if (roomLabel) roomLabel.textContent = room.dataset.label || room.id;
    if (roomCurrent) roomCurrent.textContent = pad(i + 1);
    navGroups.forEach((g) => {
      g.classList.toggle("is-current", (g.dataset.rooms || "").split(/\s+/).includes(room.id));
    });
    syncSlideLinks();
  }

  /* ----------------------------------------------------------
     Pager (desktop, motion allowed) / native fallback
     ---------------------------------------------------------- */
  const pagerMQ = window.matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)");
  let pager = null;
  let observer = null;

  function startFallback() {
    if (!("IntersectionObserver" in window)) return;
    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const i = rooms.indexOf(entry.target);
        rooms.forEach((r, k) => r.classList.toggle("is-active", k === i));
        document.body.dataset.theme = entry.target.dataset.theme || "light";
        document.documentElement.style.setProperty("--room-bg", entry.target.dataset.bg || "");
        navLinks.forEach((a) => {
          const on = a.hash.slice(1) === entry.target.id && !a.dataset.slide;
          a.classList.toggle("is-active", on);
          if (on) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
        onRoomChange(i);
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    rooms.forEach((r) => observer.observe(r));
  }
  function stopFallback() {
    observer?.disconnect();
    observer = null;
  }

  function sync() {
    if (pagerMQ.matches && !pager) {
      stopFallback();
      pager = window.createPager({ stage, scroller, rooms, links: navLinks, onChange: onRoomChange });
    } else if (!pagerMQ.matches && pager) {
      pager.destroy();
      pager = null;
      rooms.forEach((r) => { r.classList.remove("is-active"); });
      startFallback();
    } else if (!pagerMQ.matches && !observer) {
      startFallback();
    }
  }
  pagerMQ.addEventListener("change", sync);
  sync();


  // Sidebar service links: go to the room, then to the slide
  slideLinks.forEach((a) => {
    a.addEventListener("click", () => {
      if (carousel) carousel.goTo(Number(a.dataset.slide));
    });
  });

  // Logo and in-page CTA links behave like nav anchors under the pager
  $$('a[href^="#"]:not(.nav-link)').forEach((a) => {
    a.addEventListener("click", (e) => {
      const i = ids.indexOf(a.hash.slice(1));
      if (i < 0 || !pager) return;
      e.preventDefault();
      pager.goTo(i);
    });
  });
  if (logo) logo.addEventListener("click", (e) => {
    if (!pager) return;
    e.preventDefault();
    pager.goTo(0);
  });

  /* ----------------------------------------------------------
     Hero photos: slow floating conveyor. Each photo drifts at its
     own speed and direction, leaves the frame on one side and
     re-enters from the other. Runs only while the hero is visible.
     ---------------------------------------------------------- */
  const hero = $("#inicio");
  const field = hero && $(".hero-photos", hero);
  const driftMQ = window.matchMedia("(min-width: 600px) and (prefers-reduced-motion: no-preference)");
  if (field) {
    const photos = $$(".hero-photo", field);
    // px per second; negative = right-to-left
    const speeds = [22, -15, 30];
    let W = 0;
    let items = [];
    let raf = 0;
    let last = 0;

    function layout() {
      W = field.clientWidth;
      items = photos.map((el, i) => {
        const w = el.getBoundingClientRect().width;
        const speed = speeds[i % speeds.length];
        // spread the photos evenly across the field to start
        const x = (W + w) * ((i + 0.5) / photos.length) - w;
        return { el, w, speed, x };
      });
      items.forEach(({ el, x }) => el.style.setProperty("--x", `${x.toFixed(1)}px`));
    }

    function tick(now) {
      raf = 0;
      const dt = Math.min(0.05, (now - last) / 1000 || 0);
      last = now;
      items.forEach((it) => {
        it.x += it.speed * dt;
        if (it.speed > 0 && it.x > W) it.x = -it.w;        // out on the right -> back in from the left
        if (it.speed < 0 && it.x < -it.w) it.x = W;         // out on the left  -> back in from the right
        it.el.style.setProperty("--x", `${it.x.toFixed(1)}px`);
      });
      schedule();
    }

    function running() {
      return driftMQ.matches && !document.hidden && hero.classList.contains("is-active");
    }
    function schedule() {
      if (!raf && running()) raf = requestAnimationFrame(tick);
    }
    function resume() { last = performance.now(); schedule(); }
    function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; }

    function reset() {
      stop();
      if (driftMQ.matches) { layout(); resume(); }
      else photos.forEach((el) => el.style.removeProperty("--x"));
    }

    window.addEventListener("resize", reset);
    driftMQ.addEventListener("change", reset);
    document.addEventListener("visibilitychange", () => (document.hidden ? stop() : resume()));
    new MutationObserver(() => (hero.classList.contains("is-active") ? resume() : stop()))
      .observe(hero, { attributes: true, attributeFilter: ["class"] });
    reset();
  }

  /* ----------------------------------------------------------
     Contact form
     ---------------------------------------------------------- */
  const form = $("#contact-form");
  const status = $("#form-status");

  function setStatus(msg, kind) {
    status.textContent = msg;
    status.className = "form-status" + (kind ? ` is-${kind}` : "");
  }

  if (form) {
    const msg = (k) => form.dataset["msg" + k] || "";
    const endpoint = form.dataset.endpoint || "";
    const netlify = form.hasAttribute("data-netlify");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const invalid = $$("input:invalid", form);
      if (invalid.length) {
        invalid[0].focus();
        setStatus(msg("Required"), "error");
        return;
      }

      const fd = new FormData(form);
      const submit = $('button[type="submit"]', form);
      submit.disabled = true;
      setStatus(msg("Sending"));

      try {
        if (endpoint) {
          const res = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(Object.fromEntries(fd.entries())),
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          setStatus(msg("Success"), "success");
        } else if (netlify) {
          const res = await fetch("/", { method: "POST", body: new URLSearchParams(fd), headers: { "Content-Type": "application/x-www-form-urlencoded" } });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          setStatus(msg("Success"), "success");
        } else {
          console.info("Estanza contact form (no endpoint configured):", Object.fromEntries(fd.entries()));
          setStatus(msg("Logged"), "success");
        }
        form.reset();
      } catch (err) {
        console.error(err);
        setStatus(msg("Error"), "error");
      } finally {
        submit.disabled = false;
      }
    });
  }
})();
