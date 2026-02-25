// --- Global Defensive Initializer ---
document.addEventListener('DOMContentLoaded', () => {
    initCanvas();
    initKineticType();
    initCursor();
    initScrollReveal();
    initNavAutoHighlight();
    initSparkEffect();
});

// --- 2025 Hyper-Particle Engine ---
let canvas, ctx, particles = [], width, height;
let mouse = { x: -100, y: -100 };

function initCanvas() {
    canvas = document.getElementById('space-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    if (!ctx) return;

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    animateParticles();
}

function resizeCanvas() {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];
    const count = Math.min(window.innerWidth / 8, 120);
    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 2 + 0.5,
            opacity: Math.random() * 0.5 + 0.2
        });
    }
}

function animateParticles() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy;
        const dxM = (mouse.x - width / 2) * 0.01;
        const dyM = (mouse.y - height / 2) * 0.01;
        const drawX = p.x + dxM; const drawY = p.y + dyM;

        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * (Math.sin(Date.now() * 0.001 + i) * 0.3 + 0.7)})`;
        ctx.beginPath(); ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2); ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 100) {
                ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - dist / 100)})`;
                ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(drawX, drawY); ctx.lineTo(p2.x + dxM, p2.y + dyM); ctx.stroke();
            }
        }
        if (p.x < 0) p.x = width; if (p.x > width) p.x = 0; if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
    }
    requestAnimationFrame(animateParticles);
}

// --- Custom Cursor & Magnetic Interactions ---
function initCursor() {
    const dot = document.getElementById('cursor-dot');
    if (!dot) return;

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        dot.style.left = e.clientX + 'px';
        dot.style.top = e.clientY + 'px';

        // 3D Card Tilt & Magnetic
        const interactives = document.querySelectorAll('.item, .container, .magnetic, a, button, #mascot, #tagline');
        let isActive = false;

        interactives.forEach(el => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Magnetic Check
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dist = Math.hypot(e.clientX - centerX, e.clientY - centerY);

            if (dist < 100 && (el.classList.contains('magnetic') || el.tagName === 'A' || el.tagName === 'BUTTON' || el.id === 'mascot')) {
                const strength = 0.3;
                const tx = (e.clientX - centerX) * strength;
                const ty = (e.clientY - centerY) * strength;
                el.style.transform = `translate(${tx}px, ${ty}px) scale(1.05)`;
                isActive = true;
            } else if (el.classList.contains('item') || el.classList.contains('container')) {
                // Tilt logic for Bento items
                if (dist < 400) {
                    const rotateX = (rect.height / 2 - y) / 15;
                    const rotateY = (x - rect.width / 2) / 15;
                    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
                    el.style.setProperty('--x', `${x}px`);
                    el.style.setProperty('--y', `${y}px`);
                }
            }
        });

        if (isActive) dot.classList.add('active');
        else dot.classList.remove('active');
    });

    document.addEventListener('mouseleave', () => {
        document.querySelectorAll('.item, .container, .magnetic, a, button, #mascot').forEach(el => el.style.transform = '');
    });
}

// --- Kinetic Typography (Home Page) ---
function initKineticType() {
    const tagline = document.getElementById('tagline');
    if (!tagline) return;

    const text = tagline.textContent;
    tagline.innerHTML = text.split('').map((char, i) =>
        `<span class="char" style="transition-delay: ${i * 30}ms">${char === ' ' ? '&nbsp;' : char}</span>`
    ).join('');

    // Force visibility update
    setTimeout(() => {
        tagline.querySelectorAll('.char').forEach(c => {
            c.style.opacity = '1';
            c.style.filter = 'blur(0)';
            c.style.transform = 'translateY(0)';
        });
    }, 100);
}

// --- Scroll Reveal ---
function initScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0) scale(1)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.item, h1, p, .container').forEach(el => {
        if (!el.classList.contains('char')) { // Don't hide chars
            el.style.opacity = 0;
            el.style.transform = 'translateY(30px) scale(0.95)';
            el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
            observer.observe(el);
        }
    });
}

// --- Navigation Highlighting ---
function initNavAutoHighlight() {
    const path = window.location.pathname;
    document.querySelectorAll('nav a').forEach(link => {
        const href = link.getAttribute('href');
        if (path.endsWith(href) || (path.endsWith('/') && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// --- Click Sparks ---
function initSparkEffect() {
    document.addEventListener('mousedown', (e) => {
        for (let i = 0; i < 8; i++) {
            const s = document.createElement('div');
            s.style.cssText = `position:fixed;width:4px;height:4px;background:white;border-radius:50%;left:${e.clientX}px;top:${e.clientY}px;pointer-events:none;z-index:9999;transition:all 0.8s cubic-bezier(0.16,1,0.3,1);`;
            document.body.appendChild(s);
            const angle = Math.random() * Math.PI * 2;
            const dist = 60 + Math.random() * 60;
            requestAnimationFrame(() => {
                s.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0)`;
                s.style.opacity = '0';
            });
            setTimeout(() => s.remove(), 800);
        }
    });
}
