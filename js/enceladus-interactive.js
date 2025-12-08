/**
 * Infografia Interactiva d'Enceladus - VERSIÓ MILLORADA
 * Informació científica basada en dades de la missió Cassini
 *
 * CONFIGURACIÓ CENTRALITZADA: Tots els punts i posicions es defineixen aquí
 */

class EnceladusInteractive {
    constructor() {
        this.panel = document.getElementById('layer-info-panel');
        this.titleElement = document.getElementById('layer-title');
        this.descriptionElement = document.getElementById('layer-description');
        this.closeButton = document.querySelector('.close-panel');
        this.imageWrapper = document.querySelector('.enceladus-image-wrapper');
        this.activeHotspot = null;

        // ========================================================================
        // CONFIGURACIÓ DELS PUNTS INTERACTIUS
        // Defineix aquí la posició de cada punt (% respecte a la imatge)
        // x: 0-100 (% de l'esquerra), y: 0-100 (% de dalt)
        // ========================================================================
        this.hotspotConfig = {
            'surface': {
                x: 53,  // 20% des de l'esquerra
                y: -15,  // 15% des de dalt
                label: 'Superfície i plomalls',
                panelPosition: { side: 'left', vertical: 'bottom', gap: 262 }
            },
            'ice-shell': {
                x: 20,  // 75% des de l'esquerra
                y: -65,  // 35% des de dalt
                label: 'Escorça de gel',
                panelPosition: { side: 'left', vertical: 'top', gap: 80 }
            },
            'ocean': {
                x: 72,  // 50% des de l'esquerra (centrat)
                y: -42,  // 65% des de dalt
                label: 'Oceà subsuperficial',
                panelPosition: { side: 'right', vertical: 'bottom', gap: 78 }
            },
            'core': {
                x: 49,  // 50% des de l'esquerra (centrat)
                y: -64,  // 50% des de dalt (centrat)
                label: 'Nucli rocós',
                panelPosition: { side: 'right', vertical: 'top', gap: 200 }
            }
        };

        // Dades científiques de cada capa
        this.layerData = {
            'surface': {
                title: 'Superfície gelada i plomalls actius',
                content: `
                    <p>La superfície d'Enceladus està coberta per una capa de <strong>gel d'aigua extremadament net</strong>, que reflecteix gairebé el 100% de la llum solar, convertint-la en un dels cossos més brillants del Sistema Solar.</p>
                    
                    <p><strong>Plomalls criovolcànics:</strong> Al pol sud, la missió Cassini va descobrir més de 100 guèisers que expulsen aigua líquida, vapor i partícules de gel a velocitats de fins a <strong>2.189 km/h</strong>. Aquest material forma l'anell E de Saturn.</p>
                    
                    <p><strong>Composició dels plomalls:</strong></p>
                    <ul>
                        <li>Aigua (H₂O): ~90%</li>
                        <li>Diòxid de carboni (CO₂)</li>
                        <li>Metà (CH₄)</li>
                        <li>Amoníac (NH₃)</li>
                        <li>Molècules orgàniques complexes</li>
                        <li>Sals (NaCl)</li>
                    </ul>
                    
                    <p>Aquestes emissions indiquen <strong>activitat hidrotermal activa</strong> sota la superfície.</p>
                `
            },
            'ice-shell': {
                title: 'Escorça de gel (10-30 km)',
                content: `
                    <p>L'escorça gelada d'Enceladus té un gruix estimat d'entre <strong>10 i 30 kilòmetres</strong>, essent més fina al pol sud, on es concentra l'activitat geològica.</p>
                    
                    <p><strong>Esquerdes de tigre:</strong> Al pol sud hi ha quatre fractures paral·leles anomenades "esquerdes de tigre" (Damascus, Baghdad, Cairo i Alexandria), d'on surten els plomalls. Aquestes esquerdes tenen temperatures de <strong>fins a -83°C</strong>, molt més càlides que els -203°C de la resta de la superfície.</p>
                    
                    <p><strong>Mecanisme de fractura:</strong> Les forces mareals de Saturn estiren i comprimen Enceladus, generant fricció i escalfor que mantenen l'oceà líquid i creen les fractures superficials.</p>
                    
                    <p>L'anàlisi dels grans de gel dels plomalls mostra que aquests provenen directament de l'oceà subsuperficial, sense haver estat modificats químicament durant el seu ascens.</p>
                `
            },
            'ocean': {
                title: 'Oceà global subsuperficial',
                content: `
                    <p>Sota l'escorça de gel existeix un <strong>oceà global d'aigua líquida salada</strong> amb una profunditat estimada de 10 km. Aquest oceà conté tots els ingredients essencials per a la vida:</p>
                    
                    <p><strong>Composició química:</strong></p>
                    <ul>
                        <li><strong>Aigua líquida:</strong> Dissolvent universal</li>
                        <li><strong>Sals:</strong> Clorur de sodi i compostos alcalins</li>
                        <li><strong>Molècules orgàniques:</strong> Compostos amb carboni, nitrogen i oxigen</li>
                        <li><strong>Hidrogen molecular (H₂):</strong> Font d'energia per microorganismes</li>
                    </ul>
                    
                    <p><strong>Descobriment crucial (2018):</strong> L'anàlisi dels grans de gel dels plomalls ha revelat la presència de <strong>molècules orgàniques complexes</strong> amb masses moleculars superiors a 200 unitats atòmiques, incloent compostos amb grups funcionals oxigenats i nitrogenats.</p>
                    
                    <p>Aquestes macromolècules indiquen processos químics complexos similars als que van precedir l'origen de la vida a la Terra.</p>
                `
            },
            'core': {
                title: 'Nucli rocós i activitat hidrotermal',
                content: `
                    <p>El nucli d'Enceladus està format per <strong>roques silícies poroses</strong> en contacte directe amb l'oceà subsuperficial, creant un entorn similar als fons oceànics terrestres.</p>
                    
                    <p><strong>Activitat hidrotermal:</strong> La detecció d'hidrogen molecular (H₂) als plomalls és una prova directa de reaccions químiques entre l'aigua i les roques del fons oceànic a temperatures superiors a 90°C.</p>
                    
                    <p><strong>Processos quimiosintètics:</strong></p>
                    <ul>
                        <li>Reaccions aigua-roca (serpentinització)</li>
                        <li>Generació d'hidrogen molecular</li>
                        <li>Síntesi de molècules orgàniques</li>
                        <li>pH alcalí favorable per a la vida</li>
                    </ul>
                    
                    <p><strong>Analogia terrestre:</strong> Aquest entorn és comparable als sistemes hidrotermals dels fons oceànics de la Terra (fumadors negres), on existeixen ecosistemes microbians que no depenen de la llum solar.</p>
                    
                    <p>La combinació d'aigua líquida, compostos orgànics, energia química i un entorn geoquímic actiu converteix Enceladus en <strong>un dels llocs més prometedors per trobar vida microbiana</strong> al Sistema Solar.</p>
                `
            }
        };

        this.init();
    }

    init() {
        // Crear els hotspots dinàmicament des de la configuració
        this.createHotspots();

        // Crear canvas SVG per les línies de connexió
        this.createConnectionSVG();

        // Tancar panell
        this.closeButton.addEventListener('click', () => this.hidePanel());

        // Tancar amb Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.panel.classList.contains('active')) {
                this.hidePanel();
            }
        });

        // Recalcular posicions en resize
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.updateHotspotPositions();
                if (this.activeHotspot) {
                    this.positionPanel(this.activeHotspot);
                    this.drawConnectionLine(this.activeHotspot);
                }
            }, 100);
        });

        // Actualitzar posicions després de carregar la imatge
        const img = this.imageWrapper.querySelector('.enceladus-base-image');
        if (img.complete) {
            this.updateHotspotPositions();
        } else {
            img.addEventListener('load', () => this.updateHotspotPositions());
        }
    }

    createHotspots() {
        // Eliminar hotspots existents si n'hi ha
        this.imageWrapper.querySelectorAll('.enceladus-hotspot').forEach(el => el.remove());

        // Crear hotspots des de la configuració
        Object.keys(this.hotspotConfig).forEach(layerKey => {
            const config = this.hotspotConfig[layerKey];
            const hotspot = this.createHotspotElement(layerKey, config);
            this.imageWrapper.appendChild(hotspot);
        });

        // Actualitzar la referència als hotspots
        this.hotspots = document.querySelectorAll('.enceladus-hotspot');
    }

    createHotspotElement(layerKey, config) {
        const hotspot = document.createElement('button');
        hotspot.className = 'enceladus-hotspot';
        hotspot.dataset.layer = layerKey;
        hotspot.setAttribute('aria-label', config.label);

        hotspot.innerHTML = `
            <span class="hotspot-inner"></span>
            <span class="hotspot-pulse"></span>
            <span class="hotspot-pulse"></span>
            <span class="hotspot-pulse"></span>
            <span class="hotspot-tooltip">${config.label}</span>
        `;

        // Afegir event listener
        hotspot.addEventListener('click', (e) => this.showLayerInfo(e.currentTarget));

        return hotspot;
    }

    updateHotspotPositions() {
        // Actualitzar les posicions de tots els hotspots segons la configuració
        this.hotspots.forEach(hotspot => {
            const layerKey = hotspot.dataset.layer;
            const config = this.hotspotConfig[layerKey];

            if (config) {
                // Establir posició amb percentatges
                hotspot.style.left = `${config.x}%`;
                hotspot.style.top = `${config.y}%`;
                hotspot.style.transform = 'translate(-50%, -50%)'; // Centrar el punt
            }
        });
    }

    createConnectionSVG() {
        // Eliminar SVG existent si n'hi ha
        const existingSVG = this.imageWrapper.querySelector('.connection-lines');
        if (existingSVG) {
            existingSVG.remove();
        }

        // Crear element SVG per dibuixar les línies
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.classList.add('connection-lines');
        svg.setAttribute('width', '100%');
        svg.setAttribute('height', '100%');

        // Crear una línia per cada hotspot
        Object.keys(this.hotspotConfig).forEach(layerKey => {
            const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
            line.classList.add('connection-line');
            line.setAttribute('data-layer', layerKey);
            svg.appendChild(line);
        });

        this.imageWrapper.appendChild(svg);
        this.connectionSVG = svg;
    }

    showLayerInfo(hotspot) {
        const layerKey = hotspot.dataset.layer;
        const layerInfo = this.layerData[layerKey];

        if (layerInfo) {
            this.activeHotspot = hotspot;

            // Actualitzar contingut
            this.titleElement.textContent = layerInfo.title;
            this.descriptionElement.innerHTML = layerInfo.content;

            // Posicionar el panell
            this.positionPanel(hotspot);

            // Mostrar panell
            this.panel.classList.add('active');

            // Dibuixar línia de connexió
            this.drawConnectionLine(hotspot);

            // Focus per accessibilitat
            this.panel.setAttribute('tabindex', '-1');
            this.panel.focus();
        }
    }

    positionPanel(hotspot) {
        const layerKey = hotspot.dataset.layer;
        const customPos = this.hotspotConfig[layerKey]?.panelPosition || { side: 'right', vertical: 'middle', gap: 30 };

        // Obtenir dimensions i posicions
        const wrapperRect = this.imageWrapper.getBoundingClientRect();
        const hotspotRect = hotspot.getBoundingClientRect();
        const panelWidth = 320;
        const gap = customPos.gap || 30;

        // Calcular posició relativa del hotspot dins del wrapper
        const hotspotX = hotspotRect.left - wrapperRect.left + hotspotRect.width / 2;
        const hotspotY = hotspotRect.top - wrapperRect.top + hotspotRect.height / 2;

        // Netejar classes anteriors
        this.panel.classList.remove('position-left', 'position-right', 'position-top', 'position-bottom', 'position-middle');

        // Només en desktop (>1200px) posicionar al costat
        if (window.innerWidth > 1200) {
            // Posicionar horitzontalment segons configuració
            if (customPos.side === 'left') {
                this.panel.classList.add('position-left');
                this.panel.style.right = `${wrapperRect.width - hotspotX + gap}px`;
                this.panel.style.left = 'auto';
            } else {
                this.panel.classList.add('position-right');
                this.panel.style.left = `${hotspotX + gap}px`;
                this.panel.style.right = 'auto';
            }

            // Posicionar verticalment segons configuració
            if (customPos.vertical === 'top') {
                this.panel.classList.add('position-top');
                this.panel.style.top = '0';
                this.panel.style.bottom = 'auto';
            } else if (customPos.vertical === 'bottom') {
                this.panel.classList.add('position-bottom');
                this.panel.style.bottom = '0';
                this.panel.style.top = 'auto';
            } else {
                this.panel.classList.add('position-middle');
                this.panel.style.top = '50%';
                this.panel.style.bottom = 'auto';
            }
        }
    }

    drawConnectionLine(hotspot) {
        if (window.innerWidth <= 1200) {
            return;
        }

        const line = this.connectionSVG.querySelector(`line[data-layer="${hotspot.dataset.layer}"]`);
        if (!line) return;

        // Obtenir posicions
        const wrapperRect = this.imageWrapper.getBoundingClientRect();
        const hotspotRect = hotspot.getBoundingClientRect();
        const panelRect = this.panel.getBoundingClientRect();

        // Calcular coordenades relatives
        const x1 = hotspotRect.left - wrapperRect.left + hotspotRect.width / 2;
        const y1 = hotspotRect.top - wrapperRect.top + hotspotRect.height / 2;

        let x2, y2;

        // Punt de connexió del panell (centre del costat més proper)
        if (this.panel.classList.contains('position-right')) {
            x2 = panelRect.left - wrapperRect.left;
            y2 = panelRect.top - wrapperRect.top + panelRect.height / 2;
        } else {
            x2 = panelRect.right - wrapperRect.left;
            y2 = panelRect.top - wrapperRect.top + panelRect.height / 2;
        }

        // Establir coordenades de la línia
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);

        // Amagar totes les línies i mostrar només l'activa
        this.connectionSVG.querySelectorAll('.connection-line').forEach(l => {
            l.classList.remove('active');
        });
        line.classList.add('active');
    }

    hidePanel() {
        this.panel.classList.remove('active');
        this.activeHotspot = null;

        // Amagar totes les línies
        if (this.connectionSVG) {
            this.connectionSVG.querySelectorAll('.connection-line').forEach(line => {
                line.classList.remove('active');
            });
        }
    }
}

// Inicialitzar quan el DOM estigui carregat
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('enceladus-interactive')) {
        new EnceladusInteractive();
    }
});