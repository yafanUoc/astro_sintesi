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

                // Paisatges comparatius (Sala 2)
                if (section.landscapes) {
                    this.renderLandscapes(section.landscapes, section.note);
                }

                // Misiones (Sala 4)
                if (section.missions) {
                    this.renderMissions(section.missions);
                }

                // Secciones de audio (Sala 4)
                if (section.audioSections) {
                    this.renderAudioSections(section.audioSections, section.note);
                }

                // Contingut immersiu (Sala 5)
                if (section.immersive) {
                    this.renderImmersive(section.immersive, section.note);
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
                    li.className = 'route-item route-item--clickable';
                    li.setAttribute('data-href', sala.url);
                    li.innerHTML = `
                        <span class="route-label">Sala ${sala.number}</span>
                        <h3>${sala.title}</h3>
                        <p>${sala.description}</p>
                    `;

                    // Fer tota la targeta clicable
                    li.style.cursor = 'pointer';
                    li.addEventListener('click', () => {
                        window.location.href = sala.url;
                    });

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
     * Actualitzat per incloure suport per a captions (peus de foto)
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

            // Renderizar con imagen real si existe, o placeholder si no
            // Incluir caption si la imagen tiene caption especificado
            let imageHTML;
            if (world.image) {
                const captionHTML = world.caption
                    ? `<p class="image-caption">${world.caption}</p>`
                    : '';
                imageHTML = `<div class="world-image">
                    <img src="${world.image}" alt="${world.label}" />
                    ${captionHTML}
                </div>`;
            } else {
                imageHTML = `<div class="world-image" role="img" aria-label="Imatge de ${world.label}"></div>`;
            }

            article.innerHTML = `
                <div class="world-content">
                    <span class="route-label">${world.label}</span>
                    <h3>${world.title}</h3>
                    <p>${world.content}</p>
                    ${resourcesHTML}
                </div>
                ${imageHTML}
            `;
            container.appendChild(article);
        });
    }

    /**
     * Renderiza los paisajes comparativos (Sala 2)
     * @param {Array} landscapes - Array de paisatges amb informació d'habitabilitat
     * @param {String} note - Nota informativa sobre les imatges
     */
    renderLandscapes(landscapes, note) {
        const container = document.querySelector('[data-content="landscapes-gallery"]');
        if (!container) return;

        container.innerHTML = '';

        // Renderitzar cada paisatge
        landscapes.forEach(landscape => {
            const card = document.createElement('div');
            card.className = `landscape-card ${landscape.type === 'habitable' ? '' : 'non-habitable'}`;

            // Badge d'habitabilitat
            const badgeClass = landscape.type === 'habitable' ? 'badge-habitable' : 'badge-non-habitable';
            const badgeText = landscape.type === 'habitable' ? 'Potencialment habitable' : 'No habitable';

            // Factors
            let factorsHTML = '';
            if (landscape.factors && landscape.factors.length > 0) {
                factorsHTML = '<div class="landscape-factors">';
                landscape.factors.forEach(factor => {
                    const factorClass = landscape.type === 'habitable' ? 'positive' : 'negative';
                    factorsHTML += `<span class="factor-tag ${factorClass}">${factor}</span>`;
                });
                factorsHTML += '</div>';
            }

            // Caption de la imatge
            const captionHTML = landscape.caption
                ? `<div class="landscape-caption">${landscape.caption}</div>`
                : '';

            card.innerHTML = `
                <div class="landscape-image-container">
                    <img src="${landscape.image}" alt="${landscape.world}" class="landscape-image">
                    <div class="landscape-badge ${badgeClass}">${badgeText}</div>
                    ${captionHTML}
                </div>
                <div class="landscape-content">
                    <h3 class="landscape-title">${landscape.title}</h3>
                    <p class="landscape-description">${landscape.description}</p>
                    ${factorsHTML}
                </div>
            `;

            container.appendChild(card);
        });

        // Afegir nota informativa al final
        if (note) {
            const noteElement = document.createElement('div');
            noteElement.className = 'landscapes-note';
            noteElement.innerHTML = `<strong>Nota:</strong> ${note}`;
            container.appendChild(noteElement);
        }
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
     * Renderiza las secciones de audio (Sala 4)
     * @param {Array} audioSections - Array de secciones con reproductores de audio
     * @param {String} note - Nota informativa sobre los audios
     */
    renderAudioSections(audioSections, note) {
        const container = document.querySelector('[data-content="audio-gallery"]');
        if (!container) return;

        container.innerHTML = '';

        // Renderizar cada sección de audio
        audioSections.forEach(section => {
            const audioSection = document.createElement('div');
            audioSection.className = 'audio-section';

            // Header de la sección
            const headerHTML = `
                <div class="audio-section-header">
                    <span class="audio-label">${section.label}</span>
                    <h3>${section.title}</h3>
                    <p class="audio-description">${section.description}</p>
                </div>
            `;

            // Reproductores de audio
            let playersHTML = '<div class="audio-players">';
            section.audios.forEach(audio => {
                playersHTML += `
                    <div class="audio-player-wrapper ${audio.type}">
                        <div class="audio-player-label">${audio.label}</div>
                        <div class="audio-player-subtitle">${audio.subtitle}</div>
                        <audio controls preload="metadata">
                            <source src="${audio.file}" type="audio/mpeg">
                            El teu navegador no suporta l'element d'àudio.
                        </audio>
                    </div>
                `;
            });
            playersHTML += '</div>';

            audioSection.innerHTML = headerHTML + playersHTML;
            container.appendChild(audioSection);
        });

        // Añadir nota informativa al final
        if (note) {
            const noteElement = document.createElement('div');
            noteElement.className = 'audio-info-note';
            noteElement.innerHTML = `<strong>Nota:</strong> ${note}`;
            container.appendChild(noteElement);
        }
    }

    /**
     * Renderiza el contenido immersivo (Sala 5)
     * @param {Object} immersive - Objecte amb informació de la sala immersiva
     * @param {String} note - Nota informativa sobre l'àudio automàtic
     */
    renderImmersive(immersive, note) {
        const container = document.querySelector('[data-content="immersive-presentation"]');
        if (!container) return;

        // Renderitzar la presentació de la cúpula
        const captionHTML = immersive.caption
            ? `<div class="immersive-caption">${immersive.caption}</div>`
            : '';

        container.innerHTML = `
            <div class="immersive-content">
                <h3 class="immersive-title">${immersive.title}</h3>
                <p class="immersive-description">${immersive.description}</p>
                <div class="audio-indicator">Àudio ambient reproduint-se</div>
            </div>
            <div class="immersive-image-container">
                <img src="${immersive.image}" alt="${immersive.title}" class="immersive-image">
                ${captionHTML}
            </div>
        `;

        // Afegir nota informativa al final
        if (note) {
            const noteElement = document.createElement('div');
            noteElement.className = 'audio-autoplay-note';
            noteElement.innerHTML = `<strong>Nota:</strong> ${note}`;
            container.appendChild(noteElement);
        }

        // Iniciar reproducció automàtica de l'àudio
        if (immersive.audioFile) {
            this.autoplayAudio(immersive.audioFile);
        }
    }

    /**
     * Reprodueix automàticament un àudio ambient
     * @param {String} audioFile - Ruta de l'arxiu d'àudio
     */
    autoplayAudio(audioFile) {
        // Crear element d'àudio
        const audio = new Audio(audioFile);
        audio.loop = true; // Reproducció en bucle
        audio.volume = 0.5; // Volum al 50%

        // Intentar reproducció automàtica
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('✅ Àudio immersiu reproduint-se automàticament');
                })
                .catch(error => {
                    console.log('⚠️ Reproducció automàtica bloquejada pel navegador:', error);
                    // Afegir botó manual si la reproducció automàtica falla
                    this.addManualPlayButton(audio);
                });
        }

        // Guardar referència per poder aturar l'àudio si cal
        window.immersiveAudio = audio;
    }

    /**
     * Afegeix un botó manual per reproduir l'àudio si la reproducció automàtica falla
     * @param {Audio} audio - Element d'àudio
     */
    addManualPlayButton(audio) {
        const indicator = document.querySelector('.audio-indicator');
        if (!indicator) return;

        indicator.innerHTML = '';
        indicator.style.cursor = 'pointer';
        indicator.innerHTML = '🔇 Clica per activar l\'àudio ambient';

        indicator.addEventListener('click', () => {
            audio.play()
                .then(() => {
                    indicator.innerHTML = '🔊 Àudio ambient reproduint-se';
                    indicator.style.cursor = 'default';
                })
                .catch(error => {
                    console.error('Error reproduint àudio:', error);
                });
        }, { once: true });
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