
const { useState, useEffect, useRef, useContext, createContext } = React;

// 🌍 LANGUAGE CONTEXT
const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState('EN');
    const t = window.APP_CONFIG.translations[lang];
    return React.createElement(LanguageContext.Provider, { value: { lang, setLang, t } }, children);
};

const useTranslation = () => useContext(LanguageContext);

// 🌌 TOUCH-REACTIVE PARTICLE BACKGROUND
const ParticleBackground = () => {
    const canvasRef = useRef(null);
    
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null };
        
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        window.addEventListener('resize', resize);
        resize();

        window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });
        window.addEventListener('touchstart', (e) => { mouse.x = e.touches[0].clientX; mouse.y = e.touches[0].clientY; });

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = Math.random() * 2 - 1;
                this.speedY = Math.random() * 2 - 1;
                this.color = `hsla(${Math.random() * 360}, 50%, 50%, 0.5)`;
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.size > 0.2) this.size -= 0.01;
                if (this.size <= 0.2 || this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                    this.size = Math.random() * 2 + 1;
                }
                
                // Mouse Interaction
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx*dx + dy*dy);
                if (distance < 100) {
                    this.x -= dx/20;
                    this.y -= dy/20;
                    this.size += 0.05;
                }
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
            for(let i=0; i<60; i++) particles.push(new Particle());
        };
        init();

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => { p.update(); p.draw(); });
            requestAnimationFrame(animate);
        };
        animate();

        return () => window.removeEventListener('resize', resize);
    }, []);

    return React.createElement('canvas', { id: 'particle-canvas', ref: canvasRef });
};

// 🚨 RED LICENSE BAR
const LicenseBar = () => {
    const warnings = window.APP_CONFIG.legal.warnings;
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % warnings.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="license-bar">
            <div className="license-text">{warnings[index]}</div>
        </div>
    );
};

// 🌸🔥🩸 THEMED MODAL
const ThemeModal = ({ person, onClose }) => {
    if (!person) return null;

    useEffect(() => {
        const createParticles = () => {
            const el = document.createElement('div');
            el.innerText = person.emoji;
            el.className = 'modal-particle';
            el.style.left = Math.random() * 100 + 'vw';
            
            if (person.theme === 'fire') {
                el.style.animation = `riseFire ${2 + Math.random()}s ease-in forwards`;
            } else if (person.theme === 'sakura') {
                el.style.animation = `fallSakura ${4 + Math.random()}s linear forwards`;
            } else {
                el.style.animation = `dripBlood ${3 + Math.random()}s ease-in forwards`;
            }

            document.getElementById('theme-layer').appendChild(el);
            setTimeout(() => el.remove(), 4000);
        };
        const interval = setInterval(createParticles, 200);
        return () => clearInterval(interval);
    }, [person]);

    return (
        <div className={`theme-modal theme-${person.theme}`}>
            <div id="theme-layer" style={{position:'absolute', width:'100%', height:'100%', overflow:'hidden'}}></div>
            <div className="theme-content">
                <h1 className="theme-name" style={{color: person.theme === 'sakura' ? '#FFB7C5' : person.theme === 'fire' ? '#FF4500' : '#800000'}}>
                    {person.name}
                </h1>
                <h3 className="theme-role">{person.role}</h3>
                <p style={{color:'#ddd', fontSize:'0.9rem'}}>{person.desc}</p>
                <button onClick={onClose} style={{marginTop:'20px', padding:'10px 30px', background:'transparent', border:'1px solid #fff', color:'#fff', cursor:'pointer'}}>CLOSE</button>
            </div>
        </div>
    );
};

// 💰 EPIC PAYWALL
const Paywall = ({ onUnlock, t }) => {
    const [mode, setMode] = useState('vip'); // vip or card
    const [code, setCode] = useState('');
    const [cardProcessing, setCardProcessing] = useState(false);

    const handleCardPay = () => {
        setCardProcessing(true);
        setTimeout(() => {
            setCardProcessing(false);
            alert("⚠️ SYSTEM ERROR: Magical Interference Detected. Bank Servers Unreachable.");
            setMode('vip'); // Force VIP
        }, 2500);
    };

    return (
        <div className="paywall-modal">
            <div className="gold-card">
                <div className="pay-tabs">
                    <div className={`pay-tab ${mode==='vip'?'active':''}`} onClick={()=>setMode('vip')}>{t.unlock}</div>
                    <div className={`pay-tab ${mode==='card'?'active':''}`} onClick={()=>setMode('card')}>{t.card_pay}</div>
                </div>

                <h2 style={{color:'#FFD700', fontFamily:'Cinzel'}}>{t.paywall_title}</h2>
                <div className="price-tag">$4.99</div>
                <p style={{color:'#aaa', marginBottom:'20px'}}>{t.paywall_desc}</p>

                {mode === 'vip' ? (
                    <div>
                        <input 
                            className="cc-input"
                            style={{width:'100%', textAlign:'center', marginBottom:'15px', color:'#FFD700', border:'1px solid #FFD700'}}
                            placeholder="ENTER VIP KEY"
                            value={code} onChange={e=>setCode(e.target.value.toUpperCase())}
                        />
                        <button className="start-btn" style={{width:'100%', background:'#FFD700', color:'#000'}} onClick={()=>onUnlock(code)}>
                            {t.unlock}
                        </button>
                    </div>
                ) : (
                    <div className="cc-form">
                        <input className="cc-input" placeholder="0000 0000 0000 0000" />
                        <div className="cc-row">
                            <input className="cc-input" placeholder="MM/YY" style={{width:'50%'}} />
                            <input className="cc-input" placeholder="CVC" style={{width:'50%'}} />
                        </div>
                        <button className="start-btn" style={{width:'100%', marginTop:'10px'}} onClick={handleCardPay}>
                            {cardProcessing ? "PROCESSING..." : "PAY NOW"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- COMPONENT: HOME PAGE ---
const HomePage = ({ onStart, onViewCredits, t, setLang, currentLang }) => {
    const langs = ['EN', 'SI', 'JP', 'FR'];
    
    return (
        <div className="home-layout fade-in">
            {/* Top Language Switcher */}
            <div className="lang-switch-top">
                {langs.map(l => (
                    <div key={l} className={`lang-btn ${currentLang===l ? 'active':''}`} onClick={()=>setLang(l)}>{l}</div>
                ))}
            </div>

            <h1 className="hero-title">{t.title}</h1>
            <h2 className="hero-subtitle">{t.subtitle}</h2>
            
            <button className="start-btn" onClick={onStart}>{t.start}</button>

            <div className="credits-section">
                <div className="section-header">{t.special}</div>
                <div className="credits-grid">
                    {window.APP_CONFIG.credits.map((c, i) => (
                        <div key={i} className="credit-btn" onClick={() => onViewCredits(c)}>
                            <span>{c.name}</span>
                            <span style={{color:'var(--accent-gold)'}}>{c.emoji}</span>
                        </div>
                    ))}
                </div>
                <p className="credit-subtext">{t.more_info}</p>
            </div>

            <div className="app-footer">{t.footer}</div>
        </div>
    );
};

// --- COMPONENT: MANGA LIST ---
const MangaPage = ({ t, onRead }) => {
    return (
        <div className="manga-list fade-in">
            <h2 style={{color:'var(--accent-cyan)', fontFamily:'Orbitron', marginBottom:'20px', textAlign:'center'}}>{t.chapters}</h2>
            
            {window.APP_CONFIG.chapters.map((ch) => (
                <div key={ch.id} className={`ch-card ${ch.locked ? 'locked' : ''}`} onClick={() => !ch.locked && onRead(ch.id)}>
                    <div className="ch-info">
                        <h3>Chapter {ch.id}</h3>
                        <div style={{color:'#666', fontSize:'0.8rem'}}>{ch.locked ? t.locked : ch.date}</div>
                    </div>
                    <div className="ch-stats">
                        {!ch.locked && (
                            <>
                                <div className="stat-item"><span className="live-dot"></span> {ch.views} {t.live}</div>
                                <div className="stat-item"><i className="fas fa-comment"></i> {ch.comments}</div>
                            </>
                        )}
                        {ch.locked && <i className="fas fa-lock"></i>}
                    </div>
                </div>
            ))}
        </div>
    );
};

// --- 📱 MAIN APP COMPONENT ---
const App = () => {
    const { t, lang, setLang } = useTranslation();
    const [view, setView] = useState('intro');
    const [activePerson, setActivePerson] = useState(null);
    const [showPaywall, setShowPaywall] = useState(false);
    const [activeChapter, setActiveChapter] = useState(1);

    // Intro Timer
    useEffect(() => {
        if(view === 'intro') {
            const timer = setTimeout(() => setView('home'), 5000);
            return () => clearTimeout(timer);
        }
    }, [view]);

    // VIP Logic
    const handleStart = () => {
        const saved = localStorage.getItem('vipAccess');
        if (saved) setView('manga');
        else setShowPaywall(true);
    };

    const unlockVIP = (code) => {
        if (window.APP_CONFIG.vipCodes.includes(code)) {
            localStorage.setItem('vipAccess', 'true');
            setShowPaywall(false);
            setView('manga');
        } else {
            alert("ACCESS DENIED");
        }
    };

    return (
        <div className="app-shell">
            <ParticleBackground />
            <LicenseBar />

            {/* INTRO */}
            {view === 'intro' && (
                <div className="intro-wrapper">
                    <div className="top-loader-bar" style={{width:'100%', transition:'width 5s linear'}}></div>
                    <h1 className="magical-title">
                        {"BENEATH THE LIGHT".split("").map((c,i)=><span key={i} className="magical-char" style={{animationDelay:`${i*0.1}s`}}>{c}</span>)}
                    </h1>
                </div>
            )}

            {/* HOME */}
            {view === 'home' && (
                <HomePage 
                    onStart={handleStart} 
                    onViewCredits={setActivePerson} 
                    t={t} 
                    setLang={setLang}
                    currentLang={lang}
                />
            )}

            {/* MANGA LIST */}
            {view === 'manga' && (
                <>
                    <MangaPage t={t} onRead={(id)=>{setActiveChapter(id); setView('reader');}} />
                    
                    {/* Floating Lang Switcher */}
                    <div className="lang-fab">
                        <div className="lang-fab-trigger">{lang}</div>
                        <div className="lang-fab-menu">
                            {['EN','SI','JP','FR'].map(l => <div key={l} className="lang-fab-item" onClick={()=>setLang(l)}>{l}</div>)}
                        </div>
                    </div>

                    {/* Navigation FABs */}
                    <div className="nav-fab-row">
                        <div className="nav-btn" onClick={()=>setView('home')}><i className="fas fa-home"></i></div>
                    </div>
                </>
            )}

            {/* READER (Simplified for brevity) */}
            {view === 'reader' && (
                <div className="fade-in" style={{textAlign:'center', padding:'50px', color:'#fff'}}>
                    <h2>{t.reading} CHAPTER {activeChapter}</h2>
                    <img src={window.APP_CONFIG.chapters[0].pages[0]} style={{maxWidth:'100%', marginTop:'20px'}} />
                    <button className="nav-btn" style={{margin:'20px auto'}} onClick={()=>setView('manga')}>{t.back}</button>
                </div>
            )}

            {/* MODALS */}
            {activePerson && <ThemeModal person={activePerson} onClose={()=>setActivePerson(null)} />}
            {showPaywall && <Paywall onUnlock={unlockVIP} t={t} />}

        </div>
    );
};

// Root Render
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    React.createElement(LanguageProvider, null, React.createElement(App))
);
