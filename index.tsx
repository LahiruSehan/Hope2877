import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

const MagicalIntro = () => {
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState('void'); // void, ignition, forge, ascension, done
    const [textVisible, setTextVisible] = useState(false);

    useEffect(() => {
        // Sequence Timeline
        const sequence = async () => {
            // 0s: Void (Black)
            await wait(1000);
            
            // 1s: Ignition (Singularity appears)
            setPhase('ignition');
            await wait(2000);

            // 3s: Forge (Rings expand, text appears)
            setPhase('forge');
            setTimeout(() => setTextVisible(true), 800);
            
            // Progress Bar simulation
            let p = 0;
            const interval = setInterval(() => {
                p += Math.random() * 2;
                if (p > 100) p = 100;
                setProgress(p);
                if (p === 100) clearInterval(interval);
            }, 100);

            await wait(7000); // Let the forge spin and particles fly

            // 10s: Ascension (Flash)
            setPhase('ascension');
            await wait(2000);

            // 12s: Done (Remove intro, reveal site)
            setPhase('done');
            
            // Reveal Main App
            const app = document.getElementById('main-app-container');
            if (app) app.style.opacity = '1';
        };

        sequence();
    }, []);

    const wait = (ms) => new Promise(res => setTimeout(res, ms));

    if (phase === 'done') return null;

    return (
        <div className={`react-intro-container phase-${phase}`}>
            
            {/* BACKGROUND NEBULA */}
            <div className="nebula-layer">
                <div className="nebula-cloud c1"></div>
                <div className="nebula-cloud c2"></div>
                <div className="star-field"></div>
            </div>

            {/* THE CELESTIAL FORGE (Center) */}
            <div className="forge-container">
                <div className="singularity-core"></div>
                
                {/* Rotating Rune Rings */}
                <div className="rune-ring ring-1"></div>
                <div className="rune-ring ring-2"></div>
                <div className="rune-ring ring-3"></div>
                
                {/* Data Stream Particles */}
                <div className="forge-particles">
                    {[...Array(20)].map((_, i) => (
                        <div key={i} className="particle-spark" style={{
                            animationDelay: `${Math.random() * 2}s`,
                            left: `${50 + (Math.random() - 0.5) * 60}%`,
                            top: `${50 + (Math.random() - 0.5) * 60}%`
                        }} />
                    ))}
                </div>
            </div>

            {/* TITLE CONSTRUCT */}
            <div className={`title-construct ${textVisible ? 'visible' : ''}`}>
                <h1 className="hologram-text">Beneath The Light</h1>
                <h2 className="hologram-sub">of a Dying Sky</h2>
            </div>

            {/* MANA LOADING BAR */}
            <div className="mana-bar-container">
                <div className="mana-bar-fill" style={{ width: `${progress}%` }}>
                    <div className="mana-glow"></div>
                </div>
                <div className="mana-text">{Math.floor(progress)}% SYNCHRONIZING</div>
            </div>

            {/* ASCENSION FLASH OVERLAY */}
            <div className="ascension-overlay"></div>
        </div>
    );
};

// Render
const container = document.getElementById('react-intro-root');
const root = createRoot(container);
root.render(<MagicalIntro />);
