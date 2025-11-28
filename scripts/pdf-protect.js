// 📄 4. PDF PAGE LOGIC & PROTECTION
document.addEventListener('DOMContentLoaded', () => {
    const chapterId = getQueryParam('chapter') || 1;
    
    // Set Iframe Source
    const iframe = document.querySelector('.pdf-frame');
    if (iframe) {
        // #toolbar=0&navpanes=0 hides default PDF viewers UI in Chrome/Edge
        iframe.src = `chapters/${chapterId}/story.pdf#toolbar=0&navpanes=0&scrollbar=0&view=FitH`;
    }

    // Navigation Setup
    const imgModeBtn = document.getElementById('btn-img-mode');
    if (imgModeBtn) {
        imgModeBtn.onclick = (e) => {
            e.preventDefault();
            window.location.href = `reader.html?chapter=${chapterId}`;
        };
    }

    document.getElementById('current-chapter-pdf').innerText = `Ch. ${chapterId}`;
});

// Additional Protection for PDF Context
// Note: Most event blocking is handled in main.js globally.
// Specific PDF logic here ensures the overlay shield works.

// Periodically focus window to prevent iframe from capturing all keyboard events if clicked
setInterval(() => {
    if (document.activeElement && document.activeElement.tagName === 'IFRAME') {
        window.focus();
    }
}, 2000);
