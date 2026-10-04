(function () {
  // Footer year
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Interactive prototype: show a loading indicator until the app says its first screen is up (a message from the app),
  // or, if no message comes, a moment after the frame has loaded
  document.querySelectorAll(".cs-screen").forEach(function (screen) {
    var frame = screen.querySelector("iframe");
    var loading = screen.querySelector(".cs-loading");
    if (!frame || !loading) return;
    var hide = function () { loading.classList.add("done"); };
    window.addEventListener("message", function (e) {
      if (e.source === frame.contentWindow && e.origin === window.location.origin && e.data && e.data.type === "pocketsaju-ready") hide();
    });
    frame.addEventListener("load", function () { setTimeout(hide, 2500); });
  });

  // Feature list + prototype: choosing a feature opens its screen in the app inside the phone frame.
  // The app is a same-origin Expo Router build, so we push the route into the iframe's history and fire popstate.
  // Some features live in a sheet (chat, daily draw, top-up): after the route opens we press that button inside the app.
  // Sheets stay open across routes in the app, so after one of those the frame is reloaded before the next feature.
  document.querySelectorAll("[data-viewer]").forEach(function (v) {
    var frame = v.querySelector("iframe");
    var buttons = [].slice.call(v.querySelectorAll("button[data-route]"));
    if (!frame || !buttons.length) return;
    var base = new URL(frame.getAttribute("src"), location.href).pathname.replace(/\/$/, "");
    var phone = v.querySelector(".cs-proto-phone");
    var seq = 0;
    var dirty = false;

    function ready(w) {
      try { return !w.__stale && w.location.pathname.indexOf(base) === 0 && !!w.document.body && w.document.body.innerText.length > 0; } catch (e) { return false; }
    }
    function whenReady(cb, token, tries) {
      if (token !== seq) return;
      var w = frame.contentWindow;
      if (ready(w)) { cb(w); return; }
      if (tries < 150) setTimeout(function () { whenReady(cb, token, tries + 1); }, 100);
    }
    function pressWhenShown(w, label, text, token, tries) {
      if (token !== seq) return;
      var el = null;
      try {
        [].slice.call(w.document.querySelectorAll('[role="button"]')).some(function (b) {
          var r = b.getBoundingClientRect();
          if (!r.width || !r.height) return false;
          if ((label && b.getAttribute("aria-label") === label) || (text && (b.innerText || "").indexOf(text) !== -1)) { el = b; return true; }
          return false;
        });
      } catch (e) { return; }
      if (el) { el.click(); return; }
      if (tries < 40) setTimeout(function () { pressWhenShown(w, label, text, token, tries + 1); }, 150);
    }
    function go(w, route, token, tries) {
      if (token !== seq) return;
      var target = route === "/" ? base + "/" : base + route;
      w.history.pushState(null, "", target);
      w.dispatchEvent(new w.PopStateEvent("popstate", { state: null }));
      // a freshly started app can still reset its own route once; check and push again
      setTimeout(function () {
        try { if (token === seq && tries < 3 && w.location.pathname !== target) go(w, route, token, tries + 1); } catch (e) {}
      }, 700);
    }
    function apply(w, b, token) {
      var label = b.getAttribute("data-press-label");
      var text = b.getAttribute("data-press-text");
      go(w, b.getAttribute("data-route"), token, 0);
      if (label || text) {
        dirty = true;
        setTimeout(function () { pressWhenShown(w, label, text, token, 0); }, 1200);
      }
    }
    function show(b) {
      var token = ++seq;
      whenReady(function (w) {
        if (!dirty) { apply(w, b, token); return; }
        dirty = false;
        w.__stale = true;
        w.location.replace(base + "/");
        setTimeout(function () { whenReady(function (w2) { setTimeout(function () { if (token === seq) apply(w2, b, token); }, 600); }, token, 0); }, 300);
      }, token, 0);
    }
    function bringIntoView() {
      if (!phone) return;
      var r = phone.getBoundingClientRect();
      var shown = Math.min(r.bottom, window.innerHeight) - Math.max(r.top, 0);
      if (shown < r.height * 0.4) phone.scrollIntoView({ block: "nearest", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
    }
    buttons.forEach(function (b) {
      b.addEventListener("click", function () {
        buttons.forEach(function (o) { o.setAttribute("aria-pressed", o === b ? "true" : "false"); });
        show(b);
        bringIntoView();
      });
    });
  });

  // Case study table of contents: mark the section in view
  var tocLinks = document.querySelectorAll(".cs-toc ol a[href^='#']");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        tocLinks.forEach(function (a) {
          if (a.getAttribute("href") === "#" + entry.target.id) a.setAttribute("aria-current", "true");
          else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    tocLinks.forEach(function (a) {
      var sec = document.getElementById(a.getAttribute("href").slice(1));
      if (sec) spy.observe(sec);
    });
  }

  // Reveal on scroll
  var items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) { el.classList.add("in"); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("in");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  items.forEach(function (el) { io.observe(el); });
})();
