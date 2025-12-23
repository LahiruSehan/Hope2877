// ⚙️ CENTRAL CONFIGURATION & DATA
window.APP_CONFIG = {
    assets: {
        cover: "images/cover.png",
    },
    vipCodes: ["CHAVEEN", "SAIDA", "LAHIRU"],

    // 🌟 LATEST UPDATE CONFIGURATION
    // Set the chapter ID and page number (starts at 0) for the "NEW" button
    latest: {
        chapterId: 14, 
        pageIndex: 19
    },

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

    // Generate pages simply based on file count
    // Using Array.from to generate 1.png, 2.png... N.png based on 'length'
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
            pages: Array.from({ length: 39 }, (_, i) => `imageschapter2/${i + 1}.png`)
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
            date: "Losses",
            locked: false,
            pages: Array.from({ length: 12 }, (_, i) => `imageschapter5/${i + 1}.png`)
        },

        {
            id: 6,
            title: "Gods",
            date: "Begining of the End",
            locked: false,
            pages: Array.from({ length: 20 }, (_, i) => `imageschapter6/${i + 1}.png`)
        },

        {
            id: 7,
            title: "Begining",
            date: "Who Wronged Who?",
            locked: false,
            pages: Array.from({ length: 10 }, (_, i) => `imageschapter7/${i + 1}.png`)
        },

        {
            id: 8,
            title: "Hope",
            date: "Uncertain Journey",
            locked: false,
            pages: Array.from({ length: 25 }, (_, i) => `imageschapter8/${i + 1}.png`)
        },

        {
            id: 9,
            title: "You & Me",
            date: "I am here for you",
            locked: false,
            pages: Array.from({ length: 11 }, (_, i) => `imageschapter9/${i + 1}.png`)
        },

        {
            id: 10,
            title: "Something ODD",
            date: "Yes! Definetely",
            locked: false,
            pages: Array.from({ length: 7 }, (_, i) => `imageschapter10/${i + 1}.png`)
        },
        
        {
            id: 11,
            title: "Lyra",
            date: "Trip down the memory lane",
            locked: false,
            pages: Array.from({ length: 11 }, (_, i) => `imageschapter11/${i + 1}.png`)
        },
        
        {
            id: 12,
            title: "Whats new?",
            date: "Almost Nothing",
            locked: false,
            pages: Array.from({ length: 8 }, (_, i) => `imageschapter12/${i + 1}.png`)
        },
        
        {
            id: 13,
            title: "Begning of EDEN",
            date: "Life is Beautiful",
            locked: false,
            pages: Array.from({ length: 10 }, (_, i) => `imageschapter13/${i + 1}.png`)
        },

        {
            id: 14,
            title: "End of Eden",
            date: "Life is a Disaster",
            locked: false,
            pages: Array.from({ length: 21 }, (_, i) => `imageschapter14/${i + 1}.png`)
        },

                {
            id: 15,
            title: "A Disturbance",
            date: "Something is coming",
            locked: false,
            pages: Array.from({ length: 4 }, (_, i) => `imageschapter15/${i + 1}.png`)
        },

                {
            id: 16,
            title: "Discovery",
            date: "Not a regular day",
            locked: false,
            pages: Array.from({ length: 4 }, (_, i) => `imageschapter16/${i + 1}.png`)
        },

                {
            id: 17,
            title: "HandShake",
            date: "We found them.. or They found us?",
            locked: false,
            pages: Array.from({ length: 8 }, (_, i) => `imageschapter17/${i + 1}.png`)
        },

                {
            id: 18,
            title: "CREATORS",
            date: "Secret of the Universe",
            locked: false,
            pages: Array.from({ length: 21 }, (_, i) => `imageschapter18/${i + 1}.png`)
        },

                {
            id: 19,
            title: "Plan",
            date: "Get away",
            locked: false,
            pages: Array.from({ length: 21 }, (_, i) => `imageschapter19/${i + 1}.png`)
        },

                {
            id: 20,
            title: "-",
            date: "-",
            locked: true,
            pages: Array.from({ length: 21 }, (_, i) => `imageschapter20/${i + 1}.png`)
        },

                {
            id: 21,
            title: "-",
            date: "-",
            locked: true,
            pages: Array.from({ length: 21 }, (_, i) => `imageschapter21/${i + 1}.png`)
        },
    ]
};