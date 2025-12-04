
const { useState, useEffect, useRef } = React;

// --- 🪄 MAGICAL INTRO COMPONENT ---
const MagicalIntro = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState(0);

    useEffect(() => {
        // Timeline
        setTimeout(() => setPhase(1), 500);  // Rings
        setTimeout(() => setPhase(2), 1500); // Text
        setTimeout(() => setPhase(3), 2500); // Load

        // Loading Counter
        let p = 0;
        const interval = setInterval(() => {
            p += 1;
            setProgress(p);
            if (p >= 100) {
                clearInterval(interval);
                setTimeout(() => setPhase(4), 500); // Ascension
                setTimeout(onComplete, 2000); // Unmount
            }
        }, 50);
        
        return () => clearInterval(interval);
    }, []);

    // Split title logic
    const title = "Beneath The Light of a Dying Sky";
    const letters = title.split("").map((char, i) => (
        <span key={i} className="magical-char" style={{ animationDelay: `${i * 0.05}s` }}>
            {char === " " ? "\u00A0" : char}
        </span>
    ));

    return (
        <div className={`intro-wrapper ${phase === 4 ? 'fade-out' : ''}`}>
            <div className="top-loader-bar" style={{ width: `${progress}%` }}></div>
            <div className={`arcane-ring ${phase >= 1 ? 'visible' : ''}`}></div>
            <div className={`magical-title ${phase >= 2 ? 'visible' : ''}`}>{phase >= 2 && letters}</div>
            <div className={`loader-percent ${phase >= 3 ? 'visible' : ''}`}>{progress}%</div>
        </div>
    );
};

// --- 🏠 HOME PAGE ---
const HomePage = ({ onEnter }) => {
    const config = window.APP_CONFIG || { assets: { cover: '' }, credits: [] };

    return (
        <div className="home-layout fade-in">
            {/* Cover Image with Error Fallback */}
            <div className="hero-cover-container">
                <img 
                    src={config.assets.cover} 
                    className="hero-cover" 
                    alt="Cover Art"
                    onError={(e) => {
                        e.target.style.display = 'none'; 
                        e.target.parentNode.innerText = '⚠️ Image Not Found';
                        e.target.parentNode.style.color = 'red';
                        e.target.parentNode.style.border = '1px dashed red';
                    }} 
                />
            </div>
            
            <h1 className="hero-title">Beneath The Light<br/>
                <span style={{fontSize:'1rem', color:'#00F6FF', letterSpacing:'5px'}}>THE ARCHIVE</span>
            </h1>
            
            <button className="start-btn" onClick={onEnter}>
                <span>START READING</span>
            </button>

            {/* Special Thanks */}
            <div style={{marginTop: '3rem'}}>
                <h3 style={{fontFamily:'Orbitron', fontSize:'0.7rem', color:'#555', letterSpacing:'2px'}}>SPECIAL RECOGNITION</h3>
                <div className="credits-grid">
                    {config.credits.map((c, i) => (
                        <div key={i} className="credit-pill" onClick={() => alert(`${c.name}\n${c.role}\n"${c.desc}"`)}>
                            {c.name} {c.emoji}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- 📜 MANGA LIST ---
const MangaPage = ({ onRead }) => {
    const config = window.APP_CONFIG;
    
    return (
        <div className="chapter-container fade-in">
            <h2 style={{fontFamily:'Cinzel', textAlign:'center', marginBottom:'30px', color:'#FFD700'}}>CHAPTERS</h2>
            
            {config.chapters.map((ch, i) => (
                <div 
                    key={ch.id} 
                    className={`chapter-row ${ch.locked ? 'locked' : ''}`}
                    onClick={() => !ch.locked && onRead(ch.id)}
                    style={{ animationDelay: `${i * 0.1}s` }}
                >
                    <div className="ch-icon">{ch.id}</div>
                    <div style={{flex:1}}>
                        <h3 style={{fontFamily:'Orbitron', fontSize:'1rem', color:'#fff'}}>Chapter {ch.id}</h3>
                        <p style={{fontSize:'0.8rem', color:'#888'}}>{ch.title}</p>
                    </div>
                    <div>{ch.locked ? '🔒' : '➔'}</div>
                </div>
            ))}

            <div className="construction-zone">
                <div className="hazard-stripes"></div>
                <div className="construction-content">
                    <h3>WORK IN PROGRESS</h3>
                    <p>More chapters coming soon.</p>
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
        // Load interactions
        const savedLikes = localStorage.getItem(`likes-${chapterId}`);
        if(savedLikes) setLikes(parseInt(savedLikes));
        const savedComm = localStorage.getItem(`comments-${chapterId}`);
        if(savedComm) setComments(JSON.parse(savedComm));
        
        // Restore scroll
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

    if(!chapter) return <div>Loading...</div>;

    return (
        <div className="reader-wrapper">
            {/* Top Nav */}
            <div className={`reader-nav-overlay ${!navVisible ? 'hidden' : ''}`}>
                <button onClick={onBack} className="ctrl-btn">← BACK</button>
                <span style={{fontFamily:'Orbitron'}}>Ch. {chapterId}</span>
            </div>

            {/* Content */}
            <div 
                className="reader-content" 
                onClick={() => setNavVisible(!navVisible)}
                style={{paddingTop:'60px', paddingBottom:'80px', minHeight:'100vh'}}
            >
                {chapter.pages.map((src, i) => (
                    src.endsWith('.mp4') ? 
                    <video key={i} src={src} autoPlay loop muted playsInline className="reader-page-img fade-in" /> :
                    <img key={i} src={src} className="reader-page-img fade-in" alt="Page" />
                ))}
            </div>

            <div className="moving-watermark">LICENSE DETECTED</div>

            {/* Controls */}
            <div className={`reader-controls ${!navVisible ? 'hidden' : ''}`}>
                <button className="ctrl-btn" onClick={() => window.scrollTo({top:0, behavior:'smooth'})}>▲</button>
                <button className="ctrl-btn" onClick={handleLike}>❤️ {likes}</button>
            </div>

            {/* Comments */}
            <div className="discussion-area">
                <h3 style={{marginBottom:'10px', color:'#FFD700'}}>THEORY BOARD</h3>
                <div style={{display:'flex', gap:'10px', marginBottom:'20px'}}>
                    <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Type here..." style={{flex:1, padding:'10px', background:'#222', border:'1px solid #444', color:'#fff'}}/>
                    <button onClick={handlePost} style={{background:'#00F6FF', border:'none', padding:'0 15px'}}>POST</button>
                </div>
                {comments.map((c, i) => (
                    <div key={i} className="comment-box"><p>{c.text}</p><small style={{color:'#666'}}>{c.date}</small></div>
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

    // If config missing, show error
    if (!window.APP_CONFIG) return <div style={{color:'red', padding:'20px'}}>FATAL: Config not found.</div>;

    const checkVIP = () => {
        const code = localStorage.getItem('vipCode');
        if (code && window.APP_CONFIG.vipCodes.includes(code)) {
            setView('manga');
        } else {
            setShowPaywall(true);
        }
    };

    const unlock = () => {
        const val = document.getElementById('vipInput').value.toUpperCase();
        if(window.APP_CONFIG.vipCodes.includes(val)) {
            localStorage.setItem('vipCode', val);
            setShowPaywall(false);
            setView('manga');
        } else {
            alert("DENIED");
        }
    };

    // --- RENDER LOGIC: Conditionally render components to avoid Z-index fighting ---
    return (
        <div className="app-shell">
            {/* Intro Overlay - Only Render if view is intro */}
            {view === 'intro' && <MagicalIntro onComplete={() => setView('home')} />}

            {/* Top Bar - Only on Main Pages */}
            {view !== 'intro' && (
                <div className="top-bar">
                    <span className="license-text">{window.APP_CONFIG.legal.license}</span>
                </div>
            )}

            {/* Main Views - Use Conditional Rendering (Only 1 exists at a time) */}
            {view === 'home' && (
                <div className="page-view active">
                    <HomePage onEnter={checkVIP} />
                </div>
            )}

            {view === 'manga' && (
                <div className="page-view active">
                    <MangaPage onRead={(id) => { setActiveChapter(id); setView('reader'); }} />
                </div>
            )}

            {view === 'reader' && (
                <div className="page-view active">
                    <ReaderPage chapterId={activeChapter} onBack={() => setView('manga')} />
                </div>
            )}

            {/* Paywall Modal */}
            {showPaywall && (
                <div className="modal-backdrop">
                    <div className="modal-box">
                        <h2 style={{color:'#FFD700'}}>VIP ACCESS</h2>
                        <h1 style={{fontSize:'3rem', margin:'10px 0'}}>$4.99</h1>
                        <input id="vipInput" placeholder="VIP CODE" style={{padding:'10px', width:'80%', textAlign:'center'}} />
                        <br/>
                        <button onClick={unlock} style={{marginTop:'15px', padding:'10px 30px', background:'#FFD700', border:'none', fontWeight:'bold'}}>UNLOCK</button>
                        <button onClick={() => setShowPaywall(false)} style={{display:'block', margin:'10px auto', background:'transparent', color:'#888', border:'none'}}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
