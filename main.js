// --- 2025 Hyper-Particle Engine (Neural Style) ---
const canvas = document.getElementById('space-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;
    let mouse = { x: -100, y: -100 };

    function initCanvas() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        particles = [];
        const count = Math.min(window.innerWidth / 10, 80);
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.2,
                vy: (Math.random() - 0.5) * 0.2,
                size: Math.random() * 1.5 + 0.5,
                opacity: Math.random() * 0.3 + 0.1
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            p.x += p.vx; p.y += p.vy;
            const dxM = (mouse.x - width / 2) * 0.005;
            const dyM = (mouse.y - height / 2) * 0.005;
            const drawX = p.x + dxM; const drawY = p.y + dyM;

            ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * (Math.sin(Date.now() * 0.001 + i) * 0.3 + 0.7)})`;
            ctx.beginPath(); ctx.arc(drawX, drawY, p.size, 0, Math.PI * 2); ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                if (dist < 120) {
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.1 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(drawX, drawY); ctx.lineTo(p2.x + dxM, p2.y + dyM); ctx.stroke();
                }
            }
            if (p.x < 0) p.x = width; if (p.x > width) p.x = 0; if (p.y < 0) p.y = height; if (p.y > height) p.y = 0;
        }
        requestAnimationFrame(draw);
    }
    window.addEventListener('resize', initCanvas);
    initCanvas(); draw();
}

// --- Kinetic Character Engine ---
function initKineticType() {
    const tagline = document.getElementById('tagline');
    if (tagline) {
        const text = tagline.innerText;
        tagline.innerHTML = text.split('').map((char, i) =>
            `<span class="char" style="transition-delay: ${i * 30}ms">${char === ' ' ? '&nbsp;' : char}</span>`
        ).join('');

        setTimeout(() => {
            tagline.querySelectorAll('.char').forEach(c => {
                c.style.opacity = '1';
                c.style.filter = 'blur(0)';
                c.style.transform = 'translateY(0)';
            });
        }, 100);
    }
}
initKineticType();

// --- Magnetic Cursor & Physics Engine ---
const dot = document.getElementById('cursor-dot');
let mousePos = { x: 0, y: 0 };
let dotPos = { x: 0, y: 0 };

document.addEventListener('mousemove', (e) => {
    mousePos.x = e.clientX;
    mousePos.y = e.clientY;

    // Magnetic Attraction Logic
    const interactives = document.querySelectorAll('a, button, #mascot, .magnetic');
    let isMagnetic = false;

    interactives.forEach(el => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(mousePos.x - centerX, mousePos.y - centerY);

        if (dist < 100) {
            isMagnetic = true;
            const strength = 0.3;
            const tx = (mousePos.x - centerX) * strength;
            const ty = (mousePos.y - centerY) * strength;
            el.style.transform = `translate(${tx}px, ${ty}px) scale(1.02)`;

            // Snap cursor towards center
            mousePos.x = centerX + (mousePos.x - centerX) * 0.6;
            mousePos.y = centerY + (mousePos.y - centerY) * 0.6;
        } else {
            el.style.transform = '';
        }
    });

    if (dot) {
        if (isMagnetic) dot.classList.add('active');
        else dot.classList.remove('active');
    }
});

function updateCursor() {
    const ease = 0.15;
    dotPos.x += (mousePos.x - dotPos.x) * ease;
    dotPos.y += (mousePos.y - dotPos.y) * ease;
    if (dot) {
        dot.style.left = `${dotPos.x}px`;
        dot.style.top = `${dotPos.y}px`;
    }
    requestAnimationFrame(updateCursor);
}
updateCursor();

// --- Interactive Navigation Scroll Effect ---
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    if (nav) {
        if (window.scrollY > 50) {
            nav.style.top = '1rem';
            nav.style.background = 'rgba(3, 3, 5, 0.8)';
            nav.style.padding = '0.6rem 2rem';
        } else {
            nav.style.top = '2rem';
            nav.style.background = 'rgba(3, 3, 5, 0.4)';
            nav.style.padding = '0.8rem 2.8rem';
        }
    }
});

// --- Click Sparks ---
document.addEventListener('mousedown', (e) => {
    for (let i = 0; i < 6; i++) {
        const s = document.createElement('div');
        s.style.cssText = `position:fixed;width:2px;height:2px;background:white;border-radius:50%;left:${e.clientX}px;top:${e.clientY}px;pointer-events:none;z-index:9999;transition:all 0.6s cubic-bezier(0.16,1,0.3,1);`;
        document.body.appendChild(s);
        const angle = Math.random() * Math.PI * 2;
        const dist = 40 + Math.random() * 40;
        requestAnimationFrame(() => {
            s.style.transform = `translate(${Math.cos(angle) * dist}px, ${Math.sin(angle) * dist}px) scale(0)`;
            s.style.opacity = '0';
        });
        setTimeout(() => s.remove(), 600);
    }
});
