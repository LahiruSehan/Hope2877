// 🧠 8. SCRIPT BEHAVIOR - Main
document.addEventListener('DOMContentLoaded', () => {
    setupProtection();
    setupAnimations();
});

// 🔐 5. COPYRIGHT & PROTECTION - JS Implementation
function setupProtection() {
    // Disable Right Click
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });

    // Disable Drag Start (Images)
    document.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
    });

    // Disable Key Combos (Save, Print, Source)
    document.addEventListener('keydown', (e) => {
        // Ctrl+S, Ctrl+P, Ctrl+U, F12 (DevTools)
        if (
            (e.ctrlKey && (e.key === 's' || e.key === 'S')) ||
            (e.metaKey && (e.key === 's' || e.key === 'S')) || // Mac Cmd+S
            (e.ctrlKey && (e.key === 'p' || e.key === 'P')) ||
            (e.metaKey && (e.key === 'p' || e.key === 'P')) ||
            (e.ctrlKey && (e.key === 'u' || e.key === 'U')) ||
            e.key === 'F12' ||
            (e.ctrlKey && e.shiftKey && e.key === 'I')
        ) {
            e.preventDefault();
            e.stopPropagation();
            return false;
        }
    });
}

function setupAnimations() {
    // Add fade-in class to main container if present
    const container = document.querySelector('.container');
    if (container) {
        container.classList.add('fade-in');
    }
}

// Utility to get URL params
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// Global Config (Simulating Backend)
const MANGA_CONFIG = {
    title: "Beneath the Light of a Dying Sky",
    chapters: [
        { id: 1, title: "The Beginning", pages: 5 }, // Mock pages count
        { id: 2, title: "Shadows", pages: 5 },
        { id: 3, title: "Echoes", pages: 5 }
    ]
};
