
// ⚙️ CENTRAL CONFIGURATION & DATA
window.APP_CONFIG = {
    assets: {
        cover: "images/cover.gif", 
    },
    vipCodes: ["CHAVEEN", "SAIDA", "LAHIRU"],
    
    // 🌍 Language Dictionary
    translations: {
        EN: {
            title: "BENEATH THE LIGHT",
            subtitle: "HUNT THE TRUTH",
            start: "START READING",
            chapters: "ARCHIVED RECORDS",
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
            more_info: "Click name to reveal details"
        },
        SI: {
            title: "ආලෝකය යටතේ",
            subtitle: "සත්‍යය සොයන්න",
            start: "කියවීම අරඹන්න",
            chapters: "ලේඛනාගාරය",
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
            more_info: "විස්තර සඳහා නම ක්ලික් කරන්න"
        },
        JP: {
            title: "光の下で",
            subtitle: "真実を狩る",
            start: "読み始める",
            chapters: "アーカイブ",
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
            more_info: "詳細を表示するには名前をクリック"
        },
        FR: {
            title: "SOUS LA LUMIÈRE",
            subtitle: "CHASSEZ LA VÉRITÉ",
            start: "COMMENCER",
            chapters: "ARCHIVES",
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
            more_info: "Cliquez pour les détails"
        }
    },

    // 🏆 Credits with Themes
    credits: [
        { name: "MINASHA THARINDI", role: "The Muse", theme: "sakura", emoji: "🌸", desc: "Character inspiration & style icon. Brings the beauty of the falling petals to the void." },
        { name: "CHAVEEN", role: "The Strategist", theme: "fire", emoji: "🔥", desc: "First Beta Reader. Analyzed the plot holes and forged the story in fire." },
        { name: "SAIDA", role: "The Consultant", theme: "blood", emoji: "💀", desc: "Manga logic & Anime lore expert. Dark arts advisor." }
    ],

    legal: {
        license: "LICENSE: 978-624-94 186-0-2",
        warnings: [
            "⚠️ LICENSE: 978-624-94 186-0-2",
            "🛡️ PROTECTED BY INTERNATIONAL COPYRIGHT LAW",
            "👁️ IP MONITORING ACTIVE: DO NOT SCREENSHOT",
            "📂 ARCHIVE ACCESS: LEVEL 5 CLEARANCE ONLY"
        ]
    },

    chapters: [
        { 
            id: 1, 
            date: "Record #001",
            locked: false, 
            views: 8432,
            comments: 124,
            pages: [
                "images/1.png", "images/2.png", "images/3.png", 
                "images/4.png", "images/5.png", "images/6.png", "images/7.png"
            ]
        },
        { id: 2, date: "Record #002", locked: true, views: 0, comments: 0, pages: [] },
        { id: 3, date: "Record #003", locked: true, views: 0, comments: 0, pages: [] },
        { id: 4, date: "Record #004", locked: true, views: 0, comments: 0, pages: [] }
    ]
};
