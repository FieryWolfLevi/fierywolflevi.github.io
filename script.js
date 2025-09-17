(() => {
  const canvas = document.getElementById('bg');
  const ctx = canvas.getContext('2d');
  let dpr = Math.max(1, window.devicePixelRatio || 1);
  let W = 0, H = 0;

  const SNOW_COUNT = 90;
  const particles = [];

  function resize() {
    dpr = Math.max(1, window.devicePixelRatio || 1);
    W = Math.floor(window.innerWidth);
    H = Math.floor(window.innerHeight);
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function makeParticles() {
    particles.length = 0;
    for (let i = 0; i < SNOW_COUNT; i++) {
      particles.push({
        x: rand(0, W),
        y: rand(-H, H),
        r: rand(1.0, 3.2),
        vy: rand(20, 50) / 60,
        vx: rand(-15, 15) / 60,
        drift: rand(0.2, 0.8),
        base: rand(0, Math.PI * 2)
      });
    }
  }

  function drawSnow(p, t) {
    p.y += p.vy;
    p.x += p.vx + Math.sin(t * 0.5 + p.base) * 0.1 * p.drift;
    if (p.y - p.r > H) {
      p.y = -p.r - 2;
      p.x = rand(0, W);
    }
    if (p.x < -10) p.x = W + 10;
    if (p.x > W + 10) p.x = -10;

    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
  }

  let last = 0;
  function loop(ts) {
    const t = ts ? ts / 1000 : 0;
    if (!last) last = t;
    last = t;

    ctx.clearRect(0, 0, W, H);

    for (const p of particles) {
      drawSnow(p, t);
    }
    window.requestAnimationFrame(loop);
  }

  window.addEventListener('resize', () => {
    resize();
    makeParticles();
  });
  resize();
  makeParticles();
  window.requestAnimationFrame(loop);
})();

(() => {
  const card = document.getElementById('card');

  function updateHole() {
    const r = card.getBoundingClientRect();
    const holeX = r.left + r.width / 2;
    const holeY = r.top + r.height / 2;
    const rx = r.width * 0.62;
    const ry = r.height * 0.62;

    document.documentElement.style.setProperty('--hole-x', holeX + 'px');
    document.documentElement.style.setProperty('--hole-y', holeY + 'px');
    document.documentElement.style.setProperty('--hole-rx', rx + 'px');
    document.documentElement.style.setProperty('--hole-ry', ry + 'px');
  }

  const ro = new ResizeObserver(updateHole);
  ro.observe(card);
  window.addEventListener('resize', updateHole);
  window.addEventListener('scroll', updateHole, { passive: true });
  updateHole();
})();

(() => {
  const card = document.getElementById('card');
  const scene = document.querySelector('.scene');

  let targetRX = 0, targetRY = 0;
  let currentRX = 0, currentRY = 0;

  function onMove(e) {
    const rect = card.getBoundingClientRect();
    const mx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
    const my = (e.clientY - (rect.top + rect.height / 2)) / rect.height;
    targetRY = mx * 10;
    targetRX = -my * 10;
  }

  function onLeave() {
    targetRX = 0;
    targetRY = 0;
  }

  scene.addEventListener('mousemove', onMove);
  scene.addEventListener('mouseleave', onLeave);

  function animate() {
    currentRX += (targetRX - currentRX) * 0.06;
    currentRY += (targetRY - currentRY) * 0.06;

    card.style.transform = `rotateX(${currentRX.toFixed(2)}deg) rotateY(${currentRY.toFixed(2)}deg) translateZ(0)`;
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();