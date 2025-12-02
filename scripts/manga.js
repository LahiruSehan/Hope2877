
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
                <div class="skeleton skeleton-icon"></div>
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

    // Colors for the stylized numbers
    const colors = ['#00F6FF', '#FF003C', '#FFD700', '#9D00FF', '#00FF9D'];

    APP_CONFIG.chapters.forEach((chapter, index) => {
        let tileHTML;
        // Pick a color based on ID or random
        const color = colors[index % colors.length];
        
        if (chapter.locked) {
            // 🔒 Locked / Coming Soon Style
            tileHTML = `
                <div class="chapter-tile locked" style="animation-delay: ${index * 0.1}s;">
                    <div class="chapter-number-icon" style="border-color: #555; color: #555;">${chapter.id}</div>
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
            // 🔓 Unlocked Style with Stylized Number
            tileHTML = `
                <a href="reader.html?chapter=${chapter.id}" class="chapter-tile fade-in" style="animation-delay: ${index * 0.1}s;">
                    <div class="chapter-number-icon" style="border-color: ${color}; color: ${color}; box-shadow: 0 0 10px ${color}40;">${chapter.id}</div>
                    <div class="chapter-info">
                        <span class="chapter-number">Chapter ${chapter.id}</span>
                        <span class="chapter-date">${chapter.date}</span>
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
