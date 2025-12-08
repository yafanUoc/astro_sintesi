/**
 * Content Loader - Sistema de carga de contenidos desde JSON
 * Permite externalizar textos y preparar el sitio para multiidioma
 */

class ContentLoader {
    constructor() {
        this.currentLang = 'ca'; // Idioma por defecto
        this.content = null;
    }

    /**
     * Carga el contenido JSON para una página específica
     * @param {string} pageName - Nombre de la página (ej: 'sala6', 'index')
     * @returns {Promise<Object>} - Contenido cargado
     */
    async loadContent(pageName) {
        try {
            const response = await fetch(`data/${this.currentLang}/${pageName}.json`);

            if (!response.ok) {
                throw new Error(`Error al cargar ${pageName}.json: ${response.status}`);
            }

            this.content = await response.json();
            return this.content;
        } catch (error) {
            console.error('Error cargando contenido:', error);
            throw error;
        }
    }

    /**
     * Renderiza el contenido en el DOM
     * @param {Object} content - Objeto con el contenido JSON
     */
    render(content) {
        // Meta tags
        if (content.meta) {
            document.title = content.meta.title;
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', content.meta.description);
            }
        }

        // Hero
        if (content.hero) {
            this.setText('[data-content="hero-kicker"]', content.hero.kicker);
            this.setText('[data-content="hero-title"]', content.hero.title);
            this.setText('[data-content="hero-lead"]', content.hero.lead);

            // CTAs (para index)
            if (content.hero.cta) {
                const primaryCta = document.querySelector('[data-cta="primary"]');
                if (primaryCta && content.hero.cta.primary) {
                    primaryCta.textContent = content.hero.cta.primary.text;
                    primaryCta.href = content.hero.cta.primary.url;
                }

                const secondaryCta = document.querySelector('[data-cta="secondary"]');
                if (secondaryCta && content.hero.cta.secondary) {
                    secondaryCta.textContent = content.hero.cta.secondary.text;
                    secondaryCta.href = content.hero.cta.secondary.url;
                }
            }
        }

        // Secciones (estructura array - para salas)
        if (Array.isArray(content.sections)) {
            content.sections.forEach(section => {
                const sectionEl = document.querySelector(`[data-section="${section.id}"]`);
                if (!sectionEl) return;

                // Kicker y título
                this.setText(`[data-section="${section.id}"] [data-content="kicker"]`, section.kicker);
                this.setText(`[data-section="${section.id}"] [data-content="title"]`, section.title);

                // Intro (párrafo único)
                if (section.intro) {
                    this.setText(`[data-section="${section.id}"] [data-content="intro"]`, section.intro);
                }

                // Contenido (párrafos múltiples)
                if (section.content) {
                    const container = sectionEl.querySelector('[data-content="paragraphs"]');
                    if (container) {
                        container.innerHTML = '';
                        section.content.forEach(paragraph => {
                            const p = document.createElement('p');
                            p.innerHTML = paragraph; // Usar innerHTML para permitir <strong>, <a>, etc.
                            container.appendChild(p);
                        });
                    }
                }

                // Factores (Sala 2)
                if (section.factors) {
                    this.renderFactors(section.factors);
                }

                // Mundos (Sala 3)
                if (section.worlds) {
                    this.renderWorlds(section.worlds);
                }

                // Misiones (Sala 4)
                if (section.missions) {
                    this.renderMissions(section.missions);
                }

                // Placeholder (para secciones Explora)
                if (section.placeholder) {
                    this.setText(`[data-section="${section.id}"] [data-content="placeholder"]`, section.placeholder);
                }
            });
        }

        // Secciones (estructura objeto - para index)
        if (content.sections && typeof content.sections === 'object' && !Array.isArray(content.sections)) {
            this.renderIndexSections(content.sections);
        }

        // Navegación
        if (content.navigation) {
            if (content.navigation.previous) {
                const prevBtn = document.querySelector('[data-nav="previous"]');
                if (prevBtn) {
                    prevBtn.href = content.navigation.previous.url;
                    prevBtn.textContent = content.navigation.previous.label;
                }
            }

            if (content.navigation.home) {
                const homeBtn = document.querySelector('[data-nav="home"]');
                if (homeBtn) {
                    homeBtn.href = content.navigation.home.url;
                    homeBtn.textContent = content.navigation.home.label;
                }
            }

            if (content.navigation.next) {
                const nextBtn = document.querySelector('[data-nav="next"]');
                if (nextBtn) {
                    nextBtn.href = content.navigation.next.url;
                    nextBtn.textContent = content.navigation.next.label;
                }
            }
        }

        // Footer
        if (content.footer) {
            this.setText('[data-content="footer-line1"]', content.footer.line1);
            this.setText('[data-content="footer-line2"]', content.footer.line2);
        }
    }

    /**
     * Renderiza las secciones del index
     */
    renderIndexSections(sections) {
        // Context Actual
        if (sections.contextActual) {
            this.setText('[data-section="context-actual"] [data-content="title"]', sections.contextActual.title);
            const container = document.querySelector('[data-section="context-actual"] [data-content="paragraphs"]');
            if (container && sections.contextActual.content) {
                container.innerHTML = '';
                sections.contextActual.content.forEach(paragraph => {
                    const p = document.createElement('p');
                    p.innerHTML = paragraph;
                    container.appendChild(p);
                });
            }
        }

        // Context Científic - Cards
        if (sections.contextCientific) {
            this.setText('[data-section="context-cientific"] [data-content="title"]', sections.contextCientific.title);
            const cardsContainer = document.querySelector('[data-content="context-cards"]');
            if (cardsContainer && sections.contextCientific.cards) {
                cardsContainer.innerHTML = '';
                sections.contextCientific.cards.forEach(card => {
                    const article = document.createElement('article');
                    article.className = 'card';
                    article.innerHTML = `
                        <h3>${card.title}</h3>
                        <p>${card.content}</p>
                    `;
                    cardsContainer.appendChild(article);
                });
            }
        }

        // Recorregut - Salas
        if (sections.recorregut) {
            this.setText('[data-section="recorregut"] [data-content="title"]', sections.recorregut.title);
            this.setText('[data-section="recorregut"] [data-content="intro"]', sections.recorregut.intro);

            const salasContainer = document.querySelector('[data-content="salas-list"]');
            if (salasContainer && sections.recorregut.salas) {
                salasContainer.innerHTML = '';
                sections.recorregut.salas.forEach(sala => {
                    const li = document.createElement('li');
                    li.className = 'route-item';
                    li.innerHTML = `
                        <span class="route-label">Sala ${sala.number}</span>
                        <h3>
                            <a href="${sala.url}" class="route-link">${sala.title}</a>
                        </h3>
                        <p>${sala.description}</p>
                    `;
                    salasContainer.appendChild(li);
                });
            }
        }

        // Projecte
        if (sections.projecte) {
            this.setText('[data-section="projecte"] [data-content="title"]', sections.projecte.title);
            this.setText('[data-section="projecte"] [data-content="content"]', sections.projecte.content);
        }
    }

    /**
     * Renderiza los factores (Sala 2)
     */
    renderFactors(factors) {
        const container = document.querySelector('[data-content="factors-list"]');
        if (!container) return;

        container.innerHTML = '';
        factors.forEach(factor => {
            const li = document.createElement('li');
            li.className = 'route-item';

            let resourcesHTML = '';
            if (factor.resources && factor.resources.length > 0) {
                resourcesHTML = '<p><strong>Recursos:</strong><br>';
                factor.resources.forEach(resource => {
                    resourcesHTML += `<a href="${resource.url}" target="_blank" rel="noopener">${resource.text}</a><br>`;
                });
                resourcesHTML += '</p>';
            }

            li.innerHTML = `
                <span class="route-label">${factor.label}</span>
                <h3>${factor.title}</h3>
                <p>${factor.content}</p>
                ${resourcesHTML}
            `;
            container.appendChild(li);
        });
    }

    /**
     * Renderiza los mundos (Sala 3)
     */
    renderWorlds(worlds) {
        const container = document.querySelector('[data-content="worlds-gallery"]');
        if (!container) return;

        container.innerHTML = '';
        worlds.forEach(world => {
            const article = document.createElement('article');
            article.className = 'world-item';

            let resourcesHTML = '';
            if (world.resources && world.resources.length > 0) {
                resourcesHTML = '<p><strong>Articles recomanats:</strong><br>';
                world.resources.forEach(resource => {
                    resourcesHTML += `<a href="${resource.url}" target="_blank" rel="noopener">${resource.text}</a><br>`;
                });
                resourcesHTML += '</p>';
            }

            article.innerHTML = `
                <div class="world-content">
                    <span class="route-label">${world.label}</span>
                    <h3>${world.title}</h3>
                    <p>${world.content}</p>
                    ${resourcesHTML}
                </div>
                <div class="world-image" role="img" aria-label="Imatge de ${world.label}"></div>
            `;
            container.appendChild(article);
        });
    }

    /**
     * Renderiza las misiones (Sala 4)
     */
    renderMissions(missions) {
        const container = document.querySelector('[data-content="missions-list"]');
        if (!container) return;

        container.innerHTML = '';
        missions.forEach(mission => {
            const li = document.createElement('li');
            li.className = 'route-item';

            let resourcesHTML = '';
            if (mission.resources && mission.resources.length > 0) {
                resourcesHTML = '<p><strong>Recursos:</strong><br>';
                mission.resources.forEach(resource => {
                    resourcesHTML += `<a href="${resource.url}" target="_blank" rel="noopener">${resource.text}</a><br>`;
                });
                resourcesHTML += '</p>';
            }

            li.innerHTML = `
                <span class="route-label">${mission.label}</span>
                <h3>${mission.title}</h3>
                <p>${mission.content}</p>
                ${resourcesHTML}
            `;
            container.appendChild(li);
        });
    }

    /**
     * Helper para establecer texto en un elemento
     * @param {string} selector - Selector CSS
     * @param {string} text - Texto a establecer
     */
    setText(selector, text) {
        const element = document.querySelector(selector);
        if (element && text) {
            element.textContent = text;
        }
    }

    /**
     * Inicializa el cargador para una página específica
     * @param {string} pageName - Nombre de la página
     */
    async init(pageName) {
        try {
            const content = await this.loadContent(pageName);
            this.render(content);
            console.log(`✅ Contenido de ${pageName} cargado correctamente`);
        } catch (error) {
            console.error(`❌ Error inicializando ${pageName}:`, error);
        }
    }

    /**
     * Cambia el idioma y recarga el contenido
     * @param {string} lang - Código del idioma (ca, es, en)
     * @param {string} pageName - Nombre de la página actual
     */
    async changeLang(lang, pageName) {
        this.currentLang = lang;
        await this.init(pageName);
    }
}

// Exportar para uso global
window.ContentLoader = ContentLoader;