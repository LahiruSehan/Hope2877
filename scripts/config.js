

// ⚙️ CENTRAL CONFIGURATION FILE
// Add your image links here. The app handles the rest.

const APP_CONFIG = {
    // 🖼️ GLOBAL ASSETS
    assets: {
        cover: "images/cover.gif", 
    },

    // 🔑 VIP CODES
    vipCodes: ["CHAVEEN", "SAIDA", "LAHIRU"],

    // 🏆 SPECIAL THANKS
    credits: [
        {
            name: "MINASHA THARINDI",
            role: "Character Muse",
            theme: "sakura", // Pink, Flowers
            desc: "Referenced her to build a character in the story including everything—attitude, style, and presence.",
            emoji: "🌸"
        },
        {
            name: "CHAVEEN",
            role: "Beta Reader & Strategist",
            theme: "fire", // Fire, Orange
            desc: "First reader of the Beta 'HOPE 2877' Novel. Helped with tons of ideas on how to improve, explored plot holes, and fixed story inconsistencies.",
            emoji: "🔥"
        },
        {
            name: "SAIDA",
            role: "Manga & Anime Consultant",
            theme: "blood", // Skulls, Red
            desc: "Provided the entire concept of making a manga. Expert on anime references, trends, and lore integration.",
            emoji: "💀"
        }
    ],

    legal: {
        license: "Officially licensed in Sri Lanka. LICENSE: 978-624-94 186-0-2",
        copyright: "© 2025 Sehan Karunarathne. All Rights Reserved.",
        warning: "Protected under international copyright law.",
        tracking: "⚠️ SECURITY WARNING: Screenshotting or saving images will trigger an IP address log. This device's IP is being monitored. If these images are found externally, legal action will be taken based on this digital footprint.",
        origin: "Original novel 'Beneath the Light' adapted to manga format. Artwork generated via sketches refined by AI technology."
    },

    chapters: [
        { 
            id: 1, 
            title: "The Beginning", 
            date: "is everything real..?",
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