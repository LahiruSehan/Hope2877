
// 📖 3. READER PAGE LOGIC
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('reader-container');
    const zoomWrapper = document.getElementById('zoom-wrapper');
    const chapterId = window.getQueryParam('chapter') || 1;
    const nav = document.querySelector('.reader-nav');
    const controls = document.querySelector('.reader-controls');
    
    // UI Setup
    document.getElementById('current-chapter-display').innerText = `Chapter ${chapterId}`;
    setupNavigation(chapterId);

    // Load & Restore
    loadChapterImages(chapterId, zoomWrapper).then(() => {
        restoreReadingProgress(chapterId, container);
    });

    // Event Listeners
    setupInteractions(container, nav, controls);
    setupZoomBlock(container);
    initMovingWatermark();
    initSecurityMonitors();
});

async function loadChapterImages(chapterId, wrapper) {
    if (typeof APP_CONFIG === 'undefined') {
        alert("Config not found");
        return;
    }

    const chapterConfig = APP_CONFIG.chapters.find(c => c.id == chapterId);
    
    // Safety check
    if (!chapterConfig || chapterConfig.locked || !chapterConfig.pages) {
        window.showToast("This chapter is locked or empty.");
        setTimeout(() => window.location.href = 'manga.html', 2000);
        return;
    }

    const pages = chapterConfig.pages;

    pages.forEach((url, index) => {
        let el;
        const isVideo = url.toLowerCase().endsWith('.mp4');

        if (isVideo) {
            // 🎬 Video Support
            el = document.createElement('video');
            el.src = url;
            el.muted = true;    // Required for autoplay
            el.autoplay = true;
            el.loop = true;
            el.playsInline = true; // iOS support
            el.setAttribute('webkit-playsinline', 'true');
            el.className = 'manga-page'; // Re-use page class for styling
        } else {
            // 🖼️ Image/GIF Support
            el = document.createElement('img');
            el.src = url; 
            el.className = 'manga-page';
        }

        el.alt = `Page ${index + 1}`;
        
        // Add Intersection Observer for "Magical Reveal"
        observer.observe(el);

        wrapper.appendChild(el);
    });
}

// ✨ Magical Reveal Observer
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loaded');
            // If it's a video, ensure it plays when visible
            if (entry.target.tagName === 'VIDEO') {
                entry.target.play().catch(e => console.log("Autoplay blocked", e));
            }
        } else {
            // Optimization: Pause video when off screen
            if (entry.target.tagName === 'VIDEO') {
                entry.target.pause();
            }
        }
    });
}, { threshold: 0.1 });

function setupInteractions(container, nav, controls) {
    let isNavVisible = true;
    let scrollTimeout;

    // Toggle Nav
    container.addEventListener('click', (e) => {
        if(e.target.closest('button') || e.target.closest('a')) return;
        isNavVisible = !isNavVisible;
        const action = isNavVisible ? 'remove' : 'add';
        nav.classList[action]('nav-hidden');
        controls.classList[action]('nav-hidden');
    });

    // Scroll Handler (Progress + Save)
    container.addEventListener('scroll', () => {
        // Update Progress Bar
        const totalHeight = container.scrollHeight - container.clientHeight;
        const progress = (container.scrollTop / totalHeight) * 100;
        document.getElementById('reading-progress').style.width = `${progress}%`;

        // Debounced Save
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            saveReadingProgress(window.getQueryParam('chapter'), container.scrollTop);
        }, 1000);
    });
}

function saveReadingProgress(chapterId, scrollPos) {
    if(!chapterId) return;
    const key = `scrollPos-${chapterId}`;
    const prev = localStorage.getItem(key);
    
    if (!prev || Math.abs(prev - scrollPos) > 50) {
        localStorage.setItem('lastReadChapter', chapterId);
        localStorage.setItem(key, scrollPos);
        if (window.showToast) window.showToast("Progress Saved");
    }
}

function restoreReadingProgress(chapterId, container) {
    const savedPos = localStorage.getItem(`scrollPos-${chapterId}`);
    if (savedPos) {
        setTimeout(() => {
            container.scrollTo({ top: parseInt(savedPos, 10), behavior: 'smooth' });
        }, 200);
    }
}

function initMovingWatermark() {
    const el = document.getElementById('watermark');
    if(!el) return;
    
    // ⚠️ MORE FREQUENT MOVEMENT (0.8s) & AGGRESSIVE
    setInterval(() => {
        const top = Math.random() * 80 + 10; 
        const left = Math.random() * 80 + 10; 
        el.style.top = `${top}%`;
        el.style.left = `${left}%`;
        // Random slight rotation
        el.style.transform = `rotate(${Math.random() * 20 - 10}deg)`;
    }, 800); 
}

// 🚫 ZOOM BLOCK (Requested)
function setupZoomBlock(container) {
    // Disable Pinch
    container.addEventListener('touchmove', (e) => {
        if (e.touches.length > 1) {
            e.preventDefault();
        }
    }, { passive: false });

    // Disable Gesture Start
    document.addEventListener('gesturestart', (e) => e.preventDefault());
}

// 🚔 SECURITY MONITORS (Screenshot Simulation)
function initSecurityMonitors() {
    // Generate Fake IP or retrieve session IP
    let userIP = sessionStorage.getItem('userIP');
    if (!userIP) {
        userIP = `192.168.${Math.floor(Math.random()*255)}.${Math.floor(Math.random()*255)}`;
        sessionStorage.setItem('userIP', userIP);
    }

    // Listen for Screenshot keys
    document.addEventListener('keyup', (e) => {
        if (e.key === 'PrintScreen' || (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === 'S'))) {
            triggerSecurityAlert(userIP);
        }
    });
}

function triggerSecurityAlert(ip) {
    // Create Alert Overlay
    const alertOverlay = document.createElement('div');
    alertOverlay.className = 'screenshot-alert';
    alertOverlay.innerHTML = `
        <div class="alert-box">
            <h1>🚫 SCREENSHOT DETECTED</h1>
            <p>IP ADDRESS LOGGED: <span style="color:#fff; background:red; padding:2px 5px;">${ip}</span></p>
            <p>This incident has been reported.</p>
        </div>
    `;
    document.body.appendChild(alertOverlay);

    // Remove after 3 seconds
    setTimeout(() => {
        alertOverlay.remove();
    }, 3000);
}

function setupNavigation(currentId) {
    currentId = parseInt(currentId);
    
    // Use Config to check bounds
    if (typeof APP_CONFIG === 'undefined') return;
    const maxChapters = APP_CONFIG.chapters.length;

    const prev = document.getElementById('btn-prev');
    const next = document.getElementById('btn-next');

    // Prev Button
    if (currentId <= 1) {
        prev.style.opacity = '0.3';
        prev.onclick = null;
    } else {
        prev.onclick = () => window.location.href = `reader.html?chapter=${currentId - 1}`;
    }

    // Next Button (Check if next chapter is locked)
    const nextChapter = APP_CONFIG.chapters.find(c => c.id === currentId + 1);

    if (!nextChapter || nextChapter.locked) {
        next.innerHTML = '✔'; 
        next.onclick = () => window.location.href = `manga.html`;
    } else {
        next.onclick = () => window.location.href = `reader.html?chapter=${currentId + 1}`;
    }

    document.getElementById('btn-top').onclick = () => {
        document.getElementById('reader-container').scrollTo({ top: 0, behavior: 'smooth' });
    };
}
