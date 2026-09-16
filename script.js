document.addEventListener('DOMContentLoaded', () => {
        const music = document.getElementById('bg-music');

        const envelopeScreen = document.getElementById('envelope-screen');
        const flapWrapper = document.getElementById('flap-wrapper');
        const envelopeBody = document.getElementById('envelope-body');
        const envelopeWrap = document.getElementById('envelope-wrap');
        const envelopeLacinho = document.getElementById('envelope-lacinho');

        // ===================== ENVELOPE =====================
        let opened = false;
        function abrirEnvelope() {
                if (opened) return;
                opened = true;

                flapWrapper.classList.add('open');
                envelopeBody.classList.add('open');
                envelopeWrap.classList.add('open');

                if (music) {
                        music.volume = 0.85;
                        music.play().catch(() => { });
                }

                setTimeout(() => {
                        document.querySelectorAll('.letter').forEach(l => l.classList.add('animate'));
                        const brandName = document.querySelector('.brand-name');
                        if (brandName) brandName.classList.add('animate');
                        setTimeout(() => {
                                document.querySelectorAll('.reveal-item').forEach(el => el.classList.add('animate'));
                        }, 1600);
                }, 1000);

                setTimeout(() => {
                        envelopeScreen.style.display = 'none';
                }, 1000);

                // Depois do envelope abrir, o resto da animação
                // (balões, foto do Valdemiro, bolas de cristal, brinde...) começa
                setTimeout(() => {
                        iniciarSequenciaAniversario();
                }, 1500);
        }

        // O laço é o único gatilho: primeiro cai/tomba, só depois o envelope abre
        if (envelopeLacinho) {
                envelopeLacinho.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (envelopeLacinho.classList.contains('falling')) return;

                        envelopeLacinho.classList.add('falling');
                        envelopeLacinho.addEventListener('animationend', () => {
                                abrirEnvelope();
                        }, { once: true });
                });
        }

        // ===================== BALÕES A SUBIR (ecrã 1) =====================
        // Chamada 6s depois do envelope abrir (ver abrirEnvelope) — antes disso
        // nada deste bloco corre.
        function iniciarSequenciaAniversario() {
        const balloonLayer = document.getElementById('rising-balloons');
        if (balloonLayer) {
                const TOTAL_BALOES = 20;
                const fragment = document.createDocumentFragment();
                for (let i = 0; i < TOTAL_BALOES; i++) {
                        const img = document.createElement('img');
                        img.src = 'src/fundo/baloes.png';
                        img.alt = '';
                        img.className = 'rising-balloon';

                        // Mais balões do lado esquerdo do que do lado direito
                        let left;
                        if (i % 3 !== 0) {
                                left = -2 + Math.random() * 42; // -2% - 40% (esquerda)
                        } else {
                                left = 56 + Math.random() * 38; // 56% - 94% (direita)
                        }
                        // Balões um pouco maiores
                        const size = 100 + Math.random() * 120;
                        // Duracão ligeiramente maior para balões maiores
                        const duration = 3.6 + Math.random() * 2.4;
                        const delay = Math.random() * 1.2;
                        const swayX = (Math.random() * 70 - 35).toFixed(0) + 'px';
                        const swayStart = (Math.random() * 12 - 6).toFixed(1) + 'deg';
                        const swayEnd = (Math.random() * 12 - 6).toFixed(1) + 'deg';

                        img.style.left = left + '%';
                        img.style.width = size + 'px';
                        img.style.animationDuration = duration + 's';
                        img.style.animationDelay = delay + 's';
                        img.style.setProperty('--sway-x', swayX);
                        img.style.setProperty('--sway-start', swayStart);
                        img.style.setProperty('--sway-end', swayEnd);

                        fragment.appendChild(img);
                }
                balloonLayer.appendChild(fragment);

                // Depois dos balões terminarem: limpa a camada e revela o bloco de aniversário
                const maxTime = (2.5 + 2 + 1.2) * 1000 + 400;
                setTimeout(() => {
                        balloonLayer.innerHTML = '';

                        const birthdayReveal = document.getElementById('birthday-reveal');
                        if (birthdayReveal) {
                                birthdayReveal.classList.add('show');
                        }

                        // Bolas de cristal: só surgem depois da foto aparecer e começar a girar
                        const discoBalls = document.getElementById('disco-balls');
                        if (discoBalls) {
                                setTimeout(() => {
                                        discoBalls.classList.add('show');
                                }, 2400);
                        }

                        // ===================== SECÇÃO DE BRINDE + DATA/HORA =====================
                        // Depois das bolas de cristal surgirem, aparece a secção com as
                        // canecas (em baixo da foto do Valdemiro). A sequência é:
                        //   1. Secção aparece (canecas largas, dos lados)
                        //   2. Canecas deslizam para o centro — "toast" (brindam)
                        //   3. Movimento leve em "V" (canecas inclinam-se para fora)
                        //   4. Aparecem as letras uma a uma no lado esquerdo (Sábado 26/09)
                        //      com os traços decorativos em cima e em baixo
                        //   5. Depois do lado esquerdo terminar, aparece o lado direito
                        //      (A partir das 21h) com a mesma animação letra a letra
                        const toastSection = document.getElementById('toast-section');
                        const canecasWrap = document.getElementById('canecas-wrap');
                        const dateLeft = document.getElementById('date-left');
                        const dateRight = document.getElementById('date-right');

                        // Espera 2s depois das bolas de cristal aparecerem
                        setTimeout(() => {
                                if (toastSection) toastSection.classList.add('show');

                                // 1) Fase "toast" — canecas juntam-se no centro (~1s depois)
                                setTimeout(() => {
                                        if (canecasWrap) canecasWrap.classList.add('toast');
                                }, 900);

                                // 2) Fase "V" — leve inclinação para fora (~1.4s depois do toast)
                                setTimeout(() => {
                                        if (canecasWrap) {
                                                canecasWrap.classList.remove('toast');
                                                canecasWrap.classList.add('v-shape');
                                        }
                                }, 2300);

                                // 3) Aparece o bloco esquerdo (com traços) — ~1s depois do V
                                setTimeout(() => {
                                        if (dateLeft) dateLeft.classList.add('show');

                                        // Pequeno atraso para as linhas (traços) desenharem primeiro
                                        setTimeout(() => {
                                                if (dateLeft) dateLeft.classList.add('animate');
                                        }, 650);
                                }, 3300);

                                // 4) Quando o lado esquerdo terminar, aparece o lado direito
                                //    Lado esquerdo: 6 letras + 5 letras = 11 letras
                                //    Tempo total: ~ (11 * 85ms) + 650ms (anim) ≈ 1585ms
                                setTimeout(() => {
                                        if (dateRight) dateRight.classList.add('show');

                                        setTimeout(() => {
                                                if (dateRight) dateRight.classList.add('animate');
                                                // Depois que o lado direito começa a animar, esperar pela
                                                // conclusão aproximada das letras + manter a cena 2s
                                                // antes de remover e mostrar as fotos finais.
                                                setTimeout(() => {
                                                        // pausa visual de 2s antes de limpar a cena
                                                        setTimeout(() => {
                                                                // Função de limpeza: esconder elementos móveis
                                                                const discoBalls = document.getElementById('disco-balls');
                                                                const toastSection = document.getElementById('toast-section');
                                                                const canecasWrap = document.getElementById('canecas-wrap');
                                                                const valFaceWrap = document.querySelector('.valdemiro-face-wrap');
                                                                const balloonLayer = document.getElementById('rising-balloons');

                                                                if (discoBalls) {
                                                                        discoBalls.classList.remove('show');
                                                                        discoBalls.classList.add('hide-scene');
                                                                }
                                                                if (toastSection) toastSection.classList.add('hide-scene');
                                                                if (canecasWrap) canecasWrap.classList.add('hide-scene');
                                                                if (valFaceWrap) valFaceWrap.classList.add('hide-scene');
                                                                if (balloonLayer) {
                                                                        balloonLayer.innerHTML = '';
                                                                        balloonLayer.classList.add('hide-scene');
                                                                }

                                                                // Criar container com as fotos finais (moldura / localização)
                                                                const coverBackdrop = document.querySelector('.cover-backdrop');
                                                                if (coverBackdrop) {
                                                                        const final = document.createElement('div');
                                                                        final.className = 'final-photos';
                                                                        final.innerHTML = `
                                                                                <div class="frames">
                                                                                        <div class="polaroid polaroid-back">
                                                                                                <img src="src/fotos/leandro2.jpeg" alt="leandro2">
                                                                                        </div>
                                                                                        <div class="polaroid polaroid-front">
                                                                                                <img src="src/fotos/leandro1.png" alt="leandro">
                                                                                        </div>
                                                                                </div>

                                                                                <div class="local-label">
                                                                                        <span class="local-title">Local</span>
                                                                                        <span class="local-name">Restaurante Palace Lounge</span>
                                                                                </div>

                                                                                <div class="icons-row" role="navigation" aria-label="Ações">
                                                                                        <div class="icon-item">
                                                                                                <div class="icon-img-wrap">
                                                                                                        <img src="src/fotos/confirmar_presenca.png" alt="Confirmar presença">
                                                                                                </div>
                                                                                                <div class="icon-label">Confirmar Presença</div>
                                                                                        </div>

                                                                                        <div class="icon-item">
                                                                                                <div class="icon-img-wrap">
                                                                                                        <img src="src/fotos/Localizacao.png" alt="Localização">
                                                                                                </div>
                                                                                                <div class="icon-label">Localização</div>
                                                                                        </div>

                                                                                        <div class="icon-item">
                                                                                                <div class="icon-img-wrap">
                                                                                                        <img src="src/fotos/Dresscode.png" alt="Dresscode" class="icon-dresscode">
                                                                                                </div>
                                                                                                <div class="icon-label">Dresscode</div>
                                                                                        </div>
                                                                                </div>
                                                                        `;
                                                                        coverBackdrop.appendChild(final);
                                                                        // efeito de fade-in
                                                                        setTimeout(() => final.classList.add('show'), 60);

                                                                        // ---- Canecas a flutuar em movimento circular ao redor da página ----
                                                                        const orbitLayer = document.createElement('div');
                                                                        orbitLayer.className = 'mug-orbit-layer';
                                                                        const MUG_POSITIONS = [
                                                                                { top: '8%', left: '10%' },
                                                                                { top: '14%', left: '78%' },
                                                                                { top: '46%', left: '4%' },
                                                                                { top: '52%', left: '88%' },
                                                                                { top: '82%', left: '16%' },
                                                                                { top: '86%', left: '72%' }
                                                                        ];
                                                                        MUG_POSITIONS.forEach((pos, i) => {
                                                                                const mug = document.createElement('img');
                                                                                mug.src = 'src/fotos/caneca.png';
                                                                                mug.alt = '';
                                                                                mug.className = 'orbit-mug';
                                                                                mug.style.top = pos.top;
                                                                                mug.style.left = pos.left;
                                                                                mug.style.animationDelay = (i * 0.4) + 's';
                                                                                mug.style.animationDuration = (9 + Math.random() * 4) + 's';
                                                                                orbitLayer.appendChild(mug);
                                                                        });
                                                                        coverBackdrop.appendChild(orbitLayer);
                                                                        setTimeout(() => orbitLayer.classList.add('show'), 200);
                                                                }
                                                        }, 2000);
                                                }, 2000);
                                        }, 650);
                                }, 3300 + 1700);
                        }, 4400);
                }, maxTime);
        }
        } // fim de iniciarSequenciaAniversario()

        // ===================== EFEITO DE MOVIMENTO (FUNDO ESTÁTICO / BALÕES MÓVEIS) =====================
        function requestTiltPermission() {
                if (typeof DeviceOrientationEvent !== 'undefined' &&
                        typeof DeviceOrientationEvent.requestPermission === 'function') {
                        DeviceOrientationEvent.requestPermission().catch(() => { });
                }
        }
        document.body.addEventListener('click', requestTiltPermission, { once: true });

        // Todas as camadas que devem "flutuar" com o movimento: balões (ecrã 1)
        // e a camada vazia do ecrã 2, pronta para receber novas imagens depois.
        const movingLayers = document.querySelectorAll('.cover-balloon-layer, .parallax-layer');

        let targetX = 0, targetY = 0;
        let currentX = 0, currentY = 0;

        function renderScene() {
                currentX += (targetX - currentX) * 0.08;
                currentY += (targetY - currentY) * 0.08;

                // Fundo em cetim permanece perfeitamente estático
                movingLayers.forEach((layer) => {
                        layer.style.transform = `translate3d(${currentX * 0.8}px, ${currentY * 0.8}px, 0)`;
                });

                requestAnimationFrame(renderScene);
        }

        function onMouseMove(e) {
                const nx = (e.clientX / window.innerWidth) * 2 - 1;
                const ny = (e.clientY / window.innerHeight) * 2 - 1;
                targetX = nx * 10;
                targetY = ny * 8;
        }

        function onTouchMove(e) {
                if (!e.touches || e.touches.length === 0) return;
                const touch = e.touches[0];
                const nx = (touch.clientX / window.innerWidth) * 2 - 1;
                const ny = (touch.clientY / window.innerHeight) * 2 - 1;
                targetX = nx * 10;
                targetY = ny * 8;
        }

        function onOrientation(e) {
                if (e.beta === null || e.gamma === null) return;
                const gamma = Math.max(-20, Math.min(20, e.gamma));
                const beta = Math.max(-20, Math.min(20, e.beta - 45));
                targetX = (gamma / 20) * 10;
                targetY = (beta / 20) * 8;
        }

        window.addEventListener('mousemove', onMouseMove, { passive: true });
        window.addEventListener('touchmove', onTouchMove, { passive: true });
        window.addEventListener('deviceorientation', onOrientation, { passive: true });

        renderScene();
});

