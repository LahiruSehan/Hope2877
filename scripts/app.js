const { useState, useEffect, useRef } = React;

// --- 🌌 CINEMATIC INTRO COMPONENT ---
const CinematicIntro = ({ onComplete }) => {
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState(0); // 0:Void, 1:Fog, 2:Title, 3:Load, 4:Ascend

    useEffect(() => {
        // Timeline Sequence
        setTimeout(() => setPhase(1), 1000); // Fog in
        setTimeout(() => setPhase(2), 3000); // Title reveal
        
        setTimeout(() => {
            setPhase(3); // Start Loading
            // Count 1 -> 100
            let p = 0;
            const interval = setInterval(() => {
                p += 1;
                if (p > 100) p = 100;
                setProgress(p);
                if (p === 100) {
                    clearInterval(interval);
                    setTimeout(() => setPhase(4), 500); // Ascend
                    setTimeout(onComplete, 2500); // Done
                }
            }, 50); // Speed of loading
        }, 5000);

    }, []);

    // Generate static particles
    const particles = Array.from({ length: 30 }).map((_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 5 + Math.random() * 10
    }));

    return (
        <div className={`intro-container ${phase === 4 ? 'ascend' : ''}`}>
            <div className="film-grain"></div>
            
            {/* Fog Layers */}
            <div className="stranger-fog" style={{ opacity: phase >= 1 ? 1 : 0 }}></div>
            <div className="stranger-fog layer2" style={{ opacity: phase >= 1 ? 0.8 : 0 }}></div>

            {/* Particles */}
            {phase >= 1 && particles.map((p, i) => (
                <div 
                    key={i}
                    className="intro-particle"
                    style={{
                        left: `${p.left}%`,
                        animationDelay: `${p.delay}s`,
                        animationDuration: `${p.duration}s`
                    }}
                />
            ))}

            {/* Main Title */}
            <div className={`intro-title-wrapper ${phase >= 2 ? 'visible' : ''}`}>
                <h1 className="stranger-title">Beneath The Light</h1>
                <h2 className="stranger-subtitle">of a Dying Sky</h2>
            </div>

            {/* Loading Bar */}
            <div className="intro-loader-container" style={{ opacity: phase >= 3 ? 1 : 0, transition: 'opacity 1s' }}>
                <div className="loading-number">{progress}%</div>
                <div className="loading-bar-wrapper">
                    <div className="loading-bar-fill" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
        </div>
    );
};

// --- 🏠 HOME PAGE COMPONENT ---
const HomePage = ({ onShowPaywall, config }) => {
    const [themes, setThemes] = useState({ show: false, person: null });

    const openTheme = (person) => {
        setThemes({ show: true, person });
    };

    return (
        <div className="home-page fade-in">
            <img src={config.assets.cover} className="cover-art" alt="Cover" />
            <h1 className="hero-title">Beneath the Light<br/><span style={{fontSize:'1rem', color:'#00F6FF', letterSpacing:'5px'}}>OF A DYING SKY</span></h1>
            <p style={{color:'#888', marginTop:'10px'}}>Sehan Karunarathne</p>

            <button className="hero-btn" onClick={onShowPaywall}>START READING</button>

            <div style={{marginTop: '3rem', maxWidth:'600px', lineHeight:'1.6', color:'#ccc'}}>
                <p><i>"The sun never sets, yet darkness approaches."</i></p>
            </div>

            {/* Special Thanks */}
            <div style={{marginTop: '3rem'}}>
                <h3 style={{fontFamily:'Orbitron', fontSize:'0.8rem', color:'#555'}}>SPECIAL THANKS</h3>
                <div style={{display:'flex', gap:'10px', justifyContent:'center', marginTop:'10px', flexWrap:'wrap'}}>
                    {config.credits.map((c, i) => (
                        <div key={i} onClick={() => openTheme(c)} className="chapter-card" style={{margin:'5px', padding:'5px 15px', fontSize:'0.8rem', minWidth:'auto', display:'inline-block'}}>
                            {c.name} {c.emoji}
                            <div style={{fontSize:'0.6rem', color:'#666'}}>Click for info</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Theme Modal */}
            {themes.show && themes.person && (
                <div className={`modal-overlay theme-${themes.person.theme}`} onClick={() => setThemes({show:false, person:null})}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2 style={{color: '#fff', fontSize:'2rem'}}>{themes.person.name}</h2>
                        <h3 style={{color: '#888', fontFamily:'Orbitron'}}>{themes.person.role}</h3>
                        <p style={{marginTop:'20px', fontSize:'1.2rem'}}>"{themes.person.desc}"</p>
                        <div style={{marginTop:'30px', fontSize:'3rem'}}>{themes.person.emoji}</div>
                        <button style={{marginTop:'20px', background:'transparent', border:'1px solid #fff', color:'#fff', padding:'5px 15px'}} onClick={() => setThemes({show:false, person:null})}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- 📜 MANGA LIST COMPONENT ---
const MangaPage = ({ onRead, config }) => {
    return (
        <div className="manga-list-page" style={{paddingBottom:'50px'}}>
            <div style={{textAlign:'center', padding:'20px'}}>
                <h2 style={{fontFamily:'Aref Ruqaa', color:'#FFD700'}}>Chapters</h2>
            </div>
            
            {config.chapters.map((chapter) => (
                <div 
                    key={chapter.id} 
                    className={`chapter-card ${chapter.locked ? 'locked' : ''}`}
                    onClick={() => !chapter.locked && onRead(chapter.id)}
                >
                    <div className="chapter-num">{chapter.id}</div>
                    <div style={{flex:1}}>
                        <h3 style={{fontFamily:'Orbitron', fontSize:'1rem', color:'#fff'}}>{chapter.title}</h3>
                        <p style={{fontSize:'0.8rem', color:'#888'}}>{chapter.date}</p>
                    </div>
                    <div>{chapter.locked ? '🔒' : '➔'}</div>
                </div>
            ))}

            {/* Construction */}
            <div className="construction-zone">
                <div className="hazard-stripes"></div>
                <div style={{padding:'20px'}}>
                    <h3>🚧 WORK IN PROGRESS</h3>
                    <p style={{fontSize:'0.8rem', color:'#888'}}>Artists are sketching the next arc.</p>
                </div>
                <div className="hazard-stripes"></div>
            </div>
        </div>
    );
};

// --- 📖 READER COMPONENT ---
const ReaderPage = ({ chapterId, onBack, config }) => {
    const chapter = config.chapters.find((c) => c.id === chapterId);
    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState([]);
    const [input, setInput] = useState('');
    const [navVisible, setNavVisible] = useState(true);

    // Load Likes/Comments from LocalStorage
    useEffect(() => {
        const savedLikes = localStorage.getItem(`likes-ch${chapterId}`);
        if(savedLikes) setLikes(parseInt(savedLikes));
        
        const savedComments = localStorage.getItem(`comments-ch${chapterId}`);
        if(savedComments) setComments(JSON.parse(savedComments));

        // Moving Watermark Logic
        const interval = setInterval(() => {
            const el = document.getElementById('watermark');
            if(el) {
                el.style.top = Math.random() * 80 + 10 + '%';
                el.style.left = Math.random() * 80 + 10 + '%';
            }
        }, 1500);

        return () => clearInterval(interval);
    }, [chapterId]);

    const handleLike = () => {
        const newLikes = likes + 1;
        setLikes(newLikes);
        localStorage.setItem(`likes-ch${chapterId}`, newLikes.toString());
    };

    const handleComment = () => {
        if(!input.trim()) return;
        const newComments = [...comments, { text: input, date: new Date().toLocaleDateString() }];
        setComments(newComments);
        localStorage.setItem(`comments-ch${chapterId}`, JSON.stringify(newComments));
        setInput('');
    };

    if (!chapter) return <div>Error loading chapter.</div>;

    return (
        <div className="reader-view" onClick={() => setNavVisible(!navVisible)}>
            {/* Nav */}
            <div style={{
                position:'fixed', top: navVisible ? '50px' : '-100px', width:'100%', 
                zIndex:100, display:'flex', justifyContent:'space-between', 
                padding:'10px 20px', background:'rgba(0,0,0,0.8)', transition:'top 0.3s'
            }}>
                <button onClick={(e) => { e.stopPropagation(); onBack(); }} style={{background:'rgba(255,255,255,0.1)', color:'#fff', border:'1px solid #fff', borderRadius:'5px', padding:'5px 10px'}}>← BACK</button>
                <span style={{color:'#fff', padding:'5px 10px'}}>Ch. {chapterId}</span>
            </div>

            {/* Images */}
            <div style={{paddingTop:'0px'}}>
                {chapter.pages.map((src, i) => {
                    const isVideo = src.endsWith('.mp4');
                    return isVideo ? (
                        <video key={i} src={src} autoPlay loop muted playsInline className="reader-image" />
                    ) : (
                        <img key={i} src={src} className="reader-image" alt={`Page ${i+1}`} />
                    );
                })}
            </div>

            {/* Watermark */}
            <div id="watermark" className="watermark-layer"></div>

            {/* Social */}
            <div className="comments-section" onClick={(e) => e.stopPropagation()}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'20px'}}>
                    <h3 style={{fontFamily:'Orbitron'}}>Discussion</h3>
                    <button className="like-btn" onClick={handleLike}>
                        ❤️ {likes} Likes
                    </button>
                </div>

                <div className="comment-input-area">
                    <input 
                        className="comment-input" 
                        placeholder="Theory? Thoughts?" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                    />
                    <button onClick={handleComment} style={{background:'#00F6FF', border:'none', borderRadius:'5px', padding:'0 15px', fontWeight:'bold'}}>POST</button>
                </div>

                <div>
                    {comments.map((c, i) => (
                        <div key={i} style={{background:'rgba(255,255,255,0.05)', padding:'10px', marginBottom:'10px', borderRadius:'5px'}}>
                            <p style={{fontSize:'0.9rem'}}>{c.text}</p>
                            <span style={{fontSize:'0.7rem', color:'#666'}}>{c.date}</span>
                        </div>
                    ))}
                    {comments.length === 0 && <p style={{color:'#666', fontSize:'0.8rem'}}>No comments yet. Be the first.</p>}
                </div>
            </div>
        </div>
    );
};

// --- 📱 MAIN APP COMPONENT ---
const App = () => {
    const [config, setConfig] = useState(null);
    const [view, setView] = useState('intro'); // intro, home, manga, reader
    const [activeChapter, setActiveChapter] = useState(1);
    const [showPaywall, setShowPaywall] = useState(false);
    const [notifTrap, setNotifTrap] = useState(false);

    useEffect(() => {
        // Wait for config to load from global scope
        const interval = setInterval(() => {
            if (window.APP_CONFIG) {
                setConfig(window.APP_CONFIG);
                clearInterval(interval);
            }
        }, 100);
        return () => clearInterval(interval);
    }, []);

    // Initial check for VIP
    const checkVIP = () => {
        const vip = localStorage.getItem('vipAccessCode');
        if(vip && config.vipCodes.includes(vip)) {
            setView('manga');
        } else {
            setShowPaywall(true);
        }
    };

    const unlockVIP = (code) => {
        if(config.vipCodes.includes(code.toUpperCase())) {
            localStorage.setItem('vipAccessCode', code.toUpperCase());
            setShowPaywall(false);
            setNotifTrap(true); // Trigger trap
        } else {
            alert("ACCESS DENIED.");
        }
    };

    if (!config) return <div style={{color:'#fff', padding:'20px'}}>Loading Neural Network...</div>;

    return (
        <div className="app-shell">
            {/* Top Bar */}
            {view !== 'intro' && (
                <div className="app-top-bar">
                    <span className="license-ticker">{config.legal.license}</span>
                </div>
            )}

            {/* VIEWS */}
            {view === 'intro' && <CinematicIntro onComplete={() => setView('home')} />}
            
            <div className={`page ${view === 'home' ? 'active' : ''}`}>
                <HomePage onShowPaywall={checkVIP} config={config} />
            </div>

            <div className={`page ${view === 'manga' ? 'active' : ''}`}>
                <MangaPage 
                    onRead={(id) => { setActiveChapter(id); setView('reader'); }} 
                    config={config} 
                />
            </div>

            <div className={`page ${view === 'reader' ? 'active' : ''}`}>
                <ReaderPage chapterId={activeChapter} onBack={() => setView('manga')} config={config} />
            </div>

            {/* PAYWALL MODAL */}
            {showPaywall && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2 style={{color:'#FFD700', fontFamily:'Orbitron'}}>PREMIUM ACCESS</h2>
                        <h1 style={{fontSize:'3rem', color:'#fff', margin:'10px 0'}}>$4.99</h1>
                        <p style={{color:'#888', fontSize:'0.8rem'}}>Unlimited access to the Archive.</p>
                        
                        <div style={{margin:'20px 0', borderTop:'1px solid #333', paddingTop:'20px'}}>
                            <p style={{color:'#00F6FF', fontSize:'0.8rem', marginBottom:'5px'}}>ENTER VIP CODE</p>
                            <input id="vipInput" style={{padding:'10px', width:'80%', background:'#222', border:'1px solid #444', color:'#fff', textAlign:'center'}} />
                            <br/>
                            <button 
                                onClick={() => {
                                    const input = document.getElementById('vipInput');
                                    if(input) unlockVIP(input.value);
                                }}
                                style={{marginTop:'10px', background:'#FFD700', border:'none', padding:'10px 20px', fontWeight:'bold', cursor:'pointer'}}
                            >
                                UNLOCK
                            </button>
                        </div>
                        <button onClick={() => setShowPaywall(false)} style={{background:'transparent', border:'1px solid #555', color:'#fff', padding:'5px 15px', borderRadius:'5px'}}>Close</button>
                    </div>
                </div>
            )}

            {/* NOTIFICATION TRAP */}
            {notifTrap && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{border:'2px solid red', boxShadow:'0 0 50px red'}}>
                        <h2 style={{color:'red', fontFamily:'Orbitron'}}>NOTIFICATIONS?</h2>
                        <p style={{margin:'20px 0'}}>Enable updates for new chapters.</p>
                        <div style={{display:'flex', justifyContent:'center', gap:'20px'}}>
                            <button 
                                onClick={() => { setNotifTrap(false); setView('manga'); }}
                                style={{background:'green', color:'#fff', border:'none', padding:'10px 20px', cursor:'pointer'}}
                            >
                                YES
                            </button>
                            <button 
                                onMouseEnter={(e) => {
                                    e.target.style.display = 'none';
                                    alert("YOU WILL PRESS YES.");
                                }}
                                style={{background:'#333', color:'#fff', border:'none', padding:'10px 20px', cursor:'pointer'}}
                            >
                                NO
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Render
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);