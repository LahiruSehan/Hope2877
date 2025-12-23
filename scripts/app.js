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
        const duration = 11000;

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
        }, 11000);
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

// --- HOME PAGE (MAGICAL RED EDITION – NO 3D TILT) ---
const HomePage = ({ onStartChapters, onStartNew, onViewCredits }) => {

  const styles = `
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@500;700;900&family=Orbitron:wght@400;600;800&display=swap');

* { box-sizing: border-box; }

.home-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: radial-gradient(circle at top, #1a0000 0%, #000 60%);
  overflow: hidden;
  display: flex;
  justify-content: center;
  padding-top: 30px;
  font-family: 'Orbitron', sans-serif;
  color: #fff;
}

/* 🔥 RED ENERGY FOG */
.energy-overlay {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(circle at 30% 20%, rgba(255,0,0,0.12), transparent 40%),
    radial-gradient(circle at 70% 80%, rgba(255,40,0,0.1), transparent 45%);
  z-index: 1;
  mix-blend-mode: screen;
}

/* 🔥 FLOATING EMBERS */
.ember {
  position: absolute;
  bottom: -20px;
  width: 4px;
  height: 4px;
  background: #ff3b1a;
  border-radius: 50%;
  box-shadow: 0 0 12px #ff2200;
  animation: rise linear infinite;
  opacity: 0;
  z-index: 2;
}

@keyframes rise {
  0% { transform: translateY(0) scale(1); opacity: 1; }
  100% { transform: translateY(-90vh) scale(0); opacity: 0; }
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
}
.content-layer::-webkit-scrollbar { display: none; }

/* 🌌 HERO IMAGE + SHIMMER */
.hero-img-container {
  width: 100%;
  max-width: 500px;
  position: relative;
  margin-bottom: 15px;
}

.hero-image {
  width: 100%;
  display: block;
  mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0));
  -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 60%, rgba(0,0,0,0));
}

.hero-img-container::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    120deg,
    transparent 30%,
    rgba(255,80,80,0.25),
    transparent 70%
  );
  animation: shimmer 4s infinite;
  mix-blend-mode: screen;
  pointer-events: none;
}

@keyframes shimmer {
  0% { transform: translateX(-120%); }
  100% { transform: translateX(120%); }
}

/* ✨ TITLES */
.sub-title-clean {
  font-family: 'Cinzel', serif;
  font-size: 1.1rem;
  letter-spacing: 4px;
  color: #ffffff;
  font-weight: 700;
  margin-top: 10px;
}

.main-title-electric {
  font-family: 'Cinzel', serif;
  font-size: 2rem;
  font-weight: 900;
  letter-spacing: 3px;
  color: #ff1a1a;
  text-shadow: 0 0 10px #ff0000, 0 0 30px rgba(255,0,0,0.6);
  margin-bottom: 25px;
}

/* 🏷 TAGS */
.tags-row {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.tag-pill {
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  border: 1px solid #ff4444;
  color: #ffaaaa;
  background: rgba(0,0,0,0.6);
}

/* 📜 DESC */
.desc-text {
  max-width: 560px;
  font-size: 0.95rem;
  line-height: 1.6;
  color: #ddd;
  font-weight: 600;
  margin-bottom: 40px;
}

/* 🌑 CINEMATIC BUTTONS */
.btn-split-container {
  display: flex;
  gap: 22px;
  justify-content: center;
  margin-bottom: 25px;
}

.cine-btn {
  position: relative;
  width: 150px;
  height: 44px;
  cursor: pointer;
  background: radial-gradient(circle at top, rgba(255,80,80,0.25), rgba(20,0,0,0.9) 60%);
  border-radius: 10px;
  overflow: hidden;
}

.cine-btn::before {
  content: '';
  position: absolute;
  inset: 0;
  padding: 1px;
  border-radius: 10px;
  background: linear-gradient(120deg, #ff3b3b, #ff9999, #ff3b3b);
  background-size: 300% 300%;
  animation: strokeFlow 4s linear infinite;
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
}

@keyframes strokeFlow {
  0% { background-position: 0% 50%; }
  100% { background-position: 300% 50%; }
}

.cine-btn-inner {
  position: absolute;
  inset: 1px;
  background: linear-gradient(180deg, rgba(15,0,0,0.95), rgba(40,0,0,0.85));
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cine-btn-text {
  font-family: 'Cinzel', serif;
  font-size: 0.75rem;
  letter-spacing: 3px;
  font-weight: 700;
  color: #ffdede;
  animation: textDrift 3.5s ease-in-out infinite;
}

@keyframes textDrift {
  0%,100% { opacity: 0.85; }
  50% { opacity: 1; }
}

.cine-btn:hover {
  transform: scale(1.06);
}

.cine-btn.new {
  background: radial-gradient(circle at top, rgba(255,120,120,0.35), rgba(30,0,0,0.95) 60%);
}

/* ⭐ RECOGNITION */
.rec-section {
  transform: scale(0.9);
  margin-top: 5px;
}

.rec-title {
  font-family: 'Cinzel', serif;
  font-size: 0.7rem;
  letter-spacing: 2px;
  color: #777;
  margin-bottom: 10px;
}

.rec-btn-container {
  display: flex;
  gap: 16px;
}

.rec-btn {
  padding: 6px 18px;
  font-size: 0.75rem;
  font-family: 'Cinzel', serif;
  color: #ffcccc;
  border: 1px solid #ff3333;
  background: rgba(40,0,0,0.6);
  border-radius: 999px;
  cursor: pointer;
}

.rec-icon {
  margin-left: 6px;
}
`;

  const [embers, setEmbers] = React.useState([]);

  React.useEffect(() => {
    const e = [];
    for (let i = 0; i < 35; i++) {
      e.push({
        left: Math.random() * 100 + "%",
        duration: Math.random() * 3 + 3 + "s",
        delay: Math.random() * 5 + "s"
      });
    }
    setEmbers(e);
  }, []);

  const getCredit = (name) =>
    window.APP_CONFIG.credits.find(c => c.name.toUpperCase().includes(name))
    || window.APP_CONFIG.credits[0];

  const handleAction = (action) => {
    if (navigator.vibrate) navigator.vibrate([60, 40, 80]);
    action();
  };

  return h(
    "div",
    { className: "home-container" },
    h("style", null, styles),
    h("div", { className: "energy-overlay" }),

    embers.map((e, i) =>
      h("div", {
        key: i,
        className: "ember",
        style: { left: e.left, animationDuration: e.duration, animationDelay: e.delay }
      })
    ),

    h("div", { className: "content-layer" },

      h("div", { className: "hero-img-container" },
        h("img", { src: "/images/Cover.png", className: "hero-image" })
      ),

      h("div", { className: "sub-title-clean" }, "BENEATH THE LIGHT"),
      h("div", { className: "main-title-electric" }, "OF A DYING SKY"),

      h("div", { className: "tags-row" },
        ["Sci-Fi", "Romance", "Action", "Mystery", "Horror"].map(t =>
          h("span", { className: "tag-pill" }, t)
        )
      ),

      h("p", { className: "desc-text" },
        "As humanity faces its final hours, a hidden conspiracy awakens — forcing Jake and Viyona to choose between the world they know and the truth that could rewrite everything."
      ),

      h("div", { className: "btn-split-container" },

        h("div", { className: "cine-btn", onClick: () => handleAction(onStartChapters) },
          h("div", { className: "cine-btn-inner" },
            h("span", { className: "cine-btn-text" }, "CHAPTERS")
          )
        ),

        h("div", { className: "cine-btn new", onClick: () => handleAction(onStartNew) },
          h("div", { className: "cine-btn-inner" },
            h("span", { className: "cine-btn-text" }, "NEW")
          )
        )
      ),

      h(
        "div",
        { className: "rec-section" },
        h("div", { className: "rec-title" }, "SPECIAL RECOGNITION"),
        h(
          "div",
          { className: "rec-btn-container" },
          h(
            "div",
            { className: "rec-btn", onClick: () => onViewCredits(getCredit('MINASHA')) },
            "MINASHA",
            h("i", { className: "fas fa-heart rec-icon" })
          ),
          h(
            "div",
            { className: "rec-btn", onClick: () => onViewCredits(getCredit('AROSHA')) },
            "AROSHA",
            h("i", { className: "fas fa-fire rec-icon" })
          )
        )
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
// --- READER (BLUE GLASS PREMIUM VERSION) ---
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

  const [currentPage, setCurrentPage] = useState(initialPage || 0);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewText, setReviewText] = useState("");
  const [likeBurst, setLikeBurst] = useState(false);

  const imageRefs = useRef([]);

  const progress = ((currentPage + 1) / chapter.pages.length) * 100;

  /* PAGE TRACK */
  useEffect(() => {
    const onScroll = () => {
      imageRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.6 && r.bottom > window.innerHeight * 0.4) {
          setCurrentPage(i);
        }
      });
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* LIKE TSUNAMI */
  const triggerLike = () => {
    onToggleLike();
    setLikeBurst(true);
    setTimeout(() => setLikeBurst(false), 2000);
  };

  const sendReview = () => {
    const msg = `
📘 Message to Creator

Chapter: ${chapter.title}
Page: ${currentPage + 1}

${reviewText}
`.trim();

    window.open(
      `https://wa.me/94715717171?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  return h("div", { className:"reader-container" },

    h("style", null, `
.reader-container {
  background:#050b1a;
  min-height:100vh;
  padding-bottom:140px;
  overflow-x:hidden;
}

/* IMAGES */
.reader-page { width:100%; position:relative; }
.reader-img { width:100%; display:block; pointer-events:none; }
.reader-img.low { filter:blur(18px); transform:scale(1.06); }
.reader-img.high { position:absolute; inset:0; opacity:0; transition:1.2s; }
.reader-img.high.loaded { opacity:1; }

/* TOOLBAR */
.reader-toolbar {
  position:fixed;
  bottom:18px;
  left:50%;
  transform:translateX(-50%);
  width:94%;
  max-width:720px;
  background:linear-gradient(180deg,#0b1d3a,#081326);
  border-radius:22px;
  padding:10px 14px;
  box-shadow:0 10px 40px rgba(0,120,255,.35);
  display:flex;
  align-items:center;
  justify-content:space-between;
  z-index:3000;
}

/* BUTTONS */
.toolbar-group { display:flex; gap:10px; }

.reader-icon {
  width:34px;
  height:34px;
  border-radius:50%;
  display:flex;
  align-items:center;
  justify-content:center;
  background:linear-gradient(145deg,#1a4cff,#0b2a66);
  color:#e8f2ff;
  cursor:pointer;
  font-size:14px;
  box-shadow:0 0 14px rgba(80,160,255,.6);
  transition:.25s;
}

.reader-icon:hover { transform:scale(1.12); }

/* CENTER INFO */
.toolbar-center {
  flex:1;
  text-align:center;
  padding:0 10px;
}

.chapter-title {
  font-size:14px;
  font-weight:600;
  color:#eaf3ff;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
}

.chapter-sub {
  font-size:11px;
  color:#9fc3ff;
}

/* PROGRESS BAR */
.progress-wrap {
  margin-top:6px;
  height:4px;
  background:#0a1b3a;
  border-radius:6px;
  overflow:hidden;
}

.progress-bar {
  height:100%;
  width:${progress}%;
  background:linear-gradient(90deg,#4fd1ff,#2b6cff);
  transition:.3s;
}

/* LIKE RAIN */
.like-rain {
  position:fixed;
  inset:0;
  pointer-events:none;
  z-index:4000;
}

.like {
  position:absolute;
  animation:fall 2s linear forwards;
}

@keyframes fall {
  from { transform:translateY(0) scale(1); opacity:1; }
  to { transform:translateY(100vh) scale(.3); opacity:0; }
}

/* MODALS */
.overlay {
  position:fixed;
  inset:0;
  background:rgba(0,0,0,.55);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index:5000;
}

.card {
  width:92%;
  max-width:380px;
  background:linear-gradient(180deg,#0b1f3f,#06122a);
  border-radius:20px;
  padding:20px;
  color:#fff;
  box-shadow:0 0 40px rgba(80,160,255,.5);
  position:relative;
}

.close {
  position:absolute;
  top:12px;
  right:14px;
  cursor:pointer;
  color:#9fc3ff;
}

.card textarea {
  width:100%;
  height:100px;
  margin-top:12px;
  border-radius:14px;
  background:#07152e;
  color:#fff;
  border:1px solid #2b6cff;
  padding:10px;
}

.action-btn {
  margin-top:16px;
  width:100%;
  padding:12px;
  border:none;
  border-radius:30px;
  background:linear-gradient(135deg,#4fd1ff,#2b6cff);
  color:#fff;
  cursor:pointer;
}
    `),

    /* LIKE EFFECT */
    likeBurst && h("div",{className:"like-rain"},
      Array.from({length:36}).map(() =>
        h("i",{
          className:"fas fa-heart like",
          style:{
            left:Math.random()*100+"%",
            fontSize:12+Math.random()*24+"px",
            color:`hsl(200,90%,70%)`
          }
        })
      )
    ),

    /* TOOLBAR */
    h("div",{className:"reader-toolbar"},
      h("div",{className:"toolbar-group"},
        h("i",{className:"fas fa-arrow-left reader-icon",onClick:onBack}),
        h("i",{className:"fas fa-heart reader-icon",onClick:triggerLike})
      ),

      h("div",{className:"toolbar-center"},
        h("div",{className:"chapter-title"},chapter.title),
        h("div",{className:"chapter-sub"},`Page ${currentPage+1} / ${chapter.pages.length}`),
        h("div",{className:"progress-wrap"},
          h("div",{className:"progress-bar"})
        )
      ),

      h("div",{className:"toolbar-group"},
        h("i",{className:"fas fa-cog reader-icon",onClick:()=>setShowSettings(true)}),
        h("i",{className:"fas fa-envelope reader-icon",onClick:()=>setShowReview(true)})
      )
    ),

    /* CONTENT */
    chapter.pages.map((p,i)=>
      h("div",{className:"reader-page",ref:e=>imageRefs.current[i]=e},
        h("img",{src:p,className:"reader-img low"}),
        h("img",{src:p,className:"reader-img high",onLoad:e=>e.target.classList.add("loaded")})
      )
    ),

    /* SETTINGS */
    showSettings && h("div",{className:"overlay"},
      h("div",{className:"card"},
        h("i",{className:"fas fa-times close",onClick:()=>setShowSettings(false)}),
        h("h3",null,"Reader Settings"),
        h("p",{style:{opacity:.7}},"More options coming soon 💙")
      )
    ),

    /* MESSAGE */
    showReview && h("div",{className:"overlay"},
      h("div",{className:"card"},
        h("i",{className:"fas fa-times close",onClick:()=>setShowReview(false)}),
        h("h3",null,"Message to Creator"),
        h("textarea",{value:reviewText,onInput:e=>setReviewText(e.target.value)}),
        h("button",{className:"action-btn",onClick:sendReview},"Send Message")
      )
    )
  );
};


// --- MAIN APP ---
const App = () => {
    // 💾 STATE RECALL (Only for Preferences, NO Location)
    const savedView = "intro"; // ALWAYS START AT INTRO/NORMAL
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