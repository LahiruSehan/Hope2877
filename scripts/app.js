// NOTE: no imports – firebase is exposed on window from src/firebase.js

const { useState, useEffect, useRef } = React;
const h = React.createElement;

// 🌍 CONFIG ACCESS
const t = window.APP_CONFIG.translations.EN;

// 🌌 SLOW PARTICLE BACKGROUND (COOL COLORS ONLY)
const ParticleBackground = () => {
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
                this.color = `hsla(${hue}, 70%, 60%, ${Math.random() * 0.3 + 0.1
                    })`;
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

        const drawBolt = (pts, thickness = 3, alpha = 1) => {
            ctx.strokeStyle = `rgba(200,220,255,${alpha})`;
            ctx.lineWidth = thickness;
            ctx.shadowBlur = 25;
            ctx.shadowColor = "rgba(180,200,255,1)";

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

        const drawBranch = (p) => {
            let len = 50 + Math.random() * 120;
            let angle = (Math.random() - 0.5) * 1.2;
            let endX = p.x + Math.cos(angle) * len;
            let endY = p.y + Math.sin(angle) * len;
            let branchPts = genBolt(p.x, p.y, endX, endY, 6);
            drawBolt(branchPts, 1.6, 0.6);
        };

        const triggerLightning = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            let startX = canvas.width * 0.5 + (Math.random() - 0.5) * 150;
            let startY = 0;
            let endX = canvas.width * 0.5;
            let endY = canvas.height * 0.45;

            let mainBolt = genBolt(startX, startY, endX, endY, 25);

            drawBolt(mainBolt, 3, 1);

            for (let i = 3; i < mainBolt.length - 3; i += 4) {
                if (Math.random() > 0.55) continue;
                drawBranch(mainBolt[i]);
            }

            setTimeout(
                () => ctx.clearRect(0, 0, canvas.width, canvas.height),
                80
            );
            setTimeout(() => drawBolt(mainBolt, 2.5, 0.8), 120);
            setTimeout(
                () => ctx.clearRect(0, 0, canvas.width, canvas.height),
                200
            );

            const intro = document.querySelector(".cinematic-intro");
            if (!intro) return;
            intro.classList.add("lightning-screen-flash");
            intro.classList.add("lightning-camera-shake");

            setTimeout(() => {
                intro.classList.remove("lightning-screen-flash");
                intro.classList.remove("lightning-camera-shake");
            }, 300);
        };

        const timer = setTimeout(triggerLightning, 6500);

        return () => {
            clearTimeout(timer);
            window.removeEventListener("resize", resize);
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
            h(
                "div",
                { className: "sub-title-intro" },
                "BENEATH THE LIGHT"
            ),
            h(
                "div",
                { className: "main-title-intro" },
                titleStr.split("").map((char, i) =>
                    h(
                        "span",
                        {
                            key: i,
                            className: "char-span",
                            style: {
                                animationDelay:
                                    2.5 + i * 0.15 + "s"
                            }
                        },
                        char === " " ? "\u00A0" : char
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
        h(
            "div",
            {
                className:
                    "license-text " + (fade ? "fade-out" : "")
            },
            warnings[index]
        )
    );
};

// 🌸 THEMED MODAL (GOD LEVEL)
const ThemeModal = ({ person, onClose }) => {
    if (!person) return null;

    // --- 1. THEME CONFIGURATION ---
    // Define the "Soul" of each theme here
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
            font: "'Nosifer', cursive", // Creepy font
            particle: "🩸",
            particleAnim: "dripBlood",
            titleClass: "title-blood",
            border: "1px solid rgba(204, 0, 0, 0.6)",
            sound: "Heartbeat"
        }
    };

    // Fallback if theme doesn't exist
    const currentTheme = THEMES[person.theme] || THEMES.fire;

    // --- 2. PARTICLE SYSTEM ---
    useEffect(() => {
        const layer = document.getElementById("particle-layer");
        if (!layer) return;

        const createParticle = () => {
            const el = document.createElement("div");
            el.innerText = currentTheme.particle;
            el.className = "magic-particle";
            
            // Randomize physics
            const startLeft = Math.random() * 100;
            const size = Math.random() * 1.5 + 0.5; // Scale multiplier
            const duration = Math.random() * 3 + 2; // 2s to 5s

            el.style.left = startLeft + "%";
            el.style.fontSize = size + "rem";
            el.style.animation = `${currentTheme.particleAnim} ${duration}s linear forwards`;
            
            // Blur for depth
            if (Math.random() > 0.5) el.style.filter = "blur(2px)";

            layer.appendChild(el);
            setTimeout(() => el.remove(), duration * 1000);
        };

        // Intensity of particles
        const interval = setInterval(createParticle, 150);
        return () => clearInterval(interval);
    }, [person, currentTheme]);

    // --- 3. STYLES ---
    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@900&family=Cinzel:wght@700&family=Nosifer&family=Montserrat:wght@300;400&display=swap');

        /* MODAL CONTAINER */
        .modal-overlay {
            position: fixed;
            top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(8px);
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 0;
            animation: modalFadeIn 0.5s ease-out forwards;
        }

        /* THE CARD */
        .god-card-container {
            position: relative;
            width: 90%;
            max-width: 450px;
            padding: 40px;
            background: rgba(10, 10, 10, 0.9);
            border-radius: 12px;
            box-shadow: 0 0 50px rgba(0,0,0,0.8);
            text-align: center;
            overflow: hidden;
            transform: scale(0.9);
            animation: cardPop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards 0.2s;
        }

        /* TEXT STYLES */
        .role-text {
            font-family: 'Montserrat', sans-serif;
            font-size: 0.9rem;
            letter-spacing: 4px;
            text-transform: uppercase;
            color: rgba(255,255,255,0.8);
            margin-bottom: 20px;
            border-bottom: 1px solid rgba(255,255,255,0.2);
            display: inline-block;
            padding-bottom: 5px;
        }

        .desc-text {
            font-family: 'Montserrat', sans-serif;
            font-size: 0.95rem;
            color: #ccc;
            line-height: 1.6;
            margin-bottom: 30px;
            text-shadow: 0 2px 4px black;
            position: relative;
            z-index: 10;
        }

        /* CLOSE BUTTON */
        .close-btn-epic {
            background: transparent;
            color: #fff;
            font-family: 'Montserrat', sans-serif;
            font-weight: bold;
            font-size: 0.9rem;
            letter-spacing: 2px;
            padding: 12px 35px;
            border: 1px solid rgba(255,255,255,0.3);
            cursor: pointer;
            transition: 0.3s;
            position: relative;
            overflow: hidden;
            z-index: 10;
        }

        .close-btn-epic:hover {
            background: rgba(255,255,255,0.1);
            letter-spacing: 4px;
            box-shadow: 0 0 15px currentColor;
        }

        /* --- THEME SPECIFIC ANIMATIONS & TEXT --- */

        /* FIRE THEME */
        .title-fire {
            font-family: 'Orbitron', sans-serif;
            font-size: 3rem;
            color: #fff;
            margin: 0 0 10px 0;
            text-transform: uppercase;
            text-shadow: 
                0 0 10px #ff5500,
                0 -10px 20px #ff0000,
                0 -20px 40px #ffaa00;
            animation: burnText 2s infinite alternate;
        }
        @keyframes riseFire {
            0% { transform: translateY(110vh) scale(1); opacity: 0; }
            20% { opacity: 1; }
            100% { transform: translateY(-10vh) scale(0); opacity: 0; }
        }
        @keyframes burnText {
            0% { transform: scale(1); text-shadow: 0 0 10px #ff5500, 0 -10px 20px #ff0000; }
            100% { transform: scale(1.02); text-shadow: 0 0 20px #ff5500, 0 -15px 30px #ff0000; }
        }

        /* SAKURA THEME */
        .title-sakura {
            font-family: 'Cinzel', serif;
            font-size: 2.8rem;
            color: #fff;
            margin: 0 0 10px 0;
            text-shadow: 0 0 10px #ffb7c5, 0 0 20px #ff69b4;
            animation: breathePink 3s infinite ease-in-out;
        }
        @keyframes fallSakura {
            0% { transform: translateY(-10vh) rotate(0deg) translateX(0); opacity: 0; }
            20% { opacity: 1; }
            100% { transform: translateY(110vh) rotate(360deg) translateX(50px); opacity: 0; }
        }
        @keyframes breathePink {
            0%, 100% { text-shadow: 0 0 10px #ffb7c5; }
            50% { text-shadow: 0 0 25px #ffb7c5, 0 0 40px #ff69b4; }
        }

        /* BLOOD THEME */
        .title-blood {
            font-family: 'Nosifer', cursive;
            font-size: 2.5rem;
            color: #ff0000;
            margin: 0 0 10px 0;
            text-shadow: 2px 2px 0px #000;
            animation: glitchHorror 3s infinite;
        }
        @keyframes dripBlood {
            0% { top: -10%; opacity: 1; }
            100% { top: 120%; opacity: 0; }
        }
        @keyframes glitchHorror {
            0% { transform: skew(0deg); }
            90% { transform: skew(0deg); opacity: 1; }
            92% { transform: skew(-10deg); opacity: 0.8; }
            94% { transform: skew(10deg); opacity: 1; }
            96% { transform: skew(-5deg); opacity: 0.9; }
            100% { transform: skew(0deg); }
        }

        /* UTILS */
        .magic-particle {
            position: absolute;
            pointer-events: none;
            z-index: 1;
        }

        @keyframes modalFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cardPop { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    `;

    return h(
        "div",
        { className: "modal-overlay" },
        h("style", null, styles),

        // --- BACKGROUND LAYER ---
        h("div", {
            id: "particle-layer",
            style: {
                position: "absolute",
                top: 0, left: 0,
                width: "100%", height: "100%",
                background: currentTheme.bg,
                overflow: "hidden",
                zIndex: -1
            }
        }),

        // --- CONTENT CARD ---
        h(
            "div",
            {
                className: "god-card-container",
                style: {
                    border: currentTheme.border,
                    boxShadow: `0 0 30px ${currentTheme.color}40` // Hex alpha 40%
                }
            },
            
            // Name with specific animation class
            h("h1", { className: currentTheme.titleClass }, person.name),
            
            // Role
            h("div", { className: "role-text" }, person.role),
            
            // Description
            h("p", { className: "desc-text" }, person.desc),

            // Action
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

// 💰 PAYWALL
const Paywall = ({ onUnlock }) => {
    const [mode, setMode] = useState("vip");
    const [code, setCode] = useState("");

    return h(
        "div",
        { className: "paywall-modal" },
        h(
            "div",
            { className: "gold-card" },
            h(
                "div",
                { className: "pay-tabs" },
                h(
                    "div",
                    {
                        className:
                            "pay-tab " +
                            (mode === "vip" ? "active" : ""),
                        onClick: () => setMode("vip")
                    },
                    t.unlock
                ),
                h(
                    "div",
                    {
                        className:
                            "pay-tab " +
                            (mode === "card" ? "active" : ""),
                        onClick: () => setMode("card")
                    },
                    t.card_pay
                )
            ),
            h(
                "h2",
                {
                    style: {
                        color: "#FFD700",
                        fontFamily: "Cinzel",
                        fontSize: "1.2rem"
                    }
                },
                t.paywall_title
            ),
            h("div", { className: "price-tag" }, "$4.99"),
            h(
                "p",
                {
                    style: {
                        color: "#aaa",
                        marginBottom: "20px",
                        fontSize: "0.8rem"
                    }
                },
                t.paywall_desc
            ),
            mode === "vip"
                ? h(
                    "div",
                    null,
                    h("input", {
                        className: "cc-input",
                        style: {
                            width: "100%",
                            textAlign: "center",
                            marginBottom: "15px",
                            color: "#FFD700",
                            border: "1px solid #FFD700",
                            background: "#000",
                            padding: "12px",
                            borderRadius: "8px"
                        },
                        placeholder: "ENTER VIP KEY",
                        value: code,
                        onChange: (e) =>
                            setCode(
                                e.target.value.toUpperCase()
                            )
                    }),
                    h(
                        "button",
                        {
                            className: "start-btn-soft",
                            style: {
                                width: "100%",
                                margin: "0",
                                background: "#FFD700",
                                color: "#000",
                                fontSize: "0.9rem"
                            },
                            onClick: () => onUnlock(code)
                        },
                        t.unlock
                    )
                )
                : h(
                    "div",
                    null,
                    h(
                        "button",
                        {
                            className: "start-btn-soft",
                            style: {
                                width: "100%",
                                margin: "0",
                                fontSize: "1rem"
                            },
                            onClick: () =>
                                alert("ERROR: BANK UNREACHABLE")
                        },
                        "PAY NOW"
                    )
                )
        )
    );
};
// --- HOME PAGE (LANDSCAPE & COMPACT GOD MODE) ---
const HomePage = ({ onStart, onViewCredits }) => {
    
    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Rajdhani:wght@300;500;700&display=swap');

        /* RESET */
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

        .apocalypse-wrapper {
            position: relative;
            height: 100vh;
            width: 100vw;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            align-items: center;
            /* CENTER CONTENT VERTICALLY WITH SPACE DISTRIBUTION */
            justify-content: center; 
            gap: 2vh; 
            background-color: #000;
            color: #fff;
            font-family: 'Rajdhani', sans-serif;
            padding: 20px;
        }

        /* INFERNO BACKGROUND (No Particles) */
        .bg-inferno {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: linear-gradient(to bottom, #000000 10%, #1a0000 60%, #4a0000 100%);
            z-index: 0;
        }

        .bg-smoke {
            position: absolute;
            top: 0; left: 0; width: 100%; height: 100%;
            background: radial-gradient(circle, transparent 0%, #000 150%);
            opacity: 0.4;
            z-index: 0;
            animation: pulseSmoke 10s infinite alternate;
        }

        /* --- SECTION 1: COVER ART (LANDSCAPE) --- */
        .cover-frame {
            position: relative;
            width: 90%; 
            max-width: 500px;
            /* LANDSCAPE RATIO FIX */
            aspect-ratio: 16/9; 
            border-radius: 12px;
            box-shadow: 0 0 40px rgba(255, 0, 0, 0.3);
            border: 1px solid rgba(255,255,255,0.15);
            overflow: hidden;
            animation: floatHero 8s ease-in-out infinite;
            z-index: 10;
        }

        .cover-img { 
            width: 100%; 
            height: 100%; 
            object-fit: cover; 
        }

        /* --- SECTION 2: TITLES --- */
        .title-group {
            text-align: center;
            z-index: 10;
            margin-top: -10px; /* Pull closer to image */
        }

        .main-title {
            font-family: 'Cinzel', serif;
            font-size: clamp(1rem, 2.5vh, 1.5rem);
            line-height: 1.2;
            letter-spacing: 3px;
            text-transform: uppercase;
            color: #fff;
            /* SMOKE EFFECT */
            animation: smokeText 5s ease-in-out infinite alternate;
        }

        .sub-title {
            font-family: 'Cinzel', serif;
            font-size: clamp(1.5rem, 4vh, 3rem);
            text-transform: uppercase;
            letter-spacing: 2px;
            font-weight: 700;
            margin-top: 5px;
            /* RED SHIFT EFFECT */
            animation: redShift 6s infinite;
        }

        /* --- SECTION 3: META & BUTTON --- */
        .meta-container {
            z-index: 10;
            display: flex;
            flex-direction: column;
            align-items: center;
            width: 100%;
        }

        .genres-row {
            display: flex;
            justify-content: center;
            gap: 6px;
            flex-wrap: wrap;
            margin-bottom: 15px;
        }

        .genre-chip {
            font-size: 0.6rem;
            color: #ffcccc;
            border: 1px solid rgba(255, 50, 50, 0.3);
            padding: 3px 10px;
            border-radius: 20px;
            background: rgba(50, 0, 0, 0.5);
            backdrop-filter: blur(4px);
        }

        .desc-text {
            font-size: clamp(0.75rem, 1.8vh, 0.9rem);
            color: #ddd;
            line-height: 1.4;
            text-align: center;
            font-weight: 400;
            max-width: 650px;
            text-shadow: 0 1px 4px #000;
            margin-bottom: 20px;
            padding: 0 10px;
        }

        .btn-start-reading {
            background: rgba(255, 0, 0, 0.1);
            color: #fff;
            font-family: 'Cinzel', serif;
            font-size: 1.2rem;
            padding: 14px 50px;
            border: 1px solid rgba(255, 50, 50, 0.6);
            letter-spacing: 4px;
            cursor: pointer;
            box-shadow: 0 0 25px rgba(255, 0, 0, 0.2);
            animation: pulseBtn 3s infinite;
            backdrop-filter: blur(5px);
            transition: 0.3s;
            text-transform: uppercase;
            margin-bottom: 25px; /* Space before credits */
        }
        .btn-start-reading:hover { 
            background: #ff0000; 
            box-shadow: 0 0 40px rgba(255, 0, 0, 0.6);
            transform: scale(1.05);
        }

        /* --- SECTION 4: SPECIAL RECOGNITION (REDESIGNED) --- */
        .recognition-panel {
            z-index: 10;
            width: 100%;
            max-width: 550px;
            background: linear-gradient(180deg, rgba(20,0,0,0.6) 0%, rgba(50,0,0,0.3) 100%);
            border-top: 2px solid #ff3333;
            border-bottom: 1px solid rgba(255, 50, 50, 0.3);
            padding: 15px;
            display: flex;
            flex-direction: column;
            align-items: center;
            backdrop-filter: blur(8px);
            /* Sci-Fi Corners using clip-path */
            clip-path: polygon(
                0 0, 
                100% 0, 
                100% 85%, 
                95% 100%, 
                5% 100%, 
                0 85%
            );
        }

        .rec-label {
            font-size: 0.6rem;
            color: #ff5555;
            letter-spacing: 4px;
            text-transform: uppercase;
            margin-bottom: 12px;
            font-weight: 700;
            text-shadow: 0 0 8px rgba(255, 0, 0, 0.5);
        }

        .rec-grid {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 10px;
        }

        /* BUTTON STYLE FOR NAMES */
        .rec-btn {
            font-size: 0.75rem;
            color: #fff;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.2);
            padding: 8px 18px;
            border-radius: 4px;
            cursor: pointer;
            text-transform: uppercase;
            font-weight: 600;
            transition: all 0.2s ease;
            position: relative;
            overflow: hidden;
        }

        .rec-btn::before {
            content: '';
            position: absolute;
            top: 0; left: 0; width: 3px; height: 100%;
            background: #ff3333;
            opacity: 0.5;
        }

        .rec-btn:hover {
            background: rgba(255, 50, 50, 0.3);
            border-color: #ff3333;
            box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
            transform: translateY(-2px);
        }

        /* ANIMATIONS */
        @keyframes floatHero { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
        
        @keyframes smokeText { 
            0% { text-shadow: 0 0 5px rgba(255,255,255,0.3); filter: blur(0.3px); } 
            100% { text-shadow: 0 -5px 15px rgba(255,255,255,0.8); filter: blur(0px); } 
        }

        @keyframes redShift {
            0% { color: #ff0000; text-shadow: 0 0 10px #500000; }
            33% { color: #ff4d4d; text-shadow: 0 0 20px #ff0000; }
            66% { color: #8b0000; text-shadow: 0 0 10px #300000; }
            100% { color: #ff0000; text-shadow: 0 0 10px #500000; }
        }

        @keyframes pulseBtn { 0% { box-shadow: 0 0 10px rgba(255,0,0,0.2); } 50% { box-shadow: 0 0 30px rgba(255,0,0,0.5); } 100% { box-shadow: 0 0 10px rgba(255,0,0,0.2); } }
        @keyframes pulseSmoke { 0% { opacity: 0.3; } 100% { opacity: 0.5; } }
    `;

    return h(
        "div",
        { className: "apocalypse-wrapper" },
        h("style", null, styles),
        
        // BACKGROUNDS (NO PARTICLES, JUST ATMOSPHERE)
        h("div", { className: "bg-inferno" }),
        h("div", { className: "bg-smoke" }),

        // 1. COVER ART (Landscape)
        h(
            "div",
            { className: "cover-frame" },
            h("img", { 
                // Using the specific file name you asked for
                src: "./cover.png", 
                // Fallback to config if local file fails (safety)
                onError: (e) => { e.target.src = window.APP_CONFIG.assets.cover; },
                className: "cover-img", 
                alt: "Cover" 
            })
        ),

        // 2. TITLES (Compact)
        h(
            "div",
            { className: "title-group" },
            h("h2", { className: "main-title" }, t.title_start), // Beneath the light
            h("h1", { className: "sub-title" }, t.title_end)   // Of a dying sky
        ),

        // 3. META + ACTION
        h(
            "div",
            { className: "meta-container" },
            
            // Genres
            h(
                "div",
                { className: "genres-row" },
                ["Sci-Fi", "Romance", "Action", "Mystery", "Horror"].map(g => 
                    h("span", { key: g, className: "genre-chip" }, g)
                )
            ),

            // Description
            h(
                "p",
                { className: "desc-text" },
                "As humanity faces its final hours, a hidden conspiracy awakens — forcing Jake and Viyona to choose between the world they know and the truth that could rewrite everything."
            ),

            // Start Button
            h(
                "button",
                { className: "btn-start-reading", onClick: onStart },
                t.start
            ),

            // 4. SPECIAL RECOGNITION (Now a visible panel)
            h(
                "div",
                { className: "recognition-panel" },
                h("div", { className: "rec-label" }, "// " + t.special + " //"),
                h(
                    "div",
                    { className: "rec-grid" },
                    window.APP_CONFIG.credits.map((c, i) =>
                        h(
                            "div",
                            {
                                key: i,
                                className: "rec-btn",
                                onClick: () => onViewCredits(c)
                            },
                            c.name
                        )
                    )
                )
            )
        )
    );
};
// --- MANGA LIST (NEON GOD UPGRADE) ---
const MangaPage = ({ onRead, onBack }) => {
    const [likes, setLikes] = React.useState({});

    const toggleLike = (e, id) => {
        e.stopPropagation();
        setLikes(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const STATUS_COLORS = {
        "FINISHED":    { color: "#00ff9d", glow: "0 0 10px #00ff9d" },
        "ONGOING":     { color: "#00e5ff", glow: "0 0 10px #00e5ff" },
        "COMING SOON": { color: "#ff3333", glow: "0 0 10px #ff3333" }
    };

    const styles = `
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&family=Rajdhani:wght@300;500;700&display=swap');
        .manga-layout { position: relative; height: 100vh; width: 100vw; display: flex; flex-direction: column; background-color: #050505; font-family: 'Rajdhani', sans-serif; overflow: hidden; color: white; }
        .space-bg { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: radial-gradient(circle at center, #11001c 0%, #000000 100%); z-index: -2; }
        .stars-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 3px); background-size: 550px 550px; opacity: 0.6; z-index: -1; animation: moveStars 100s linear infinite; }
        
        /* HEADER */
        .header-zone { flex: 0 0 auto; display: flex; justify-content: center; align-items: center; padding: 20px 0; z-index: 10; background: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent); position: relative; width: 100%; }
        
        /* BUTTONS */
        .icon-btn {
            position: absolute;
            background: rgba(0, 229, 255, 0.1);
            border: 1px solid rgba(0, 229, 255, 0.3);
            color: #00e5ff;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-family: 'Orbitron', sans-serif;
            transition: all 0.3s;
            clip-path: polygon(10px 0, 100% 0, 100% calc(100% - 10px), calc(100% - 10px) 100%, 0 100%, 0 10px);
        }
        .icon-btn:hover { background: rgba(0, 229, 255, 0.3); box-shadow: 0 0 15px rgba(0, 229, 255, 0.5); text-shadow: 0 0 8px white; }
        
        .home-btn { left: 20px; }
        .settings-btn { right: 20px; }

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

        // HEADER
        h(
            "div",
            { className: "header-zone" },
            // HOME ICON (LEFT)
            h(
                "button", 
                { className: "icon-btn home-btn", onClick: onBack },
                h("i", { className: "fas fa-home" })
            ),
            // TITLE
            h("h2", { className: "holo-title" }, t.chapters),
            // SETTINGS ICON (RIGHT)
            h(
                "button", 
                { className: "icon-btn settings-btn", onClick: () => alert("Settings Menu Coming Soon") },
                h("i", { className: "fas fa-cog" })
            )
        ),

        // LIST
        h(
            "div",
            { className: "list-viewport" },
            window.APP_CONFIG.chapters.map((ch, index) => {
                let statusText = "FINISHED";
                if (ch.id === 5) statusText = "ONGOING";
                else if (ch.id >= 6) statusText = "COMING SOON";
                const theme = STATUS_COLORS[statusText];

                return h(
                    "div",
                    {
                        key: ch.id,
                        className: "god-card " + (ch.locked ? "locked" : ""),
                        style: { animationDelay: `${index * 0.1}s` }, 
                        onClick: () => !ch.locked && onRead(ch.id)
                    },
                    h(
                        "div",
                        { className: "card-left" },
                        h("i", { className: "fas fa-heart like-btn " + (likes[ch.id] ? "liked" : ""), onClick: (e) => toggleLike(e, ch.id) }),
                        h("div", { className: "ch-info-group" }, h("div", { className: "ch-title" }, `CH.${ch.id} : ${ch.title}`), h("div", { className: "ch-date" }, ch.locked ? "ENCRYPTED" : ch.date))
                    ),
                    h(
                        "div",
                        { style: { display: "flex", alignItems: "center" } },
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

// --- READER ---
const ReaderPage = ({ chapterId, onBack }) => {
    const chapter = window.APP_CONFIG.chapters.find(
        (c) => c.id === chapterId
    );

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // 🎵 MUSIC ENGINE SYSTEM
    useEffect(() => {
        let activeTrack = null;
        let currentAudio = null;

        const fade = (audio, target, duration) => {
            let start = audio.volume;
            let diff = target - start;
            let startTime = performance.now();

            function step(now) {
                let p = Math.min((now - startTime) / duration, 1);
                let newVolume = start + diff * p;

                // 🔥 FIX: Clamp volume between 0 and 1
                newVolume = Math.max(0, Math.min(1, newVolume));

                audio.volume = newVolume;

                if (p < 1) requestAnimationFrame(step);
            }

            requestAnimationFrame(step);
        };

        const chapterRules = window.MUSIC_CONFIG.chapters[chapterId] || [];

        const checkActivePage = () => {
            const imgs = document.querySelectorAll(".reader-img");
            let activePage = null;

            imgs.forEach((img, index) => {
                const rect = img.getBoundingClientRect();
                if (rect.top < window.innerHeight * 0.5 &&
                    rect.bottom > window.innerHeight * 0.5) {
                    activePage = index + 1;
                }
            });

            if (!activePage) return;

            const rule = chapterRules.find(r =>
                activePage >= r.pages[0] && activePage <= r.pages[1]
            );

            if (!rule) return;

            if (activeTrack === rule.track) return;

            // Fade out previous
            if (currentAudio) fade(currentAudio, 0, window.MUSIC_CONFIG.fadeDuration);

            // Load new
            const audio = new Audio(rule.track);
            audio.volume = 0;
            audio.loop = true;
            audio.play();

            fade(audio, 1, window.MUSIC_CONFIG.fadeDuration);

            currentAudio = audio;
            activeTrack = rule.track;
        };

        window.addEventListener("scroll", checkActivePage);
        setTimeout(checkActivePage, 800);

        return () => {
            window.removeEventListener("scroll", checkActivePage);
            if (currentAudio) currentAudio.pause();
        };
    }, [chapterId]);



    return h(
        "div",
        { className: "reader-container fade-in" },
        h(
            "div",
            { className: "reader-toolbar" },
            h("i", {
                className: "fas fa-arrow-left reader-icon",
                onClick: onBack
            }),
            h("i", {
                className: "fas fa-home reader-icon",
                onClick: onBack
            }),
            h(
                "div",
                { style: { display: "flex" } },
                h("i", {
                    className: "fas fa-heart reader-icon",
                    onClick: () => alert("Liked!")
                }),
                h("i", {
                    className: "fas fa-comment reader-icon",
                    onClick: () =>
                        alert("Comments coming soon")
                })
            )
        ),
        chapter.pages.map((img, i) =>
            h("img", {
                key: i,
                src: img,
                className: "reader-img",
                loading: "lazy"
            })
        )
    );
};

// --- MAIN APP (UPDATED) ---
const App = () => {
    const [view, setView] = useState("intro");
    const [activePerson, setActivePerson] = useState(null);
    const [showPaywall, setShowPaywall] = useState(false);
    const [activeChapter, setActiveChapter] = useState(1);

    useEffect(() => {
        if (window.requestNotificationPermission) window.requestNotificationPermission();
        if (window.APP_CONFIG && !window.APP_CONFIG) console.error("Config not found");
    }, []);

    const handleStart = () => {
        const saved = localStorage.getItem("vipAccess");
        if (saved) setView("manga");
        else setShowPaywall(true);
    };

    const unlockVIP = (code) => {
        if (window.APP_CONFIG.vipCodes.includes(code)) {
            localStorage.setItem("vipAccess", "true");
            setShowPaywall(false);
            setView("manga");
        } else alert("ACCESS DENIED");
    };

    return h(
        "div",
        { className: "app-shell " + (view === "reader" ? "reader-mode" : "") },
        
        // --- FIX: ONLY SHOW BLUE PARTICLES ON PAYWALL OR OTHER MENUS, NOT HOME/MANGA ---
        // Home has Fire, Manga has Space, so we hide ParticleBackground for them
        view !== "reader" && view !== "intro" && view !== "home" && view !== "manga" && h(ParticleBackground),
        
        view !== "reader" && view !== "intro" && h(LicenseBar),
        
        view === "intro" && h(CinematicIntro, { onComplete: () => setView("home") }),
        
        view === "home" && h(HomePage, {
            onStart: handleStart,
            onViewCredits: setActivePerson
        }),
        
        view === "manga" && h(MangaPage, {
            onRead: (id) => { setActiveChapter(id); setView("reader"); },
            onBack: () => setView("home") // <--- THIS MAKES THE HOME BUTTON WORK
        }),
        
        view === "reader" && h(ReaderPage, {
            chapterId: activeChapter,
            onBack: () => setView("manga")
        }),
        
        activePerson && h(ThemeModal, {
            person: activePerson,
            onClose: () => setActivePerson(null)
        }),
        
        showPaywall && h(Paywall, { onUnlock: unlockVIP })
    );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(h(App));
