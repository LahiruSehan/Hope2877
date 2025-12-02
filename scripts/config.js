
// ⚙️ CENTRAL CONFIGURATION FILE
// Add your image links here. The app handles the rest.

const APP_CONFIG = {
    // 🖼️ GLOBAL ASSETS
    assets: {
        cover: "images/cover.gif", 
    },

    legal: {
        license: "Officially licensed in Sri Lanka.",
        copyright: "© 2025 Sehan Karunarathne. All Rights Reserved.",
        warning: "Protected under international copyright law.",
        tracking: "⚠️ SECURITY WARNING: Screenshotting or saving images will trigger an IP address log. This device's IP is being monitored. If these images are found externally, legal action will be taken based on this digital footprint.",
        origin: "Original novel 'Hope 2877' adapted to manga format. Artwork Hand Drawn Digitaly as sketches and refined /  Coloured by AI technology."
    },

    chapters: [
        { 
            id: 1, 
            title: "The Beginning", 
            date: "Everything is a mess",
            locked: false, 
            thumb: "", // Unused now, we generate stylized numbers
            pages: [
                "images/1.png", 
                "images/2.png",
                "images/3.png",
                "images/4.png",
                "images/5.png",
                "images/6.png",
                "images/7.png"
            ]
        },
        { 
            id: 2, 
            title: "Shadows", 
            date: "Coming Soon",
            locked: true, 
            thumb: "",
            pages: [] 
        },
        { 
            id: 3, 
            title: "Echoes", 
            date: "Coming Soon",
            locked: true, 
            thumb: "",
            pages: [] 
        },
        { 
            id: 4, 
            title: "The Freeze", 
            date: "Coming Soon",
            locked: true, 
            thumb: "",
            pages: [] 
        }
    ]
};
