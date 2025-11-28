// 📖 3. READER PAGE LOGIC
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('reader-container');
    const zoomWrapper = document.getElementById('zoom-wrapper');
    const chapterId = getQueryParam('chapter') || 1;
    const nav = document.querySelector('.reader-nav');
    const controls = document.querySelector('.reader-controls');
    
    // Setup UI
    document.getElementById('current-chapter-display').innerText = `Chapter ${chapterId}`;
    setupNavigation(chapterId);

    // Load Images
    loadChapterImages(chapterId, zoomWrapper);

    // Restore Position
    restoreReadingProgress(chapterId, container);

    // Interaction Listeners
    setupInteractions(container, nav, controls);
    setupZoom(container, zoomWrapper);
});

function loadChapterImages(chapterId, wrapper) {
    // In a real app without backend, we'd need a manifest. 
    // Here we try to load images until one fails or max limit (safeguard).
    // Using MANGA_CONFIG from main.js if available, else standard loop
    
    const chapterConfig = MANGA_CONFIG.chapters.find(c => c.id == chapterId);
    const maxPages = chapterConfig ? chapterConfig.pages : 10; // Fallback

    for (let i = 1; i <= maxPages; i++) {
        const img = document.createElement('img');
        img.dataset.src = `chapters/${chapterId}/artwork/${i}.png`;
        img.src = `chapters/${chapterId}/artwork/${i}.png`; // Trigger load
        img.className = 'manga-page';
        img.alt = `Page ${i}`;
        
        // Error handling: remove if not found (end of chapter detection fallback)
        img.onerror = function() {
            this.style.display = 'none';
        };

        img.onload = function() {
            this.classList.add('loaded');
        };

        wrapper.appendChild(img);
    }
}

function setupInteractions(container, nav, controls) {
    let lastScrollY = 0;
    let isNavVisible = true;

    // Toggle Nav on Tap
    container.addEventListener('click', (e) => {
        // Don't toggle if clicking a button
        if(e.target.closest('button') || e.target.closest('a')) return;
        
        isNavVisible = !isNavVisible;
        if (isNavVisible) {
            nav.classList.remove('nav-hidden');
            controls.classList.remove('nav-hidden');
        } else {
            nav.classList.add('nav-hidden');
            controls.classList.add('nav-hidden');
        }
    });

    // Save progress on scroll
    container.addEventListener('scroll', () => {
        saveReadingProgress(getQueryParam('chapter'), container.scrollTop);
    });
}

// ✔️ Limited Zoom Logic (Pinch to Zoom)
function setupZoom(container, element) {
    let scale = 1;
    let pointX = 0;
    let pointY = 0;
    let startX = 0;
    let startY = 0;
    let initialScale = 1;

    container.addEventListener('touchstart', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault(); // Prevent native browser zoom
            startX = Math.abs(e.touches[0].pageX - e.touches[1].pageX);
            startY = Math.abs(e.touches[0].pageY - e.touches[1].pageY);
            initialScale = scale;
        }
    }, { passive: false });

    container.addEventListener('touchmove', (e) => {
        if (e.touches.length === 2) {
            e.preventDefault();
            const currentX = Math.abs(e.touches[0].pageX - e.touches[1].pageX);
            const currentY = Math.abs(e.touches[0].pageY - e.touches[1].pageY);
            
            // Calculate distance change
            const startDist = Math.sqrt(startX * startX + startY * startY);
            const currentDist = Math.sqrt(currentX * currentX + currentY * currentY);

            if (startDist > 0) {
                const newScale = initialScale * (currentDist / startDist);
                // Limit Zoom: Min 1x, Max 1.5x
                scale = Math.min(Math.max(1, newScale), 1.5);
                
                element.style.transform = `scale(${scale})`;
                
                // If zooming in, we might need to adjust scroll overflow handling
                // CSS 'transform-origin: top center' keeps it centered horizontally
            }
        }
    }, { passive: false });

    container.addEventListener('touchend', (e) => {
        // Optional: Snap back to 1x if scale is close to 1
        if (scale < 1.1) {
            scale = 1;
            element.style.transition = 'transform 0.3s ease';
            element.style.transform = `scale(1)`;
            setTimeout(() => {
                element.style.transition = 'transform 0.1s linear';
            }, 300);
        }
    });
}

function saveReadingProgress(chapterId, scrollPos) {
    if(!chapterId) return;
    localStorage.setItem('lastReadChapter', chapterId);
    localStorage.setItem(`scrollPos-${chapterId}`, scrollPos);
}

function restoreReadingProgress(chapterId, container) {
    const savedPos = localStorage.getItem(`scrollPos-${chapterId}`);
    if (savedPos) {
        // Small delay to ensure images occupy layout
        setTimeout(() => {
            container.scrollTop = parseInt(savedPos, 10);
        }, 100);
    }
}

function setupNavigation(currentId) {
    currentId = parseInt(currentId);
    const prevBtn = document.getElementById('btn-prev');
    const nextBtn = document.getElementById('btn-next');
    const topBtn = document.getElementById('btn-top');

    // Prev
    if (currentId > 1) {
        prevBtn.onclick = () => window.location.href = `reader.html?chapter=${currentId - 1}`;
    } else {
        prevBtn.disabled = true;
    }

    // Next
    // Assuming 3 chapters for now based on Mock config
    const maxChapters = MANGA_CONFIG.chapters.length;
    if (currentId < maxChapters) {
        nextBtn.onclick = () => window.location.href = `reader.html?chapter=${currentId + 1}`;
    } else {
        nextBtn.innerText = "Finish";
        nextBtn.onclick = () => window.location.href = `manga.html`;
    }

    // PDF Switch
    const pdfBtn = document.getElementById('btn-pdf');
    if (pdfBtn) {
        pdfBtn.onclick = () => window.location.href = `pdf-reader.html?chapter=${currentId}`;
    }

    // Scroll Top
    topBtn.onclick = () => {
        document.getElementById('reader-container').scrollTo({ top: 0, behavior: 'smooth' });
    };
}
