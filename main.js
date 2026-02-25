// --- Space Canvas ---
const canvas = document.getElementById('space-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let width, height;

function initCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2,
            speed: Math.random() * 0.5 + 0.1,
            opacity: Math.random()
        });
    }
}

function drawSpace() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * (Math.sin(Date.now() * 0.001) * 0.5 + 0.5)})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        p.y -= p.speed;
        if (p.y < 0) p.y = height;
    });
    requestAnimationFrame(drawSpace);
}

window.addEventListener('resize', initCanvas);
initCanvas();
drawSpace();

// --- Custom Cursor & Mascot ---
const cursor = document.getElementById('cursor');
const mascot = document.getElementById('mascot');
let mx = 0, my = 0, cx = 0, cy = 0;
let mPosX = 100, mPosY = 100;

document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
});

function animateCursor() {
    cx += (mx - cx) * 0.2;
    cy += (my - cy) * 0.2;
    cursor.style.left = cx + 'px';
    cursor.style.top = cy + 'px';

    if (mascot) {
        mPosX += (mx - 100 - mPosX) * 0.05;
        mPosY += (my - 100 - mPosY) * 0.05;
        mascot.style.left = mPosX + 'px';
        mascot.style.top = mPosY + 'px';
    }

    requestAnimationFrame(animateCursor);
}
animateCursor();

// --- Sparkles ---
document.addEventListener('mousedown', (e) => {
    const count = 12;
    for (let i = 0; i < count; i++) createSparkle(e.clientX, e.clientY);
});

function createSparkle(x, y) {
    const s = document.createElement('div');
    s.className = 'sparkle';
    document.body.appendChild(s);
    const size = Math.random() * 6 + 4;
    s.style.width = size + 'px';
    s.style.height = size + 'px';
    const colors = ['#fff', '#00d2ff', '#8a2be2', '#ff00ff'];
    s.style.background = colors[Math.floor(Math.random() * colors.length)];

    let posX = x, posY = y;
    const angle = Math.random() * Math.PI * 2;
    const vel = Math.random() * 8 + 2;
    let vx = Math.cos(angle) * vel;
    let vy = Math.sin(angle) * vel;
    let op = 1;

    function up() {
        posX += vx; posY += vy;
        vx *= 0.95; vy *= 0.95;
        op -= 0.02;
        s.style.left = posX + 'px'; s.style.top = posY + 'px';
        s.style.opacity = op;
        if (op > 0) requestAnimationFrame(up); else s.remove();
    }
    up();
}

// --- Active Link Highlight ---
const path = window.location.pathname;
const links = document.querySelectorAll('nav a');
links.forEach(link => {
    if (link.getAttribute('href') === path || (path === '/' && link.getAttribute('href') === 'index.html')) {
        link.classList.add('active');
    }
});
