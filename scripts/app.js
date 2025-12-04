
const { useState, useEffect, useRef, useContext, createContext } = React;

// 🌍 LANGUAGE CONTEXT
const LanguageContext = createContext();

const LanguageProvider = ({ children }) => {
    const [lang, setLang] = useState('EN');
    const t = window.APP_CONFIG.translations[lang];
    return React.createElement(LanguageContext.Provider, { value: { lang, setLang, t } }, children);
};

const useTranslation = () => useContext(LanguageContext);

// 🌌 SLOW PARTICLE BACKGROUND
const ParticleBackground = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let particles = [];
        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                // VERY SLOW SPEED
                this.speedX = (Math.random() - 0.5) * 0.2; 
                this.speedY = (Math.random() - 0.5) * 0.2;
                this.color = `hsla(${Math.random() * 360}, 50%, 50%, 0.3)`;
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

// 🚨 LICENSE BAR
const LicenseBar = () => {
    const warnings = window.APP_CONFIG.legal.warnings;
    const [index, setIndex] = useState(0);
    useEffect(() => {
        const interval = setInterval(() => setIndex(prev => (prev+1)%warnings.length), 3000);
        return () => clearInterval(interval);
    }, []);
    return (
        <div className="license-bar">
            <div className="license-text">{warnings[index]}</div>
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
            document.getElementById('theme-layer').appendChild(el);
            setTimeout(() => el.remove(), 4000);
        };
        const interval = setInterval(createParticles, 200);
        return () => clearInterval(interval);
    }, [person]);
    return (
        <div className={`theme-modal theme-${person.theme}`}>
            <div id="theme-layer" style={{position:'absolute',width:'100%',height:'100%',overflow:'hidden'}}></div>
            <div className="theme-content">
                <h1 className="theme-name" style={{color:person.theme==='sakura'?'#FFB7C5':person.theme==='fire'?'#FF4500':'#800000'}}>{person.name}</h1>
                <h3 className="theme-role">{person.role}</h3>
                <p style={{color:'#ddd',fontSize:'0.9rem'}}>{person.desc}</p>
                <button onClick={onClose} style={{marginTop:'20px',padding:'10px 30px',background:'transparent',border:'1px solid #fff',color:'#fff',cursor:'pointer'}}>CLOSE</button>
            </div>
        </div>
    );
};

// 💰 PAYWALL
const Paywall = ({ onUnlock, t }) => {
    const [mode, setMode] = useState('vip');
    const [code, setCode] = useState('');
    return (
        <div className="paywall-modal">
            <div className="gold-card">
                <div className="pay-tabs">
                    <div className={`pay-tab ${mode==='vip'?'active':''}`} onClick={()=>setMode('vip')}>{t.unlock}</div>
                    <div className={`pay-tab ${mode==='card'?'active':''}`} onClick={()=>setMode('card')}>{t.card_pay}</div>
                </div>
                <h2 style={{color:'#FFD700',fontFamily:'Cinzel'}}>{t.paywall_title}</h2>
                <div className="price-tag">$4.99</div>
                <p style={{color:'#aaa',marginBottom:'20px'}}>{t.paywall_desc}</p>
                {mode === 'vip' ? (
                    <div>
                        <input className="cc-input" style={{width:'100%',textAlign:'center',marginBottom:'15px',color:'#FFD700',border:'1px solid #FFD700',background:'#000',padding:'10px'}} placeholder="ENTER VIP KEY" value={code} onChange={e=>setCode(e.target.value.toUpperCase())} />
                        <button className="start-btn" style={{width:'100%',background:'#FFD700'}} onClick={()=>onUnlock(code)}>{t.unlock}</button>
                    </div>
                ) : (
                    <div><button className="start-btn" style={{width:'100%'}} onClick={()=>alert("ERROR: BANK UNREACHABLE")}>PAY NOW</button></div>
                )}
            </div>
        </div>
    );
};

// --- COMPONENT: HOME PAGE ---
const HomePage = ({ onStart, onViewCredits, t, setLang, currentLang }) => {
    return (
        <div className="home-layout fade-in">
            {/* Cover Art */}
            <div className="cover-art-container">
                <img src={window.APP_CONFIG.assets.cover} className="cover-art-gif" alt="Cover" />
            </div>

            <h1 className="hero-title">
                {t.title_start}<br />
                <span className="title-red">{t.title_end}</span>
            </h1>

            {/* Circular Epic Button */}
            <div className="start-btn-circle" onClick={onStart}>{t.start}</div>
            <div className="hunt-text">{t.subtitle}</div>

            {/* Special Recognition - Round Row */}
            <div className="credits-section">
                <div className="section-header">{t.special}</div>
                <div className="credits-row">
                    {window.APP_CONFIG.credits.map((c, i) => (
                        <div key={i} className="round-credit-btn" onClick={() => onViewCredits(c)}>
                            {c.name}
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
            <h2 style={{color:'var(--accent-cyan)',fontFamily:'Orbitron',marginBottom:'20px',textAlign:'center'}}>{t.chapters}</h2>
            {window.APP_CONFIG.chapters.map((ch) => (
                <div key={ch.id} className={`ch-card ${ch.locked?'locked':''}`} onClick={()=>!ch.locked && onRead(ch.id)}>
                    <div className="ch-info">
                        <h3>{ch.id}. {ch.title}</h3>
                        <div style={{color:'#666',fontSize:'0.8rem'}}>{ch.locked ? t.locked : ch.date}</div>
                    </div>
                    <div className="ch-stats">
                        {!ch.locked && <><div className="stat-item"><span className="live-dot" style={{background:'red',width:6,height:6,borderRadius:50,display:'inline-block'}}></span> 0 {t.live}</div><div className="stat-item">0 {t.comments}</div></>}
                        {ch.locked && <i className="fas fa-lock"></i>}
                    </div>
                </div>
            ))}
            <div className="construction-section">
                <h3>{t.coming_soon}</h3>
                <p>{t.construction_desc}</p>
            </div>
        </div>
    );
};

// --- COMPONENT: READER ---
const ReaderPage = ({ t, chapterId, onBack }) => {
    const chapter = window.APP_CONFIG.chapters.find(c => c.id === chapterId);
    return (
        <div className="reader-container fade-in">
            {chapter.pages.map((img, i) => (
                <img key={i} src={img} className="reader-img" loading="lazy" />
            ))}
            <div className="reader-toolbar">
                <i className="fas fa-home reader-icon" onClick={onBack}></i>
                <i className="fas fa-arrow-left reader-icon" onClick={onBack}></i>
                <i className="fas fa-heart reader-icon" onClick={()=>alert('Liked!')}></i>
                <i className="fas fa-comment reader-icon" onClick={()=>alert('Comments coming soon')}></i>
            </div>
        </div>
    );
};

// --- 📱 MAIN APP ---
const App = () => {
    const { t, lang, setLang } = useTranslation();
    const [view, setView] = useState('intro');
    const [activePerson, setActivePerson] = useState(null);
    const [showPaywall, setShowPaywall] = useState(false);
    const [activeChapter, setActiveChapter] = useState(1);

    useEffect(() => { if(view==='intro') setTimeout(()=>setView('home'),5000); }, [view]);

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
            {view !== 'reader' && <ParticleBackground />}
            {view !== 'reader' && <LicenseBar />}
            
            {view==='intro' && (
                <div className="intro-wrapper">
                    <div className="top-loader-bar" style={{width:'100%',transition:'width 5s linear'}}></div>
                    <h1 className="magical-title">{"BENEATH THE LIGHT".split("").map((c,i)=><span key={i} className="magical-char" style={{animationDelay:`${i*0.1}s`}}>{c}</span>)}</h1>
                </div>
            )}

            {view==='home' && <HomePage onStart={handleStart} onViewCredits={setActivePerson} t={t} setLang={setLang} currentLang={lang} />}
            {view==='manga' && <MangaPage t={t} onRead={(id)=>{setActiveChapter(id); setView('reader');}} />}
            {view==='reader' && <ReaderPage t={t} chapterId={activeChapter} onBack={()=>setView('manga')} />}

            {view!=='intro' && (
                <div className="lang-fab">
                    <div className="lang-fab-trigger">{lang}</div>
                    <div className="lang-fab-menu">{['EN','SI','JP','FR'].map(l=><div key={l} className="lang-fab-item" onClick={()=>setLang(l)}>{l}</div>)}</div>
                </div>
            )}
            
            {activePerson && <ThemeModal person={activePerson} onClose={()=>setActivePerson(null)} />}
            {showPaywall && <Paywall onUnlock={unlockVIP} t={t} />}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(LanguageProvider, null, React.createElement(App)));
