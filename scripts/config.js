
// ⚙️ CENTRAL CONFIGURATION & DATA
window.APP_CONFIG = {
    assets: {
        cover: "images/cover.gif", 
    },
    vipCodes: ["CHAVEEN", "SAIDA", "LAHIRU"],
    
    // 🌍 Language Dictionary (English Only Active)
    translations: {
        EN: {
            title_start: "BENEATH THE LIGHT",
            title_end: "OF A DYING SKY",
            subtitle: "HUNT THE TRUTH",
            start: "START READING",
            chapters: "CHAPTERS",
            special: "SPECIAL RECOGNITION",
            footer: "@LahiruSehanKarunarathe2025",
            locked: "LOCKED",
            paywall_title: "RESTRICTED ACCESS",
            paywall_desc: "This archive is protected by a magical seal.",
            unlock: "USE VIP KEY",
            card_pay: "PAY CARD",
            more_info: "Click name to reveal details",
            coming_soon: "MORE CHAPTERS COMING SOON",
            construction_desc: "Artists are sketching the rest of the Manga from the Novel HOPE 2877."
        }
    },

    // 🏆 Credits with Themes
    credits: [
        { name: "MINASHA", role: "The Muse", theme: "sakura", emoji: "🌸", desc: "Character inspiration & style icon. Brings the beauty of the falling petals to the void." },
        { name: "CHAVEEN", role: "The Strategist", theme: "fire", emoji: "🔥", desc: "First Beta Reader. Analyzed the plot holes and forged the story in fire." },
        { name: "SAIDA", role: "The Consultant", theme: "blood", emoji: "💀", desc: "Manga logic & Anime lore expert. Dark arts advisor." }
    ],

    legal: {
        license: "LICENSE: 978-624-94 186-0-2",
        warnings: [
            "⚠️ LICENSE: 978-624-94 186-0-2",
            "PROTECTED BY INTERNATIONAL COPYRIGHT LAW",
            "IP MONITORING : DO NOT SCREENSHOT",
            "BY SEHAN KARUNARATHNE"
        ]
    },

    // Generate pages 1-11 for Chapter 1
    chapters: [
        { 
            id: 1, 
            title: "Everything Falls Apart",
            date: "2025-01-01",
            locked: false, 
            pages: Array.from({length: 11}, (_, i) => `images/${i+1}.png`) 
        },
        { id: 2, title: "Echoes of Silence", locked: true, pages: [] },
        { id: 3, title: "The Red Horizon", locked: true, pages: [] },
        { id: 4, title: "Shattered Glass", locked: true, pages: [] }
    ]
};
