
// ⚙️ CENTRAL CONFIGURATION & DATA
window.APP_CONFIG = {
    assets: {
        cover: "images/cover.png",
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
            desc: "Inspired the creation and personality of Viyona — becoming the heart behind her emotions, elegance, and charm — and contributed romantic moment ideas that shaped some of the story’s most beautiful emotional and stylistic scenes. 🌙💞✨"
        },

        {
            name: "AROSHA",
            role: "The First Beta Reader (aka GAMERLAZA)",
            theme: "fire",
            emoji: "🔥",
            desc: "Early reviewer and first-ever reader of HOPE 2877 (BOOK) & the first to review every manga page as it’s created, providing fresh perspectives, inspirational suggestions and deep story-strengthening feedback throughout the entire creative process. 🌌✨"
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
            title: "The Rage",
            date: "A Shattered Dawn",
            locked: false,
            pages: Array.from({ length: 24 }, (_, i) => `imageschapter1/${i + 1}.png`)
        },
        {
            id: 2,
            title: "Broken New World",
            date: "Beauty is a lie.",
            locked: false,
            pages: [...Array(39)].flatMap((_, i) =>
                i + 1 === 27 ? [] : `imageschapter2/${i + 1}.png`
            )
        },

        {
            id: 3,
            title: "Belives",
            date: "Broken Promisses",
            locked: false,
            pages: Array.from({ length: 15 }, (_, i) => `imageschapter3/${i + 1}.png`)
        },

                {
            id: 4,
            title: "Regrets",
            date: "A False Hope ",
            locked: false,
            pages: Array.from({ length: 19 }, (_, i) => `imageschapter4/${i + 1}.png`)
        },

                {
            id: 5,
            title: "CRUEL",
            date: "Comming Soon",
            locked: false,
            pages: Array.from({ length: 0 }, (_, i) => `imageschapter5/${i + 1}.png`)
        },

                {
            id: 6,
            title: "HOPE",
            date: "Begining of the End",
            locked: false,
            pages: Array.from({ length: 0 }, (_, i) => `imageschapter6/${i + 1}.png`)
        },
      
    ]
};
