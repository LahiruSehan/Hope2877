// ⚛️ FULL REACT APPLICATION
import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';

// Access Global Config
const CONFIG = (window as any).APP_CONFIG;

// --- 🌌 CINEMATIC INTRO COMPONENT ---
const CinematicIntro = ({ onComplete }: { onComplete: () => void }) => {
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
                    setTimeout(onComplete, 2000); // Done
                }
            }, 50); // Speed of loading
        }, 5000);

    }, []);

    return (
        <div className={`intro-container ${phase === 4 ? 'ascend' : ''}`}>
            <div className="film-grain"></div>
            
            {/* Fog Layers */}
            <div className="stranger-fog" style={{ opacity: phase >= 1 ? 1 : 0 }}></div>
            <div className="stranger-fog layer2" style={{ opacity: phase >= 1 ? 0.8 : 0 }}></div>

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
const HomePage = ({ onShowPaywall }: { onShowPaywall: () => void }) => {
    return (
        <div className="home-page fade-in">
            <img src={CONFIG.assets.cover} className="cover-art" alt="Cover" />
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
                    {CONFIG.credits.map((c: any, i: number) => (
                        <div key={i} className="chapter-card" style={{margin:'5px', padding:'5px 15px', fontSize:'0.8rem'}}>
                            {c.name} {c.emoji}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- 📜 MANGA LIST COMPONENT ---
const MangaPage = ({ onRead, lockedChapters }: { onRead: (id: number) => void, lockedChapters: any[] }) => {
    return (
        <div className="manga-list-page" style={{paddingBottom:'50px'}}>
            <div style={{textAlign:'center', padding:'20px'}}>
                <h2 style={{fontFamily:'Aref Ruqaa', color:'#FFD700'}}>Chapters</h2>
            </div>
            
            {CONFIG.chapters.map((chapter: any) => (
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
            <div style={{border:'2px dashed #FFD700', margin:'20px', padding:'20px', textAlign:'center', borderRadius:'10px', color:'#FFD700'}}>
                <h3>🚧 WORK IN PROGRESS</h3>
                <p style={{fontSize:'0.8rem', color:'#888'}}>Artists are sketching the next arc.</p>
            </div>
        </div>
    );
};

// --- 📖 READER COMPONENT ---
const ReaderPage = ({ chapterId, onBack }: { chapterId: number, onBack: () => void }) => {
    const chapter = CONFIG.chapters.find((c: any) => c.id === chapterId);
    const [likes, setLikes] = useState(0);
    const [comments, setComments] = useState<{ text: string, date: string }[]>([]);
    const [input, setInput] = useState('');

    // Load Likes/Comments from LocalStorage
    useEffect(() => {
        const savedLikes = localStorage.getItem(`likes-ch${chapterId}`);
        if(savedLikes) setLikes(parseInt(savedLikes));
        
        const savedComments = localStorage.getItem(`comments-ch${chapterId}`);
        if(savedComments) setComments(JSON.parse(savedComments));
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
        <div className="reader-view">
            {/* Nav */}
            <div style={{position:'fixed', top:'50px', width:'100%', zIndex:100, display:'flex', justifyContent:'space-between', padding:'10px 20px'}}>
                <button onClick={onBack} style={{background:'rgba(0,0,0,0.5)', color:'#fff', border:'1px solid #fff', borderRadius:'5px', padding:'5px 10px'}}>← BACK</button>
                <span style={{background:'rgba(0,0,0,0.5)', padding:'5px 10px', borderRadius:'5px'}}>Ch. {chapterId}</span>
            </div>

            {/* Images */}
            <div style={{paddingTop:'0px'}}>
                {chapter.pages.map((src: string, i: number) => {
                    const isVideo = src.endsWith('.mp4');
                    return isVideo ? (
                        <video key={i} src={src} autoPlay loop muted playsInline className="reader-image" />
                    ) : (
                        <img key={i} src={src} className="reader-image" alt={`Page ${i+1}`} />
                    );
                })}
            </div>

            {/* Social */}
            <div className="comments-section">
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
    const [view, setView] = useState('intro'); // intro, home, manga, reader
    const [activeChapter, setActiveChapter] = useState(1);
    const [showPaywall, setShowPaywall] = useState(false);

    // Initial check for VIP
    const checkVIP = () => {
        const vip = localStorage.getItem('vipAccessCode');
        if(vip && CONFIG.vipCodes.includes(vip)) {
            setView('manga');
        } else {
            setShowPaywall(true);
        }
    };

    const unlockVIP = (code: string) => {
        if(CONFIG.vipCodes.includes(code.toUpperCase())) {
            localStorage.setItem('vipAccessCode', code.toUpperCase());
            setShowPaywall(false);
            setView('manga');
            alert("WELCOME TO THE ARCHIVE.");
        } else {
            alert("ACCESS DENIED.");
        }
    };

    return (
        <div className="app-shell">
            {/* Top Bar */}
            {view !== 'intro' && (
                <div className="app-top-bar">
                    <span className="license-ticker">{CONFIG.legal.license}</span>
                </div>
            )}

            {/* VIEWS */}
            {view === 'intro' && <CinematicIntro onComplete={() => setView('home')} />}
            
            <div className={`page ${view === 'home' ? 'active' : ''}`}>
                <HomePage onShowPaywall={checkVIP} />
            </div>

            <div className={`page ${view === 'manga' ? 'active' : ''}`}>
                <MangaPage 
                    onRead={(id) => { setActiveChapter(id); setView('reader'); }} 
                    lockedChapters={[]} 
                />
            </div>

            <div className={`page ${view === 'reader' ? 'active' : ''}`}>
                <ReaderPage chapterId={activeChapter} onBack={() => setView('manga')} />
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
                                    const input = document.getElementById('vipInput') as HTMLInputElement;
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
        </div>
    );
};

// Render
const rootElement = document.getElementById('root');
if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(<App />);
}