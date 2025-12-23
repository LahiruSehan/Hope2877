// ================================
// 🔥 APP.JS — PART 1 / 4
// CORE ENGINE + THEME + IMAGE LOADER
// ================================

// NOTE: no imports – firebase is exposed on window from src/firebase.js
const { useState, useEffect, useRef, useMemo } = React;
const h = React.createElement;

// 🌍 CONFIG ACCESS
const t = window.APP_CONFIG.translations.EN;

// ================================
// 🎨 GLOBAL THEME SYSTEM
// ================================

const THEMES = {
    red: {
        primary: "#ff1a1a",
        glow: "rgba(255, 30, 30, 0.6)",
        bg: "#000000",
        accent: "#ff4444"
    },
    blue: {
        primary: "#00e5ff",
        glow: "rgba(0, 229, 255, 0.6)",
        bg: "#000000",
        accent: "#66f2ff"
    },
    purple: {
        primary: "#b366ff",
        glow: "rgba(179, 102, 255, 0.6)",
        bg: "#000000",
        accent: "#d1a3ff"
    }
};

// Apply theme via CSS variables
const applyTheme = (themeKey) => {
    const theme = THEMES[themeKey] || THEMES.red;
    const root = document.documentElement;

    root.style.setProperty("--theme-primary", theme.primary);
    root.style.setProperty("--theme-glow", theme.glow);
    root.style.setProperty("--theme-bg", theme.bg);
    root.style.setProperty("--theme-accent", theme.accent);
};

// ================================
// ⚡ FAST IMAGE LOADER (LQ → HQ)
// ================================
// Usage:
// <ProgressiveImage src="/img/full.png" lq="/img/lq.png" />

const ProgressiveImage = ({ src, lq, className, alt = "" }) => {
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => setLoaded(true);
    }, [src]);

    return h("img", {
        src: loaded ? src : lq,
        className: `${className || ""} ${loaded ? "img-hq" : "img-lq"}`,
        alt,
        loading: "lazy",
        draggable: false
    });
};

// ================================
// 🌌 SLOW FLOATING PARTICLE HELPER
// (Reusable, GPU-safe)
// ================================

const SlowParticles = ({ count = 30, color = "rgba(255,255,255,0.3)" }) => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const particles = [];

        for (let i = 0; i < count; i++) {
            const p = document.createElement("div");
            p.className = "slow-particle";
            p.style.left = Math.random() * 100 + "%";
            p.style.top = Math.random() * 100 + "%";
            p.style.animationDelay = Math.random() * 20 + "s";
            p.style.animationDuration = 30 + Math.random() * 40 + "s";
            p.style.background = color;
            container.appendChild(p);
            particles.push(p);
        }

        return () => {
            particles.forEach(p => p.remove());
        };
    }, [count, color]);

    return h("div", { ref: containerRef, className: "slow-particle-layer" });
};

// ================================
// 🧱 GLOBAL BASE STYLES (INJECTED)
// ================================

const GlobalStyles = () => {
    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = `
            :root {
                --theme-primary: #ff1a1a;
                --theme-glow: rgba(255,30,30,0.6);
                --theme-bg: #000;
                --theme-accent: #ff4444;
            }

            body {
                margin: 0;
                background: var(--theme-bg);
                color: #fff;
                overscroll-behavior: none;
            }

            .img-lq {
                filter: blur(12px);
                transform: scale(1.05);
                transition: filter 0.8s ease, transform 0.8s ease;
            }

            .img-hq {
                filter: blur(0);
                transform: scale(1);
            }

            .slow-particle-layer {
                position: absolute;
                inset: 0;
                pointer-events: none;
                overflow: hidden;
                z-index: 1;
            }

            .slow-particle {
                position: absolute;
                width: 2px;
                height: 2px;
                border-radius: 50%;
                opacity: 0.6;
                animation-name: floatSlow;
                animation-timing-function: linear;
                animation-iteration-count: infinite;
            }

            @keyframes floatSlow {
                from {
                    transform: translateY(40px) translateX(0);
                    opacity: 0;
                }
                10% { opacity: 0.6; }
                to {
                    transform: translateY(-120vh) translateX(40px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        return () => document.head.removeChild(style);
    }, []);

    return null;
};

// ================================
// ⚡ VIBRATION HELPER
// ================================
const vibrate = (pattern) => {
    if (navigator.vibrate) navigator.vibrate(pattern);
};

// ================================
// ===== END PART 1 =====
// ================================
// --- HOME PAGE (MAGICAL EDITION – NO TILT) ---
const HomePage = ({ onStartChapters, onStartNew, onViewCredits }) => {

    useEffect(() => {
        applyTheme(localStorage.getItem("theme") || "red");
    }, []);

    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&family=Orbitron:wght@700&display=swap');

        .home-container {
            position: relative;
            width: 100vw;
            height: 100vh;
            background: radial-gradient(circle at top, #220000, #000);
            overflow: hidden;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            color: white;
        }

        .hero-wrap {
            position: relative;
            max-width: 520px;
            width: 100%;
            text-align: center;
            z-index: 5;
        }

        /* ✨ HERO SHIMMER */
        .hero-shimmer::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(
                120deg,
                transparent 30%,
                rgba(255,255,255,0.15),
                transparent 70%
            );
            animation: shimmer 6s infinite;
            pointer-events: none;
        }

        @keyframes shimmer {
            from { transform: translateX(-100%); }
            to { transform: translateX(100%); }
        }

        .hero-img {
            width: 100%;
            display: block;
            mask-image: linear-gradient(to bottom, black 65%, transparent);
            -webkit-mask-image: linear-gradient(to bottom, black 65%, transparent);
        }

        .sub-title {
            font-family: 'Cinzel', serif;
            font-weight: 900;
            color: #fff;
            letter-spacing: 3px;
            margin-top: 15px;
        }

        .main-title {
            font-family: 'Orbitron', sans-serif;
            font-size: 2rem;
            margin-top: 5px;
            color: var(--theme-primary);
            text-shadow:
                0 0 15px var(--theme-glow),
                0 0 30px rgba(255,0,0,0.4);
        }

        /* 🔥 MAGICAL BUTTONS */
        .magic-btn-wrap {
            position: relative;
            margin-top: 30px;
            display: flex;
            gap: 20px;
            justify-content: center;
        }

        .magic-btn {
            position: relative;
            flex: 1;
            max-width: 180px;
            padding: 14px;
            background: linear-gradient(180deg, #660000, #220000);
            border: 1px solid var(--theme-primary);
            border-radius: 14px;
            color: white;
            font-family: 'Cinzel', serif;
            font-weight: 900;
            letter-spacing: 3px;
            cursor: pointer;
            overflow: hidden;
            box-shadow:
                0 0 25px var(--theme-glow),
                inset 0 0 15px rgba(255,0,0,0.4);
        }

        .magic-btn::before {
            content: "";
            position: absolute;
            inset: -50%;
            background: radial-gradient(circle, rgba(255,0,0,0.35), transparent 70%);
            animation: pulseAura 4s infinite;
        }

        .magic-btn::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(
                120deg,
                transparent,
                rgba(255,255,255,0.3),
                transparent
            );
            animation: sweep 3.5s infinite;
        }

        @keyframes pulseAura {
            0% { transform: scale(0.8); opacity: 0.4; }
            50% { transform: scale(1.1); opacity: 0.8; }
            100% { transform: scale(0.8); opacity: 0.4; }
        }

        @keyframes sweep {
            from { transform: translateX(-100%); }
            to { transform: translateX(100%); }
        }

        .magic-btn span {
            position: relative;
            z-index: 5;
        }
    `;

    return h(
        "div",
        { className: "home-container" },
        h("style", null, styles),

        h(SlowParticles, { count: 40, color: "rgba(255,60,60,0.35)" }),

        h(
            "div",
            { className: "hero-wrap hero-shimmer" },
            h(ProgressiveImage, {
                src: "/images/Cover.png",
                lq: "/images/Cover_lq.png",
                className: "hero-img",
                alt: "Cover"
            })
        ),

        h("div", { className: "sub-title" }, "BENEATH THE LIGHT"),
        h("div", { className: "main-title" }, "OF A DYING SKY"),

        h(
            "div",
            { className: "magic-btn-wrap" },
            h(
                "button",
                { className: "magic-btn", onClick: onStartChapters },
                h("span", null, "CHAPTERS")
            ),
            h(
                "button",
                { className: "magic-btn", onClick: onStartNew },
                h("span", null, "NEW")
            )
        )
    );
};
// ⚙️ SETTINGS MODAL — THEME ENABLED
const SettingsModal = ({ onClose, settings, updateSetting, deferredPrompt }) => {

    const themes = ["red", "blue", "purple"];
    const currentTheme = localStorage.getItem("theme") || "red";

    const setTheme = (theme) => {
        localStorage.setItem("theme", theme);
        applyTheme(theme);
    };

    useEffect(() => {
        applyTheme(currentTheme);
    }, []);

    const styles = `
        .settings-overlay {
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }

        .settings-box {
            width: 90%;
            max-width: 420px;
            background: #0b0b0b;
            border: 1px solid var(--theme-primary);
            border-radius: 14px;
            padding: 20px;
            box-shadow: 0 0 30px var(--theme-glow);
            font-family: 'Cinzel', serif;
        }

        .settings-title {
            text-align: center;
            margin-bottom: 20px;
            letter-spacing: 3px;
            color: var(--theme-primary);
        }

        .theme-row {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 20px;
        }

        .theme-btn {
            flex: 1;
            padding: 10px;
            background: #111;
            border: 1px solid var(--theme-primary);
            border-radius: 10px;
            color: white;
            cursor: pointer;
            font-weight: 700;
            text-transform: uppercase;
            box-shadow: inset 0 0 10px rgba(255,255,255,0.05);
        }

        .theme-btn.active {
            background: var(--theme-primary);
            color: #000;
            box-shadow: 0 0 15px var(--theme-glow);
        }

        .close-settings {
            width: 100%;
            margin-top: 15px;
            padding: 12px;
            background: transparent;
            border: 1px solid var(--theme-primary);
            border-radius: 12px;
            color: white;
            letter-spacing: 3px;
            cursor: pointer;
        }
    `;

    return h(
        "div",
        { className: "settings-overlay" },
        h("style", null, styles),

        h(
            "div",
            { className: "settings-box" },
            h("div", { className: "settings-title" }, "THEME"),

            h(
                "div",
                { className: "theme-row" },
                themes.map(t =>
                    h(
                        "button",
                        {
                            key: t,
                            className: `theme-btn ${currentTheme === t ? "active" : ""}`,
                            onClick: () => setTheme(t)
                        },
                        t.toUpperCase()
                    )
                )
            ),

            h(
                "button",
                {
                    className: "close-settings",
                    onClick: onClose
                },
                "CLOSE"
            )
        )
    );
};
// --- READER PAGE (FAST • NATIVE ZOOM • CLEAN) ---
const ReaderPage = ({
    chapterId,
    onBack,
    initialPage,
    likes,
    onToggleLike,
    onFinishChapter,
    masterVolume
}) => {

    const chapter = window.APP_CONFIG.chapters.find(c => c.id === chapterId);

    const [currentPage, setCurrentPage] = useState(initialPage || 0);
    const [showComments, setShowComments] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const imageRefs = useRef([]);
    const audioRef = useRef(null);
    const currentTrackRef = useRef(null);

    // ✅ FORCE NORMAL WEBSITE ZOOM
    useEffect(() => {
        const meta = document.querySelector("meta[name='viewport']");
        if (meta) {
            meta.content = "width=device-width, initial-scale=1.0, user-scalable=yes";
        }
    }, []);

    // 📜 SCROLL TRACKING (CLEAN)
    useEffect(() => {
        const onScroll = () => {
            imageRefs.current.forEach((img, idx) => {
                if (!img) return;
                const r = img.getBoundingClientRect();
                if (r.top < innerHeight * 0.55 && r.bottom > innerHeight * 0.45) {
                    setCurrentPage(idx);

                    if (idx === imageRefs.current.length - 1) {
                        clearTimeout(window.__finishTimer);
                        window.__finishTimer = setTimeout(() => {
                            onFinishChapter(chapterId);
                        }, 1500);
                    }
                }
            });
        };
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, [chapterId]);

    // 🎯 INITIAL PAGE SCROLL
    useEffect(() => {
        if (initialPage && imageRefs.current[initialPage]) {
            setTimeout(() => {
                imageRefs.current[initialPage].scrollIntoView({ behavior: "smooth" });
            }, 400);
        }
    }, [initialPage]);

    // 🎵 MUSIC SYSTEM (UNCHANGED, CLEAN)
    useEffect(() => {
        const rules = window.MUSIC_CONFIG.chapters[chapterId] || [];
        const rule = rules.find(r => currentPage + 1 >= r.pages[0] && currentPage + 1 <= r.pages[1]);
        const track = rule ? rule.track : null;

        if (track !== currentTrackRef.current) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }

            if (track) {
                const a = new Audio(track);
                a.loop = true;
                a.volume = isMuted ? 0 : masterVolume;
                a.play().catch(() => {});
                audioRef.current = a;
                currentTrackRef.current = track;
            }
        }
    }, [currentPage, isMuted, masterVolume, chapterId]);

    useEffect(() => {
        return () => {
            if (audioRef.current) audioRef.current.pause();
        };
    }, []);

    const isLiked = likes[chapterId];

    return h(
        "div",
        { className: "reader-root" },

        h("style", null, `
            .reader-root {
                width: 100vw;
                min-height: 100vh;
                background: #000;
                padding-bottom: 90px;
            }

            .reader-stack {
                display: flex;
                flex-direction: column;
                align-items: center;
                width: 100%;
            }

            .reader-img {
                width: 100%;
                height: auto;
                display: block;
                max-width: 100%;
            }

            .reader-toolbar {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(10,10,15,0.9);
                border: 1px solid var(--theme-primary);
                border-radius: 50px;
                padding: 10px 22px;
                display: flex;
                gap: 18px;
                z-index: 999;
                box-shadow: 0 0 20px var(--theme-glow);
                backdrop-filter: blur(6px);
            }

            .reader-btn {
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                background: rgba(255,255,255,0.08);
                color: var(--theme-primary);
                cursor: pointer;
            }

            .reader-btn.liked {
                color: #ff0055;
                text-shadow: 0 0 10px #ff0055;
            }

            .reader-depth {
                position: fixed;
                inset: 0;
                pointer-events: none;
                z-index: 1;
            }
        `),

        // 🌌 DEPTH PARTICLES
        h("div", { className: "reader-depth" },
            h(SlowParticles, { count: 25, color: "rgba(255,50,50,0.25)" })
        ),

        // 🧭 TOOLBAR
        h(
            "div",
            { className: "reader-toolbar" },
            h("i", {
                className: "fas fa-arrow-left reader-btn",
                onClick: onBack
            }),
            h("i", {
                className: `fas ${isMuted ? "fa-volume-mute" : "fa-volume-up"} reader-btn`,
                onClick: () => setIsMuted(!isMuted)
            }),
            h("i", {
                className: `fas fa-heart reader-btn ${isLiked ? "liked" : ""}`,
                onClick: () => onToggleLike(chapterId)
            }),
            h("i", {
                className: "fas fa-comment reader-btn",
                onClick: () => setShowComments(true)
            })
        ),

        // 📖 PAGES (LQ → HQ)
        h(
            "div",
            { className: "reader-stack" },
            chapter.pages.map((img, i) =>
                h(ProgressiveImage, {
                    key: i,
                    ref: el => imageRefs.current[i] = el,
                    src: img,
                    lq: img.replace(".png", "_lq.png"),
                    className: "reader-img",
                    alt: `Page ${i + 1}`
                })
            )
        ),

        showComments && h(CommentsModal, { onClose: () => setShowComments(false) })
    );
};
