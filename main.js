// --- Atmospheric Dust Engine ---
const canvas = document.getElementById('space-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let width, height;
let mouse = { x: -100, y: -100 };

function initCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    const count = Math.min(window.innerWidth / 12, 100);
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.1,
            vy: (Math.random() - 0.5) * 0.1,
            size: Math.random() * 1.5 + 0.2,
            opacity: Math.random() * 0.3 + 0.1
        });
    }
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Subtle Parallax
        const dxM = (mouse.x - width / 2) * 0.005;
        const dyM = (mouse.y - height / 2) * 0.005;
        const drawX = p.x + dxM;
        const drawY = p.y + dyM;

        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * (Math.sin(Date.now() * 0.0005 + i) * 0.5 + 0.5)})`;
        ctx.beginPath();
        ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2);
        ctx.fill();

        if (p.x < 0) p.x = width; if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
    }
    requestAnimationFrame(draw);
}

window.addEventListener('resize', initCanvas);
document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Tiny cursor follow
    const dot = document.getElementById('cursor-dot');
    if (dot) {
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';
    }
});

initCanvas();
draw();

// --- Cursor Interaction Logic ---
const interactive = document.querySelectorAll('a, button, #mascot, #tagline, .item');
const dot = document.getElementById('cursor-dot');
interactive.forEach(el => {
    el.addEventListener('mouseenter', () => dot.classList.add('active'));
    el.addEventListener('mouseleave', () => dot.classList.remove('active'));
});

// --- Active Nav ---
const path = window.location.pathname;
document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (path.endsWith(href) || (path.endsWith('/') && href === 'index.html')) link.classList.add('active');
});

// --- Scroll Reveal Logic ---
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = 1;
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.05 });

document.querySelectorAll('.item, h1, p, .container').forEach(el => {
    el.style.opacity = 0;
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
    observer.observe(el);
});
