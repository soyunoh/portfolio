(function () {
  // Footer year
  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Interactive prototype: load the app into the frame only when the visitor asks for it
  document.querySelectorAll("[data-embed]").forEach(function (box) {
    var start = box.querySelector(".cs-proto-start");
    if (!start) return;
    start.addEventListener("click", function () {
      var frame = document.createElement("iframe");
      frame.src = box.getAttribute("data-embed");
      frame.title = box.getAttribute("data-title") || "Interactive prototype";
      frame.setAttribute("allow", "clipboard-write");
      box.replaceChildren(frame);
      frame.focus();
    });
  });

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
