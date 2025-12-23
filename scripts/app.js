// NOTE: no imports – firebase is exposed on window from src/firebase.js

const { useState, useEffect, useRef, useMemo } = React;
const h = React.createElement;

// 🌍 CONFIG ACCESS
const t = window.APP_CONFIG.translations.EN;

// 🎨 THEME CONFIGURATION
const APP_THEMES = {
    crimson: { name: "CRIMSON NIGHT", primary: "#ff0000", secondary: "#4a0000", accent: "#ff4444", glow: "rgba(255, 0, 0, 0.6)", bgGrad: "radial-gradient(circle at center, #2a0000 0%, #000000 100%)" },
    cyber:   { name: "CYBER BLUE",    primary: "#00e5ff", secondary: "#003344", accent: "#ccf9ff", glow: "rgba(0, 229, 255, 0.6)", bgGrad: "radial-gradient(circle at center, #00111a 0%, #000000 100%)" },
    void:    { name: "VOID PURPLE",   primary: "#bc13fe", secondary: "#2d0042", accent: "#e08aff", glow: "rgba(188, 19, 254, 0.6)", bgGrad: "radial-gradient(circle at center, #1a0026 0%, #000000 100%)" },
    gold:    { name: "ROYAL GOLD",    primary: "#ffd700", secondary: "#423700", accent: "#fffbcc", glow: "rgba(255, 215, 0, 0.6)", bgGrad: "radial-gradient(circle at center, #262000 0%, #000000 100%)" },
};

// ⚡ VIBRATION ENGINE HELPER
const vibrate = (pattern) => {
    if (navigator.vibrate) {
        navigator.vibrate(pattern);
    }
};

// 🌌 SLOW PARTICLE BACKGROUND (UPDATED: SLOWER, MULTI-DEPTH)
const ParticleBackground = ({ enabled, theme }) => {
    if (!enabled) return null;

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let particles = [];
        let animationFrameId;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", resize);
        resize();

        // Parse theme color for particles
        const themeColor = theme.primary; 

        class Particle {
            constructor() {
                this.reset();
                // Scatter initial positions
                this.y = Math.random() * canvas.height;
            }
            reset() {
                this.x = Math.random() * canvas.width;
                this.y = canvas.height + Math.random() * 100;
                this.depth = Math.random(); // 0 to 1
                this.size = (Math.random() * 2 + 0.5) * (this.depth + 0.5); // Closer = bigger
                // Much slower speed
                this.speedY = (Math.random() * 0.2 + 0.05) * (this.depth + 0.5); 
                this.speedX = (Math.random() - 0.5) * 0.1;
                this.opacity = Math.random() * 0.4 + 0.1;
                this.color = themeColor;
            }
            update() {
                this.y -= this.speedY;
                this.x += this.speedX;
                
                // Wrap around
                if (this.y < -10) this.reset();
                if (this.x > canvas.width + 10) this.x = -10;
                if (this.x < -10) this.x = canvas.width + 10;
            }
            draw() {
                ctx.globalAlpha = this.opacity * this.depth; // Depth fog
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }

        const init = () => {
            particles = [];
            // More particles for density
            for (let i = 0; i < 80; i++) particles.push(new Particle());
        };

        init();

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.update();
                p.draw();
            });
            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationFrameId);
        };
    }, [theme]); // Re-init if theme changes

    return h("canvas", { id: "particle-canvas", ref: canvasRef, style: { position: 'fixed', top: 0, left: 0, zIndex: -1, pointerEvents: 'none' } });
};

// 🖼️ PROGRESSIVE IMAGE COMPONENT (LOW -> HIGH QUALITY)
const ProgressiveImage = ({ src, className, ...props }) => {
    const [loaded, setLoaded] = useState(false);
    
    // We simulate "Low Quality" by using a tiny blurry placeholder styling initially
    // Since we don't have a backend to generate real LQIP (Low Quality Image Placeholders)
    
    useEffect(() => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
            setLoaded(true);
        };
    }, [src]);

    return h("div", { 
        className: `progressive-img-container ${className}`,
        style: { position: 'relative', overflow: 'hidden' }
    },
        // Placeholder / Blur Layer
        h("div", {
            style: {
                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                backgroundColor: '#111',
                filter: 'blur(20px)',
                opacity: loaded ? 0 : 1,
                transition: 'opacity 0.8s ease-out',
                backgroundImage: `url(${src})`, // Browser might cache this, effectively giving us the load effect
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                zIndex: 1
            }
        }),
        // Real Image
        h("img", {
            ...props,
            src: src,
            style: {
                ...props.style,
                opacity: loaded ? 1 : 0,
                transition: 'opacity 0.5s ease-in',
                zIndex: 2,
                position: 'relative'
            }
        })
    );
};

// ✨ MAGICAL BUTTON COMPONENT
const MagicalButton = ({ label, subtext, onClick, theme, icon }) => {
    return h("button", { className: "magical-btn", onClick: onClick },
        h("div", { className: "magical-btn-bg" }),
        h("div", { className: "magical-particles" },
            [...Array(6)].map((_, i) => h("span", { key: i, className: "magic-p" }))
        ),
        h("div", { className: "magical-content" },
            h("span", { className: "magical-label" }, label),
            subtext && h("span", { className: "magical-sub" }, subtext)
        ),
        h("div", { className: "magical-border" }),
        h("div", { className: "magical-glow" })
    );
};

// 🎬 CINEMATIC VOID INTRO
const CinematicIntro = ({ onComplete }) => {
    // ... (Keep existing intro logic, just ensuring it completes)
    const [progress, setProgress] = useState(0);
    
    useEffect(() => {
        let start = performance.now();
        const duration = 4000; // Speed up a bit for dev

        function animate(t) {
            const elapsed = t - start;
            const pct = Math.min(elapsed / duration, 1);
            setProgress(pct * 100);
            if (pct < 1) requestAnimationFrame(animate);
            else onComplete();
        }
        requestAnimationFrame(animate);
    }, [onComplete]);

    return h("div", { className: "cinematic-intro", style: { display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'black', height: '100vh', color: 'white', flexDirection: 'column' } },
        h("h1", { style: { fontFamily: 'Cinzel', letterSpacing: '5px' } }, "LOADING REALITY"),
        h("div", { style: { width: '200px', height: '2px', background: '#333', marginTop: '20px' } },
            h("div", { style: { width: `${progress}%`, height: '100%', background: '#fff' } })
        )
    );
};

// 🚨 LICENSE BAR
const LicenseBar = () => {
    const warnings = window.APP_CONFIG.legal.warnings;
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(true);
            setTimeout(() => {
                setIndex((prev) => (prev + 1) % warnings.length);
                setFade(false);
            }, 500);
        }, 3500);
        return () => clearInterval(interval);
    }, [warnings]);

    return h("div", { className: "license-bar" },
        h("div", { className: "license-text " + (fade ? "fade-out" : "") }, warnings[index])
    );
};

// 🌸 THEMED MODAL
const ThemeModal = ({ person, onClose, theme }) => {
    if (!person) return null;
    // ... (Keeping existing modal logic mostly, but styling updates handled by CSS injection)
    return h("div", { className: "modal-overlay", onClick: onClose },
        h("div", { className: "god-card-container", onClick: e => e.stopPropagation(), style: { border: `1px solid ${theme.primary}`, boxShadow: `0 0 30px ${theme.glow}` } },
            h("h1", { style: { color: theme.primary, fontFamily: 'Cinzel', fontSize: '2rem' } }, person.name),
            h("p", { style: { color: '#ccc' } }, person.desc),
            h("button", { className: "close-btn-epic", onClick: onClose, style: { borderColor: theme.primary, color: 'white' } }, "CLOSE")
        )
    );
};

// ⚙️ SETTINGS MODAL (WITH THEME CHANGER)
const SettingsModal = ({ onClose, settings, updateSetting, currentThemeKey, setThemeKey }) => {
    const toggleFullScreen = () => {
        if (!document.fullscreenElement) document.documentElement.requestFullscreen().catch(console.log);
        else if (document.exitFullscreen) document.exitFullscreen();
    };

    const themesList = Object.keys(APP_THEMES);

    return h("div", { className: "settings-overlay" },
        h("div", { className: "settings-dialog" },
            h("div", { className: "settings-header" },
                h("h2", { className: "settings-title" }, "SYSTEM SETTINGS"),
                h("button", { className: "close-icon-btn", onClick: onClose }, "×")
            ),
            h("div", { className: "settings-list" },
                // Theme Picker
                h("div", { className: "setting-section" },
                    h("span", { className: "setting-label" }, "INTERFACE THEME"),
                    h("div", { className: "theme-picker-row" },
                        themesList.map(key => 
                            h("div", {
                                key: key,
                                className: `theme-dot ${currentThemeKey === key ? 'active' : ''}`,
                                style: { background: APP_THEMES[key].primary, boxShadow: `0 0 10px ${APP_THEMES[key].primary}` },
                                onClick: () => setThemeKey(key)
                            })
                        )
                    )
                ),
                
                // Volume
                h("div", { className: "setting-row" },
                    h("span", { className: "setting-label" }, "MASTER VOLUME"),
                    h("input", { 
                        type: "range", min: "0", max: "1", step: "0.1",
                        value: settings.masterVolume,
                        className: "slider-input",
                        onChange: (e) => updateSetting("masterVolume", parseFloat(e.target.value))
                    })
                ),

                // Toggles
                h("div", { className: "setting-row" },
                    h("span", { className: "setting-label" }, "PARTICLES"),
                    h("div", { 
                        className: `toggle-switch ${settings.particles ? 'on' : ''}`,
                        onClick: () => updateSetting("particles", !settings.particles)
                    })
                ),

                h("div", { className: "setting-row" },
                    h("span", { className: "setting-label" }, "FULL SCREEN"),
                    h("button", { className: "action-btn", onClick: toggleFullScreen }, "TOGGLE")
                )
            )
        )
    );
};

// --- HOME PAGE (STYLED & REDESIGNED) ---
const HomePage = ({ onStartChapters, onStartNew, onViewCredits, theme }) => {
    
    // Configured with NO 3D TILT, but SHIMMER on Cover
    const getCredit = (name) => {
        return window.APP_CONFIG.credits.find(c => c.name.toUpperCase().includes(name)) || window.APP_CONFIG.credits[0];
    };

    return h("div", { className: "home-container fade-in" },
        h("div", { className: "energy-overlay" }), // Background atmospheric glow

        h("div", { className: "content-layer" },
            
            // 🖼️ SHIMMERING COVER ART
            h("div", { className: "hero-img-wrapper" },
                h("div", { className: "shimmer-effect" }),
                h("img", { src: "/images/Cover.png", className: "hero-image", alt: "Cover" })
            ),

            // ✍️ TYPOGRAPHY
            h("div", { className: "title-group" },
                h("h2", { className: "sub-title-clean" }, "BENEATH THE LIGHT"),
                h("h1", { className: "main-title-epic" }, "OF A DYING SKY")
            ),

            // 🏷️ GENRES (NO ANIMATION)
            h("div", { className: "tags-row-static" },
                ["SCI-FI", "ROMANCE", "ACTION", "MYSTERY", "HORROR"].map((tag, i) => 
                    h("span", { key: i, className: "tag-pill-static" }, tag)
                )
            ),

            h("div", { className: "desc-container" },
                h("div", { className: "circuit-line left" }),
                h("p", { className: "desc-text" }, "As humanity faces its final hours, a hidden conspiracy awakens..."),
                h("div", { className: "circuit-line right" })
            ),

            // 💥 MAGICAL BUTTONS
            h("div", { className: "magical-actions-row" },
                h(MagicalButton, { 
                    label: "CHAPTERS", 
                    subtext: "CONTINUE", 
                    onClick: onStartChapters, 
                    theme: theme 
                }),
                h(MagicalButton, { 
                    label: "NEW GAME", 
                    subtext: "BEGIN", 
                    onClick: onStartNew, 
                    theme: theme 
                })
            ),

            // 🏅 CREDITS
            h("div", { className: "rec-section" },
                h("div", { className: "rec-title" }, "SPECIAL RECOGNITION"),
                h("div", { className: "rec-btn-container" },
                    h("div", { className: "rec-btn", onClick: () => onViewCredits(getCredit('MINASHA')) }, "MINASHA"),
                    h("div", { className: "rec-btn", onClick: () => onViewCredits(getCredit('AROSHA')) }, "AROSHA")
                )
            )
        )
    );
};

// --- MANGA LIST ---
const MangaPage = ({ onRead, onBack, onOpenSettings, likes, onToggleLike, theme }) => {
    return h("div", { className: "manga-layout fade-in" },
        h("div", { className: "header-zone" },
            h("button", { className: "icon-btn home-btn", onClick: onBack }, h("i", { className: "fas fa-arrow-left" })),
            h("h2", { className: "holo-title", style: { color: theme.primary } }, "ARCHIVES"),
            h("button", { className: "icon-btn settings-btn", onClick: onOpenSettings }, h("i", { className: "fas fa-cog" }))
        ),
        h("div", { className: "list-viewport" },
            window.APP_CONFIG.chapters.map((ch, index) => (
                h("div", { 
                    key: ch.id, 
                    className: "god-card",
                    style: { borderColor: theme.primary, boxShadow: `inset 0 0 20px ${theme.glow}` },
                    onClick: () => !ch.locked && onRead(ch.id, 0)
                },
                    h("div", { className: "card-left" },
                        h("div", { className: "ch-title" }, `CHAPTER ${ch.id}`),
                        h("div", { className: "ch-sub" }, ch.title)
                    ),
                    h("i", { 
                        className: `fas fa-heart like-btn ${likes[ch.id] ? 'liked' : ''}`,
                        onClick: (e) => { e.stopPropagation(); onToggleLike(ch.id); }
                    })
                )
            ))
        )
    );
};

// --- READER PAGE (PROGRESSIVE LOADING) ---
const ReaderPage = ({ chapterId, onBack, initialPage, onFinishChapter, masterVolume }) => {
    const chapter = window.APP_CONFIG.chapters.find((c) => c.id === chapterId);
    const [currentPage, setCurrentPage] = useState(initialPage || 0);

    // Native scroll tracking
    const imageRefs = useRef([]);
    useEffect(() => {
        const handleScroll = () => {
            imageRefs.current.forEach((img, idx) => {
                if (!img) return;
                const rect = img.getBoundingClientRect();
                if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
                    setCurrentPage(idx);
                    if (idx === chapter.pages.length - 1) {
                        if (!window.finishTimeout) window.finishTimeout = setTimeout(() => onFinishChapter(chapterId), 2000);
                    }
                }
            });
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [chapterId]);

    // Enable Zoom
    useEffect(() => {
        const vp = document.querySelector('meta[name="viewport"]');
        if (vp) vp.content = "width=device-width, initial-scale=1.0, user-scalable=yes";
    }, []);

    return h("div", { className: "reader-container fade-in" },
        h("div", { className: "reader-toolbar" },
            h("i", { className: "fas fa-arrow-left reader-icon", onClick: onBack })
            // (Simplified toolbar for clean look)
        ),
        h("div", { className: "reader-content-wrapper" },
            chapter.pages.map((imgSrc, i) =>
                h("div", { key: i, ref: el => imageRefs.current[i] = el, style: { width: '100%', marginBottom: '5px' } },
                    h(ProgressiveImage, { 
                        src: imgSrc, 
                        className: "reader-img",
                        loading: "lazy" 
                    })
                )
            )
        )
    );
};

// --- MAIN APP COMPONENT ---
const App = () => {
    const [view, setView] = useState("intro");
    const [activePerson, setActivePerson] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [settings, setSettings] = useState({ masterVolume: 0.8, particles: true });
    const [likes, setLikes] = useState({});
    
    // 🎨 THEME STATE (Default: Crimson/Red)
    const [themeKey, setThemeKey] = useState("crimson");
    const activeTheme = APP_THEMES[themeKey];

    // Persist Settings
    useEffect(() => {
        const savedSettings = localStorage.getItem("appSettings");
        if (savedSettings) setSettings(JSON.parse(savedSettings));
        const savedTheme = localStorage.getItem("appTheme");
        if (savedTheme && APP_THEMES[savedTheme]) setThemeKey(savedTheme);
        const savedLikes = localStorage.getItem("userLikes");
        if (savedLikes) setLikes(JSON.parse(savedLikes));
    }, []);

    const updateSetting = (key, val) => {
        const newSet = { ...settings, [key]: val };
        setSettings(newSet);
        localStorage.setItem("appSettings", JSON.stringify(newSet));
    };

    const updateTheme = (key) => {
        setThemeKey(key);
        localStorage.setItem("appTheme", key);
    };

    // 🎨 DYNAMIC GLOBAL STYLES
    const globalStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Rajdhani:wght@300;500;700&family=Orbitron:wght@400;700&display=swap');
        
        :root {
            --primary: ${activeTheme.primary};
            --secondary: ${activeTheme.secondary};
            --accent: ${activeTheme.accent};
            --glow: ${activeTheme.glow};
        }

        body { margin: 0; background-color: #000; color: #fff; font-family: 'Rajdhani', sans-serif; overflow-x: hidden; }
        
        /* FADE TRANSITIONS */
        .fade-in { animation: fadeIn 0.8s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        /* HERO & COVER */
        .home-container { min-height: 100vh; display: flex; flex-direction: column; align-items: center; position: relative; padding-top: 20px; }
        .energy-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: ${activeTheme.bgGrad}; z-index: -2; opacity: 0.8; }
        
        /* SHIMMER COVER */
        .hero-img-wrapper { 
            position: relative; width: 90%; max-width: 400px; border-radius: 8px; overflow: hidden; 
            margin-bottom: 20px; box-shadow: 0 0 30px rgba(0,0,0,0.8);
            border: 1px solid rgba(255,255,255,0.1);
        }
        .hero-image { width: 100%; display: block; }
        .shimmer-effect {
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
            transform: skewX(-20deg) translateX(-150%);
            animation: shimmer 4s infinite ease-in-out;
            pointer-events: none;
        }
        @keyframes shimmer { 0% { transform: skewX(-20deg) translateX(-150%); } 20% { transform: skewX(-20deg) translateX(150%); } 100% { transform: skewX(-20deg) translateX(150%); } }

        /* TYPOGRAPHY */
        .sub-title-clean { font-family: 'Cinzel', serif; font-weight: 900; color: #fff; font-size: 1.2rem; letter-spacing: 4px; text-shadow: 0 2px 10px rgba(0,0,0,0.8); margin-bottom: 0; margin-top: 10px; }
        .main-title-epic { font-family: 'Cinzel', serif; color: var(--primary); font-size: 2.2rem; margin: 5px 0 20px 0; text-transform: uppercase; letter-spacing: 2px; text-shadow: 0 0 15px var(--glow); animation: pulseTitle 3s infinite alternate; }
        @keyframes pulseTitle { from { text-shadow: 0 0 10px var(--glow); } to { text-shadow: 0 0 25px var(--primary); } }

        /* TAGS (STATIC) */
        .tags-row-static { display: flex; gap: 8px; margin-bottom: 30px; flex-wrap: wrap; justify-content: center; }
        .tag-pill-static { background: rgba(0,0,0,0.5); border: 1px solid var(--primary); color: var(--accent); padding: 4px 12px; border-radius: 20px; font-size: 0.75rem; font-weight: 700; letter-spacing: 1px; }

        /* MAGICAL BUTTONS - ULTRA EPIC */
        .magical-actions-row { display: flex; gap: 30px; margin-bottom: 50px; margin-top: 20px; }
        .magical-btn {
            position: relative; width: 160px; height: 60px; background: transparent; border: none; cursor: pointer; outline: none;
            display: flex; align-items: center; justify-content: center; perspective: 500px;
        }
        .magical-btn-bg {
            position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.8), rgba(20,20,20,0.9));
            clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px);
            z-index: 1; transition: all 0.3s;
        }
        .magical-border {
            position: absolute; inset: -2px; background: var(--primary);
            clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px);
            z-index: 0; opacity: 0.7; box-shadow: 0 0 15px var(--glow); transition: 0.3s;
        }
        .magical-content { position: relative; z-index: 5; display: flex; flex-direction: column; align-items: center; }
        .magical-label { font-family: 'Cinzel', serif; font-size: 1.1rem; font-weight: 900; color: #fff; letter-spacing: 2px; text-shadow: 0 2px 5px black; }
        .magical-sub { font-family: 'Rajdhani', sans-serif; font-size: 0.7rem; color: var(--primary); letter-spacing: 3px; font-weight: 700; margin-top: 2px; }
        .magical-glow {
            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 80%; height: 50%;
            background: var(--primary); filter: blur(30px); opacity: 0; transition: 0.4s; pointer-events: none; z-index: -1;
        }
        .magical-particles { position: absolute; inset: 0; overflow: hidden; z-index: 2; pointer-events: none; }
        .magic-p { position: absolute; width: 2px; height: 2px; background: var(--accent); border-radius: 50%; animation: floatP 2s infinite; opacity: 0; }
        .magic-p:nth-child(1) { top: 80%; left: 10%; animation-delay: 0s; }
        .magic-p:nth-child(2) { top: 80%; left: 30%; animation-delay: 0.3s; }
        .magic-p:nth-child(3) { top: 80%; left: 50%; animation-delay: 0.6s; }
        .magic-p:nth-child(4) { top: 80%; left: 70%; animation-delay: 0.9s; }
        .magic-p:nth-child(5) { top: 80%; left: 90%; animation-delay: 1.2s; }
        
        @keyframes floatP { 0% { transform: translateY(0); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateY(-30px); opacity: 0; } }
        
        /* BUTTON HOVER STATES */
        .magical-btn:hover .magical-btn-bg { background: linear-gradient(180deg, rgba(20,20,20,0.9), rgba(50,50,50,0.9)); }
        .magical-btn:hover .magical-border { opacity: 1; box-shadow: 0 0 30px var(--glow), inset 0 0 20px var(--glow); }
        .magical-btn:hover .magical-glow { opacity: 0.4; }
        .magical-btn:active { transform: scale(0.95); }

        /* LIST & READER */
        .god-card { background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); border: 1px solid #333; margin-bottom: 15px; padding: 20px; display: flex; align-items: center; justify-content: space-between; border-radius: 4px; transition: 0.3s; width: 90%; max-width: 600px; }
        .god-card:hover { transform: translateX(10px); background: rgba(20,20,20,0.8); }
        .ch-title { font-family: 'Orbitron'; font-size: 1.2rem; color: #fff; }
        .ch-sub { font-size: 0.9rem; color: #888; margin-top: 5px; }

        .reader-toolbar { position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.8); border: 1px solid var(--primary); padding: 10px 30px; border-radius: 50px; z-index: 100; backdrop-filter: blur(5px); display: flex; gap: 20px; }
        .reader-icon { color: var(--primary); font-size: 1.2rem; cursor: pointer; transition: 0.2s; }
        .reader-icon:hover { color: #fff; transform: scale(1.2); }
        
        .reader-img { width: 100%; display: block; }
        .progressive-img-container { width: 100%; min-height: 200px; background: #050505; }

        /* SETTINGS & THEME PICKER */
        .settings-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); z-index: 9999; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(5px); }
        .settings-dialog { width: 90%; max-width: 400px; background: #0a0a0a; border: 1px solid var(--primary); border-radius: 8px; padding: 20px; box-shadow: 0 0 50px rgba(0,0,0,0.8); }
        .settings-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; padding-bottom: 15px; margin-bottom: 20px; }
        .settings-title { font-family: 'Orbitron'; color: var(--primary); margin: 0; }
        .close-icon-btn { background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }
        
        .theme-picker-row { display: flex; gap: 15px; margin-top: 10px; }
        .theme-dot { width: 30px; height: 30px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: 0.3s; }
        .theme-dot.active { border-color: #fff; transform: scale(1.2); }
        .setting-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .setting-label { font-size: 0.9rem; color: #aaa; letter-spacing: 1px; }
        .toggle-switch { width: 40px; height: 20px; background: #333; border-radius: 10px; position: relative; cursor: pointer; }
        .toggle-switch.on { background: var(--primary); }
        .toggle-switch::after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; background: #fff; border-radius: 50%; transition: 0.3s; }
        .toggle-switch.on::after { left: 22px; }
        .slider-input { width: 100px; }
        .action-btn { background: var(--primary); color: #000; border: none; padding: 5px 15px; font-weight: bold; cursor: pointer; }

        /* DESC TEXT */
        .desc-text { color: #ccc; text-align: center; max-width: 500px; line-height: 1.6; font-size: 0.95rem; }
        .circuit-line { flex: 1; height: 1px; background: linear-gradient(90deg, transparent, var(--primary), transparent); opacity: 0.5; margin: 0 10px; }
        .desc-container { display: flex; align-items: center; width: 100%; margin-bottom: 30px; }
        
        /* CREDITS */
        .rec-section { margin-top: auto; padding-bottom: 30px; display: flex; flex-direction: column; align-items: center; width: 100%; }
        .rec-title { font-size: 0.7rem; letter-spacing: 2px; color: #666; margin-bottom: 10px; }
        .rec-btn-container { display: flex; gap: 20px; }
        .rec-btn { color: var(--accent); font-size: 0.8rem; letter-spacing: 2px; cursor: pointer; border-bottom: 1px solid transparent; transition: 0.3s; }
        .rec-btn:hover { border-color: var(--primary); text-shadow: 0 0 10px var(--glow); }

        /* LICENSE */
        .license-bar { position: fixed; bottom: 10px; width: 100%; text-align: center; font-size: 0.7rem; color: #444; pointer-events: none; }
        .license-text { transition: opacity 0.5s; }
        .license-text.fade-out { opacity: 0; }
    `;

    return h("div", { className: "app-root" },
        h("style", null, globalStyles),
        
        // Background particles enabled everywhere except Reader/Intro
        view !== "intro" && view !== "reader" && h(ParticleBackground, { enabled: settings.particles, theme: activeTheme }),

        view !== "intro" && view !== "reader" && h(LicenseBar),

        view === "intro" && h(CinematicIntro, { onComplete: () => setView("home") }),

        view === "home" && h(HomePage, {
            theme: activeTheme,
            onStartChapters: () => setView("manga"),
            onStartNew: () => { setActiveChapter(1); setView("reader"); }, // Quick Start
            onViewCredits: setActivePerson
        }),

        view === "manga" && h(MangaPage, {
            theme: activeTheme,
            onRead: (id) => { setActiveChapter(id); setView("reader"); },
            onBack: () => setView("home"),
            onOpenSettings: () => setShowSettings(true),
            likes: likes,
            onToggleLike: (id) => { 
                const n = { ...likes, [id]: !likes[id] };
                setLikes(n); localStorage.setItem("userLikes", JSON.stringify(n));
            }
        }),

        view === "reader" && h(ReaderPage, {
            chapterId: activeChapter,
            initialPage: 0,
            onBack: () => setView("manga"),
            onFinishChapter: (id) => console.log("Finished", id), // Stub
            masterVolume: settings.masterVolume
        }),

        activePerson && h(ThemeModal, {
            person: activePerson,
            theme: activeTheme,
            onClose: () => setActivePerson(null)
        }),

        showSettings && h(SettingsModal, {
            onClose: () => setShowSettings(false),
            settings: settings,
            updateSetting: updateSetting,
            currentThemeKey: themeKey,
            setThemeKey: updateTheme
        })
    );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(h(App));