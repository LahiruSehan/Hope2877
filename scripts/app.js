
const { useState, useEffect, useRef, useContext, createContext } = React;

// 🌍 CONFIG ACCESS
const t = window.APP_CONFIG.translations.EN;

// 🌌 SLOW PARTICLE BACKGROUND (COOL COLORS ONLY)
const ParticleBackground = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return; // 🛑 SAFETY CHECK TO PREVENT CRASH
        
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let particles = [];
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 0.5; // Smaller, star-like
                this.speedX = (Math.random() - 0.5) * 0.05; // Extremely slow
                this.speedY = (Math.random() - 0.5) * 0.05; 
                // Blue / Purple / Cyan only
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
        const init = () => { particles = []; for(let i=0; i<40; i++) particles.push(new Particle()); };
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

// 🎬 CINEMATIC VOID INTRO (Stranger Things Style)
const CinematicIntro = ({ onComplete }) => {
    useEffect(() => {
        // Run for 11 seconds then trigger completion
        const timer = setTimeout(() => {
            const el = document.querySelector('.cinematic-intro');
            if(el) el.classList.add('implode');
            setTimeout(onComplete, 1400); // Wait for implosion animation
        }, 11000);
        return () => clearTimeout(timer);
    }, []);

    const titleStr = "OF A DYING SKY";

    return (
        <div className="cinematic-intro">
            <div className="film-grain"></div>
            <div className="fog-container"></div>
            
            <div className="title-container">
                <div className="sub-title-intro">BENEATH THE LIGHT</div>
                <div className="main-title-intro">
                    {titleStr.split("").map((char, i) => (
                        <span key={i} className="char-span" style={{animationDelay: `${2.5 + (i * 0.15)}s`}}>
                            {char === " " ? "\u00A0" : char}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

// 🚨 LICENSE BAR WITH SMOOTH FADE
const LicenseBar = () => {
    const warnings = window.APP_CONFIG.legal.warnings;
    const [index, setIndex] = useState(0);
    const [fade, setFade] = useState(false);

    useEffect(() => {
        const interval = setInterval(() => {
            setFade(true); // Trigger fade out
            setTimeout(() => {
                setIndex(prev => (prev + 1) % warnings.length);
                setFade(false); // Trigger fade in
            }, 500);
        }, 3500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="license-bar">
            <div className={`license-text ${fade ? 'fade-out' : ''}`}>{warnings[index]}</div>
        </div>
    );
};

// 🌸 THEMED MODAL
const ThemeModal = ({ person, onClose }) => {
    if (!person) return null;
    useEffect(() => {
        const createParticles = () => {
            const el = document.createElement('div');
            el.innerText = person.emoji;
            el.className = 'modal-particle';
            el.style.left = Math.random() * 100 + 'vw';
            if (person.theme === 'fire') el.style.animation = `riseFire ${2 + Math.random()}s ease-in forwards`;
            else if (person.theme === 'sakura') el.style.animation = `fallSakura ${4 + Math.random()}s linear forwards`;
            else el.style.animation = `dripBlood ${3 + Math.random()}s ease-in forwards`;
            const container = document.getElementById('theme-layer');
            if(container) container.appendChild(el);
            setTimeout(() => el.remove(), 4000);
        };
        const interval = setInterval(createParticles, 200);
        return () => clearInterval(interval);
    }, [person]);
    return (
        <div className={`theme-modal theme-${person.theme}`}>
            <div id="theme-layer" style={{position:'absolute',width:'100%',height:'100%',overflow:'hidden'}}></div>
            <div className="theme-content">
                <h1 style={{color:person.theme==='sakura'?'#FFB7C5':person.theme==='fire'?'#FF4500':'#800000', fontFamily:'Orbitron', marginBottom:'5px'}}>{person.name}</h1>
                <h3 style={{color:'#fff', fontSize:'0.9rem', marginBottom:'15px'}}>{person.role}</h3>
                <p style={{color:'#ccc',fontSize:'0.85rem', lineHeight:'1.4'}}>{person.desc}</p>
                <button onClick={onClose} style={{marginTop:'25px',padding:'8px 25px',background:'rgba(255,255,255,0.1)',border:'1px solid #777',color:'#fff',cursor:'pointer',borderRadius:'20px'}}>CLOSE</button>
            </div>
        </div>
    );
};

// 💰 PAYWALL
const Paywall = ({ onUnlock }) => {
    const [mode, setMode] = useState('vip');
    const [code, setCode] = useState('');
    return (
        <div className="paywall-modal">
            <div className="gold-card">
                <div className="pay-tabs">
                    <div className={`pay-tab ${mode==='vip'?'active':''}`} onClick={()=>setMode('vip')}>{t.unlock}</div>
                    <div className={`pay-tab ${mode==='card'?'active':''}`} onClick={()=>setMode('card')}>{t.card_pay}</div>
                </div>
                <h2 style={{color:'#FFD700',fontFamily:'Cinzel',fontSize:'1.2rem'}}>{t.paywall_title}</h2>
                <div className="price-tag">$4.99</div>
                <p style={{color:'#aaa',marginBottom:'20px',fontSize:'0.8rem'}}>{t.paywall_desc}</p>
                {mode === 'vip' ? (
                    <div>
                        <input className="cc-input" style={{width:'100%',textAlign:'center',marginBottom:'15px',color:'#FFD700',border:'1px solid #FFD700',background:'#000',padding:'12px',borderRadius:'8px'}} placeholder="ENTER VIP KEY" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} />
                        <button className="start-btn-soft" style={{width:'100%',margin:'0',background:'#FFD700',color:'#000',fontSize:'0.9rem'}} onClick={()=>onUnlock(code)}>{t.unlock}</button>
                    </div>
                ) : (
                    <div><button className="start-btn-soft" style={{width:'100%',margin:'0',fontSize:'1rem'}} onClick={()=>alert("ERROR: BANK UNREACHABLE")}>PAY NOW</button></div>
                )}
            </div>
        </div>
    );
};

// --- COMPONENT: HOME PAGE (Revised Layout) ---
const HomePage = ({ onStart, onViewCredits }) => {
    return (
        <div className="home-layout fade-in" style={{height:'100vh', display:'flex', flexDirection:'column'}}>
            {/* Top Section */}
            <div className="home-top-section">
                <div className="cover-art-container">
                    <img src={window.APP_CONFIG.assets.cover} className="cover-art-gif" alt="Cover" />
                </div>

                <h1 className="hero-title">
                    {t.title_start}<br />
                    <span className="title-red">{t.title_end}</span>
                </h1>
            </div>

            {/* Center Actions */}
            <div className="home-center-action">
                <div className="start-btn-soft" onClick={onStart}>{t.start}</div>
                <div className="hunt-text">{t.subtitle}</div>
            </div>

            {/* Bottom Credits (Fixed at bottom) */}
            <div className="credits-section">
                <div className="section-header" style={{fontSize:'0.7rem', color:'#666', letterSpacing:'2px'}}>{t.special}</div>
                <div className="credits-row">
                    {window.APP_CONFIG.credits.map((c, i) => (
                        <div key={i} className="soft-credit-btn" onClick={() => onViewCredits(c)}>
                            {c.name.charAt(0)}
                        </div>
                    ))}
                </div>
                <p className="credit-subtext">{t.more_info}</p>
            </div>
        </div>
    );
};

// --- COMPONENT: MANGA LIST ---
const MangaPage = ({ onRead }) => {
    return (
        <div className="manga-list fade-in">
            <h2 style={{color:'var(--accent-cyan)',fontFamily:'Orbitron',marginBottom:'20px',textAlign:'center',marginTop:'10px'}}>{t.chapters}</h2>
            {window.APP_CONFIG.chapters.map((ch) => (
                <div key={ch.id} className={`ch-card ${ch.locked?'locked':''}`} onClick={()=>!ch.locked && onRead(ch.id)}>
                    <div className="ch-info">
                        <h3 style={{color:'#fff',fontSize:'1rem'}}>{ch.id}. {ch.title}</h3>
                        <div style={{color:'#666',fontSize:'0.7rem'}}>{ch.locked ? t.locked : ch.date}</div>
                    </div>
                    <div className="ch-stats">
                        {!ch.locked && (
                            <>
                                <div className="stat-pill"><span className="live-dot"></span> 0</div>
                                <div className="stat-pill"><i className="fas fa-comment"></i> 0</div>
                            </>
                        )}
                        {ch.locked && <i className="fas fa-lock" style={{color:'#555'}}></i>}
                    </div>
                </div>
            ))}
            <div className="construction-section">
                <h3 style={{fontSize:'1rem'}}>{t.coming_soon}</h3>
                <p style={{fontSize:'0.8rem', marginTop:'5px'}}>{t.construction_desc}</p>
            </div>
        </div>
    );
};

// --- COMPONENT: READER (Fixed Toolbar + Back Function) ---
const ReaderPage = ({ chapterId, onBack }) => {
    const chapter = window.APP_CONFIG.chapters.find(c => c.id === chapterId);
    
    // Auto-scroll to top when opening
    useEffect(() => {
        window.scrollTo(0,0);
    }, []);

    return (
        <div className="reader-container fade-in">
            {/* FLOATING TRANSPARENT OVERLAY TOOLBAR */}
            <div className="reader-toolbar">
                <i className="fas fa-arrow-left reader-icon" onClick={onBack}></i>
                <i className="fas fa-home reader-icon" onClick={onBack}></i>
                <div style={{display:'flex'}}>
                    <i className="fas fa-heart reader-icon" onClick={()=>alert('Liked!')}></i>
                    <i className="fas fa-comment reader-icon" onClick={()=>alert('Comments coming soon')}></i>
                </div>
            </div>

            {chapter.pages.map((img, i) => (
                <img key={i} src={img} className="reader-img" loading="lazy" />
            ))}
        </div>
    );
};

// --- 📱 MAIN APP ---
const App = () => {
    const [view, setView] = useState('intro');
    const [activePerson, setActivePerson] = useState(null);
    const [showPaywall, setShowPaywall] = useState(false);
    const [activeChapter, setActiveChapter] = useState(1);

    // Initial Load Check
    useEffect(() => {
        if (!window.APP_CONFIG) {
            console.error("Config not found");
        }
    }, []);

    const handleStart = () => {
        const saved = localStorage.getItem('vipAccess');
        if (saved) setView('manga'); else setShowPaywall(true);
    };
    const unlockVIP = (code) => {
        if(window.APP_CONFIG.vipCodes.includes(code)){ localStorage.setItem('vipAccess','true'); setShowPaywall(false); setView('manga'); }
        else alert("ACCESS DENIED");
    };

    return (
        <div className={`app-shell ${view==='reader'?'reader-mode':''}`}>
            {/* Show Particle BG everywhere except Reader */}
            {view !== 'reader' && view !== 'intro' && <ParticleBackground />}
            
            {/* Show License Bar everywhere except Reader and Intro */}
            {view !== 'reader' && view !== 'intro' && <LicenseBar />}
            
            {/* Views */}
            {view==='intro' && <CinematicIntro onComplete={() => setView('home')} />}
            {view==='home' && <HomePage onStart={handleStart} onViewCredits={setActivePerson} />}
            {view==='manga' && <MangaPage onRead={(id)=>{setActiveChapter(id); setView('reader');}} />}
            {view==='reader' && <ReaderPage chapterId={activeChapter} onBack={()=>setView('manga')} />}

            {/* Modals */}
            {activePerson && <ThemeModal person={activePerson} onClose={()=>setActivePerson(null)} />}
            {showPaywall && <Paywall onUnlock={unlockVIP} />}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
