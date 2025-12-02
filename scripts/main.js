
// 🧠 8. SCRIPT BEHAVIOR - Main
document.addEventListener('DOMContentLoaded', () => {
    setupProtection();
    setupAnimations();
    initParticles();
    checkHomeResume();
    setupLegalModal();
    loadAppCover();
});

// 🖼️ Load Cover from Config
function loadAppCover() {
    const coverEl = document.getElementById('app-cover');
    if (coverEl && typeof APP_CONFIG !== 'undefined') {
        coverEl.src = APP_CONFIG.assets.cover;
    }
}

// ⚖️ Legal & Security Modal
function setupLegalModal() {
    const trigger = document.getElementById('legal-trigger');
    const modal = document.getElementById('legal-modal');
    const closeBtn = document.getElementById('close-legal');
    const contentBody = document.getElementById('legal-body-text');

    if (!trigger || !modal) return;

    // Load text from Config
    if (typeof APP_CONFIG !== 'undefined') {
        contentBody.innerHTML = `
            <p class="legal-text">${APP_CONFIG.legal.license}</p>
            <p class="legal-text">${APP_CONFIG.legal.origin}</p>
            <p class="legal-text" style="color:#aaa; font-style:italic;">${APP_CONFIG.legal.copyright}</p>
            <div class="ip-warning">
                ${APP_CONFIG.legal.tracking}
                <br><br>
                DEVICE ID: ${Math.floor(Math.random()*1000000).toString(16).toUpperCase()}-SR
            </div>
        `;
    }

    trigger.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

// 🌌 Particle Background
function initParticles() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    
    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.2;
            this.vy = (Math.random() - 0.5) * 0.2;
            this.size = Math.random() * 2;
            this.alpha = Math.random() * 0.5;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }
        draw() {
            ctx.fillStyle = `rgba(255, 255, 255, ${this.alpha})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function init() {
        particles = [];
        for (let i = 0; i < 50; i++) particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    resize();
    init();
    animate();
}

// 🍞 Toast Notification System
window.showToast = function(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerText = message;
    container.appendChild(toast);

    // Trigger reflow
    void toast.offsetWidth; 
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 2000);
};

// 🏠 Home Page Resume Logic
function checkHomeResume() {
    const actions = document.getElementById('home-actions');
    if (!actions) return;
    
    const lastRead = localStorage.getItem('lastReadChapter');
    if (lastRead) {
        // Verify chapter isn't locked in new config
        const chapter = APP_CONFIG.chapters.find(c => c.id == lastRead);
        if (chapter && !chapter.locked) {
            const btn = document.createElement('a');
            btn.href = `reader.html?chapter=${lastRead}`;
            btn.className = 'btn';
            btn.style.fontSize = '0.8rem';
            btn.style.marginTop = '0.5rem';
            btn.style.borderColor = 'rgba(255,255,255,0.3)';
            btn.innerText = `Continue Chapter ${lastRead}`;
            actions.appendChild(btn);
        }
    }
}

// 🔐 5. COPYRIGHT & PROTECTION
function setupProtection() {
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('dragstart', e => e.preventDefault());
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && ['s','p','u'].includes(e.key.toLowerCase())) {
            e.preventDefault();
            window.showToast("⚠️ Security Violation Logged");
        }
    });
}

function setupAnimations() {
    const container = document.querySelector('.container');
    if (container) container.classList.add('fade-in');
}

// Utility
window.getQueryParam = (param) => {
    return new URLSearchParams(window.location.search).get(param);
};
