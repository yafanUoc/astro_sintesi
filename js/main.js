// main.js
// Script comú per a totes les pàgines de la web Astro-Síntesi.
// De moment, s'encarrega principalment de marcar al menú quina pàgina està activa.

document.addEventListener("DOMContentLoaded", () => {
    /* 1. Marcar enllaç actiu al menú*/
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

    /* 2. Enllaç Llegir més */
    // Seleccionem tots els paràgrafs que poden desplegar més text
    const collapsibleParagraphs = document.querySelectorAll(".paragraph--collapsible");

    collapsibleParagraphs.forEach((paragraph) => {
        // Busquem el botó/enllaç dins del mateix paràgraf
        const toggleBtn = paragraph.querySelector(".read-more-toggle");
        if (!toggleBtn) return; // si no hi ha botó, no fem res

        toggleBtn.addEventListener("click", () => {
            // Alternem la classe que controla si el text està expandit o no
            const isExpanded = paragraph.classList.toggle("is-expanded");

            // Actualitzem el text del botó i l'atribut d'accessibilitat
            toggleBtn.textContent = isExpanded ? "...llegir menys" : "...llegir més";
            toggleBtn.setAttribute("aria-expanded", isExpanded ? "true" : "false");
        });
    });
});
