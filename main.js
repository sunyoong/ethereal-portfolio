// --- 2025 Bento Particle Engine ---
const canvas = document.getElementById('space-canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let width, height;
let mouse = { x: 0, y: 0 };

function initCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    const count = Math.min(window.innerWidth / 10, 150);
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.2,
            vy: (Math.random() - 0.5) * 0.2,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.5 + 0.2,
            baseX: 0, baseY: 0
        });
    }
}

function draw() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
        // Subtle drift
        p.x += p.vx;
        p.y += p.vy;

        // Mouse Parallax
        const dx = mouse.x - width / 2;
        const dy = mouse.y - height / 2;
        const px = p.x + (dx * 0.02);
        const py = p.y + (dy * 0.02);

        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * (Math.sin(Date.now() * 0.001 + p.size) * 0.3 + 0.7)})`;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();

        // Wrap around
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
    });
    requestAnimationFrame(draw);
}

window.addEventListener('resize', initCanvas);
document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Update tiny cursor dot
    const dot = document.getElementById('cursor-dot');
    if (dot) {
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';
    }

    // Interactive spotlight for bento items
    const items = document.querySelectorAll('.item');
    items.forEach(item => {
        const rect = item.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        item.style.setProperty('--x', `${x}px`);
        item.style.setProperty('--y', `${y}px`);
    });
});

initCanvas();
draw();

// --- Tiny Cursor Hover Logic ---
const interactive = document.querySelectorAll('a, button, #mascot, #tagline');
interactive.forEach(el => {
    el.addEventListener('mouseenter', () => {
        document.getElementById('cursor-dot').classList.add('active');
    });
    el.addEventListener('mouseleave', () => {
        document.getElementById('cursor-dot').classList.remove('active');
    });
});

// --- Simple Active Nav ---
const path = window.location.pathname;
document.querySelectorAll('nav a').forEach(link => {
    const href = link.getAttribute('href');
    if (path.endsWith(href) || (path.endsWith('/') && href === 'index.html')) {
        link.classList.add('active');
    }
});

// --- Mouse-click Sparkle (Minimal 2025) ---
document.addEventListener('mousedown', (e) => {
    for (let i = 0; i < 6; i++) {
        const s = document.createElement('div');
        s.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: white;
            border-radius: 50%;
            left: ${e.clientX}px;
            top: ${e.clientY}px;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        `;
        document.body.appendChild(s);

        const angle = Math.random() * Math.PI * 2;
        const dist = 50 + Math.random() * 50;
        const tx = Math.cos(angle) * dist;
        const ty = Math.sin(angle) * dist;

        requestAnimationFrame(() => {
            s.style.transform = `translate(${tx}px, ${ty}px) scale(0)`;
            s.style.opacity = '0';
        });
        setTimeout(() => s.remove(), 600);
    }
});
