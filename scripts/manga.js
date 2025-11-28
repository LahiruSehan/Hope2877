// 📚 2. MANGA PAGE LOGIC
document.addEventListener('DOMContentLoaded', () => {
    const chapterListEl = document.getElementById('chapter-list');
    if (!chapterListEl) return;

    renderChapters(chapterListEl);
    updateLastReadStatus();
});

function renderChapters(container) {
    container.innerHTML = '';
    
    // Sort chapters descending (newest first usually, but here 1-3 is fine)
    // Let's keep 1 at top for story progression
    MANGA_CONFIG.chapters.forEach(chapter => {
        const tile = document.createElement('a');
        tile.className = 'chapter-tile fade-in';
        tile.href = `reader.html?chapter=${chapter.id}`;
        // Add specific style delay for cascade effect
        tile.style.animationDelay = `${chapter.id * 0.1}s`;

        // Check if artwork exists (simulated path)
        const thumbPath = `chapters/${chapter.id}/artwork/1.png`;

        tile.innerHTML = `
            <img src="${thumbPath}" alt="Ch ${chapter.id}" class="chapter-thumb" onerror="this.src='https://picsum.photos/60/80'">
            <div class="chapter-info">
                <span class="chapter-number">Chapter ${chapter.id}</span>
                <span class="chapter-date">${chapter.title}</span>
                <span id="badge-${chapter.id}" class="last-read-badge">LAST READ</span>
            </div>
            <div class="chapter-action">
                <span style="color:var(--accent-color)">➤</span>
            </div>
        `;

        container.appendChild(tile);
    });
}

function updateLastReadStatus() {
    const lastRead = localStorage.getItem('lastReadChapter');
    if (lastRead) {
        const badge = document.getElementById(`badge-${lastRead}`);
        if (badge) {
            badge.classList.add('active');
        }
        
        // Update Start Reading button on index if we were there (but this is manga.js)
        // If we are on manga page, maybe we highlight the Resume button?
        // Let's add a "Resume" button at the top if history exists
        const header = document.querySelector('.manga-header');
        if (header) {
            const resumeBtn = document.createElement('a');
            resumeBtn.href = `reader.html?chapter=${lastRead}`;
            resumeBtn.className = 'btn';
            resumeBtn.style.marginTop = '1rem';
            resumeBtn.innerText = `Resume Chapter ${lastRead}`;
            header.appendChild(resumeBtn);
        }
    }
}
