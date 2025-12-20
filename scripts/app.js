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

// 📡 NOTIFICATION SYSTEM (NEW)
const NOTIFICATION_MESSAGES = {
    morning: [
        "Good Morning, Survivor. Status check required.",
        "Sunrise detected. Visibility improving.",
        "Hope system online. Ready for reading.",
        "A new day. Survival probability: 89%."
    ],
    afternoon: [
        "Sun is high. Hydration levels?",
        "Afternoon report pending. Check chapters.",
        "Lyra: 'Are you there? I found something...'",
        "Signal strength optimal. Continue the story."
    ],
    evening: [
        "Shadows are lengthening. Stay close to the light.",
        "Lyra is calling you...",
        "Evening has fallen. Perfect time to read.",
        "Don't let the fire go out."
    ],
    night: [
        "It's dark out there. Stay safe.",
        "Night reading recommended. Keep quiet.",
        "Anomaly detected in Sector 4...",
        "The stars are dying. Witness them while you can."
    ],
    generic: [
        "Incoming transmission...",
        "New data available.",
        "System Alert: Narrative incomplete.",
        "Connection established."
    ]
};

const sendSystemNotification = (title, body) => {
    if (!("Notification" in window)) return;
    
    if (Notification.permission === "granted") {
        try {
            // Android/Mobile often requires ServiceWorker registration for notifications, 
            // but new Notification() works on desktop/some mobile contexts if app is active.
            // We try both methods for maximum compatibility.
            
            const options = {
                body: body,
                icon: '/icon.png', // Ensure you have an icon.png in public folder
                vibrate: [200, 100, 200],
                badge: '/icon.png',
                tag: 'hope-app-update'
            };

            if (navigator.serviceWorker && navigator.serviceWorker.ready) {
                navigator.serviceWorker.ready.then(registration => {
                    registration.showNotification(title, options);
                });
            } else {
                new Notification(title, options);
            }
        } catch (e) {
            console.log("Notification trigger failed", e);
        }
    }
};

const requestNotificationPermission = async () => {
    if (!("Notification" in window)) return false;
    if (Notification.permission === "granted") return true;
    
    const permission = await Notification.requestPermission();
    return permission === "granted";
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

// 🎬 CINEMATIC VOID INTRO (WITH VIBRATION)
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

    // ⚡ LIGHTNING SYSTEM (VIBRATION ENABLED)
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
            // ⚡ VIBRATION TRIGGER: Sync with lightning
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
const SettingsModal = ({ onClose, settings, updateSetting }) => {
    
    // Toggle Full Screen
    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(e => console.log(e));
        } else {
            if (document.exitFullscreen) document.exitFullscreen();
        }
    };

    // 🔊 TEST NOTIFICATION
    const sendTestSignal = () => {
        if ("Notification" in window) {
             if (Notification.permission === "granted") {
                 sendSystemNotification("System Test", "Signal strength 100%. Lyra is online.");
             } else {
                 requestNotificationPermission().then(granted => {
                     if(granted) sendSystemNotification("System Test", "Permission Granted. Welcome back, Survivor.");
                 });
             }
        } else {
            alert("Your device does not support holographic signals (Notifications).");
        }
    };

    const settingList = [
        { id: "masterVolume", label: "MASTER VOLUME", type: "slider", cat: "AUDIO" },
        { id: "highContrast", label: "HIGH CONTRAST (B&W)", type: "toggle", cat: "VISUAL" },
        { id: "particles", label: "PARTICLES (SAVE BATTERY)", type: "toggle", cat: "VISUAL" },
        { id: "notifications", label: "SYSTEM NOTIFICATIONS", type: "toggle", cat: "SYSTEM" },
        { id: "testNotify", label: "TEST SIGNAL", type: "action", action: sendTestSignal, cat: "SYSTEM" },
        { id: "fullscreen", label: "FULL SCREEN", type: "action", action: toggleFullScreen, cat: "SYSTEM" },
        { id: "autoScroll", label: "AUTO-SCROLL (BETA)", type: "toggle", cat: "SYSTEM" },
    ];

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
                            onClick: () => {
                                // Specific logic for Notification permission
                                if (s.id === 'notifications' && !settings.notifications) {
                                    requestNotificationPermission().then(granted => {
                                        if (granted) updateSetting(s.id, true);
                                    });
                                } else {
                                    updateSetting(s.id, !settings[s.id]);
                                }
                            }
                        }),
                        
                        s.type === "slider" && h("div", { className: "slider-container" },
                            h("input", { 
                                type: "range", min: "0", max: "1", step: "0.1",
                                value: settings[s.id],
                                className: "slider-input",
                                onChange: (e) => updateSetting(s.id, parseFloat(e.target.value))
                            })
                        ),

                        s.type === "action" && h("button", { className: "action-btn", onClick: s.action }, "ACTIVATE")
                    )
                )
            )
        )
    );
};

// --- HOME PAGE (WITH 3D GYRO EFFECT & ENGINE VIBRATION) ---
const HomePage = ({ onStart, onViewCredits }) => {
    
    // 🧊 3D TILT LOGIC
    const cardRef = useRef(null);
    useEffect(() => {
        const el = cardRef.current;
        if(!el) return;

        const handleMove = (e) => {
            const { clientX, clientY } = e;
            const { left, top, width, height } = el.getBoundingClientRect();
            const centerX = left + width / 2;
            const centerY = top + height / 2;
            
            // Calc rotation (-15 to 15 degrees)
            const rotateX = ((clientY - centerY) / (height/2)) * -10;
            const rotateY = ((clientX - centerX) / (width/2)) * 10;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        };

        const reset = () => {
            el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        };

        // Gyro for Mobile
        const handleOrientation = (e) => {
            const beta = e.beta;  // X-axis tilt (-180 to 180)
            const gamma = e.gamma; // Y-axis tilt (-90 to 90)
            // Limit and dampen
            if (beta === null || gamma === null) return;
            const rotateX = Math.max(-20, Math.min(20, (beta - 45))) * -0.5; // Assuming holding phone at 45deg
            const rotateY = Math.max(-20, Math.min(20, gamma)) * 0.5;
            
            el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        };

        window.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseleave', reset);
        if (window.DeviceOrientationEvent) {
            window.addEventListener('deviceorientation', handleOrientation);
        }

        return () => {
            window.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseleave', reset);
            window.removeEventListener('deviceorientation', handleOrientation);
        };
    }, []);

    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Rajdhani:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        .home-container { position: relative; width: 100vw; height: 100vh; background-color: #000000; overflow: hidden; display: flex; flex-direction: column; align-items: center; justify-content: flex-start; padding-top: 30px; font-family: 'Rajdhani', sans-serif; color: #fff; padding-left: 20px; padding-right: 20px; }
        .home-container.fade-in { animation: fadeIn 1.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .energy-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at center, rgba(255,50,0,0.05), transparent 70%); mix-blend-mode: screen; z-index: 1; }
        .enhanced-ember { width: 5px; height: 5px; background: #ff5533; box-shadow: 0 0 15px #ff3300; animation: rise 5s linear infinite; z-index: 2; }
        .ember { position: absolute; bottom: -10px; width: 4px; height: 4px; background: #ff4500; border-radius: 50%; box-shadow: 0 0 10px #ff4500; animation: rise 4s linear infinite; z-index: 2; opacity: 0; }
        @keyframes rise { 0% { transform: translateY(0) scale(1); opacity: 1; } 100% { transform: translateY(-80vh) scale(0); opacity: 0; } }
        .content-layer { z-index: 10; width: 100%; max-width: 800px; display: flex; flex-direction: column; align-items: center; text-align: center; overflow-y: auto; max-height: 100vh; scrollbar-width: none; }
        .content-layer::-webkit-scrollbar { display: none; }
        
        /* 🧊 3D CONTAINER */
        .hero-img-container { width: 100%; max-width: 500px; position: relative; margin: 10px auto 10px auto; display: flex; justify-content: center; transition: transform 0.1s ease-out; transform-style: preserve-3d; will-change: transform; }
        .hero-image { width: 100%; height: auto; object-fit: cover; mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%); -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%); pointer-events: none; }

        .top-title { font-family: 'Cinzel', serif; font-size: clamp(1rem, 2.5vw, 1.4rem); color: #a0a0a0; letter-spacing: 2px; margin-bottom: 5px; }
        .sub-title-clean { font-family: 'Cinzel', serif; font-size: clamp(1rem, 2.5vw, 1.4rem); color: #fff; letter-spacing: 3px; margin-bottom: 5px; font-weight: 700; text-shadow: 0 2px 5px rgba(0,0,0,0.5); }
        .main-title-electric { font-family: 'Cinzel', serif; font-size: 1.8rem; font-weight: 700; text-transform: uppercase; color: #ff0000; letter-spacing: 2px; margin-bottom: 25px; position: relative; text-shadow: 0 0 5px #ff0000; animation: electric-glitch 2.5s infinite alternate; }
        @keyframes electric-glitch { 0% { text-shadow: 0 0 5px #ff0000; opacity: 1; transform: skewX(0); } 5% { text-shadow: 0 0 20px #ff0000, 2px 2px 0px #880000; opacity: 0.8; transform: skewX(-5deg); } 10% { text-shadow: 0 0 5px #ff0000; opacity: 1; transform: skewX(0); } 50% { text-shadow: 0 0 5px #ff0000; opacity: 1; } 55% { text-shadow: 0 0 15px #ff0000; opacity: 0.9; transform: skewX(3deg); } 60% { text-shadow: 0 0 5px #ff0000; opacity: 1; transform: skewX(0); } 100% { text-shadow: 0 0 5px #ff0000; opacity: 1; } }
        .tags-row { display: flex; flex-wrap: nowrap; overflow: hidden; gap: 5px; width: 100%; justify-content: center; margin-bottom: 30px; padding: 15px 0; }
        .tag-pill { padding: 4px 10px; border-radius: 50px; font-size: clamp(0.6rem, 2vw, 0.75rem); font-weight: 600; letter-spacing: 0.5px; background: rgba(0,0,0,0.6); border: 1px solid; backdrop-filter: blur(4px); text-transform: capitalize; white-space: nowrap; flex-shrink: 1; min-width: 0; animation: wave 2.5s ease-in-out infinite; }
        @keyframes wave { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
        .tag-scifi { border-color: #2de2e6; color: #2de2e6; box-shadow: 0 0 8px rgba(45, 226, 230, 0.3); }
        .tag-romance { border-color: #ff99cc; color: #ff99cc; box-shadow: 0 0 8px rgba(255, 153, 204, 0.3); }
        .tag-action { border-color: #ff9933; color: #ff9933; box-shadow: 0 0 8px rgba(255, 153, 51, 0.3); }
        .tag-mystery { border-color: #9933ff; color: #9933ff; box-shadow: 0 0 8px rgba(153, 51, 255, 0.3); }
        .tag-horror { border-color: #ff0000; color: #ff0000; box-shadow: 0 0 8px rgba(255, 0, 0, 0.4); }
        .desc-container { position: relative; width: 100%; display: flex; align-items: center; justify-content: center; margin-bottom: 40px; }
        .desc-text { max-width: 550px; font-size: 0.95rem; line-height: 1.5; color: #ccc; text-align: center; padding: 0 10px; font-weight: 700; }
        .circuit-line { height: 1px; background: #552222; flex-grow: 1; position: relative; opacity: 0.6; margin: 0 15px; display: none; }
        .circuit-line::before { content: ''; position: absolute; top: -2px; width: 4px; height: 4px; background: #ff4444; border-radius: 50%; }
        .circuit-line.left::before { right: 0; }
        .circuit-line.right::before { left: 0; }
        @media (min-width: 600px) { .circuit-line { display: block; } }
        .btn-wrapper-outer { position: relative; padding: 3px; border-radius: 8px; background: linear-gradient(90deg, transparent, rgba(255, 60, 0, 0.5), transparent); box-shadow: 0 0 15px rgba(255, 60, 0, 0.2); margin-bottom: 50px; transition: transform 0.3s; }
        .btn-wrapper-outer:hover { transform: scale(1.03); }
        .btn-frame { position: relative; padding: 4px; border: 2px solid #ff5555; border-radius: 8px; background: rgba(40, 0, 0, 0.6); box-shadow: 0 0 10px rgba(255, 0, 0, 0.4), inset 0 0 20px rgba(255, 0, 0, 0.2); display: flex; align-items: center; justify-content: center; }
        .start-btn-inner { background: linear-gradient(180deg, #aa0000 0%, #440000 100%); color: #fff; font-family: 'Cinzel', serif; font-size: 0.9rem; font-weight: 700; padding: 8px 30px; border: 1px solid rgba(255, 150, 150, 0.4); border-radius: 4px; text-transform: uppercase; letter-spacing: 2px; cursor: pointer; text-shadow: 0 2px 2px rgba(0,0,0,0.5); box-shadow: inset 0 1px 0 rgba(255,255,255,0.2); position: relative; overflow: hidden; }
        .start-btn-inner::after { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent); animation: btnShine 3s infinite; }
        @keyframes btnShine { 0% { left: -100%; } 20% { left: 100%; } 100% { left: 100%; } }
        .rec-section { display: flex; flex-direction: column; align-items: center; gap: 15px; width: 100%; margin-bottom: 20px; }
        .rec-title { font-family: 'Cinzel', serif; color: #666; font-size: 0.8rem; letter-spacing: 1px; text-transform: uppercase; }
        .rec-btn-container { display: flex; gap: 20px; }
        .rec-btn { position: relative; background: linear-gradient(180deg, #500000 0%, #200000 100%); border: 1px solid #ff3333; color: #ffcccc; font-family: 'Cinzel', serif; font-weight: 700; font-size: 0.8rem; padding: 8px 20px; clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px); cursor: pointer; box-shadow: 0 0 10px rgba(255, 0, 0, 0.2); transition: 0.2s; text-transform: uppercase; display: flex; align-items: center; justify-content: center; }
        .rec-btn:hover { background: #700000; box-shadow: 0 0 20px rgba(255, 0, 0, 0.5); transform: translateY(-2px); }
        .rec-icon { font-size: 0.8rem; margin-left: 8px; opacity: 0.9; }
    `;

    // Generate embers for background
    const [embers, setEmbers] = React.useState([]);
    React.useEffect(() => {
        const e = [];
        for (let i = 0; i < 30; i++) {
            e.push({
                left: Math.random() * 100 + "%",
                delay: Math.random() * 5 + "s",
                duration: Math.random() * 3 + 3 + "s"
            });
        }
        setEmbers(e);
    }, []);

    const getCredit = (name) => {
        return window.APP_CONFIG.credits.find(c => c.name.toUpperCase().includes(name)) || window.APP_CONFIG.credits[0];
    };

    const handleStartClick = () => {
        // ⚡ HEAVY MECHANICAL VIBRATION
        vibrate([80, 50, 100, 50, 400]);
        onStart();
    };

    return h(
        "div",
        { className: "home-container fade-in" },
        h("style", null, styles),

        h("div", { className: "energy-overlay" }),

        embers.map((emb, i) =>
            h("div", {
                key: i,
                className: "ember enhanced-ember",
                style: {
                    left: emb.left,
                    animationDelay: emb.delay,
                    animationDuration: emb.duration
                }
            })
        ),

        h(
            "div",
            { className: "content-layer" },

            h(
                "div",
                { className: "hero-img-container", ref: cardRef },
                h("img", {
                    src: "/images/Cover.png",
                    className: "hero-image",
                    alt: "Cover Art"
                })
            ),

            h("div", { className: "sub-title-clean" }, "BENEATH THE LIGHT"),
            h("div", { className: "main-title-electric" }, "OF A DYING SKY"),

            h(
                "div",
                { className: "tags-row" },
                h("span", { className: "tag-pill tag-scifi", style: { animationDelay: '0s' } }, "Sci-Fi"),
                h("span", { className: "tag-pill tag-romance", style: { animationDelay: '0.2s' } }, "Romance"),
                h("span", { className: "tag-pill tag-action", style: { animationDelay: '0.4s' } }, "Action"),
                h("span", { className: "tag-pill tag-mystery", style: { animationDelay: '0.6s' } }, "Mystery"),
                h("span", { className: "tag-pill tag-horror", style: { animationDelay: '0.8s' } }, "Horror")
            ),

            h(
                "div",
                { className: "desc-container" },
                h("div", { className: "circuit-line left" }),
                h(
                    "p",
                    { className: "desc-text" },
                    "As humanity faces its final hours, a hidden conspiracy awakens — forcing Jake and Viyona to choose between the world they know and the truth that could rewrite everything."
                ),
                h("div", { className: "circuit-line right" })
            ),

            h(
                "div",
                { className: "btn-wrapper-outer" },
                h(
                    "div",
                    { className: "btn-frame" },
                    h(
                        "button",
                        { className: "start-btn-inner", onClick: handleStartClick },
                        "START READING"
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

// --- MANGA LIST (NEON GOD UPGRADE) ---
const MangaPage = ({ onRead, onBack, onOpenSettings, likes, onToggleLike, savedLocation }) => {
    
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
        
        /* 🌀 ANIMATED GEAR UI */
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
        .continue-text { font-size: 0.7rem; color: #FFD700; font-weight: bold; letter-spacing: 1px; margin-top: 3px; display: flex; align-items: center; gap: 5px; animation: pulse 2s infinite; }
        .status-pill { font-size: 0.65rem; font-weight: 700; padding: 4px 10px; border: 1px solid currentColor; border-radius: 4px; letter-spacing: 1px; text-transform: uppercase; white-space: nowrap; box-shadow: inset 0 0 10px rgba(0,0,0,0.5); margin-left: 10px; }
        .lock-icon { font-size: 1.2rem; color: #ff3333; text-shadow: 0 0 10px rgba(255, 50, 50, 0.6); margin-left: 15px; }
        @keyframes flicker { 0%, 18%, 22%, 25%, 53%, 57%, 100% { text-shadow: 0 0 4px #fff, 0 0 10px #fff, 0 0 20px #00e5ff; opacity: 1; } 20%, 24%, 55% { text-shadow: none; opacity: 0.2; } }
        @keyframes moveStars { from { background-position: 0 0; } to { background-position: -1000px 500px; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(50px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
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
                const hasSave = savedLocation && savedLocation.chapterId === ch.id;

                return h(
                    "div",
                    {
                        key: ch.id,
                        className: "god-card " + (ch.locked ? "locked" : ""),
                        style: { animationDelay: `${index * 0.1}s` },
                        onClick: () => !ch.locked && onRead(ch.id, hasSave ? savedLocation.pageIndex : 0)
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
                            h("div", { className: "ch-date" }, ch.locked ? "ENCRYPTED" : ch.date),
                            hasSave && h("div", { className: "continue-text" }, 
                                h("i", { className: "fas fa-bookmark" }), 
                                `CONTINUE FROM PAGE ${savedLocation.pageIndex + 1}`
                            )
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

// --- READER ---
const ReaderPage = ({ chapterId, onBack, initialPage, onSaveLocation, onClearSave, likes, onToggleLike, hasSave, onFinishChapter, masterVolume }) => {
    const chapter = window.APP_CONFIG.chapters.find((c) => c.id === chapterId);
    const [currentPage, setCurrentPage] = useState(initialPage || 0);
    const [showComments, setShowComments] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [notification, setNotification] = useState(null);
    
    // 🎵 MUSIC REFS
    const audioRef = useRef(null);
    const currentTrackRef = useRef(null);
    const imageRefs = useRef([]);

    // Scroll to initial page
    useEffect(() => {
        if (initialPage > 0 && imageRefs.current[initialPage]) {
            setTimeout(() => {
                imageRefs.current[initialPage].scrollIntoView({ behavior: 'smooth' });
            }, 500);
        }
    }, [initialPage]);

    // Track Scroll Position & Finish Logic
    useEffect(() => {
        const handleScroll = () => {
            imageRefs.current.forEach((img, idx) => {
                if (!img) return;
                const rect = img.getBoundingClientRect();
                if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
                    if (currentPage !== idx) {
                        setCurrentPage(idx);
                    }
                    if (idx === imageRefs.current.length - 1) {
                        setTimeout(() => onFinishChapter(chapterId), 2000);
                    }
                }
            });
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [currentPage, chapterId, onFinishChapter]);

    // 🎵 MUSIC ENGINE SYSTEM (NOW USES MASTER VOLUME)
    useEffect(() => {
        const fadeDuration = window.MUSIC_CONFIG.fadeDuration || 2000;
        const chapterRules = window.MUSIC_CONFIG.chapters[chapterId] || [];
        const rule = chapterRules.find(r => (currentPage + 1) >= r.pages[0] && (currentPage + 1) <= r.pages[1]);
        const targetTrack = rule ? rule.track : null;

        // Apply Master Volume immediately if track is playing
        if (audioRef.current) {
            // Target volume is masterVolume unless muted
            const targetVol = isMuted ? 0 : masterVolume;
            // Smoothly adjust if volume changed
             if (Math.abs(audioRef.current.volume - targetVol) > 0.1) {
                 audioRef.current.volume = targetVol;
             }
        }

        if (targetTrack !== currentTrackRef.current) {
            // Fade out
            if (audioRef.current) {
                const oldAudio = audioRef.current;
                let vol = oldAudio.volume;
                const fadeOutInterval = setInterval(() => {
                    if (vol > 0.1) {
                        vol -= 0.1;
                        oldAudio.volume = vol;
                    } else {
                        oldAudio.pause();
                        clearInterval(fadeOutInterval);
                    }
                }, fadeDuration / 10);
            }

            // Start new track
            if (targetTrack) {
                const newAudio = new Audio(targetTrack);
                newAudio.loop = true;
                newAudio.muted = isMuted;
                newAudio.volume = 0;
                newAudio.play().catch(e => console.log("Autoplay blocked", e));
                
                // Fade in to Master Volume
                let vol = 0;
                const fadeInInterval = setInterval(() => {
                    if (vol < masterVolume) {
                        vol += 0.1;
                        if(vol > masterVolume) vol = masterVolume;
                        newAudio.volume = vol;
                    } else {
                        clearInterval(fadeInInterval);
                    }
                }, fadeDuration / 10);

                audioRef.current = newAudio;
                currentTrackRef.current = targetTrack;
            } else {
                audioRef.current = null;
                currentTrackRef.current = null;
            }
        }
    }, [chapterId, currentPage, isMuted, masterVolume]); 

    // Handle Mute Toggle & Master Volume Changes
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
            if (!isMuted) audioRef.current.volume = masterVolume;
        }
    }, [isMuted, masterVolume]);

    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
                currentTrackRef.current = null;
            }
        };
    }, []);

    const showToast = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const isLiked = likes[chapterId];

    return h(
        "div",
        { className: "reader-container fade-in" },
        
        h("style", null, `
            .reader-toolbar {
                position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
                background: rgba(10, 10, 15, 0.9); border: 1px solid #00e5ff;
                box-shadow: 0 0 20px rgba(0, 229, 255, 0.3); border-radius: 50px;
                padding: 10px 25px; display: flex; gap: 20px; z-index: 1000;
                backdrop-filter: blur(5px);
            }
            .reader-icon {
                color: #00e5ff; font-size: 1rem; cursor: pointer; transition: 0.1s;
                display: flex; align-items: center; justify-content: center;
                width: 35px; height: 35px; border-radius: 50%;
                background: rgba(0, 229, 255, 0.1);
            }
            .reader-icon:active { transform: scale(0.9); background: rgba(0, 229, 255, 0.4); }
            .reader-icon:hover { background: rgba(0, 229, 255, 0.2); box-shadow: 0 0 10px #00e5ff; }
            .reader-icon.liked { color: #ff0055; text-shadow: 0 0 10px #ff0055; background: rgba(255, 0, 85, 0.1); }
            .save-btn {
                background: linear-gradient(90deg, #00e5ff, #0099ff);
                color: #000; font-weight: bold; border: none;
                padding: 0 15px; border-radius: 20px;
                font-family: 'Rajdhani'; font-size: 0.8rem;
                cursor: pointer; display: flex; align-items: center; gap: 8px;
                transition: transform 0.1s;
            }
            .save-btn:active { transform: scale(0.95); }
            .save-btn.unsave { background: linear-gradient(90deg, #ff3333, #aa0000); color: white; }
            .toast-notification {
                position: fixed; top: 20px; left: 50%; transform: translateX(-50%);
                background: rgba(0, 229, 255, 0.9); color: #000;
                padding: 10px 20px; border-radius: 8px;
                font-family: 'Orbitron'; font-size: 0.8rem;
                box-shadow: 0 0 20px #00e5ff; z-index: 2000;
                animation: slideDown 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                display: flex; align-items: center; gap: 10px;
            }
            @keyframes slideDown { from { transform: translate(-50%, -100%); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
        `),

        notification && h("div", { className: "toast-notification" }, 
            h("i", { className: "fas fa-check-circle" }),
            notification
        ),

        h(
            "div",
            { className: "reader-toolbar" },
            h("i", {
                className: "fas fa-arrow-left reader-icon",
                title: "Back",
                onClick: onBack
            }),
            h("i", {
                className: `fas ${isMuted ? 'fa-volume-mute' : 'fa-volume-up'} reader-icon`,
                title: "Mute Music",
                onClick: () => setIsMuted(!isMuted)
            }),
            
            h(
                "button", 
                { 
                    className: `save-btn ${hasSave ? 'unsave' : ''}`,
                    onClick: () => {
                        if (hasSave) {
                            onClearSave();
                            showToast("SAVE CLEARED");
                        } else {
                            onSaveLocation(chapterId, currentPage);
                            showToast(`LOCATION SAVED: PAGE ${currentPage + 1}`);
                        }
                    }
                },
                h("i", { className: hasSave ? "fas fa-trash" : "fas fa-bookmark" }),
                hasSave ? "DELETE SAVE" : `SAVE P.${currentPage + 1}`
            ),

            h("i", {
                className: `fas fa-heart reader-icon ${isLiked ? 'liked' : ''}`,
                title: "Like",
                onClick: () => onToggleLike(chapterId)
            }),
            h("i", {
                className: "fas fa-comment reader-icon",
                title: "Comments",
                onClick: () => setShowComments(true)
            })
        ),
        
        chapter.pages.map((img, i) =>
            h("img", {
                key: i,
                ref: el => imageRefs.current[i] = el,
                src: img,
                className: "reader-img",
                loading: "lazy"
            })
        ),

        showComments && h(CommentsModal, { onClose: () => setShowComments(false) })
    );
};

// --- MAIN APP (PERSISTENCE & SETTINGS) ---
const App = () => {
    // 💾 TOTAL STATE RECALL
    const savedView = localStorage.getItem("appView") || "intro";
    const savedActiveChap = localStorage.getItem("appActiveChapter");
    
    const [view, setView] = useState(savedView);
    const [activePerson, setActivePerson] = useState(null);
    const [showSettings, setShowSettings] = useState(false);
    const [activeChapter, setActiveChapter] = useState(savedActiveChap ? parseInt(savedActiveChap) : 1);
    
    // ⚙️ GLOBAL SETTINGS
    const [settings, setSettings] = useState({
        masterVolume: 0.8,
        highContrast: false,
        particles: true,
        autoScroll: false,
        notifications: false // Default off
    });

    const [likes, setLikes] = useState({});
    const [savedLocation, setSavedLocation] = useState(null);
    const [finishedChapters, setFinishedChapters] = useState({});

    // 🕒 NOTIFICATION SCHEDULE LOGIC
    useEffect(() => {
        if (!settings.notifications) return;

        // Check every minute
        const interval = setInterval(() => {
            const lastTime = parseInt(localStorage.getItem('lastNotifyTime') || 0);
            const now = Date.now();
            const THREE_HOURS = 3 * 60 * 60 * 1000;

            if (now - lastTime > THREE_HOURS) {
                // Determine time of day
                const hour = new Date().getHours();
                let category = 'generic';
                if (hour >= 5 && hour < 12) category = 'morning';
                else if (hour >= 12 && hour < 17) category = 'afternoon';
                else if (hour >= 17 && hour < 22) category = 'evening';
                else category = 'night';

                const msgs = NOTIFICATION_MESSAGES[category];
                const msg = msgs[Math.floor(Math.random() * msgs.length)];
                
                sendSystemNotification("HOPE System", msg);
                
                localStorage.setItem('lastNotifyTime', now.toString());
            }
        }, 60000); // Check every minute if we should send

        return () => clearInterval(interval);
    }, [settings.notifications]);

    // 💾 Persist View State
    useEffect(() => {
        localStorage.setItem("appView", view);
        localStorage.setItem("appActiveChapter", activeChapter);
    }, [view, activeChapter]);

    useEffect(() => {
        if (window.requestNotificationPermission) window.requestNotificationPermission();
        
        const savedLoc = localStorage.getItem("savedLocation");
        if (savedLoc) setSavedLocation(JSON.parse(savedLoc));
        
        const savedLikes = localStorage.getItem("userLikes");
        if (savedLikes) setLikes(JSON.parse(savedLikes));

        const savedFinished = localStorage.getItem("finishedChapters");
        if (savedFinished) setFinishedChapters(JSON.parse(savedFinished));

        // Load Settings if any
        const localSettings = localStorage.getItem("appSettings");
        if (localSettings) setSettings(JSON.parse(localSettings));
    }, []);

    const updateSetting = (key, val) => {
        const newSettings = { ...settings, [key]: val };
        setSettings(newSettings);
        localStorage.setItem("appSettings", JSON.stringify(newSettings));
    };

    const handleStart = () => {
        setView("manga");
    };

    const toggleLike = (chapterId) => {
        const newLikes = { ...likes, [chapterId]: !likes[chapterId] };
        setLikes(newLikes);
        localStorage.setItem("userLikes", JSON.stringify(newLikes));
    };

    const handleSaveLocation = (chapterId, pageIndex) => {
        const loc = { chapterId, pageIndex };
        setSavedLocation(loc);
        localStorage.setItem("savedLocation", JSON.stringify(loc));
    };

    const handleClearSave = () => {
        setSavedLocation(null);
        localStorage.removeItem("savedLocation");
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
            onStart: handleStart,
            onViewCredits: setActivePerson
        }),

        view === "manga" && h(MangaPage, {
            onRead: openReader,
            onBack: () => setView("home"),
            onOpenSettings: () => setShowSettings(true),
            likes: likes,
            onToggleLike: toggleLike,
            savedLocation: savedLocation,
            finishedChapters: finishedChapters
        }),

        view === "reader" && h(ReaderPage, {
            chapterId: activeChapter,
            initialPage: savedLocation && savedLocation.chapterId === activeChapter ? savedLocation.pageIndex : 0,
            onBack: () => setView("manga"),
            onSaveLocation: handleSaveLocation,
            onClearSave: handleClearSave,
            likes: likes,
            onToggleLike: toggleLike,
            hasSave: savedLocation && savedLocation.chapterId === activeChapter,
            onFinishChapter: handleFinishChapter,
            masterVolume: settings.masterVolume // 🔊 Pass volume to reader
        }),

        activePerson && h(ThemeModal, {
            person: activePerson,
            onClose: () => setActivePerson(null)
        }),

        showSettings && h(SettingsModal, { 
            onClose: () => setShowSettings(false),
            settings: settings,
            updateSetting: updateSetting
        })
    );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(h(App));