/**
 * Lightbox - Sistema de visualización ampliada de imágenes y videos
 * Autor: Astro-Síntesi
 *
 * USO:
 * - Añadir clase "lightbox-image" a <img> para hacerlas clicables
 * - Añadir clase "lightbox-video" a <video> para hacerlos clicables
 */

class Lightbox {
    constructor() {
        this.overlay = null;
        this.isOpen = false;
        this.currentType = null; // 'image' o 'video'
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
                    <video class="lightbox-video-display" id="lightbox-video" controls loop>
                        <source src="" type="video/mp4">
                    </video>
                    <div class="lightbox-caption" id="lightbox-caption"></div>
                </div>
                <div class="lightbox-help">Prem ESC per tancar · Clica fora per sortir</div>
            </div>
        `;

        // Añadir al final del body
        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        this.overlay = document.getElementById('lightbox-overlay');
    }

    /**
     * Adjunta event listeners a todas las imágenes y videos con clase lightbox
     */
    attachEventListeners() {
        // Seleccionar todas las imágenes con clase lightbox-image
        const images = document.querySelectorAll('.lightbox-image');
        images.forEach(img => {
            img.style.cursor = 'zoom-in';
            img.addEventListener('click', (e) => {
                e.preventDefault();
                this.open(img, 'image');
            });
            img.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.open(img, 'image');
                }
            });
            if (!img.hasAttribute('tabindex')) {
                img.setAttribute('tabindex', '0');
            }
        });

        // Seleccionar todos los videos con clase lightbox-video
        const videos = document.querySelectorAll('.lightbox-video');
        videos.forEach(video => {
            video.style.cursor = 'zoom-in';
            video.addEventListener('click', (e) => {
                e.preventDefault();
                this.open(video, 'video');
            });
            video.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.open(video, 'video');
                }
            });
            if (!video.hasAttribute('tabindex')) {
                video.setAttribute('tabindex', '0');
            }
        });

        // Eventos del lightbox
        if (this.overlay) {
            const closeBtn = this.overlay.querySelector('.lightbox-close');
            closeBtn.addEventListener('click', () => this.close());

            this.overlay.addEventListener('click', (e) => {
                if (e.target === this.overlay) {
                    this.close();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });
        }
    }

    /**
     * Abre el lightbox con la imagen o video especificado
     * @param {HTMLElement} element - Elemento de imagen o video a mostrar
     * @param {string} type - Tipo de elemento: 'image' o 'video'
     */
    open(element, type) {
        if (!this.overlay) return;

        this.currentType = type;
        const lightboxImg = document.getElementById('lightbox-image');
        const lightboxVideo = document.getElementById('lightbox-video');
        const lightboxCaption = document.getElementById('lightbox-caption');

        // Ocultar ambos elementos primero
        lightboxImg.style.display = 'none';
        lightboxVideo.style.display = 'none';

        if (type === 'image') {
            // Mostrar imagen
            lightboxImg.src = element.src;
            lightboxImg.alt = element.alt || 'Imatge ampliada';
            lightboxImg.style.display = 'block';
        } else if (type === 'video') {
            // Mostrar video
            const videoSource = lightboxVideo.querySelector('source');
            videoSource.src = element.querySelector('source').src;
            videoSource.type = element.querySelector('source').type;
            lightboxVideo.load();
            lightboxVideo.style.display = 'block';

            // Reproducir el video automáticamente al abrir
            setTimeout(() => {
                lightboxVideo.play().catch(err => {
                    console.log('No es pot reproduir automàticament el vídeo:', err);
                });
            }, 100);
        }

        // Establecer el caption
        let captionText = this.getCaption(element);

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

        setTimeout(() => {
            this.overlay.querySelector('.lightbox-close').focus();
        }, 100);
    }

    /**
     * Obtiene el caption de un elemento
     * @param {HTMLElement} element - Elemento del que extraer el caption
     * @returns {string} - Texto del caption
     */
    getCaption(element) {
        let captionText = '';

        // Opción 1: Atributo data-caption
        if (element.hasAttribute('data-caption')) {
            captionText = element.getAttribute('data-caption');
        }
        // Opción 2: Alt text (solo para imágenes)
        else if (element.tagName === 'IMG' && element.alt) {
            captionText = element.alt;
        }
        // Opción 3: Aria-label (para videos)
        else if (element.hasAttribute('aria-label')) {
            captionText = element.getAttribute('aria-label');
        }
        // Opción 4: Caption hermano
        else {
            const parentContainer = element.closest('.landscape-image-container, .world-image, .hero-image-slot, .enceladus-video-container');
            if (parentContainer) {
                const caption = parentContainer.querySelector('.landscape-caption, .image-caption, .video-caption, .img_info');
                if (caption) {
                    captionText = caption.textContent.trim();
                }
            }
        }

        return captionText;
    }

    /**
     * Cierra el lightbox
     */
    close() {
        if (!this.overlay) return;

        // Pausar el video si está reproduciéndose
        if (this.currentType === 'video') {
            const lightboxVideo = document.getElementById('lightbox-video');
            lightboxVideo.pause();
            lightboxVideo.currentTime = 0;
        }

        this.overlay.classList.remove('active');
        document.body.classList.remove('lightbox-active');
        this.isOpen = false;
        this.currentType = null;
    }

    /**
     * Actualiza el lightbox para detectar nuevas imágenes y videos
     * Útil cuando se cargan elementos dinámicamente
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
if (window.ContentLoader) {
    const originalInit = window.ContentLoader.prototype.init;
    window.ContentLoader.prototype.init = function(...args) {
        const result = originalInit.apply(this, args);

        setTimeout(() => {
            if (window.lightbox) {
                window.lightbox.refresh();
            }
        }, 500);

        return result;
    };
}

console.log('✅ Lightbox inicialitzat correctament (imatges i vídeos)');