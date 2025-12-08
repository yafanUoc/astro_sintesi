// main.js - Versión mejorada
document.addEventListener("DOMContentLoaded", () => {

    // 1. Marcar enlace activo en el menú
    const currentFile = window.location.pathname.split("/").pop() || "index.html";
    const links = document.querySelectorAll(".main-nav .nav-link");

    links.forEach((link) => {
        if (link.getAttribute("href") === currentFile) {
            link.classList.add("nav-link--active");
            link.setAttribute("aria-current", "page"); // Mejora accesibilidad
        } else {
            link.classList.remove("nav-link--active");
            link.removeAttribute("aria-current");
        }
    });

    // 2. Funcionalidad "Leer más" (actualmente no se usa en index)
    const collapsibleParagraphs = document.querySelectorAll(".paragraph--collapsible");

    collapsibleParagraphs.forEach((paragraph) => {
        const toggleBtn = paragraph.querySelector(".read-more-toggle");
        if (!toggleBtn) return;

        toggleBtn.addEventListener("click", (e) => {
            e.preventDefault();
            const isExpanded = paragraph.classList.toggle("is-expanded");

            toggleBtn.textContent = isExpanded ? "...llegir menys" : "...llegir més";
            toggleBtn.setAttribute("aria-expanded", isExpanded);
        });
    });
});