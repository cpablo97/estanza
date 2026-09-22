/* ============================================================
   Estanza — room pager
   One wheel gesture / key press / swipe = one room. The stage is
   translated by whole viewports; input is locked while a room
   changes so trackpad inertia never double-pages.
   ============================================================ */
(function () {
  "use strict";

  function createPager({ stage, scroller, rooms, links, onChange }) {
    const DUR = 950;      // must match --dur-room
    const LOCK = 1300;    // input lock after each change (reference value)
    const THRESH = 40;    // normalised deltaY needed to page
    const IDLE = 160;     // ms without wheel events before the accumulator resets
    const SETTLE = 300;   // ms after native inner scrolling before paging is allowed
    const SWIPE = 50;     // px

    const ids = rooms.map((r) => r.id);
    let index = -1;
    let locked = false;
    let acc = 0;
    let idleT = 0;
    let lastInner = 0;
    let touchY = null;
    const timers = [];

    const inner = (r) => r.querySelector(".room-scroll") || r;

    function goTo(i, { instant = false, fromHash = false } = {}) {
      i = Math.max(0, Math.min(rooms.length - 1, i));
      if (i === index) return;
      const from = index;
      index = i;
      locked = !instant;

      scroller.classList.toggle("is-instant", instant);
      scroller.style.setProperty("--section", String(i));
      stage.scrollTop = 0; // undo any browser fragment auto-scroll inside overflow:hidden

      rooms.forEach((r, k) => {
        const active = k === i;
        r.classList.toggle("is-active", active);
        r.inert = !active;
      });
      document.body.dataset.theme = rooms[i].dataset.theme || "light";
      document.documentElement.style.setProperty("--room-bg", rooms[i].dataset.bg || "");

      links.forEach((a) => {
        const on = a.hash.slice(1) === ids[i] && !a.dataset.slide;
        a.classList.toggle("is-active", on);
        if (on) a.setAttribute("aria-current", "true");
        else a.removeAttribute("aria-current");
      });

      if (!fromHash) history.replaceState(null, "", "#" + ids[i]);
      if (typeof onChange === "function") onChange(i, from);

      timers.push(setTimeout(() => rooms[i].focus({ preventScroll: true }), instant ? 0 : DUR));
      timers.push(setTimeout(() => { locked = false; acc = 0; }, instant ? 0 : LOCK));
      if (instant) {
        requestAnimationFrame(() => requestAnimationFrame(() => scroller.classList.remove("is-instant")));
      }
    }

    // Can the active room be left in `dir` (1 = down, -1 = up)?
    function atBoundary(dir) {
      const el = inner(rooms[index]);
      if (el.scrollHeight - el.clientHeight < 16) return true; // a few px of overflow never blocks paging
      return dir > 0
        ? el.scrollTop + el.clientHeight >= el.scrollHeight - 1
        : el.scrollTop <= 0;
    }

    function onWheel(e) {
      const dir = Math.sign(e.deltaY);
      if (!dir) return;
      if (!atBoundary(dir)) { acc = 0; lastInner = performance.now(); return; } // native inner scroll
      e.preventDefault();
      if (locked || performance.now() - lastInner < SETTLE) return;
      const px = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaMode === 2 ? e.deltaY * window.innerHeight : e.deltaY;
      acc += px;
      clearTimeout(idleT);
      idleT = setTimeout(() => { acc = 0; }, IDLE);
      if (Math.abs(acc) >= THRESH) { acc = 0; goTo(index + dir); }
    }

    function onKey(e) {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.target.closest("input, textarea, select, [contenteditable], [data-carousel]")) return;
      const rel = { ArrowDown: 1, PageDown: 1, ArrowUp: -1, PageUp: -1, " ": e.shiftKey ? -1 : 1 }[e.key];
      const target = e.key === "Home" ? 0 : e.key === "End" ? rooms.length - 1 : rel === undefined ? null : index + rel;
      if (target === null) return;
      if (rel !== undefined && !atBoundary(rel)) return; // let the inner room scroll first
      e.preventDefault();
      if (!locked) goTo(target);
    }

    function onTouchStart(e) { touchY = e.touches[0].clientY; }
    function onTouchEnd(e) {
      if (touchY === null) return;
      const d = touchY - e.changedTouches[0].clientY;
      touchY = null;
      const dir = Math.sign(d);
      if (Math.abs(d) >= SWIPE && atBoundary(dir) && !locked) goTo(index + dir);
    }

    function fromHash(instant) {
      const i = ids.indexOf(location.hash.slice(1));
      goTo(i < 0 ? 0 : i, { instant, fromHash: true });
    }
    function onHash() { fromHash(false); }
    function onLink(e) {
      e.preventDefault();
      goTo(ids.indexOf(e.currentTarget.hash.slice(1)));
    }

    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("keydown", onKey);
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchend", onTouchEnd);
    window.addEventListener("hashchange", onHash);
    links.forEach((a) => a.addEventListener("click", onLink));

    document.documentElement.classList.add("has-pager");
    fromHash(true);

    return {
      goTo,
      get index() { return index; },
      destroy() {
        window.removeEventListener("wheel", onWheel);
        window.removeEventListener("keydown", onKey);
        window.removeEventListener("touchstart", onTouchStart);
        window.removeEventListener("touchend", onTouchEnd);
        window.removeEventListener("hashchange", onHash);
        links.forEach((a) => a.removeEventListener("click", onLink));
        timers.forEach(clearTimeout);
        clearTimeout(idleT);
        scroller.style.removeProperty("--section");
        scroller.classList.remove("is-instant");
        rooms.forEach((r) => { r.inert = false; });
        document.documentElement.classList.remove("has-pager");
      },
    };
  }

  window.createPager = createPager;
})();
