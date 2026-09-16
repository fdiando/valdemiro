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
	const balloonLayer = document.getElementById('rising-balloons');
	if (balloonLayer) {
		const TOTAL_BALOES = 25;
		for (let i = 0; i < TOTAL_BALOES; i++) {
			const img = document.createElement('img');
			img.src = 'src/fundo/baloes.png';
			img.alt = '';
			img.className = 'rising-balloon';

			const left = Math.random() * 96;
			const size = 46 + Math.random() * 60;
			const duration = 2.5 + Math.random() * 2;
			const delay = Math.random() * 1.2;
			const swayX = (Math.random() * 80 - 40).toFixed(0) + 'px';
			const swayStart = (Math.random() * 12 - 6).toFixed(1) + 'deg';
			const swayEnd = (Math.random() * 12 - 6).toFixed(1) + 'deg';

			img.style.left = left + '%';
			img.style.width = size + 'px';
			img.style.animationDuration = duration + 's';
			img.style.animationDelay = delay + 's';
			img.style.setProperty('--sway-x', swayX);
			img.style.setProperty('--sway-start', swayStart);
			img.style.setProperty('--sway-end', swayEnd);

			balloonLayer.appendChild(img);
		}

		// Depois dos balões terminarem: limpa a camada e revela o bloco de aniversário
		const maxTime = (2.5 + 2 + 1.2) * 1000 + 400;
		setTimeout(() => {
			balloonLayer.innerHTML = '';

			const birthdayReveal = document.getElementById('birthday-reveal');
			if (birthdayReveal) {
				birthdayReveal.classList.add('show');
			}
		}, maxTime);
	}

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

