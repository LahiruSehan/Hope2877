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

// 🌸 THEMED MODAL
const ThemeModal = ({ person, onClose }) => {
    if (!person) return null;

    useEffect(() => {
        const createParticles = () => {
            const el = document.createElement("div");
            el.innerText = person.emoji;
            el.className = "modal-particle";
            el.style.left = Math.random() * 100 + "vw";
            if (person.theme === "fire")
                el.style.animation = `riseFire ${2 + Math.random()
                    }s ease-in forwards`;
            else if (person.theme === "sakura")
                el.style.animation = `fallSakura ${4 + Math.random()
                    }s linear forwards`;
            else
                el.style.animation = `dripBlood ${3 + Math.random()
                    }s ease-in forwards`;
            const container = document.getElementById("theme-layer");
            if (container) container.appendChild(el);
            setTimeout(() => el.remove(), 4000);
        };
        const interval = setInterval(createParticles, 200);
        return () => clearInterval(interval);
    }, [person]);

    return h(
        "div",
        { className: "theme-modal theme-" + person.theme },
        h("div", {
            id: "theme-layer",
            style: {
                position: "absolute",
                width: "100%",
                height: "100%",
                overflow: "hidden"
            }
        }),
        h(
            "div",
            { className: "theme-content" },
            h(
                "h1",
                {
                    style: {
                        color:
                            person.theme === "sakura"
                                ? "#FFB7C5"
                                : person.theme === "fire"
                                    ? "#FF4500"
                                    : "#800000",
                        fontFamily: "Orbitron",
                        marginBottom: "5px"
                    }
                },
                person.name
            ),
            h(
                "h3",
                {
                    style: {
                        color: "#fff",
                        fontSize: "0.9rem",
                        marginBottom: "15px"
                    }
                },
                person.role
            ),
            h(
                "p",
                {
                    style: {
                        color: "#ccc",
                        fontSize: "0.85rem",
                        lineHeight: "1.4"
                    }
                },
                person.desc
            ),
            h(
                "button",
                {
                    onClick: onClose,
                    style: {
                        marginTop: "25px",
                        padding: "8px 25px",
                        background: "rgba(255,255,255,0.1)",
                        border: "1px solid #777",
                        color: "#fff",
                        cursor: "pointer",
                        borderRadius: "20px"
                    }
                },
                "CLOSE"
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

// --- HOME PAGE ---
const HomePage = ({ onStart, onViewCredits }) =>
    h(
        "div",
        {
            className: "home-layout fade-in",
            style: {
                height: "100vh",
                display: "flex",
                flexDirection: "column"
            }
        },
        h(
            "div",
            { className: "home-top-section" },
            h(
                "div",
                { className: "cover-art-container" },
                h("img", {
                    src: window.APP_CONFIG.assets.cover,
                    className: "cover-art-gif",
                    alt: "Cover"
                })
            ),
            h(
                "h1",
                { className: "hero-title" },
                t.title_start,
                h("br"),
                h(
                    "span",
                    { className: "title-red" },
                    t.title_end
                )
            )
        ),
        h(
            "div",
            { className: "home-center-action" },
            h(
                "div",
                {
                    className: "start-btn-soft",
                    onClick: onStart
                },
                t.start
            ),
            h("div", { className: "hunt-text" }, t.subtitle)
        ),
        h(
            "div",
            { className: "credits-section" },
            h(
                "div",
                {
                    className: "section-header",
                    style: {
                        fontSize: "0.7rem",
                        color: "#666",
                        letterSpacing: "2px"
                    }
                },
                t.special
            ),
            h(
                "div",
                { className: "credits-row" },
                window.APP_CONFIG.credits.map((c, i) =>
                    h(
                        "div",
                        {
                            key: i,
                            className: "soft-credit-btn",
                            onClick: () => onViewCredits(c)
                        },
                        c.name.charAt(0)
                    )
                )
            ),
            h(
                "p",
                { className: "credit-subtext" },
                t.more_info
            )
        )
    );

// --- MANGA LIST ---
const MangaPage = ({ onRead }) =>
    h(
        "div",
        { className: "manga-list fade-in" },
        h(
            "h2",
            {
                style: {
                    color: "var(--accent-cyan)",
                    fontFamily: "Orbitron",
                    marginBottom: "20px",
                    textAlign: "center",
                    marginTop: "10px"
                }
            },
            t.chapters
        ),
        window.APP_CONFIG.chapters.map((ch) =>
            h(
                "div",
                {
                    key: ch.id,
                    className:
                        "ch-card " +
                        (ch.locked ? "locked" : ""),
                    onClick: () =>
                        !ch.locked && onRead(ch.id)
                },
                h(
                    "div",
                    { className: "ch-info" },
                    h(
                        "h3",
                        {
                            style: {
                                color: "#fff",
                                fontSize: "1rem"
                            }
                        },
                        ch.id + ". " + ch.title
                    ),
                    h(
                        "div",
                        {
                            style: {
                                color: "#666",
                                fontSize: "0.7rem"
                            }
                        },
                        ch.locked ? t.locked : ch.date
                    )
                ),
                h(
                    "div",
                    { className: "ch-stats" },
                    !ch.locked
                        ? [
                            h(
                                "div",
                                {
                                    key: "live",
                                    className: "stat-pill"
                                },
                                h("span", {
                                    className: "live-dot"
                                }),
                                " 0"
                            ),
                            h(
                                "div",
                                {
                                    key: "comments",
                                    className: "stat-pill"
                                },
                                h("i", {
                                    className:
                                        "fas fa-comment"
                                }),
                                " 0"
                            )
                        ]
                        : h("i", {
                            className: "fas fa-lock",
                            style: { color: "#555" }
                        })
                )
            )
        ),
        h(
            "div",
            { className: "construction-section" },
            h(
                "h3",
                { style: { fontSize: "1rem" } },
                t.coming_soon
            ),
            h(
                "p",
                {
                    style: {
                        fontSize: "0.8rem",
                        marginTop: "5px"
                    }
                },
                t.construction_desc
            )
        )
    );

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
                audio.volume = start + diff * p;
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

// --- MAIN APP ---
const App = () => {
    const [view, setView] = useState("intro");
    const [activePerson, setActivePerson] = useState(null);
    const [showPaywall, setShowPaywall] = useState(false);
    const [activeChapter, setActiveChapter] = useState(1);

    // 🔔 Notifications
    useEffect(() => {
        if (window.requestNotificationPermission) {
            window.requestNotificationPermission().then(
                (token) => {
                    console.log("User Token:", token);
                }
            );
        }

        if (window.onFirebaseForegroundMessage) {
            window.onFirebaseForegroundMessage((payload) => {
                alert(
                    "🔥 New Update: " +
                    payload.notification.title
                );
            });
        }
    }, []);

    // Config check
    useEffect(() => {
        if (!window.APP_CONFIG) {
            console.error("Config not found");
        }
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
        {
            className:
                "app-shell " +
                (view === "reader" ? "reader-mode" : "")
        },
        view !== "reader" &&
        view !== "intro" &&
        h(ParticleBackground),
        view !== "reader" &&
        view !== "intro" &&
        h(LicenseBar),
        view === "intro" &&
        h(CinematicIntro, {
            onComplete: () => setView("home")
        }),
        view === "home" &&
        h(HomePage, {
            onStart: handleStart,
            onViewCredits: setActivePerson
        }),
        view === "manga" &&
        h(MangaPage, {
            onRead: (id) => {
                setActiveChapter(id);
                setView("reader");
            }
        }),
        view === "reader" &&
        h(ReaderPage, {
            chapterId: activeChapter,
            onBack: () => setView("manga")
        }),
        activePerson &&
        h(ThemeModal, {
            person: activePerson,
            onClose: () => setActivePerson(null)
        }),
        showPaywall &&
        h(Paywall, {
            onUnlock: unlockVIP
        })
    );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(h(App));
