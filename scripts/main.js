

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

// 🎬 CINEMATIC MOVIE INTRO LOGIC
function handleIntro() {
    const intro = document.getElementById('movie-intro');
    const titleText = document.getElementById('intro-title-text');
    
    if (!intro || !titleText) return;

    // 1. Text Fragmentation Logic
    // Need to split text nodes into spans without breaking <br>
    const originalHTML = titleText.innerHTML;
    // Replace <br> with a placeholder to split safely, then reconstruct
    // Or simpler: handle text lines manually since we know the content
    titleText.innerHTML = '';
    
    const lines = ["Beneath the Light", "of a Dying Sky"];
    
    lines.forEach((line, lineIndex) => {
        const lineDiv = document.createElement('div');
        // Split into characters
        line.split('').forEach((char, i) => {
            const span = document.createElement('span');
            span.innerText = char;
            span.className = 'intro-char';
            if (char === ' ') span.style.width = '10px'; // Handle spaces
            
            // Randomize delay slightly for the "Fragmented" feel
            // Base delay starts at 1.2s (after line laser)
            const randomDelay = Math.random() * 0.5; 
            span.style.animationDelay = `${1.2 + randomDelay + (i * 0.05)}s`;
            
            lineDiv.appendChild(span);
        });
        titleText.appendChild(lineDiv);
    });

    // 2. Add Ember Particles via JS (for intro only)
    for(let i=0; i<20; i++) {
        const ember = document.createElement('div');
        ember.className = 'ember';
        ember.style.left = Math.random() * 100 + '%';
        ember.style.top = (80 + Math.random() * 20) + '%';
        ember.style.animationDelay = `${2.3 + Math.random()}s`; // Start after title activates
        intro.appendChild(ember);
    }

    // 3. Intro Cleanup (Total duration approx 5.5s)
    setTimeout(() => {
        intro.style.transition = 'opacity 1s ease';
        intro.style.opacity = '0';
        setTimeout(() => {
            intro.style.display = 'none';
        }, 1000);
    }, 5500);
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
        // Clean up particles
        document.querySelectorAll('.emoji-particle').forEach(e => e.remove());
    };
}

function createEmojiParticle(emoji, theme) {
    const p = document.createElement('div');
    p.innerText = emoji;
    p.className = 'emoji-particle';
    p.style.left = Math.random() * 100 + 'vw';
    
    if (theme === 'fire') {
        // Fire goes UP
        p.style.bottom = '-50px';
        p.style.animation = `riseUp ${2 + Math.random()}s linear forwards`;
    } else {
        // Sakura/Blood goes DOWN
        p.style.top = '-50px';
        p.style.animation = `fallDown ${2 + Math.random()}s linear forwards`;
    }
    
    document.getElementById('theme-modal').appendChild(p);
    
    setTimeout(() => p.remove(), 4000);
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

// 🔐 5. COPYRIGHT & PROTECTION
function setupProtection() {
    // Block Right Click
    document.addEventListener('contextmenu', e => e.preventDefault());
    
    // Block Dragging
    document.addEventListener('dragstart', e => e.preventDefault());
    
    // Block Key Combos (Save, Print, View Source)
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

// Utility
window.getQueryParam = (param) => {
    return new URLSearchParams(window.location.search).get(param);
};
