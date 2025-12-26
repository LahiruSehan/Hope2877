// NOTE: no imports – firebase is exposed on window from src/firebase.js

const { useState, useEffect, useRef, useMemo } = React;
const h = React.createElement;

// 🌍 CONFIG ACCESS
const t = window.APP_CONFIG.translations.EN;

// ⚡ VIBRATION ENGINE HELPER
const vibrate = (pattern) => {
    if (navigator.vibrate) {
        navigator.vibrate(pattern);
    }
};

// 🌌 SLOW PARTICLE BACKGROUND (TOGGLEABLE)
const ParticleBackground = ({ enabled }) => {
    if (!enabled) return null; // BATTERY SAVER MODE

    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let particles = [];

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5;
                this.speedX = (Math.random() - 0.5) * 0.05;
                this.speedY = (Math.random() - 0.5) * 0.05;
                const hue = 200 + Math.random() * 80;
                this.color = `hsla(${hue}, 70%, 60%, ${Math.random() * 0.3 + 0.1})`;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < 40; i++) particles.push(new Particle());
        };

        init();

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        };

        animate();

        return () => window.removeEventListener("resize", resize);
    }, []);

    return h("canvas", { id: "particle-canvas", ref: canvasRef });
};

// 🎬 CINEMATIC VOID INTRO
const CinematicIntro = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const particleRef = useRef(null);

    // Progress bar
    useEffect(() => {
        let start = performance.now();
        const duration = 7000;

        function animate(t) {
            const elapsed = t - start;
            const pct = Math.min(elapsed / duration, 1);
            setProgress(pct * 100);
            if (pct < 1) requestAnimationFrame(animate);
        }
        requestAnimationFrame(animate);
    }, []);

    // Finish + implosion
    useEffect(() => {
        const timer = setTimeout(() => {
            const el = document.querySelector(".cinematic-intro");
            if (el) el.classList.add("implode");
            setTimeout(onComplete, 1400);
        }, 7000);
        return () => clearTimeout(timer);
    }, [onComplete]);

    // Red drifting particles around text
    useEffect(() => {
        const container = particleRef.current;
        if (!container) return;

        const particles = [];

        class Ember {
            constructor() {
                this.el = document.createElement("div");
                this.el.className = "intro-ember";
                this.reset(true);
                container.appendChild(this.el);
            }
            reset(first = false) {
                this.x = Math.random() * 80 + 10;
                this.y = first ? Math.random() * 80 + 10 : 100;
                this.size = Math.random() * 3 + 1;
                this.speed = 0.05 + Math.random() * 0.2;
                this.opacity = 0.2 + Math.random() * 0.4;
                this.el.style.left = this.x + "%";
                this.el.style.top = this.y + "%";
                this.el.style.width = this.size + "px";
                this.el.style.height = this.size + "px";
                this.el.style.opacity = this.opacity;
            }
            update() {
                this.y -= this.speed;
                if (this.y < -5) this.reset(false);
                this.el.style.top = this.y + "%";
            }
        }

        for (let i = 0; i < 18; i++) particles.push(new Ember());

        const frame = () => {
            particles.forEach((p) => p.update());
            requestAnimationFrame(frame);
        };
        frame();
    }, []);

    // ⚡ LIGHTNING SYSTEM
    useEffect(() => {
        const canvas = document.getElementById("lightning-canvas");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const getBoltColor = () => {
            const r = Math.random();
            if (r < 0.33) return { r: 255, g: 50, b: 50 }; // Red
            if (r < 0.66) return { r: 255, g: 255, b: 255 }; // White
            return { r: 50, g: 150, b: 255 }; // Blue
        };

        const genBolt = (x, y, targetX, targetY, segments = 20) => {
            let points = [{ x, y }];
            for (let i = 1; i < segments; i++) {
                let t = i / segments;
                let px =
                    x +
                    (targetX - x) * t +
                    (Math.random() - 0.5) * 60;
                let py =
                    y +
                    (targetY - y) * t +
                    (Math.random() - 0.5) * 60;
                points.push({ x: px, y: py });
            }
            points.push({ x: targetX, y: targetY });
            return points;
        };

        const drawBolt = (pts, color, thickness = 3, alpha = 1) => {
            const { r, g, b } = color;
            ctx.strokeStyle = `rgba(${r},${g},${b},${alpha})`;
            ctx.lineWidth = thickness;
            ctx.shadowBlur = 25;
            ctx.shadowColor = `rgba(${r},${g},${b},1)`;
            ctx.beginPath();
            ctx.moveTo(pts[0].x, pts[0].y);
            pts.forEach((p) => ctx.lineTo(p.x, p.y));
            ctx.stroke();

            ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
            ctx.lineWidth = thickness * 0.6;
            ctx.shadowBlur = 40;
            ctx.shadowColor = "white";
            ctx.stroke();
        };

        const drawBranch = (p, color) => {
            let len = 50 + Math.random() * 120;
            let angle = (Math.random() - 0.5) * 1.2;
            let endX = p.x + Math.cos(angle) * len;
            let endY = p.y + Math.sin(angle) * len;
            let branchPts = genBolt(p.x, p.y, endX, endY, 6);
            drawBolt(branchPts, color, 1.6, 0.6);
        };

        const triggerLightning = (e) => {
            vibrate([40, 30, 40]);

            let targetX, targetY;
            if (e) {
                targetX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : window.innerWidth / 2);
                targetY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : window.innerHeight / 2);
            } else {
                targetX = canvas.width * 0.5;
                targetY = canvas.height * 0.45;
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            let startX = e ? targetX + (Math.random() - 0.5) * 200 : canvas.width * 0.5 + (Math.random() - 0.5) * 150;
            let startY = 0;

            let mainBolt = genBolt(startX, startY, targetX, targetY, 25);
            const color = getBoltColor();

            drawBolt(mainBolt, color, 3, 1);

            for (let i = 3; i < mainBolt.length - 3; i += 4) {
                if (Math.random() > 0.55) continue;
                drawBranch(mainBolt[i], color);
            }

            setTimeout(() => ctx.clearRect(0, 0, canvas.width, canvas.height), 80);
            setTimeout(() => drawBolt(mainBolt, color, 2.5, 0.8), 120);
            setTimeout(() => ctx.clearRect(0, 0, canvas.width, canvas.height), 200);

            const intro = document.querySelector(".cinematic-intro");
            if (!intro) return;
            intro.classList.add("lightning-screen-flash");
            intro.classList.add("lightning-camera-shake");

            setTimeout(() => {
                intro.classList.remove("lightning-screen-flash");
                intro.classList.remove("lightning-camera-shake");
            }, 300);
        };

        const timer = setTimeout(() => triggerLightning(), 6500);

        window.addEventListener('mousedown', triggerLightning);
        window.addEventListener('touchstart', triggerLightning);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", resize);
            window.removeEventListener('mousedown', triggerLightning);
            window.removeEventListener('touchstart', triggerLightning);
        };
    }, []);

    const titleStr = "OF A DYING SKY";

    return h(
        "div",
        { className: "cinematic-intro" },
        h("div", {
            className: "intro-progress-bar",
            style: { width: progress + "%" }
        }),
        h("div", { className: "intro-heat-ripple" }),
        h("div", { className: "intro-pulse-layer" }),
        h("div", { className: "film-grain" }),
        h("div", { className: "fog-container" }),
        h("canvas", { id: "lightning-canvas" }),
        h("div", { className: "intro-particle-zone", ref: particleRef }),
        h(
            "div",
            { className: "title-container" },
            h("div", { className: "sub-title-intro" }, "BENEATH THE LIGHT"),
            h(
                "div",
                { className: "main-title-intro" },
                titleStr.split("").map((char, i) =>
                    h("span", {
                        key: i,
                        className: "char-span",
                        style: { animationDelay: 2.5 + i * 0.15 + "s" }
                    }, char === " " ? "\u00A0" : char)
                )
            )
        )
    );
};

// 🌸 THEMED MODAL (GOD LEVEL)
const ThemeModal = ({ person, onClose }) => {
    if (!person) return null;

    const THEMES = {
        fire: {
            color: "#ff5500",
            bg: "radial-gradient(circle at center, #2a0a0a 0%, #000000 100%)",
            font: "'Orbitron', sans-serif",
            particle: "🔥",
            particleAnim: "riseFire",
            titleClass: "title-fire",
            border: "1px solid rgba(255, 85, 0, 0.5)",
            sound: "Burning Spirit"
        },
        sakura: {
            color: "#ffb7c5",
            bg: "radial-gradient(circle at center, #1a050a 0%, #000000 100%)",
            font: "'Cinzel', serif",
            particle: "🌸",
            particleAnim: "fallSakura",
            titleClass: "title-sakura",
            border: "1px solid rgba(255, 183, 197, 0.4)",
            sound: "Gentle Breeze"
        },
        blood: {
            color: "#cc0000",
            bg: "radial-gradient(circle at center, #200000 0%, #000000 100%)",
            font: "'Nosifer', cursive",
            particle: "🩸",
            particleAnim: "dripBlood",
            titleClass: "title-blood",
            border: "1px solid rgba(204, 0, 0, 0.6)",
            sound: "Heartbeat"
        }
    };

    const currentTheme = THEMES[person.theme] || THEMES.fire;

    useEffect(() => {
        const layer = document.getElementById("particle-layer");
        if (!layer) return;

        const createParticle = () => {
            const el = document.createElement("div");
            el.innerText = currentTheme.particle;
            el.className = "magic-particle";

            const startLeft = Math.random() * 100;
            const size = Math.random() * 1.5 + 0.5;
            const duration = Math.random() * 3 + 2;

            el.style.left = startLeft + "%";
            el.style.fontSize = size + "rem";
            el.style.animation = `${currentTheme.particleAnim} ${duration}s linear forwards`;

            if (Math.random() > 0.5) el.style.filter = "blur(2px)";

            layer.appendChild(el);
            setTimeout(() => el.remove(), duration * 1000);
        };

        const interval = setInterval(createParticle, 150);
        return () => clearInterval(interval);
    }, [person, currentTheme]);

    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@900&family=Cinzel:wght@700&family=Nosifer&family=Montserrat:wght@300;400&display=swap');
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(8px); z-index: 9999; display: flex; justify-content: center; align-items: center; opacity: 0; animation: modalFadeIn 0.5s ease-out forwards; }
        .god-card-container { position: relative; width: 90%; max-width: 450px; padding: 40px; background: rgba(10, 10, 10, 0.9); border-radius: 12px; box-shadow: 0 0 50px rgba(0,0,0,0.8); text-align: center; overflow: hidden; transform: scale(0.9); animation: cardPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 0.2s; }
        .role-text { font-family: 'Montserrat', sans-serif; font-size: 0.9rem; letter-spacing: 4px; text-transform: uppercase; color: rgba(255,255,255,0.8); margin-bottom: 20px; border-bottom: 1px solid rgba(255,255,255,0.2); display: inline-block; padding-bottom: 5px; }
        .desc-text { font-family: 'Montserrat', sans-serif; font-size: 0.95rem; color: #ccc; line-height: 1.6; margin-bottom: 30px; text-shadow: 0 2px 4px black; position: relative; z-index: 10; }
        .close-btn-epic { background: transparent; color: #fff; font-family: 'Montserrat', sans-serif; font-weight: bold; font-size: 0.9rem; letter-spacing: 2px; padding: 12px 35px; border: 1px solid rgba(255,255,255,0.3); cursor: pointer; transition: 0.3s; position: relative; overflow: hidden; z-index: 10; }
        .close-btn-epic:hover { background: rgba(255,255,255,0.1); letter-spacing: 4px; box-shadow: 0 0 15px currentColor; }
        .title-fire { font-family: 'Orbitron', sans-serif; font-size: 3rem; color: #fff; margin: 0 0 10px 0; text-transform: uppercase; text-shadow: 0 0 10px #ff5500, 0 -10px 20px #ff0000, 0 -20px 40px #ffaa00; animation: burnText 2s infinite alternate; }
        @keyframes riseFire { 0% { transform: translateY(110vh) scale(1); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateY(-10vh) scale(0); opacity: 0; } }
        @keyframes burnText { 0% { transform: scale(1); text-shadow: 0 0 10px #ff5500, 0 -10px 20px #ff0000; } 100% { transform: scale(1.02); text-shadow: 0 0 20px #ff5500, 0 -15px 30px #ff0000; } }
        .title-sakura { font-family: 'Cinzel', serif; font-size: 2.8rem; color: #fff; margin: 0 0 10px 0; text-shadow: 0 0 10px #ffb7c5, 0 0 20px #ff69b4; animation: breathePink 3s infinite ease-in-out; }
        @keyframes fallSakura { 0% { transform: translateY(-10vh) rotate(0deg) translateX(0); opacity: 0; } 20% { opacity: 1; } 100% { transform: translateY(110vh) rotate(360deg) translateX(50px); opacity: 0; } }
        @keyframes breathePink { 0%, 100% { text-shadow: 0 0 10px #ffb7c5; } 50% { text-shadow: 0 0 25px #ffb7c5, 0 0 40px #ff69b4; } }
        .title-blood { font-family: 'Nosifer', cursive; font-size: 2.5rem; color: #ff0000; margin: 0 0 10px 0; text-shadow: 2px 2px 0px #000; animation: glitchHorror 3s infinite; }
        @keyframes dripBlood { 0% { top: -10%; opacity: 1; } 100% { top: 120%; opacity: 0; } }
        @keyframes glitchHorror { 0% { transform: skew(0deg); } 90% { transform: skew(0deg); opacity: 1; } 92% { transform: skew(-10deg); opacity: 0.8; } 94% { transform: skew(10deg); opacity: 1; } 96% { transform: skew(-5deg); opacity: 0.9; } 100% { transform: skew(0deg); } }
        .magic-particle { position: absolute; pointer-events: none; z-index: 1; }
        @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cardPop { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    `;

    return h(
        "div",
        { className: "modal-overlay" },
        h("style", null, styles),
        h("div", {
            id: "particle-layer",
            style: { position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: currentTheme.bg, overflow: "hidden", zIndex: -1 }
        }),
        h(
            "div",
            {
                className: "god-card-container",
                style: { border: currentTheme.border, boxShadow: `0 0 30px ${currentTheme.color}40` }
            },
            h("h1", { className: currentTheme.titleClass }, person.name),
            h("div", { className: "role-text" }, person.role),
            h("p", { className: "desc-text" }, person.desc),
            h(
                "button",
                {
                    className: "close-btn-epic",
                    onClick: onClose,
                    style: { color: currentTheme.color, borderColor: currentTheme.color }
                },
                "CLOSE CONNECTION"
            )
        )
    );
};

// ⚙️ REAL WORKING SETTINGS MODAL
const SettingsModal = ({ onClose, settings, updateSetting, deferredPrompt }) => {
    
    // Toggle Full Screen
    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(e => console.log(e));
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
        }
    };

    // Install App
    const handleInstall = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            console.log("Install outcome:", outcome);
        } else {
            alert("Installation not available. Try using your browser menu.");
        }
    };

    const settingList = [
        { id: "masterVolume", label: "MASTER VOLUME", type: "slider", cat: "AUDIO" },
        { id: "highContrast", label: "HIGH CONTRAST (B&W)", type: "toggle", cat: "VISUAL" },
        { id: "particles", label: "PARTICLES (SAVE BATTERY)", type: "toggle", cat: "VISUAL" },
        // Notification Toggle REMOVED
        { id: "fullscreen", label: "FULL SCREEN", type: "action", action: toggleFullScreen, cat: "SYSTEM" },
        { id: "autoScroll", label: "AUTO-SCROLL (BETA)", type: "toggle", cat: "SYSTEM" },
    ];

    // Add install option if available
    if (deferredPrompt) {
        settingList.push({ id: "installApp", label: "INSTALL APP", type: "action", action: handleInstall, cat: "SYSTEM" });
    }

    const styles = `
        .settings-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.7); z-index: 10000; display: flex; justify-content: center; align-items: center; backdrop-filter: blur(5px); animation: fadeIn 0.3s ease-out; }
        .settings-dialog { width: 90%; max-width: 400px; background: rgba(10, 15, 20, 0.95); border: 1px solid #00e5ff; border-radius: 8px; padding: 25px; box-shadow: 0 0 30px rgba(0, 229, 255, 0.2); font-family: 'Rajdhani', sans-serif; color: #fff; position: relative; animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
        .settings-header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(0, 229, 255, 0.3); padding-bottom: 15px; margin-bottom: 20px; }
        .settings-title { font-family: 'Orbitron'; font-size: 1.2rem; letter-spacing: 2px; color: #00e5ff; margin: 0; }
        .close-icon-btn { background: transparent; border: none; color: #fff; font-size: 1.2rem; cursor: pointer; transition: 0.2s; }
        .close-icon-btn:hover { color: #ff3333; transform: scale(1.1); }
        .settings-list { display: flex; flex-direction: column; gap: 12px; max-height: 60vh; overflow-y: auto; padding-right: 5px; }
        .setting-row { display: flex; justify-content: space-between; align-items: center; font-size: 0.9rem; padding: 5px 0; }
        .setting-label { color: #aaa; letter-spacing: 0.5px; }
        
        /* Toggle Switch */
        .toggle-switch { width: 40px; height: 20px; background: #333; border-radius: 20px; position: relative; cursor: pointer; transition: 0.3s; }
        .toggle-switch.on { background: #00e5ff; }
        .toggle-switch::after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; background: #fff; border-radius: 50%; transition: 0.3s; }
        .toggle-switch.on::after { left: 22px; }

        /* Slider */
        .slider-container { width: 100px; position: relative; display: flex; align-items: center; }
        .slider-input { -webkit-appearance: none; width: 100%; height: 4px; border-radius: 2px; background: #333; outline: none; }
        .slider-input::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 12px; height: 12px; border-radius: 50%; background: #fff; cursor: pointer; box-shadow: 0 0 5px rgba(0,0,0,0.5); }
        .slider-input::-moz-range-thumb { width: 12px; height: 12px; border-radius: 50%; background: #fff; cursor: pointer; }

        .action-btn { background: #00e5ff; color: #000; border: none; padding: 5px 15px; border-radius: 4px; font-weight: bold; cursor: pointer; }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes popIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    `;

    return h(
        "div",
        { className: "settings-overlay" },
        h("style", null, styles),
        h(
            "div",
            { className: "settings-dialog" },
            h(
                "div",
                { className: "settings-header" },
                h("h2", { className: "settings-title" }, "SYSTEM SETTINGS"),
                h("button", { className: "close-icon-btn", onClick: onClose }, h("i", { className: "fas fa-times" }))
            ),
            h(
                "div",
                { className: "settings-list" },
                settingList.map(s => 
                    h("div", { key: s.id, className: "setting-row" },
                        h("span", { className: "setting-label" }, s.label),
                        
                        s.type === "toggle" && h("div", { 
                            className: `toggle-switch ${settings[s.id] ? 'on' : ''}`,
                            onClick: () => updateSetting(s.id, !settings[s.id])
                        }),
                        
                        s.type === "slider" && h("div", { className: "slider-container" },
                            h("input", { 
                                type: "range", min: "0", max: "1", step: "0.1",
                                value: settings[s.id],
                                className: "slider-input",
                                onChange: (e) => updateSetting(s.id, parseFloat(e.target.value))
                            })
                        ),

                        s.type === "action" && h("button", { className: "action-btn", onClick: s.action }, "GO")
                    )
                )
            )
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



    return h(

        "div",

        { className: "license-bar" },

        h("div", { className: "license-text " + (fade ? "fade-out" : "") }, warnings[index])

    );

};



// --- HOME PAGE (ULTIMATE IMMERSIVE EDITION - V3) ---
const HomePage = ({ onStartChapters, onViewCredits }) => {

  // --- 1. STATE MANAGEMENT ---
  const [isLoading, setIsLoading] = React.useState(true);
  const [showSettings, setShowSettings] = React.useState(false);
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  const [resumeChapter, setResumeChapter] = React.useState(null);
  const [descText, setDescText] = React.useState("");
  const [isTypingDone, setIsTypingDone] = React.useState(false); 
  const [isTransitioning, setIsTransitioning] = React.useState(false);
  const [settings, setSettings] = React.useState({ reducedMotion: false, muted: false });
  const [embers, setEmbers] = React.useState([]);

  // Audio Ref
  const audioRef = React.useRef(null);

  // Full Description
  const fullDescription = "As humanity faces its final hours, a hidden conspiracy awakens — forcing Jake and Viyona to choose between the world they know and the truth that could rewrite everything.";

  // --- 2. CSS STYLES ---
  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Orbitron:wght@400;600;800&display=swap');
    @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css');

    * { box-sizing: border-box; }

    /* 🌌 CONTAINER */
    .home-container {
      position: relative;
      width: 100vw;
      height: 100vh;
      /* Deep dark background */
      background: #050505; 
      overflow: hidden;
      display: flex;
      justify-content: center;
      padding-top: 0px; 
      font-family: 'Orbitron', sans-serif;
      color: #fff;
      perspective: 1000px;
    }

    /* 🔴 AMBIENT GLOW (BACKGROUND) */
    .bg-glow {
      position: absolute;
      width: 800px;
      height: 800px;
      background: radial-gradient(circle, rgba(220, 20, 20, 0.08) 0%, transparent 70%);
      border-radius: 50%;
      pointer-events: none;
      z-index: 1;
      filter: blur(60px);
    }
    .glow-top-left { top: -300px; left: -200px; }
    .glow-bottom-right { bottom: -300px; right: -200px; background: radial-gradient(circle, rgba(255, 60, 0, 0.06) 0%, transparent 70%); }

    /* 📺 GLOBAL OVERLAYS */
    .vignette {
      position: absolute;
      inset: 0;
      background: radial-gradient(circle, transparent 40%, rgba(0,0,0,0.9) 100%);
      z-index: 40;
      pointer-events: none;
    }
    .noise {
      position: absolute;
      inset: 0;
      background: url('https://grainy-gradients.vercel.app/noise.svg');
      opacity: 0.04;
      z-index: 41;
      pointer-events: none;
    }

    /* 🔥 EMBERS */
    .ember {
      position: absolute;
      bottom: -20px;
      width: 3px;
      height: 3px;
      background: #ff3b1a;
      border-radius: 50%;
      box-shadow: 0 0 10px #ff2200;
      animation: rise linear infinite;
      z-index: 2;
    }
    @keyframes rise {
      0% { transform: translateY(0) scale(1); opacity: 0.8; }
      100% { transform: translateY(-100vh) scale(0); opacity: 0; }
    }

    .content-layer {
      z-index: 10;
      width: 100%;
      max-width: 800px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      overflow-y: auto;
      scrollbar-width: none;
      transition: transform 0.1s ease-out;
    }

    /* 🌌 HERO IMAGE & SHIMMER */
    .hero-img-container {
      width: 100%;
      max-width: 480px;
      position: relative;
      margin-bottom: 15px;
      transition: transform 0.3s;
      overflow: hidden; /* Clips the shimmer */
      border-radius: 4px;
    }
    
    .hero-image {
      width: 100%;
      display: block;
      /* COLORS RESTORED */
      filter: contrast(1.1) brightness(0.95); 
      mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 80%, rgba(0,0,0,0));
      -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 80%, rgba(0,0,0,0));
    }

    /* ✨ LIGHT SWEEP EFFECT */
    .shimmer-effect {
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      background: linear-gradient(120deg, transparent 40%, rgba(255, 255, 255, 0.2) 50%, transparent 60%);
      transform: translateX(-100%);
      /* Long duration + specific keyframes = Random feel */
      animation: sweep 7s ease-in-out infinite; 
      pointer-events: none;
      mix-blend-mode: overlay;
      z-index: 5;
    }

    @keyframes sweep {
      0% { transform: translateX(-150%); }
      20% { transform: translateX(150%); } /* Fast sweep */
      100% { transform: translateX(150%); } /* Wait */
    }

    /* 🔗 SHARE BUTTON (ON IMAGE) */
    .share-btn-floating {
      position: absolute;
      top: 15px;
      right: 15px;
      width: 35px; height: 35px;
      border-radius: 50%;
      background: rgba(0,0,0,0.6);
      border: 1px solid #555;
      color: #fff;
      display: flex; justify-content: center; align-items: center;
      cursor: pointer;
      z-index: 20;
      backdrop-filter: blur(4px);
      transition: all 0.3s ease;
    }
    .share-btn-floating:hover { background: #fff; color: #000; }

    /* ✨ TITLES */
    .sub-title-clean {
      font-family: 'Cinzel', serif;
      font-size: 1.1rem;
      letter-spacing: 4px;
      font-weight: 700;
      margin-top: 10px;
      background: linear-gradient(to right, #ffffff, #888);
      -webkit-background-clip: text;
      color: transparent;
    }

    .main-title-electric {
      font-family: 'Cinzel', serif;
      font-size: 2.2rem;
      font-weight: 900;
      letter-spacing: 3px;
      color: #ff1a1a;
      text-shadow: 0 0 15px rgba(255, 0, 0, 0.6);
      margin-bottom: 20px;
    }
    .flicker-text { animation: neonFlicker 4s infinite alternate; }
    @keyframes neonFlicker {
      0%, 19%, 21%, 23%, 25%, 54%, 56%, 100% { opacity: 1; }
      20%, 24%, 55% { opacity: 0.5; }
    }

    /* 🏷 TAGS */
    .tags-row {
      display: flex;
      gap: 8px;
      justify-content: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
    }
    .tag-pill {
      padding: 5px 12px;
      border-radius: 4px;
      font-size: 0.7rem;
      font-weight: 600;
      border: 1px solid #333;
      color: #999;
      background: rgba(0,0,0,0.5);
    }

    /* 📜 TYPEWRITER */
    .desc-text {
      max-width: 560px;
      min-height: 60px;
      font-size: 0.82rem; 
      line-height: 1.6;
      color: #ccc;
      font-family: 'Courier New', monospace;
      font-weight: 500;
      margin-bottom: 30px;
      text-shadow: 0 0 2px black;
    }
    .cursor-blink { 
      display: inline-block; width: 8px; height: 15px; background: #ff4444; 
      animation: blink 1s step-end infinite; vertical-align: middle; margin-left: 5px;
    }
    @keyframes blink { 50% { opacity: 0; } }

    /* 🔴 READ BUTTON (STATIC BORDER) */
    .epic-btn-wrapper {
      position: relative;
      display: flex;
      justify-content: center;
      margin-bottom: 25px;
      padding: 3px;
      border-radius: 50px;
      background: transparent;
      overflow: visible;
    }

    /* STATIC GRADIENT BORDER */
    .epic-btn-wrapper::before {
      content: '';
      position: absolute;
      inset: 0;
      border-radius: 50px;
      padding: 2px;
      /* Linear Gradient = Still, No Animation */
      background: linear-gradient(90deg, #550000, #ff0000, #ff8800, #ff0000, #550000);
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      mask-composite: exclude;
    }

    .cine-btn {
      position: relative;
      width: 240px; 
      height: 55px;
      cursor: pointer;
      background: #110202;
      border-radius: 50px;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.3s;
      box-shadow: 0 0 15px rgba(255, 0, 0, 0.1);
      z-index: 2;
    }
    .cine-btn:hover { background: #2a0404; box-shadow: 0 0 30px rgba(255, 0, 0, 0.4); }

    .cine-btn-text {
      font-family: 'Cinzel', serif;
      font-size: 1rem;
      font-weight: 800;
      color: #fff;
      letter-spacing: 2px;
    }

    /* BADGE */
    .badge-new {
      position: absolute;
      top: -10px; right: 0px;
      background: #ff0000;
      color: #fff;
      font-size: 0.6rem;
      padding: 3px 8px;
      border-radius: 10px;
      font-weight: bold;
      border: 1px solid #fff;
      box-shadow: 0 0 5px #ff0000;
      z-index: 10;
      animation: pulseBadge 2s infinite;
    }
    @keyframes pulseBadge { 0% { transform: scale(1); } 50% { transform: scale(1.1); } 100% { transform: scale(1); } }

    /* ⭐ RECOGNITION (BUTTONS STYLE) */
    .rec-section { 
      transform: scale(0.95); 
      margin-top: 40px; /* Moved Down */
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .rec-title { font-family: 'Cinzel', serif; font-size: 0.7rem; color: #555; margin-bottom: 15px; letter-spacing: 2px;}
    
    .rec-buttons-row { display: flex; gap: 15px; }

    .rec-pill-btn {
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid #333;
      padding: 8px 18px;
      border-radius: 25px;
      cursor: pointer;
      display: flex; align-items: center; gap: 8px;
      transition: all 0.3s;
    }
    .rec-pill-btn:hover { 
      background: rgba(255, 0, 0, 0.15); 
      border-color: #ff4444; 
      transform: translateY(-2px);
    }

    .icon-box { font-size: 0.9rem; }
    .minasha-icon { color: #ff6b81; } 
    .arosha-icon { color: #ff9f43; } 
    .rec-name { font-size: 0.75rem; font-family: 'Cinzel', serif; color: #ddd; font-weight: 600; }

    /* FOOTER & MODAL */
    .system-footer {
      position: absolute; bottom: 10px; width: 100%;
      display: flex; justify-content: space-between; padding: 0 20px;
      font-size: 0.6rem; color: #444; pointer-events: none; z-index: 60;
    }
    .settings-icon { pointer-events: auto; cursor: pointer; transition: color 0.3s; }
    .settings-icon:hover { color: #fff; }

    .modal-overlay {
      position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 100;
      display: flex; justify-content: center; align-items: center;
      backdrop-filter: blur(5px);
    }
    .modal-box {
      background: #111; border: 1px solid #333; padding: 25px;
      width: 300px; border-radius: 12px;
      box-shadow: 0 0 30px rgba(0,0,0,1);
    }

    /* ZOOM OUT */
    .zooming-out { animation: camZoom 1.5s forwards; }
    @keyframes camZoom {
      0% { transform: scale(1); filter: brightness(1); }
      100% { transform: scale(4); filter: brightness(0); opacity: 0; }
    }
  `;

  // --- 3. LOGIC ---

  React.useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
    const savedCh = localStorage.getItem('lastReadChapter');
    if (savedCh && parseInt(savedCh) > 1) {
      setResumeChapter(parseInt(savedCh));
    }

    const e = [];
    for (let i = 0; i < 40; i++) {
      e.push({
        left: Math.random() * 100 + "%",
        duration: Math.random() * 4 + 4 + "s",
        delay: Math.random() * 5 + "s",
        id: i
      });
    }
    setEmbers(e);
  }, []);

  React.useEffect(() => {
    if (isLoading) return;
    let i = 0;
    const interval = setInterval(() => {
      setDescText(fullDescription.slice(0, i));
      i++;
      if (i > fullDescription.length) {
        clearInterval(interval);
        setTimeout(() => setIsTypingDone(true), 1000);
      }
    }, 30);
    return () => clearInterval(interval);
  }, [isLoading]);

  const handleMouseMove = (e) => {
    if (settings.reducedMotion) return;
    const { clientX, clientY } = e;
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const moveX = ((clientX - centerX) / centerX) * 10;
    const moveY = ((clientY - centerY) / centerY) * 10;
    setMousePos({ x: moveX * -1, y: moveY * -1 });
  };

  const handleStart = () => {
    if (audioRef.current && !settings.muted) audioRef.current.play().catch(() => {});
    setIsTransitioning(true);
    setTimeout(() => onStartChapters(), 1400);
  };

  const handleShare = () => {
    const text = "Read 'Beneath the Light of a Dying Sky'";
    if (navigator.share) {
      navigator.share({ title: 'Dying Sky', text: text, url: window.location.href });
    } else {
      alert("Link copied!");
    }
  };

  const getCredit = (name) => 
    window.APP_CONFIG.credits.find(c => c.name.toUpperCase().includes(name)) 
    || window.APP_CONFIG.credits[0];

  // --- 4. RENDER ---

  return h(
    "div",
    { 
      className: "home-container", 
      onMouseMove: handleMouseMove,
    },
    h("style", null, styles),

    h("audio", { ref: audioRef, src: "https://cdn.pixabay.com/audio/2022/10/05/audio_686377755b.mp3", loop: true, volume: 0.4 }),

    // AMBIENT BACKGROUND GLOWS
    h("div", { className: "bg-glow glow-top-left" }),
    h("div", { className: "bg-glow glow-bottom-right" }),

    h("div", { className: "vignette" }),
    h("div", { className: "noise" }),

    !settings.reducedMotion && embers.map((e) =>
      h("div", {
        key: e.id,
        className: "ember",
        style: { left: e.left, animationDuration: e.duration, animationDelay: e.delay }
      })
    ),

    // MAIN CONTENT
    h("div", { 
      className: `content-layer ${isTransitioning ? 'zooming-out' : ''}`,
      style: { transform: `translate(${mousePos.x}px, ${mousePos.y}px)` }
    },

      isLoading ? h("div", { style: {color: '#333'} }, "INITIALIZING...") : 
      
      h(React.Fragment, null,
        
        // HERO IMAGE
        h("div", { className: "hero-img-container" },
          h("img", { src: "/images/Cover.png", className: "hero-image" }),
          // Light Sweep Effect
          h("div", { className: "shimmer-effect" }),
          // Share Button
          h("div", { className: "share-btn-floating", onClick: handleShare },
            h("i", { className: "fas fa-share-alt" })
          )
        ),

        h("div", { className: "sub-title-clean" }, "BENEATH THE LIGHT"),
        h("div", { className: "main-title-electric" }, 
          "OF A ", h("span", { className: "flicker-text" }, "DYING SKY")
        ),

        h("div", { className: "tags-row" },
          ["Sci-Fi", "Romance", "Mystery", "Horror"].map(t =>
            h("span", { key: t, className: "tag-pill" }, t)
          )
        ),

        h("div", { className: "desc-text" }, 
          descText,
          !isTypingDone && h("span", { className: "cursor-blink" })
        ),

        // READ BUTTON (No Rotation, just static gradient)
        h("div", { className: "epic-btn-wrapper" },
          h("div", { className: "cine-btn", onClick: handleStart },
            h("div", { className: "cine-btn-text" }, 
              resumeChapter ? `RESUME (CH ${resumeChapter})` : "READ STORY"
            ),
            !resumeChapter && h("div", { className: "badge-new" }, "NEW")
          )
        ),

        // RECOGNITION (Now Small Buttons & Moved Down)
        h("div", { className: "rec-section" },
          h("div", { className: "rec-title" }, "SPECIAL RECOGNITION"),
          h("div", { className: "rec-buttons-row" },
            // Minasha Button
            h("div", { className: "rec-pill-btn", onClick: () => onViewCredits(getCredit('MINASHA')) },
              h("i", { className: "fas fa-heart icon-box minasha-icon" }),
              h("span", { className: "rec-name" }, "MINASHA")
            ),
            // Arosha Button
            h("div", { className: "rec-pill-btn", onClick: () => onViewCredits(getCredit('AROSHA')) },
              h("i", { className: "fas fa-fire icon-box arosha-icon" }),
              h("span", { className: "rec-name" }, "AROSHA")
            )
          )
        )
      )
    ),

    // FOOTER
    h("div", { className: "system-footer" },
      h("span", null, "v3.1.0 • SYSTEM ONLINE"),
      h("i", { className: "fas fa-cog settings-icon", onClick: () => setShowSettings(true) })
    ),

    // SETTINGS MODAL
    showSettings && h("div", { className: "modal-overlay", onClick: () => setShowSettings(false) },
      h("div", { className: "modal-box", onClick: e => e.stopPropagation() },
        h("h3", { style: { color: '#ff3333', marginTop: 0 } }, "SETTINGS"),
        h("div", { style: {display:'flex', justifyContent:'space-between', marginBottom:'15px'} },
          "Reduced Motion",
          h("span", { onClick: () => setSettings({...settings, reducedMotion: !settings.reducedMotion}), style: {color: '#ff3333', cursor:'pointer'} }, settings.reducedMotion ? "ON" : "OFF")
        ),
        h("div", { style: {textAlign: 'center', color: '#666', fontSize:'0.8rem', marginTop:'20px'} }, "CLICK OUTSIDE TO CLOSE")
      )
    )
  );
};



// --- MANGA LIST ---
const MangaPage = ({ onRead, onBack, onOpenSettings, likes, onToggleLike }) => {
    
    // Simplified Status Colors
    const STATUS_COLORS = {
        "RELEASED": { color: "#00ff9d", glow: "0 0 10px #00ff9d" }
    };

    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@300;500;700&display=swap');
        .manga-layout { position: relative; height: 100vh; width: 100vw; display: flex; flex-direction: column; background-color: #050505; font-family: 'Rajdhani', sans-serif; overflow: hidden; color: white; }
        .space-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at center, #11001c 0%, #000000 100%); z-index: -2; }
        .stars-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 3px); background-size: 550px 550px; opacity: 0.6; z-index: -1; animation: moveStars 100s linear infinite; }
        .header-zone { flex: 0 0 auto; display: flex; justify-content: center; align-items: center; padding: 20px 0; z-index: 10; background: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent); position: relative; width: 100%; }
        .icon-btn { position: absolute; background: rgba(0, 229, 255, 0.1); border: 1px solid rgba(0, 229, 255, 0.3); color: #00e5ff; padding: 8px 12px; border-radius: 4px; cursor: pointer; font-family: 'Orbitron', sans-serif; transition: all 0.3s; clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px); }
        .icon-btn:hover { background: rgba(0, 229, 255, 0.3); box-shadow: 0 0 15px rgba(0, 229, 255, 0.5); text-shadow: 0 0 8px white; }
        .home-btn { left: 20px; }
        .settings-btn { right: 20px; }
        
        .fa-cog { transition: transform 0.5s linear; }
        .settings-btn:hover .fa-cog { transform: rotate(180deg); }
        .anim-spin { animation: spin 4s linear infinite; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }

        .holo-title { font-family: 'Orbitron', sans-serif; font-size: 2rem; color: #fff; text-transform: uppercase; letter-spacing: 4px; margin: 0; text-shadow: 0 0 5px #00e5ff; animation: flicker 3s infinite alternate; }
        .list-viewport { flex: 1; overflow-y: auto; padding: 10px 20px; display: flex; flex-direction: column; align-items: center; gap: 15px; mask-image: linear-gradient(to bottom, transparent, black 5%, black 95%, transparent); -webkit-mask-image: linear-gradient(to bottom, transparent, black 5%, black 95%, transparent); }
        .god-card { position: relative; width: 100%; max-width: 600px; background: rgba(20, 20, 30, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); backdrop-filter: blur(10px); padding: 15px 15px; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: all 0.4s; clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px); animation: slideUp 0.6s ease-out backwards; }
        .god-card:hover { transform: scale(1.02) translateX(5px); background: rgba(30, 30, 50, 0.8); border-color: rgba(0, 229, 255, 0.5); box-shadow: 0 0 20px rgba(0, 229, 255, 0.2); }
        .god-card.locked { opacity: 0.7; filter: grayscale(0.9); cursor: not-allowed; border-color: rgba(255, 50, 50, 0.2); }
        .like-btn { font-size: 1.2rem; color: rgba(255,255,255,0.2); margin-right: 15px; transition: all 0.3s; cursor: pointer; padding: 5px; }
        .like-btn:hover { color: #ff69b4; transform: scale(1.2); }
        .like-btn.liked { color: #ff0055; text-shadow: 0 0 10px #ff0055; transform: scale(1.1); }
        .card-left { display: flex; align-items: center; flex: 1; }
        .ch-info-group { display: flex; flex-direction: column; gap: 4px; }
        .ch-title { font-size: 1.1rem; font-weight: 700; color: #fff; text-transform: uppercase; letter-spacing: 1px; }
        .ch-date { font-size: 0.75rem; color: #888; font-family: monospace; }
        .status-pill { font-size: 0.65rem; font-weight: 700; padding: 4px 10px; border: 1px solid currentColor; border-radius: 4px; letter-spacing: 1px; text-transform: uppercase; white-space: nowrap; box-shadow: inset 0 0 10px rgba(0,0,0,0.5); margin-left: 10px; }
        .lock-icon { font-size: 1.2rem; color: #ff3333; text-shadow: 0 0 10px rgba(255, 50, 50, 0.6); margin-left: 15px; }
        @keyframes flicker { 0%, 18%, 22%, 25%, 53%, 57%, 100% { text-shadow: 0 0 4px #fff, 0 0 10px #fff, 0 0 20px #00e5ff; opacity: 1; } 20%, 24%, 55% { text-shadow: none; opacity: 0.2; } }
        @keyframes moveStars { from { background-position: 0 0; } to { background-position: -1000px 500px; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
    `;

    return h(
        "div",
        { className: "manga-layout fade-in" },
        h("style", null, styles),
        h("div", { className: "space-bg" }),
        h("div", { className: "stars-overlay" }),

        h(
            "div",
            { className: "header-zone" },
            h(
                "button",
                { className: "icon-btn home-btn", onClick: onBack },
                h("i", { className: "fas fa-home" })
            ),
            h("h2", { className: "holo-title" }, t.chapters),
            h(
                "button",
                { className: "icon-btn settings-btn", onClick: onOpenSettings },
                h("i", { className: "fas fa-cog anim-spin" }) 
            )
        ),

        h(
            "div",
            { className: "list-viewport" },
            window.APP_CONFIG.chapters.map((ch, index) => {
                let statusText = "RELEASED";
                const theme = STATUS_COLORS[statusText];

                return h(
                    "div",
                    {
                        key: ch.id,
                        className: "god-card " + (ch.locked ? "locked" : ""),
                        style: { animationDelay: `${index * 0.1}s` },
                        onClick: () => !ch.locked && onRead(ch.id, 0) // ALWAYS START AT PAGE 0
                    },
                    h(
                        "div",
                        { className: "card-left" },
                        h("i", { 
                            className: "fas fa-heart like-btn " + (likes[ch.id] ? "liked" : ""), 
                            onClick: (e) => { e.stopPropagation(); onToggleLike(ch.id); } 
                        }),
                        h("div", { className: "ch-info-group" }, 
                            h("div", { className: "ch-title" }, `CH.${ch.id} : ${ch.title}`), 
                            h("div", { className: "ch-date" }, ch.locked ? "ENCRYPTED" : ch.date)
                        )
                    ),
                    h(
                        "div",
                        {
                            style: { display: "flex", alignItems: "center" }
                        },
                        h("div", { className: "status-pill", style: { color: theme.color, borderColor: theme.color, boxShadow: `0 0 5px ${theme.color}, inset 0 0 5px ${theme.color}20`, textShadow: theme.glow } }, statusText),
                        ch.locked && h("i", { className: "fas fa-lock lock-icon" })
                    )
                );
            }),
            h("div", { className: "sys-msg", style: { marginTop: "30px", paddingBottom: "30px", textAlign: "center", borderTop: "1px solid #333", paddingTop: "20px", width: "80%" } },
                h("div", { style: { color: "#ffcc00", fontSize: "0.8rem" } }, `// SYSTEM_MESSAGE: ${t.coming_soon}`),
                h("div", { style: { color: "#666", fontSize: "0.7rem" } }, t.construction_desc)
            )
        )
    );
};

// --- COMMENTS MODAL ---
const CommentsModal = ({ onClose }) => {
    return h("div", { className: "comments-modal-overlay", onClick: onClose },
        h("div", { className: "comments-modal", onClick: e => e.stopPropagation() },
            h("div", { className: "comments-header" },
                h("span", null, "COMMENTS (0)"),
                h("button", { className: "close-com", onClick: onClose }, "×")
            ),
            h("div", { className: "comments-body" },
                h("i", { className: "fas fa-comment-slash", style: { fontSize: "2rem", marginBottom: "10px", color: "#333" } }),
                "No comments yet. Be the first!"
            )
        ),
        h("style", null, `
            .comments-modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center; animation: fadeIn 0.3s; }
            .comments-modal { width: 90%; max-width: 400px; height: 300px; background: #111; border: 1px solid #333; display: flex; flex-direction: column; border-radius: 8px; box-shadow: 0 0 20px rgba(0,255,200,0.1); }
            .comments-header { padding: 15px; border-bottom: 1px solid #222; display: flex; justify-content: space-between; align-items: center; font-family: 'Orbitron'; color: #00e5ff; }
            .close-com { background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer; }
            .comments-body { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #666; font-family: 'Rajdhani'; }
        `)
    );
};
// --- READER (BLUE GLASS PREMIUM VERSION - 3.0 ULTIMATE) ---
const ReaderPage = ({
  chapterId,
  onBack,
  initialPage,
  likes,
  onToggleLike,
  onFinishChapter,
  masterVolume
}) => {

  const chapters = window.APP_CONFIG.chapters;
  const chapter = chapters.find(c => c.id === chapterId);
  const nextChapter = chapters.find(c => c.id === chapter.id + 1);

  // --- STATE ---
  const [currentPage, setCurrentPage] = useState(initialPage || 0);
  const [showSettings, setShowSettings] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [likeBurst, setLikeBurst] = useState(false);
  
  // New States for Features
  const [unlockedPages, setUnlockedPages] = useState(new Set());
  const [bookmarks, setBookmarks] = useState(new Set()); // Feature: Bookmarks
  const [readingTime, setReadingTime] = useState(0); // Feature: Reading Stats
  const [isOffline, setIsOffline] = useState(false); // Feature: Offline/Cache
  const [showBackToTop, setShowBackToTop] = useState(false); // Feature: Back to Top

  // --- SETTINGS (Expanded) ---
  const [settings, setSettings] = useState({
    theme: 'ocean',       
    spoilerMode: true,    
    zoom: 100,            // Keeping existing zoom
    brightness: 100,      
    grayscale: false,     
    pageGap: 20,          
    blueLight: 0,         
    invert: false,        
    showProgress: true,   
    autoHide: false,
    
    // --- NEW FEATURES ---
    readingMode: 'vertical', // vertical | horizontal
    doubleSpread: false,     // For horizontal mode
    oled: false,             // True black background
    sharpen: false,          // Image sharpening
    customCursor: false,     // Themed cursor
    zenMode: false,          // Hide UI completely
    autoScroll: 0,           // 0=off, 1=slow, 2=med, 3=fast
    showStats: false,        // Show time read
  });

  const imageRefs = useRef([]);
  const containerRef = useRef(null);

  // Theme Definitions
  const themes = {
    ocean:   { main: '#2b6cff', bg: '#0b1d3a', grad: 'linear-gradient(135deg,#4fd1ff,#2b6cff)' },
    crimson: { main: '#ff2b55', bg: '#3a0b12', grad: 'linear-gradient(135deg,#ff4f70,#ff2b55)' },
    emerald: { main: '#00d68f', bg: '#0b3a24', grad: 'linear-gradient(135deg,#34fab0,#00d68f)' },
    amethyst:{ main: '#a72bff', bg: '#240b3a', grad: 'linear-gradient(135deg,#d585ff,#a72bff)' },
    gold:    { main: '#ffaa00', bg: '#3a2e0b', grad: 'linear-gradient(135deg,#ffd500,#ffaa00)' },
  };

  const currentTheme = themes[settings.theme];
  // OLED Override
  const bgStyle = settings.oled ? '#000000' : currentTheme.bg;
  
  const progress = ((currentPage + 1) / chapter.pages.length) * 100;

  // Update setting helper
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  /* --- FEATURE: KEYBOARD SHORTCUTS & SCROLL TRACKING --- */
  useEffect(() => {
    const handleScroll = () => {
      // Back to Top Logic
      if (window.scrollY > 1500) setShowBackToTop(true);
      else setShowBackToTop(false);

      // Page Tracking
      if (settings.readingMode === 'vertical') {
        imageRefs.current.forEach((el, i) => {
          if (!el) return;
          const r = el.getBoundingClientRect();
          if (r.top < window.innerHeight * 0.6 && r.bottom > window.innerHeight * 0.4) {
            setCurrentPage(i);
          }
        });
      }
    };

    const handleKeys = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        if (settings.readingMode === 'vertical') window.scrollBy({ top: 300, behavior: 'smooth' });
        else { /* Horizontal logic would go here */ }
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        if (settings.readingMode === 'vertical') window.scrollBy({ top: -300, behavior: 'smooth' });
      }
      if (e.key === 'm') setShowSettings(prev => !prev);
      if (e.key === 'z') updateSetting('zenMode', !settings.zenMode);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKeys);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeys);
    };
  }, [settings.readingMode, settings.zenMode]);

  /* --- FEATURE: AUTO SCROLL --- */
  useEffect(() => {
    let interval;
    if (settings.autoScroll > 0) {
      const speeds = [0, 1, 3, 6]; // Pixels per tick
      interval = setInterval(() => {
        window.scrollBy(0, speeds[settings.autoScroll]);
      }, 16); // ~60fps
    }
    return () => clearInterval(interval);
  }, [settings.autoScroll]);

  /* --- FEATURE: READING STATS (TIMER) --- */
  useEffect(() => {
    const timer = setInterval(() => {
      setReadingTime(prev => prev + 1);
    }, 60000); // Every minute
    return () => clearInterval(timer);
  }, []);

  /* --- FEATURE: PRELOAD NEXT CHAPTER --- */
  useEffect(() => {
    if (nextChapter) {
      // Preload first 3 images of next chapter quietly
      nextChapter.pages.slice(0, 3).forEach(src => {
        const img = new Image();
        img.src = src;
      });
    }
  }, [chapterId]);

  /* IMAGE CLICK (UNBLUR or BOOKMARK) */
  const handleImageInteraction = (index, e) => {
    // Check if clicking top right corner for bookmark (simple heuristic: click x > 80% width, y < 20% height)
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    if (x > rect.width * 0.8 && y < rect.height * 0.2) {
      // Toggle Bookmark
      const newBookmarks = new Set(bookmarks);
      if (newBookmarks.has(index)) newBookmarks.delete(index);
      else {
        newBookmarks.add(index);
        // Haptic feedback
        if (navigator.vibrate) navigator.vibrate(50); 
      }
      setBookmarks(newBookmarks);
      return;
    }

    if (settings.spoilerMode && !unlockedPages.has(index)) {
      // Unblur logic
      const newSet = new Set(unlockedPages);
      newSet.add(index);
      setUnlockedPages(newSet);
      if (navigator.vibrate) navigator.vibrate(20);
    }
  };

  /* LIKE TSUNAMI */
  const triggerLike = () => {
    onToggleLike();
    setLikeBurst(true);
    if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
    setTimeout(() => setLikeBurst(false), 2000);
  };

  const sendReview = () => {
    const msg = `📘 Message to Creator\nChapter: ${chapter.title}\nPage: ${currentPage + 1}\n\n${reviewText}`.trim();
    window.open(`https://wa.me/94715717171?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return h("div", { className: `reader-container ${settings.customCursor ? 'custom-cursor' : ''} ${settings.readingMode}` },

    h("style", null, `
      .reader-container {
        background: ${bgStyle};
        min-height: 100vh;
        padding-bottom: 140px;
        overflow-x: hidden;
        position: relative;
        transition: background 0.5s;
      }

      .reader-container.horizontal {
        display: flex;
        flex-wrap: nowrap;
        overflow-x: auto;
        overflow-y: hidden;
        height: 100vh;
        padding-bottom: 0;
        scroll-snap-type: x mandatory;
      }
      
      .custom-cursor { cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${encodeURIComponent(currentTheme.main)}"><path d="M12 2L2 22l10-2 10 2L12 2z"/></svg>') 12 12, auto; }

      /* DYNAMIC FILTERS */
      .reader-content-wrapper {
        width: ${settings.zoom}%;
        margin: 0 auto;
        transition: width 0.3s ease;
        filter: 
          brightness(${settings.brightness}%) 
          grayscale(${settings.grayscale ? 100 : 0}%) 
          invert(${settings.invert ? 100 : 0}%)
          contrast(${settings.sharpen ? 150 : 100}%);
      }

      .reader-container.horizontal .reader-content-wrapper {
        display: flex;
        width: auto;
        height: 100%;
      }

      /* BLUE LIGHT OVERLAY */
      .blue-light-overlay {
        position: fixed; inset: 0; background: rgba(255, 180, 0, ${settings.blueLight * 0.003}); pointer-events: none; z-index: 5000;
      }

      /* PAGES & SPOILER MODE */
      .reader-page-wrapper {
        position: relative;
        margin-bottom: ${settings.pageGap}px;
        transition: margin 0.3s, transform 0.5s;
        cursor: pointer;
        user-select: none;
      }
      
      .reader-container.horizontal .reader-page-wrapper {
        height: 100vh;
        width: ${settings.doubleSpread ? '50vw' : '100vw'};
        flex-shrink: 0;
        margin-bottom: 0;
        scroll-snap-align: start;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
      .reader-container.horizontal .reader-img {
        max-height: 100vh;
        width: auto;
        max-width: 100%;
      }

      .reader-img { width: 100%; display: block; transition: filter 0.5s ease; }

      /* SPOILER BLUR STATE */
      .is-blurred .reader-img { filter: blur(20px) brightness(0.8); }
      
      .spoiler-overlay {
        position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center;
        opacity: 0; transition: 0.3s; z-index: 10;
      }
      .is-blurred .spoiler-overlay { opacity: 1; }
      .spoiler-badge {
        background: rgba(0,0,0,0.6); backdrop-filter: blur(10px); color: #fff; padding: 10px 20px;
        border-radius: 30px; border: 1px solid rgba(255,255,255,0.2); font-weight: 600; display: flex; align-items: center; gap: 8px;
      }

      /* BOOKMARK */
      .bookmark-ribbon {
        position: absolute; top: 0; right: 20px; width: 40px; height: 60px;
        background: ${currentTheme.main};
        clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%);
        box-shadow: 0 4px 10px rgba(0,0,0,0.5);
        z-index: 20;
        animation: dropDown 0.3s ease-out;
      }
      @keyframes dropDown { from { transform: translateY(-100%); } to { transform: translateY(0); } }

      /* HISTORY MARKER */
      .history-marker {
        height: 2px; background: ${currentTheme.main}; width: 100%; margin: 10px 0;
        position: relative; opacity: 0.7;
      }
      .history-marker::after {
        content: 'PREVIOUSLY READ'; position: absolute; right: 10px; top: -20px;
        color: ${currentTheme.main}; font-size: 10px; font-weight: bold;
      }

      /* END OF CHAPTER */
      .end-chapter-section {
        margin: 60px 20px 20px; padding: 40px 20px;
        background: linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01));
        border-radius: 20px; border: 1px solid rgba(255,255,255,0.05); text-align: center; color: #fff;
      }
      
      .end-btn {
        margin-top: 20px; background: ${currentTheme.grad}; border: none; padding: 12px 30px;
        border-radius: 30px; color: #fff; font-weight: bold; font-size: 16px; cursor: pointer;
        box-shadow: 0 5px 20px ${currentTheme.main}66; transition: 0.2s;
      }
      .end-btn:active { transform: scale(0.95); }

      /* FLOATING UI */
      .back-to-top {
        position: fixed; bottom: 100px; right: 20px; width: 50px; height: 50px;
        background: ${currentTheme.main}; border-radius: 50%; display: flex; align-items: center; justify-content: center;
        color: #fff; box-shadow: 0 5px 20px rgba(0,0,0,0.4); cursor: pointer; z-index: 3900;
        animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }

      /* STATS OVERLAY */
      .stats-pill {
        position: fixed; top: 20px; left: 20px; background: rgba(0,0,0,0.5); backdrop-filter: blur(5px);
        padding: 6px 14px; border-radius: 20px; font-size: 12px; color: #fff; z-index: 3900;
        display: flex; align-items: center; gap: 6px;
      }

      /* TOOLBAR */
      .reader-toolbar {
        position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%); width: 90%; max-width: 600px;
        background: rgba(10, 15, 30, 0.85); backdrop-filter: blur(16px); border: 1px solid rgba(255,255,255,0.1);
        border-radius: 24px; padding: 10px 20px; display: flex; align-items: center; justify-content: space-between;
        z-index: 4000; box-shadow: 0 10px 40px rgba(0,0,0,0.5); transition: transform 0.4s;
      }
      .toolbar-hidden { transform: translate(-50%, 150%); }

      .reader-icon {
        width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
        color: #fff; font-size: 16px; transition: 0.2s; cursor: pointer;
      }
      .reader-icon:hover { background: rgba(255,255,255,0.1); }
      .reader-icon.active { color: ${currentTheme.main}; background: rgba(255,255,255,0.05); }

      .chapter-info { text-align: center; flex: 1; margin: 0 10px; }
      .chapter-title { font-size: 13px; font-weight: 700; color: #fff; overflow:hidden; white-space:nowrap; text-overflow:ellipsis; }
      .chapter-pg { font-size: 11px; color: #8899ac; }

      .prog-track { height: 3px; background: rgba(255,255,255,0.1); border-radius: 3px; margin-top: 6px; overflow: hidden; }
      .prog-fill { height: 100%; background: ${currentTheme.grad}; width: ${progress}%; transition: 0.3s; }

      /* SETTINGS MODAL */
      .overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(5px);
        display: flex; align-items: center; justify-content: center; z-index: 6000; animation: fadeIn 0.2s ease-out;
      }
      .settings-card {
        width: 90%; max-width: 400px; max-height: 80vh; overflow-y: auto; background: #0e1629;
        border-radius: 24px; border: 1px solid rgba(255,255,255,0.1); padding: 24px; color: #fff; box-shadow: 0 20px 50px rgba(0,0,0,0.6);
      }
      .set-group { margin-bottom: 20px; }
      .set-label { font-size: 12px; color: #8899ac; font-weight: 600; text-transform: uppercase; margin-bottom: 10px; display:block; }
      .theme-row { display: flex; gap: 10px; }
      .theme-dot { width: 36px; height: 36px; border-radius: 50%; cursor: pointer; border: 2px solid transparent; transition: 0.2s; }
      .theme-dot.selected { border-color: #fff; transform: scale(1.1); }
      .control-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05); }
      .control-name { font-size: 14px; display:flex; align-items:center; gap:8px; }
      .toggle-switch { width: 44px; height: 24px; background: #223; border-radius: 20px; position: relative; cursor: pointer; transition: 0.3s; }
      .toggle-switch.on { background: ${currentTheme.main}; }
      .toggle-knob { width: 20px; height: 20px; background: #fff; border-radius: 50%; position: absolute; top: 2px; left: 2px; transition: 0.3s; }
      .toggle-switch.on .toggle-knob { transform: translateX(20px); }
      input[type=range] { width: 120px; accent-color: ${currentTheme.main}; }
      
      @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      @keyframes popIn { from { transform: scale(0); } to { transform: scale(1); } }
      
      .like-particle { position: fixed; animation: floatUp 1.5s ease-out forwards; pointer-events: none; z-index: 5000; }
      @keyframes floatUp { 0% { transform: translateY(0) scale(0.5); opacity: 1; } 100% { transform: translateY(-100px) scale(1.5); opacity: 0; } }
    `),

    /* BLUE LIGHT FILTER */
    h("div", { className: "blue-light-overlay" }),

    /* STATS OVERLAY */
    (settings.showStats || showBackToTop) && h("div", { className: "stats-pill" },
      h("i", { className: "fas fa-clock" }),
      `${readingTime}m read`
    ),

    /* BACK TO TOP */
    showBackToTop && h("div", { className: "back-to-top", onClick: () => window.scrollTo({top:0, behavior:'smooth'}) },
      h("i", { className: "fas fa-arrow-up" })
    ),

    /* LIKE EFFECTS */
    likeBurst && Array.from({ length: 15 }).map((_, i) =>
      h("i", {
        key: i,
        className: "fas fa-heart like-particle",
        style: {
          left: 10 + Math.random() * 80 + '%',
          top: '50%',
          fontSize: 20 + Math.random() * 30 + 'px',
          color: currentTheme.main,
          animationDelay: Math.random() * 0.5 + 's'
        }
      })
    ),

    /* --- CONTENT AREA --- */
    h("div", { className: "reader-content-wrapper", ref: containerRef },
      chapter.pages.map((p, i) => {
        const isBlurred = settings.spoilerMode && !unlockedPages.has(i);
        const isBookmarked = bookmarks.has(i);

        return h("div", {
          key: i,
          className: `reader-page-wrapper ${isBlurred ? 'is-blurred' : ''}`,
          ref: e => imageRefs.current[i] = e,
          onClick: (e) => handleImageInteraction(i, e)
        },
          // Bookmark Ribbon
          isBookmarked && h("div", { className: "bookmark-ribbon" }),
          
          // History Marker (Visual only, on page 5 for demo)
          i === 5 && h("div", { className: "history-marker" }),

          // Image
          h("img", { src: p, className: "reader-img" }),
          
          // Spoiler Overlay
          isBlurred && h("div", { className: "spoiler-overlay" },
            h("div", { className: "spoiler-badge" },
              h("i", { className: "fas fa-eye-slash" }),
              "Tap to Reveal"
            )
          )
        );
      }),

      /* --- END OF CHAPTER SECTION --- */
      h("div", { className: "end-chapter-section" },
        h("h2", { style: { fontSize: '24px', marginBottom: '8px' } }, "Chapter Complete"),
        h("p", { style: { color: '#8899ac', fontSize: '14px' } }, "You've reached the end."),
        nextChapter && h("p", { style: { color: currentTheme.main, fontSize: '12px', marginTop: '5px' } }, `Next: ${nextChapter.title} is ready!`),
        h("button", { className: "end-btn", onClick: onBack }, 
          h("i", { className: "fas fa-arrow-left", style: { marginRight: '8px' } }),
          "Back to Chapters"
        )
      )
    ),

    /* --- TOOLBAR --- */
    !settings.zenMode && h("div", { className: `reader-toolbar ${settings.autoHide ? 'toolbar-hidden' : ''}` },
      h("div", { className: "reader-icon", onClick: onBack }, h("i", { className: "fas fa-arrow-left" })),
      
      h("div", { className: "chapter-info" },
        h("div", { className: "chapter-title" }, chapter.title),
        h("div", { className: "chapter-pg" }, `Page ${currentPage + 1} / ${chapter.pages.length}`),
        settings.showProgress && h("div", { className: "prog-track" },
          h("div", { className: "prog-fill" })
        )
      ),

      h("div", { style: { display: 'flex', gap: '8px' } },
        /* Auto Scroll Toggle (Quick Access) */
        h("div", { className: "reader-icon", onClick: () => updateSetting('autoScroll', (settings.autoScroll + 1) % 4) },
          h("i", { className: `fas fa-play ${settings.autoScroll > 0 ? 'fa-spin' : ''}`, style: { fontSize: '12px', color: settings.autoScroll > 0 ? currentTheme.main : '' } })
        ),
        h("div", { className: "reader-icon", onClick: triggerLike }, 
          h("i", { className: `fas fa-heart ${likes ? 'active' : ''}`, style: { color: likes ? '#ff2b55' : '' } })
        ),
        h("div", { className: "reader-icon", onClick: () => setShowSettings(true) }, h("i", { className: "fas fa-cog" }))
      )
    ),

    /* --- SETTINGS MODAL --- */
    showSettings && h("div", { className: "overlay" },
      h("div", { className: "settings-card" },
        h("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' } },
          h("h3", { style: { margin: 0 } }, "Settings"),
          h("div", { style: { display: 'flex', gap: '10px' } },
            // Share Button
            h("i", { className: "fas fa-share-alt", style: { cursor: 'pointer', padding: '10px' }, onClick: () => { setShowSettings(false); setShowShare(true); } }),
            h("i", { className: "fas fa-times", style: { cursor: 'pointer', padding: '10px' }, onClick: () => setShowSettings(false) })
          )
        ),

        /* Theme Selector */
        h("div", { className: "set-group" },
          h("span", { className: "set-label" }, "Theme & Reading Mode"),
          h("div", { className: "theme-row", style: { marginBottom: '15px' } },
            Object.keys(themes).map(key => 
              h("div", { 
                key, 
                className: `theme-dot ${settings.theme === key ? 'selected' : ''}`,
                style: { background: themes[key].grad },
                onClick: () => updateSetting('theme', key)
              })
            )
          ),
          /* Reading Mode Buttons */
          h("div", { style: { display: 'flex', background: '#050b1a', borderRadius: '12px', padding: '4px' } },
            ['vertical', 'horizontal'].map(mode => 
              h("div", {
                key: mode,
                style: {
                  flex: 1, textAlign: 'center', padding: '8px', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold',
                  background: settings.readingMode === mode ? currentTheme.main : 'transparent',
                  color: settings.readingMode === mode ? '#fff' : '#8899ac',
                  cursor: 'pointer', transition: '0.3s'
                },
                onClick: () => updateSetting('readingMode', mode)
              }, mode === 'vertical' ? 'Webtoon' : 'Manga')
            )
          )
        ),

        /* UX FEATURES */
        h("div", { className: "set-group" },
          h("span", { className: "set-label" }, "Experience"),
          
          /* Auto Scroll Speed */
          h("div", { className: "control-row" },
            h("div", { className: "control-name" }, h("i", { className: "fas fa-scroll" }), "Auto Scroll Speed"),
            h("span", { style: { color: currentTheme.main, fontWeight: 'bold' } }, ['Off', 'Slow', 'Med', 'Fast'][settings.autoScroll])
          ),

          /* Offline / Cache */
          h("div", { className: "control-row" },
            h("div", { className: "control-name" }, h("i", { className: "fas fa-download" }), "Offline Cache"),
            h("div", { 
              onClick: () => setIsOffline(!isOffline),
              style: { color: isOffline ? '#00d68f' : '#8899ac', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' } 
            }, isOffline ? "CACHED" : "DOWNLOAD")
          ),

          /* Zen Mode */
          h("div", { className: "control-row" },
            h("div", { className: "control-name" }, h("i", { className: "fas fa-compress-arrows-alt" }), "Zen Mode"),
            h("div", { className: `toggle-switch ${settings.zenMode ? 'on' : ''}`, onClick: () => updateSetting('zenMode', !settings.zenMode) }, h("div", { className: "toggle-knob" }))
          ),
          
          /* Custom Cursor */
          h("div", { className: "control-row" },
            h("div", { className: "control-name" }, h("i", { className: "fas fa-mouse-pointer" }), "Themed Cursor"),
            h("div", { className: `toggle-switch ${settings.customCursor ? 'on' : ''}`, onClick: () => updateSetting('customCursor', !settings.customCursor) }, h("div", { className: "toggle-knob" }))
          ),
          
          /* Stats */
          h("div", { className: "control-row" },
            h("div", { className: "control-name" }, h("i", { className: "fas fa-chart-pie" }), "Show Stats"),
            h("div", { className: `toggle-switch ${settings.showStats ? 'on' : ''}`, onClick: () => updateSetting('showStats', !settings.showStats) }, h("div", { className: "toggle-knob" }))
          )
        ),

        /* DISPLAY FEATURES */
        h("div", { className: "set-group" },
          h("span", { className: "set-label" }, "Display"),
          
          /* OLED Mode */
          h("div", { className: "control-row" },
            h("div", { className: "control-name" }, h("i", { className: "fas fa-adjust" }), "OLED True Black"),
            h("div", { className: `toggle-switch ${settings.oled ? 'on' : ''}`, onClick: () => updateSetting('oled', !settings.oled) }, h("div", { className: "toggle-knob" }))
          ),

           /* Sharpen */
           h("div", { className: "control-row" },
            h("div", { className: "control-name" }, h("i", { className: "fas fa-magic" }), "Sharpen Image"),
            h("div", { className: `toggle-switch ${settings.sharpen ? 'on' : ''}`, onClick: () => updateSetting('sharpen', !settings.sharpen) }, h("div", { className: "toggle-knob" }))
          ),

          /* Double Spread (Horizontal Only) */
          settings.readingMode === 'horizontal' && h("div", { className: "control-row" },
            h("div", { className: "control-name" }, h("i", { className: "fas fa-book-open" }), "Double Page"),
            h("div", { className: `toggle-switch ${settings.doubleSpread ? 'on' : ''}`, onClick: () => updateSetting('doubleSpread', !settings.doubleSpread) }, h("div", { className: "toggle-knob" }))
          ),

          /* EXISTING: Spoiler Mode */
          h("div", { className: "control-row" },
            h("div", { className: "control-name" }, h("i", { className: "fas fa-eye-slash" }), "Spoiler Blur"),
            h("div", { className: `toggle-switch ${settings.spoilerMode ? 'on' : ''}`, onClick: () => updateSetting('spoilerMode', !settings.spoilerMode) }, h("div", { className: "toggle-knob" }))
          ),

          /* EXISTING: Zoom (KEEPING AS REQUESTED) */
          h("div", { className: "control-row" },
            h("div", { className: "control-name" }, h("i", { className: "fas fa-expand" }), "Page Width"),
            h("input", { type: "range", min: "50", max: "100", value: settings.zoom, onChange: e => updateSetting('zoom', e.target.value) })
          ),

           /* EXISTING: Brightness */
           h("div", { className: "control-row" },
            h("div", { className: "control-name" }, h("i", { className: "fas fa-sun" }), "Brightness"),
            h("input", { type: "range", min: "50", max: "150", value: settings.brightness, onChange: e => updateSetting('brightness', e.target.value) })
          )
        )
      )
    ),

    /* SHARE MODAL */
    showShare && h("div", { className: "overlay" },
      h("div", { className: "card", style: { textAlign: 'center' } },
        h("i", { className: "fas fa-times close", onClick: () => setShowShare(false) }),
        h("i", { className: "fas fa-share-square", style: { fontSize: '40px', color: currentTheme.main, marginBottom: '20px' } }),
        h("h3", null, "Share Chapter"),
        h("p", { style: { color: '#8899ac', marginBottom: '20px' } }, `Share ${chapter.title} with friends?`),
        h("div", { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' } },
          h("button", { className: "action-btn", style: { background: '#25D366' }, onClick: () => window.open(`https://wa.me/?text=Reading ${chapter.title} on BlueGlass!`) }, "WhatsApp"),
          h("button", { className: "action-btn", style: { background: '#1DA1F2' }, onClick: () => window.open(`https://twitter.com/intent/tweet?text=Reading ${chapter.title}`) }, "Twitter")
        )
      )
    )
  );
};
// --- MAIN APP ---
const App = () => {
    // 💾 STATE RECALL (Only for Preferences, NO Location)
    // Detect if the visitor is a Google bot, Bing bot, or social crawler
    const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);

// If it is a bot, SKIP the intro. If it is a human, show the 'intro'.
    const savedView = isBot ? "home" : "intro"; // ALWAYS START AT INTRO/NORMAL
    const [view, setView] = useState(savedView);
    const [activePerson, setActivePerson] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [activeChapter, setActiveChapter] = useState(1);
    
    // ⚙️ GLOBAL SETTINGS
    const [settings, setSettings] = useState({
        masterVolume: 0.8,
        highContrast: false,
        particles: true,
        autoScroll: false
        // Notifications Setting REMOVED
    });

    const [likes, setLikes] = useState({});
    const [finishedChapters, setFinishedChapters] = useState({});
    
    // INSTALL PROMPT STATE
    const [deferredPrompt, setDeferredPrompt] = useState(null);

    // Capture Install Prompt
    useEffect(() => {
        const handler = (e) => {
            e.preventDefault();
            setDeferredPrompt(e);
            console.log("Install prompt captured");
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    // Load Settings if any
    useEffect(() => {
        const localSettings = localStorage.getItem("appSettings");
        if (localSettings) setSettings(JSON.parse(localSettings));
        
        const savedLikes = localStorage.getItem("userLikes");
        if (savedLikes) setLikes(JSON.parse(savedLikes));

        const savedFinished = localStorage.getItem("finishedChapters");
        if (savedFinished) setFinishedChapters(JSON.parse(savedFinished));
    }, []);

    const updateSetting = (key, val) => {
        const newSettings = { ...settings, [key]: val };
        setSettings(newSettings);
        localStorage.setItem("appSettings", JSON.stringify(newSettings));
    };

    const handleStartChapters = () => {
        setView("manga");
    };

    const handleStartNew = () => {
        // Reads from Config
        const latest = window.APP_CONFIG.latest;
        setActiveChapter(latest.chapterId);
        // Start reader at specific page
        setView("reader"); 
    };

    const toggleLike = (chapterId) => {
        const newLikes = { ...likes, [chapterId]: !likes[chapterId] };
        setLikes(newLikes);
        localStorage.setItem("userLikes", JSON.stringify(newLikes));
    };

    const handleFinishChapter = (chapterId) => {
        if (!finishedChapters[chapterId]) {
            const newFinished = { ...finishedChapters, [chapterId]: true };
            setFinishedChapters(newFinished);
            localStorage.setItem("finishedChapters", JSON.stringify(newFinished));
        }
    };

    const openReader = (chapterId, pageIndex = 0) => {
        setActiveChapter(chapterId);
        setView("reader"); 
    };

    // HIGH CONTRAST CLASS INJECTION
    const highContrastClass = settings.highContrast ? "high-contrast-mode" : "";
    const globalStyles = settings.highContrast ? `
        body { filter: grayscale(100%) contrast(120%); background: #000 !important; }
        .energy-overlay, .enhanced-ember { display: none !important; }
    ` : "";

    return h(
        "div",
        { className: `app-shell ${view === "reader" ? "reader-mode" : ""} ${highContrastClass}` },
        
        h("style", null, globalStyles),

        // 🌌 PARTICLES: Respects battery saver setting
        view !== "reader" && view !== "intro" && view !== "home" && view !== "manga" && h(ParticleBackground, { enabled: settings.particles }),

        view !== "reader" && view !== "intro" && h(LicenseBar),

        view === "intro" && h(CinematicIntro, { onComplete: () => setView("home") }),

        view === "home" && h(HomePage, {
            onStartChapters: handleStartChapters,
            onStartNew: handleStartNew,
            onViewCredits: setActivePerson
        }),

        view === "manga" && h(MangaPage, {
            onRead: openReader,
            onBack: () => setView("home"),
            onOpenSettings: () => setShowSettings(true),
            likes: likes,
            onToggleLike: toggleLike,
            finishedChapters: finishedChapters
        }),

        view === "reader" && h(ReaderPage, {
            chapterId: activeChapter,
            initialPage: 0, // ALWAYS 0 or config based if triggered via "New" (Handled by logic above)
            onBack: () => setView("manga"),
            likes: likes,
            onToggleLike: toggleLike,
            onFinishChapter: handleFinishChapter,
            masterVolume: settings.masterVolume
        }),

        activePerson && h(ThemeModal, {
            person: activePerson,
            onClose: () => setActivePerson(null)
        }),

        showSettings && h(SettingsModal, { 
            onClose: () => setShowSettings(false),
            settings: settings,
            updateSetting: updateSetting,
            deferredPrompt: deferredPrompt
        })
    );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(h(App));