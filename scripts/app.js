
const { useState, useEffect, useRef, useContext, createContext } = React;

// 🌍 TRANSLATIONS (English Only now, logic kept simple)
const t = window.APP_CONFIG.translations.EN;

// 🌌 SLOW PARTICLE BACKGROUND (COOL COLORS ONLY)
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
                this.speedX = (Math.random() - 0.5) * 0.15; 
                this.speedY = (Math.random() - 0.5) * 0.15;
                // BLUE / PURPLE / CYAN ONLY
                const hue = Math.random() > 0.5 ? 200 + Math.random() * 60 : 260 + Math.random() * 60; 
                this.color = `hsla(${hue}, 70%, 50%, 0.3)`;
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
                        <button className="start-btn-soft" style={{width:'100%',margin:'0',background:'#FFD700',color:'#000',fontSize:'1rem'}} onClick={()=>onUnlock(code)}>{t.unlock}</button>
                    </div>
                ) : (
                    <div><button className="start-btn-soft" style={{width:'100%',margin:'0',fontSize:'1rem'}} onClick={()=>alert("ERROR: BANK UNREACHABLE")}>PAY NOW</button></div>
                )}
            </div>
        </div>
    );
};

// --- COMPONENT: HOME PAGE ---
const HomePage = ({ onStart, onViewCredits }) => {
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

            {/* Soft Edge Epic Button */}
            <div className="start-btn-soft" onClick={onStart}>{t.start}</div>
            <div className="hunt-text">{t.subtitle}</div>

            {/* Special Recognition - Round Row */}
            <div className="credits-section">
                <div className="section-header" style={{fontSize:'0.8rem', color:'#666', letterSpacing:'2px'}}>{t.special}</div>
                <div className="credits-row">
                    {window.APP_CONFIG.credits.map((c, i) => (
                        <div key={i} className="soft-credit-btn" onClick={() => onViewCredits(c)}>
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

// --- COMPONENT: READER ---
const ReaderPage = ({ chapterId, onBack }) => {
    const chapter = window.APP_CONFIG.chapters.find(c => c.id === chapterId);
    return (
        <div className="reader-container fade-in">
            {/* FIXED TOP TOOLBAR */}
            <div className="reader-toolbar">
                <i className="fas fa-home reader-icon" onClick={onBack}></i>
                <span style={{color:'#fff',fontSize:'0.8rem',fontFamily:'Orbitron'}}>CH {chapterId}</span>
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

            {view==='home' && <HomePage onStart={handleStart} onViewCredits={setActivePerson} />}
            {view==='manga' && <MangaPage onRead={(id)=>{setActiveChapter(id); setView('reader');}} />}
            {view==='reader' && <ReaderPage chapterId={activeChapter} onBack={()=>setView('manga')} />}

            {activePerson && <ThemeModal person={activePerson} onClose={()=>setActivePerson(null)} />}
            {showPaywall && <Paywall onUnlock={unlockVIP} />}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
