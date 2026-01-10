/**
 * Lightbox - Sistema de visualización ampliada de imágenes
 * Autor: Astro-Síntesi
 *
 * USO: Añadir la clase "lightbox-image" a cualquier <img> para hacerla clicable
 */

class Lightbox {
    constructor() {
        this.overlay = null;
        this.isOpen = false;
        this.init();
    }

    /**
     * Inicializa el lightbox y crea la estructura HTML
     */
    init() {
        // Crear estructura del lightbox
        this.createLightboxHTML();

        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.attachEventListeners());
        } else {
            this.attachEventListeners();
        }
    }

    /**
     * Crea la estructura HTML del lightbox
     */
    createLightboxHTML() {
        const lightboxHTML = `
            <div class="lightbox-overlay" id="lightbox-overlay">
                <button class="lightbox-close" aria-label="Tancar visualització ampliada"></button>
                <div class="lightbox-container">
                    <img class="lightbox-image-display" id="lightbox-image" src="" alt="" />
                    <div class="lightbox-caption" id="lightbox-caption"></div>
                </div>
                <div class="lightbox-help">Prem ESC per tancar · Clica fora de la imatge per sortir</div>
            </div>
        `;

        // Añadir al final del body
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        this.overlay = document.getElementById('lightbox-overlay');
    }

    /**
     * Adjunta event listeners a todas las imágenes con clase lightbox-image
     */
    attachEventListeners() {
        // Seleccionar todas las imágenes con clase lightbox-image
        const images = document.querySelectorAll('.lightbox-image');

        images.forEach(img => {
            // Añadir cursor pointer
            img.style.cursor = 'zoom-in';

            // Click en la imagen para abrir lightbox
            img.addEventListener('click', (e) => {
                e.preventDefault();
                this.open(img);
            });

            // Accesibilidad: Enter para abrir
            img.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.open(img);
                }
            });

            // Hacer la imagen focusable
            if (!img.hasAttribute('tabindex')) {
                img.setAttribute('tabindex', '0');
            }
        });

        // Eventos del lightbox
        if (this.overlay) {
            // Click en el botón de cerrar
            const closeBtn = this.overlay.querySelector('.lightbox-close');
            closeBtn.addEventListener('click', () => this.close());

            // Click en el overlay (fuera de la imagen) para cerrar
            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.close();
                }
            });

            // Tecla ESC para cerrar
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });
        }
    }

    /**
     * Abre el lightbox con la imagen especificada
     * @param {HTMLImageElement} imgElement - Elemento de imagen a mostrar
     */
    open(imgElement) {
        if (!this.overlay) return;

        const lightboxImg = document.getElementById('lightbox-image');
        const lightboxCaption = document.getElementById('lightbox-caption');

        // Establecer la imagen y su alt text
        lightboxImg.src = imgElement.src;
        lightboxImg.alt = imgElement.alt || 'Imatge ampliada';

        // Establecer el caption si existe
        // Buscar caption en diferentes ubicaciones posibles
        let captionText = '';

        // Opción 1: Atributo data-caption
        if (imgElement.hasAttribute('data-caption')) {
            captionText = imgElement.getAttribute('data-caption');
        }
        // Opción 2: Alt text de la imagen
        else if (imgElement.alt) {
            captionText = imgElement.alt;
        }
        // Opción 3: Caption hermano (siguiente elemento con clase image-caption o landscape-caption)
        else {
            const parentContainer = imgElement.closest('.landscape-image-container, .world-image, .hero-image-slot');
            if (parentContainer) {
                const caption = parentContainer.querySelector('.landscape-caption, .image-caption');
                if (caption) {
                    captionText = caption.textContent.trim();
                }
            }
        }

        // Mostrar u ocultar caption
        if (captionText) {
            lightboxCaption.textContent = captionText;
            lightboxCaption.style.display = 'block';
        } else {
            lightboxCaption.style.display = 'none';
        }

        // Mostrar el lightbox
        this.overlay.classList.add('active');
        document.body.classList.add('lightbox-active');
        this.isOpen = true;

        // Focus en el botón de cerrar para accesibilidad
        setTimeout(() => {
            this.overlay.querySelector('.lightbox-close').focus();
        }, 100);
    }

    /**
     * Cierra el lightbox
     */
    close() {
        if (!this.overlay) return;

        this.overlay.classList.remove('active');
        document.body.classList.remove('lightbox-active');
        this.isOpen = false;
    }

    /**
     * Actualiza el lightbox para detectar nuevas imágenes
     * Útil cuando se cargan imágenes dinámicamente
     */
    refresh() {
        this.attachEventListeners();
    }
}

// Inicializar el lightbox automáticamente
const lightbox = new Lightbox();

// Hacer disponible globalmente para poder refrescar si es necesario
window.lightbox = lightbox;

// Refrescar el lightbox después de que se cargue el contenido dinámico
// (esperar a que ContentLoader haya terminado de renderizar)
if (window.ContentLoader) {
    const originalInit = window.ContentLoader.prototype.init;
    window.ContentLoader.prototype.init = function(...args) {
        const result = originalInit.apply(this, args);

        // Esperar un poco para que las imágenes se rendericen
        setTimeout(() => {
            if (window.lightbox) {
                window.lightbox.refresh();
            }
        }, 500);

        return result;
    };
}

console.log('✅ Lightbox inicialitzat correctament');