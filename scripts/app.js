
const { useState, useEffect, useRef } = React;

// --- 🪄 MAGICAL INTRO COMPONENT ---
const MagicalIntro = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        // Phase 1: Rings appear
        setTimeout(() => setPhase(1), 500);
        // Phase 2: Text Reveals
        setTimeout(() => setPhase(2), 1500);
        // Phase 3: Loading Counter
        setTimeout(() => setPhase(3), 2500);

        // Simulated Loading Logic
        let p = 0;
        const interval = setInterval(() => {
            p += 1;
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                setTimeout(() => setPhase(4), 500); // Ascension/Fade
                setTimeout(onComplete, 2000); // Unmount
            }
        }, 50);
        
        return () => clearInterval(interval);
    }, []);

    // Split title logic for "One-by-One" effect
    const title = "Beneath The Light of a Dying Sky";
    const letters = title.split("").map((char, i) => (
        <span key={i} className="magical-char" style={{ animationDelay: `${i * 0.05}s` }}>
            {char === " " ? "\u00A0" : char}
        </span>
    ));

    return (
        <div className={`intro-wrapper ${phase === 4 ? 'fade-out' : ''}`}>
            {/* Top Progress Bar */}
            <div className="top-loader-bar" style={{ width: `${progress}%` }}></div>
            
            {/* Background Rings */}
            <div className={`arcane-ring ${phase >= 1 ? 'visible' : ''}`}></div>
            
            {/* Title */}
            <div className={`magical-title ${phase >= 2 ? 'visible' : ''}`}>
                {phase >= 2 && letters}
            </div>
            
            {/* Counter */}
            <div className={`loader-percent ${phase >= 3 ? 'visible' : ''}`}>
                {progress}%
            </div>
        </div>
    );
};

// --- 🏠 HOME PAGE ---
const HomePage = ({ onEnter }) => {
    const config = window.APP_CONFIG || { assets: { cover: '' }, credits: [] };

    return (
        <div className="home-layout fade-in">
            {/* Hero Cover */}
            <div className="hero-cover-container">
                <img 
                    src={config.assets.cover} 
                    className="hero-cover" 
                    alt="Cover Art"
                    onError={(e) => {
                        e.target.style.display = 'none'; 
                    }} 
                />
            </div>
            
            <h1 className="hero-title">Beneath The Light<br/>
                <span style={{fontSize:'1rem', color:'#00F6FF', letterSpacing:'5px'}}>THE ARCHIVE</span>
            </h1>
            
            <button className="start-btn" onClick={onEnter}>
                <span>START READING</span>
            </button>

            {/* Special Thanks Section */}
            <div style={{marginTop: '3rem', width: '100%', maxWidth: '600px'}}>
                <h3 style={{fontFamily:'Orbitron', fontSize:'0.7rem', color:'#555', letterSpacing:'2px', marginBottom:'15px'}}>SPECIAL RECOGNITION</h3>
                <div className="credits-grid">
                    {config.credits.map((c, i) => (
                        <div key={i} className="credit-pill" onClick={() => alert(`${c.name}\n${c.role}\n"${c.desc}"`)}>
                            {c.name} {c.emoji}
                        </div>
                    ))}
                </div>
                <p style={{fontSize:'0.6rem', color:'#444', marginTop:'10px'}}>Click a name to reveal details</p>
            </div>
        </div>
    );
};

// --- 📜 MANGA LIST ---
const MangaPage = ({ onRead }) => {
    const config = window.APP_CONFIG;
    
    return (
        <div className="chapter-container fade-in">
            <h2 style={{fontFamily:'Cinzel', textAlign:'center', marginBottom:'30px', color:'#FFD700', fontSize:'2rem'}}>CHAPTERS</h2>
            
            {config.chapters.map((ch, i) => (
                <div 
                    key={ch.id} 
                    className={`chapter-row ${ch.locked ? 'locked' : ''}`}
                    onClick={() => !ch.locked && onRead(ch.id)}
                    style={{ animationDelay: `${i * 0.1}s` }}
                >
                    <div className="ch-icon">{ch.id}</div>
                    <div style={{flex:1}}>
                        <h3 style={{fontFamily:'Orbitron', fontSize:'1rem', color:'#fff', marginBottom:'5px'}}>Chapter {ch.id}</h3>
                        <p style={{fontSize:'0.8rem', color:'#888'}}>{ch.title}</p>
                    </div>
                    <div style={{fontSize:'1.2rem', color: ch.locked ? '#555' : '#00F6FF'}}>
                        {ch.locked ? <i className="fas fa-lock"></i> : <i className="fas fa-chevron-right"></i>}
                    </div>
                </div>
            ))}

            {/* Construction Zone */}
            <div className="construction-zone">
                <div className="hazard-stripes"></div>
                <div className="construction-content">
                    <div className="hazard-icon">🚧</div>
                    <h3>WORK IN PROGRESS</h3>
                    <p>More chapters coming soon from the archives.</p>
                </div>
                <div className="hazard-stripes"></div>
            </div>
        </div>
    );
};

// --- 📖 READER PAGE ---
const ReaderPage = ({ chapterId, onBack }) => {
    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState([]);
    const [input, setInput] = useState('');
    const [navVisible, setNavVisible] = useState(true);
    
    const config = window.APP_CONFIG;
    const chapter = config.chapters.find(c => c.id === chapterId);

    useEffect(() => {
        // Load interactions from localStorage
        const savedLikes = localStorage.getItem(`likes-${chapterId}`);
        if(savedLikes) setLikes(parseInt(savedLikes));
        const savedComm = localStorage.getItem(`comments-${chapterId}`);
        if(savedComm) setComments(JSON.parse(savedComm));
        
        // Restore scroll position
        const savedScroll = localStorage.getItem(`scroll-${chapterId}`);
        if(savedScroll) window.scrollTo(0, parseInt(savedScroll));

        const handleScroll = () => localStorage.setItem(`scroll-${chapterId}`, window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [chapterId]);

    const handleLike = () => {
        const n = likes + 1;
        setLikes(n);
        localStorage.setItem(`likes-${chapterId}`, n);
    };

    const handlePost = () => {
        if(!input.trim()) return;
        const newC = [...comments, { text: input, date: new Date().toLocaleDateString() }];
        setComments(newC);
        localStorage.setItem(`comments-${chapterId}`, JSON.stringify(newC));
        setInput('');
    };

    if(!chapter) return <div style={{padding:'20px', color:'white'}}>Loading Chapter...</div>;

    return (
        <div className="reader-wrapper">
            {/* Top Nav Overlay */}
            <div className={`reader-nav-overlay ${!navVisible ? 'hidden' : ''}`}>
                <button onClick={onBack} className="ctrl-btn"><i className="fas fa-arrow-left"></i> BACK</button>
                <span style={{fontFamily:'Orbitron', color:'#FFD700'}}>Ch. {chapterId}</span>
            </div>

            {/* Main Content Area */}
            <div 
                className="reader-content" 
                onClick={() => setNavVisible(!navVisible)}
            >
                {chapter.pages.map((src, i) => (
                    src.endsWith('.mp4') ? 
                    <video key={i} src={src} autoPlay loop muted playsInline className="reader-page-img fade-in" /> :
                    <img key={i} src={src} className="reader-page-img fade-in" alt={`Page ${i+1}`} loading="lazy" />
                ))}
            </div>

            {/* Security Watermark */}
            <div className="moving-watermark">
                LICENSE: {config.legal.license} <br/>
                IP LOGGED
            </div>

            {/* Bottom Controls */}
            <div className={`reader-controls ${!navVisible ? 'hidden' : ''}`}>
                <button className="ctrl-btn" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>
                    <i className="fas fa-arrow-up"></i>
                </button>
                <button className="ctrl-btn" onClick={handleLike}>
                    <i className="fas fa-heart" style={{color:'red'}}></i> {likes}
                </button>
            </div>

            {/* Discussion Board */}
            <div className="discussion-area">
                <h3 style={{marginBottom:'15px', color:'#FFD700', fontFamily:'Orbitron'}}>THEORY BOARD</h3>
                <div style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
                    <input 
                        value={input} 
                        onChange={e=>setInput(e.target.value)} 
                        placeholder="Share your theory..." 
                        style={{flex:1, padding:'12px', background:'#222', border:'1px solid #444', color:'#fff', borderRadius:'5px'}}
                    />
                    <button onClick={handlePost} style={{background:'#00F6FF', border:'none', padding:'0 20px', borderRadius:'5px', fontWeight:'bold'}}>POST</button>
                </div>
                {comments.length === 0 && <p style={{color:'#666', fontStyle:'italic'}}>No theories yet. Be the first.</p>}
                {comments.map((c, i) => (
                    <div key={i} className="comment-box">
                        <p>{c.text}</p>
                        <small style={{color:'#666', display:'block', marginTop:'5px'}}>{c.date}</small>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- 📱 MAIN APP ROOT ---
const App = () => {
    const [view, setView] = useState('intro'); // intro, home, manga, reader
    const [activeChapter, setActiveChapter] = useState(1);
    const [showPaywall, setShowPaywall] = useState(false);
    const [vipCodeInput, setVipCodeInput] = useState('');

    // Safety check for config
    if (!window.APP_CONFIG) {
        return (
            <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100vh', color:'red'}}>
                FATAL ERROR: Configuration file (config.js) not loaded.
            </div>
        );
    }

    const checkVIP = () => {
        const savedCode = localStorage.getItem('vipAccessCode');
        if (savedCode && window.APP_CONFIG.vipCodes.includes(savedCode)) {
            setView('manga');
        } else {
            setShowPaywall(true);
        }
    };

    const handleUnlock = () => {
        if(window.APP_CONFIG.vipCodes.includes(vipCodeInput.toUpperCase())) {
            localStorage.setItem('vipAccessCode', vipCodeInput.toUpperCase());
            setShowPaywall(false);
            setView('manga');
        } else {
            alert("ACCESS DENIED. Invalid Code.");
        }
    };

    return (
        <div className="app-shell">
            {/* 1. Intro Overlay (Only render if view is intro) */}
            {view === 'intro' && (
                <MagicalIntro onComplete={() => setView('home')} />
            )}

            {/* 2. Top Bar (Global for app pages) */}
            {view !== 'intro' && (
                <div className="top-bar">
                    <span className="license-text">{window.APP_CONFIG.legal.license}</span>
                </div>
            )}

            {/* 3. Main Views (Conditional Rendering) */}
            {view === 'home' && <HomePage onEnter={checkVIP} />}
            {view === 'manga' && <MangaPage onRead={(id) => { setActiveChapter(id); setView('reader'); }} />}
            {view === 'reader' && <ReaderPage chapterId={activeChapter} onBack={() => setView('manga')} />}

            {/* 4. Paywall Modal */}
            {showPaywall && (
                <div className="modal-backdrop">
                    <div className="modal-box">
                        <h2 style={{color:'#FFD700', fontFamily:'Cinzel'}}>VIP ACCESS REQUIRED</h2>
                        <h1 style={{fontSize:'3.5rem', margin:'20px 0', color:'#fff', textShadow:'0 0 20px #FFD700'}}>$4.99</h1>
                        <p style={{color:'#aaa', marginBottom:'20px'}}>Unlimited Access to The Archive</p>
                        
                        <div style={{background:'#222', padding:'15px', borderRadius:'10px', marginBottom:'20px'}}>
                            <p style={{color:'#fff', marginBottom:'10px', fontSize:'0.8rem'}}>ENTER PASSKEY</p>
                            <input 
                                value={vipCodeInput}
                                onChange={(e) => setVipCodeInput(e.target.value)}
                                placeholder="CODE" 
                                style={{padding:'10px', width:'100%', textAlign:'center', fontSize:'1.2rem', letterSpacing:'3px', background:'#111', border:'1px solid #444', color:'#fff'}} 
                            />
                        </div>
                        
                        <button onClick={handleUnlock} style={{width:'100%', padding:'15px', background:'#FFD700', border:'none', borderRadius:'5px', fontWeight:'bold', fontSize:'1rem', cursor:'pointer'}}>UNLOCK ARCHIVE</button>
                        <button onClick={() => setShowPaywall(false)} style={{marginTop:'15px', background:'transparent', color:'#888', border:'none', cursor:'pointer'}}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
