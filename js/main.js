// main.js
// Script comú per a totes les pàgines de la web Astro-Síntesi.
// De moment, s'encarrega principalment de marcar al menú quina pàgina està activa.

document.addEventListener("DOMContentLoaded", () => {
  const links = document.querySelectorAll(".main-nav .nav-link");

  // Obtenim el nom de l'arxiu actual (per exemple: "index.html" o "sala1_estem_sols.html")
  const currentFile = window.location.pathname.split("/").pop() || "index.html";

  links.forEach((link) => {
    const href = link.getAttribute("href");

    // Si l'enllaç coincideix amb el fitxer actual, marquem aquest element com actiu
    if (href === currentFile) {
      links.forEach((l) => l.classList.remove("nav-link--active"));
      link.classList.add("nav-link--active");
    }
  });
});
