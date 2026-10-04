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
