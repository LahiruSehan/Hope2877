
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
    { 
        name: "MINASHA", 
        role: "Character Inspiration", 
        theme: "sakura", 
        emoji: "🌸", 
        desc: "Inspired the creation and personality of Viyona, shaping key emotional and stylistic elements of the story." 
    },

    { 
        name: "AROSHA", 
        role: "The First Beta Reader (aka GAMERLAZA)", 
        theme: "fire", 
        emoji: "🔥", 
        desc: "Early reviewer of HOPE 2877. Provided feedback, new ideas, and perspective to strengthen the storyline." 
    }
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
            title: "A world Filled with Rage",
            date: "When the world begins to break, the truth finally shows.",
            locked: false, 
            pages: Array.from({length: 15}, (_, i) => `images/${i+1}.png`) 
        },
        { id: 2, title: "A Brand New Life... Or...", locked: true, pages: [] },
        { id: 3, title: "Never Ending Story", locked: true, pages: [] },
        { id: 4, title: "FINALE", locked: true, pages: [] }
    ]
};
