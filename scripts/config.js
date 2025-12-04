
// ⚙️ CENTRAL CONFIGURATION & DATA
window.APP_CONFIG = {
    assets: {
        cover: "images/cover.gif", 
    },
    vipCodes: ["CHAVEEN", "SAIDA", "LAHIRU"],
    
    // 🌍 Language Dictionary
    translations: {
        EN: {
            title_start: "BENEATH THE LIGHT",
            title_end: "OF A DYING SKY",
            subtitle: "HUNT THE TRUTH",
            start: "START",
            chapters: "CHAPTERS",
            special: "SPECIAL RECOGNITION",
            footer: "@LahiruSehanKarunarathe2025",
            back: "BACK",
            home: "HOME",
            live: "Live",
            comments: "Comments",
            locked: "ENCRYPTED",
            reading: "READING",
            paywall_title: "RESTRICTED ACCESS",
            paywall_desc: "This archive is protected by a magical seal.",
            unlock: "USE VIP KEY",
            card_pay: "PAY WITH CARD",
            more_info: "Click name to reveal details",
            coming_soon: "MORE CHAPTERS COMING SOON",
            construction_desc: "Artists are sketching the rest of the Manga from the Novel HOPE 2877."
        },
        SI: {
            title_start: "ආලෝකය යටතේ",
            title_end: "අඳුරු අහසක්",
            subtitle: "සත්‍යය සොයන්න",
            start: "පටන් ගන්න",
            chapters: "පරිච්ඡේද",
            special: "විශේෂ ස්තුතිය",
            footer: "@LahiruSehanKarunarathe2025",
            back: "ආපසු",
            home: "මුල් පිටුව",
            live: "සජීවී",
            comments: "අදහස්",
            locked: "අගුලු දමා ඇත",
            reading: "කියවමින්",
            paywall_title: "ප්‍රවේශය තහනම්",
            paywall_desc: "මෙම ලේඛනාගාරය ආරක්ෂිතයි.",
            unlock: "VIP යතුර",
            card_pay: "කාඩ්පත",
            more_info: "විස්තර සඳහා නම ක්ලික් කරන්න",
            coming_soon: "තවත් පරිච්ඡේද ළඟදීම",
            construction_desc: "නවකතාවෙන් මන්ගා නිර්මාණය වෙමින් පවතී."
        },
        JP: {
            title_start: "光の下で",
            title_end: "死にゆく空",
            subtitle: "真実を狩る",
            start: "開始",
            chapters: "チャプター",
            special: "特別表彰",
            footer: "@LahiruSehanKarunarathe2025",
            back: "戻る",
            home: "ホーム",
            live: "ライブ",
            comments: "コメント",
            locked: "ロック中",
            reading: "読書中",
            paywall_title: "アクセス制限",
            paywall_desc: "魔法の封印が施されています。",
            unlock: "VIPキー",
            card_pay: "カード払い",
            more_info: "詳細を表示するには名前をクリック",
            coming_soon: "近日公開",
            construction_desc: "制作中..."
        },
        FR: {
            title_start: "SOUS LA LUMIÈRE",
            title_end: "D'UN CIEL MOURANT",
            subtitle: "CHASSEZ LA VÉRITÉ",
            start: "DÉBUT",
            chapters: "CHAPITRES",
            special: "RECONNAISSANCE",
            footer: "@LahiruSehanKarunarathe2025",
            back: "RETOUR",
            home: "ACCUEIL",
            live: "Direct",
            comments: "Comm.",
            locked: "VERROUILLÉ",
            reading: "LECTURE",
            paywall_title: "ACCÈS RESTREINT",
            paywall_desc: "Cette archive est scellée.",
            unlock: "CLÉ VIP",
            card_pay: "CARTE",
            more_info: "Cliquez pour les détails",
            coming_soon: "BIENTÔT DISPONIBLE",
            construction_desc: "En construction..."
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
            views: 0,
            comments: 0,
            pages: Array.from({length: 11}, (_, i) => `images/${i+1}.png`) 
        },
        { id: 2, title: "Echoes of Silence", locked: true, views: 0, comments: 0, pages: [] },
        { id: 3, title: "The Red Horizon", locked: true, views: 0, comments: 0, pages: [] },
        { id: 4, title: "Shattered Glass", locked: true, views: 0, comments: 0, pages: [] }
    ]
};
