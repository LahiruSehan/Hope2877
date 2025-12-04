


// 🧠 8. SCRIPT BEHAVIOR - Main
document.addEventListener('DOMContentLoaded', () => {
    handleIntro();
    setupProtection();
    setupAnimations();
    initParticles();
    
    setupLegalModal();
    loadAppCover();
    
    // New Features
    setupPaywall();
    setupSpecialThanks();
});

// 🎬 CINEMATIC RITUAL INTRO LOGIC (Immediate Start)
function handleIntro() {
    const intro = document.getElementById('cinematic-intro');
    const titleText = document.getElementById('ritual-title');
    const runeContainer = document.getElementById('rune-loader');
    const counterText = document.getElementById('loading-counter');
    
    if (!intro || !titleText) return;

    // 1. Crystal Shard Text Effect (Immediate)
    // We split text and randomly position characters in 3D space
    const lines = ["Beneath The Light", "of a Dying Sky"];
    titleText.innerHTML = ''; 

    let charDelayBase = 0; // Start immediately

    lines.forEach((line) => {
        const lineDiv = document.createElement('div');
        line.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.innerText = char;
            span.className = 'ritual-char';
            if (char === ' ') span.style.width = '12px';
            
            // Random start positions
            const rx = (Math.random() - 0.5) * 150 + 'px';
            const ry = (Math.random() - 0.5) * 150 + 'px';
            
            span.style.setProperty('--rx', rx);
            span.style.setProperty('--ry', ry);

            // Staggered delay (faster)
            span.style.animationDelay = `${charDelayBase + (i * 0.05)}s`;

            lineDiv.appendChild(span);
        });
        charDelayBase += 0.8; // Delay next line slightly
        titleText.appendChild(lineDiv);
    });

    // 2. Rising Number Counter (0% - 100%)
    if (counterText) {
        let percent = 0;
        const duration = 10000; // 10 seconds to match intro
        const interval = 100; // update speed
        const step = 100 / (duration / interval);
        
        const timer = setInterval(() => {
            percent += step;
            if (percent >= 100) {
                percent = 100;
                clearInterval(timer);
            }
            counterText.innerText = Math.floor(percent) + '%';
        }, interval);
    }

    // 3. Generate Rune Loader Segments (Start appearing after 2s)
    const segmentCount = 12;
    for(let i=0; i<segmentCount; i++) {
        const seg = document.createElement('div');
        seg.className = 'rune-segment';
        const rot = (360 / segmentCount) * i;
        seg.style.setProperty('--rot', rot + 'deg');
        
        // Activation
        seg.style.animationDelay = `${2 + (i * 0.5)}s`;
        
        setTimeout(() => {
            seg.classList.add('active');
        }, (2 + (i * 0.5)) * 1000);

        runeContainer.appendChild(seg);
    }

    // 4. Magical Particles
    const particleContainer = document.getElementById('intro-particles');
    for(let i=0; i<30; i++) {
        const p = document.createElement('div');
        p.className = 'cinematic-ember';
        p.style.left = Math.random() * 100 + '%';
        p.style.top = (Math.random() * 100) + '%';
        p.style.animationDelay = `${Math.random() * 5}s`;
        particleContainer.appendChild(p);
    }

    // 5. ASCENSION / CLEANUP (At 12s)
    setTimeout(() => {
        // Trigger Fade Out (Opacity 0)
        intro.classList.add('ascension-active');
        
        // Remove from DOM after transition
        setTimeout(() => {
            intro.style.display = 'none';
        }, 2000); 
    }, 12000); // 12 seconds total intro
}

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

// 💰 PAYWALL & NOTIFICATION LOGIC
function setupPaywall() {
    const startBtn = document.getElementById('start-reading-btn');
    if (!startBtn) return; // Only exists on home page

    const paywallModal = document.getElementById('paywall-modal');
    const vipInput = document.getElementById('vip-code-input');
    const vipBtn = document.getElementById('vip-submit-btn');
    const rememberChk = document.getElementById('remember-vip');

    // Check LocalStorage
    const savedCode = localStorage.getItem('vipAccessCode');
    
    startBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (savedCode && APP_CONFIG.vipCodes.includes(savedCode)) {
            // Already VIP -> Go straight to Manga
            window.location.href = 'manga.html';
        } else {
            // Open Paywall
            paywallModal.style.display = 'flex';
        }
    });

    vipBtn.addEventListener('click', () => {
        const inputCode = vipInput.value.trim().toUpperCase();
        
        if (APP_CONFIG.vipCodes.includes(inputCode)) {
            // SUCCESS
            if (rememberChk.checked) {
                localStorage.setItem('vipAccessCode', inputCode);
            }
            
            paywallModal.style.display = 'none';
            triggerNotificationTrap(); // Run the trap before redirecting
        } else {
            // FAIL
            window.showToast("🚫 INVALID VIP CODE");
            vipInput.style.borderColor = 'red';
            setTimeout(() => vipInput.style.borderColor = '#FFD700', 1000);
        }
    });
}

// 🔔 NOTIFICATION TRAP
function triggerNotificationTrap() {
    const notifModal = document.getElementById('notif-modal');
    const btnNo = document.getElementById('notif-no');
    const btnYes = document.getElementById('notif-yes');
    const title = document.getElementById('notif-title');
    const text = document.getElementById('notif-text');
    
    notifModal.style.display = 'flex';

    // Demon Interaction
    const triggerDemonMode = () => {
        notifModal.classList.add('demon-mode');
        title.innerText = "YOU WILL PRESS YES";
        text.innerText = "There is no escape.";
        if (window.navigator.vibrate) window.navigator.vibrate([100,50,100,50,500]);
    };

    btnNo.addEventListener('mouseenter', triggerDemonMode);
    btnNo.addEventListener('click', triggerDemonMode); // Mobile fallback

    btnYes.addEventListener('click', () => {
        window.showToast("GOOD CHOICE.");
        setTimeout(() => {
            window.location.href = 'manga.html';
        }, 1000);
    });
}

// 🏆 SPECIAL THANKS LOGIC
function setupSpecialThanks() {
    const container = document.getElementById('thanks-list');
    if (!container || typeof APP_CONFIG === 'undefined') return;

    APP_CONFIG.credits.forEach(person => {
        const tag = document.createElement('div');
        tag.className = 'thanks-item';
        tag.innerText = person.name;
        tag.addEventListener('click', () => openThemeModal(person));
        container.appendChild(tag);
    });
}

let particleInterval;

function openThemeModal(person) {
    const modal = document.getElementById('theme-modal');
    const nameEl = document.getElementById('theme-name');
    const roleEl = document.getElementById('theme-role');
    const descEl = document.getElementById('theme-desc');
    const closeBtn = document.getElementById('close-theme');

    // Set Content
    nameEl.innerText = person.name;
    roleEl.innerText = person.role;
    descEl.innerText = person.desc;

    // Reset Classes
    modal.className = 'theme-modal';
    modal.classList.add(`theme-${person.theme}`);

    modal.style.display = 'flex';

    // Start Particles
    if (particleInterval) clearInterval(particleInterval);
    particleInterval = setInterval(() => createEmojiParticle(person.emoji, person.theme), 200);

    closeBtn.onclick = () => {
        modal.style.display = 'none';
        clearInterval(particleInterval);
        document.querySelectorAll('.emoji-particle').forEach(e => e.remove());
    };
}

function createEmojiParticle(emoji, theme) {
    const p = document.createElement('div');
    p.innerText = emoji;
    p.className = 'emoji-particle';
    p.style.left = Math.random() * 100 + 'vw';
    
    if (theme === 'fire') {
        p.style.bottom = '-50px';
        p.style.animation = `riseUp ${2 + Math.random()}s linear forwards`;
    } else {
        p.style.top = '-50px';
        p.style.animation = `fallDown ${2 + Math.random()}s linear forwards`;
    }
    
    document.getElementById('theme-modal').appendChild(p);
    
    setTimeout(() => p.remove(), 4000);
}

// 🌌 Particle Background (Canvas)
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

    void toast.offsetWidth; 
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 2000);
};

// 🔐 PROTECTION
function setupProtection() {
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('dragstart', e => e.preventDefault());
    
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && ['s','p','u','shift'].includes(e.key.toLowerCase())) {
            e.preventDefault();
            window.showToast("⚠️ Security Violation Logged");
        }
    });
}

function setupAnimations() {
    const container = document.querySelector('.container');
    if (container) container.classList.add('fade-in');
}

window.getQueryParam = (param) => {
    return new URLSearchParams(window.location.search).get(param);
};
