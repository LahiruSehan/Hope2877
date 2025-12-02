
// 📚 2. MANGA PAGE LOGIC
document.addEventListener('DOMContentLoaded', () => {
    loadMangaCover();
    
    const chapterListEl = document.getElementById('chapter-list');
    if (!chapterListEl) return;

    // Show Skeleton Loader first
    renderSkeleton(chapterListEl);

    // Simulate Network Delay (for effect) then load real data
    setTimeout(() => {
        renderChapters(chapterListEl);
        updateLastReadStatus();
    }, 600);
});

function loadMangaCover() {
    const coverEl = document.getElementById('manga-cover');
    if (coverEl && typeof APP_CONFIG !== 'undefined') {
        coverEl.src = APP_CONFIG.assets.cover;
    }
}

function renderSkeleton(container) {
    container.innerHTML = '';
    for(let i=0; i<3; i++) {
        container.innerHTML += `
            <div class="chapter-tile">
                <div class="chapter-thumb skeleton"></div>
                <div class="chapter-info">
                    <div class="skeleton skeleton-text" style="width: 40%"></div>
                    <div class="skeleton skeleton-text" style="width: 70%"></div>
                </div>
            </div>
        `;
    }
}

function renderChapters(container) {
    container.innerHTML = '';
    
    if (typeof APP_CONFIG === 'undefined') {
        container.innerHTML = "<p>Error loading configuration.</p>";
        return;
    }

    APP_CONFIG.chapters.forEach((chapter, index) => {
        let tileHTML;
        
        if (chapter.locked) {
            // 🔒 Locked / Coming Soon Style
            tileHTML = `
                <div class="chapter-tile locked" style="animation-delay: ${index * 0.1}s;">
                    <img src="${chapter.thumb}" class="chapter-thumb grayscale">
                    <div class="chapter-info">
                        <span class="chapter-number">Chapter ${chapter.id}</span>
                        <span class="chapter-date" style="color:var(--accent-secondary)">${chapter.date}</span>
                    </div>
                    <div class="chapter-action">
                        🔒
                    </div>
                </div>
            `;
        } else {
            // 🔓 Unlocked Style
            tileHTML = `
                <a href="reader.html?chapter=${chapter.id}" class="chapter-tile fade-in" style="animation-delay: ${index * 0.1}s;">
                    <img src="${chapter.thumb}" alt="Ch ${chapter.id}" class="chapter-thumb">
                    <div class="chapter-info">
                        <span class="chapter-number">Chapter ${chapter.id}</span>
                        <span class="chapter-date">${chapter.title}</span>
                        <span id="badge-${chapter.id}" class="last-read-badge">Last Read</span>
                    </div>
                    <div class="chapter-action">
                        <span style="color:var(--accent-color); font-size: 1.2rem;">➔</span>
                    </div>
                </a>
            `;
        }

        container.insertAdjacentHTML('beforeend', tileHTML);
    });
}

function updateLastReadStatus() {
    const lastRead = localStorage.getItem('lastReadChapter');
    if (lastRead) {
        const badge = document.getElementById(`badge-${lastRead}`);
        if (badge) badge.classList.add('active');
    }
}
