import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInspector } from '../context/InspectorContext';
import './LandingPage.css';

const LandingPage = () => {
    const navigate = useNavigate();
    const { dispatch } = useInspector();
    const [urlInput, setUrlInput] = useState('https://example.com');
    const [stripCss, setStripCss] = useState(false);
    const [removeImages, setRemoveImages] = useState(true);
    const [outlineDom, setOutlineDom] = useState(false);

    const handleDeconstruct = () => {
        if (!urlInput) return;

        // Basic URL validation/formatting
        let targetUrl = urlInput;
        if (!/^https?:\/\//i.test(targetUrl)) {
            targetUrl = 'https://' + targetUrl;
        }

        dispatch({ type: 'FETCH_START', payload: targetUrl });
        dispatch({
            type: 'SET_OPTIONS',
            payload: { stripCss, removeImages, outlineDom }
        });

        navigate('/inspect');
    };

    return (
        <div className="landing">
            {/* Grid background */}
            <div className="grid-bg"></div>

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-badge">
                    <span className="badge-text">Stitch - Design with AI</span>
                    <span className="badge-icon">□</span>
                </div>
                <h1 className="hero-title">
                    <span className="title-line">WEB</span>
                    <span className="title-line title-accent">DECONSTRUCTION</span>
                    <span className="title-line">ENGINE</span>
                </h1>
            </section>

            {/* Input Section */}
            <section className="input-section">
                <div className="input-card">
                    <p className="input-description">
                        Input a target URL. We strip the styling. We
                        expose the skeleton.
                        <br />
                        Generate raw wireframes instantly.
                    </p>

                    <div className="url-input-group">
                        <label className="input-label">TARGET_URL:</label>
                        <div className="url-input-wrapper">
                            <input
                                type="text"
                                className="url-input"
                                value={urlInput}
                                onChange={(e) => setUrlInput(e.target.value)}
                                placeholder="https://www.example.com"
                            />
                        </div>
                    </div>

                    <div className="options-row">
                        <div className="checkboxes">
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={stripCss}
                                    onChange={(e) => setStripCss(e.target.checked)}
                                />
                                <span className="checkbox-custom"></span>
                                STRIP CSS
                            </label>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={removeImages}
                                    onChange={(e) => setRemoveImages(e.target.checked)}
                                />
                                <span className="checkbox-custom"></span>
                                REMOVE IMAGES
                            </label>
                            <label className="checkbox-label">
                                <input
                                    type="checkbox"
                                    checked={outlineDom}
                                    onChange={(e) => setOutlineDom(e.target.checked)}
                                />
                                <span className="checkbox-custom"></span>
                                OUTLINE DOM
                            </label>
                        </div>
                        <button className="deconstruct-btn" onClick={handleDeconstruct}>
                            DECONSTRUCT →
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="stats-section">
                <div className="stats-grid">
                    <div className="stat-cell">
                        <span className="stat-label">COMPLETION</span>
                        <span className="stat-value stat-accent">12%</span>
                    </div>
                    <div className="stat-cell">
                        <span className="stat-label">NODES/COUNT</span>
                        <span className="stat-value">8,402</span>
                    </div>
                    <div className="stat-cell">
                        <span className="stat-label">EX_TIME</span>
                        <span className="stat-value">0.4s</span>
                    </div>
                    <div className="stat-cell">
                        <span className="stat-label">ENDPOINT</span>
                        <span className="stat-value">
                            <span className="endpoint-arrow">►</span> US-EAST
                        </span>
                    </div>
                </div>
            </section>

            {/* Marquee Banner */}
            <section className="marquee-section">
                <div className="marquee-track">
                    <div className="marquee-content">
                        <span className="marquee-item">CONSTRUCT // WIREFRAME</span>
                        <span className="marquee-separator">✦</span>
                        <span className="marquee-item">ANALYZE DOM STRUCTURE</span>
                        <span className="marquee-separator">✦</span>
                        <span className="marquee-item">EXPORT TO FIGMA</span>
                        <span className="marquee-separator">✦</span>
                        <span className="marquee-item">INSPECT LAYOUT</span>
                        <span className="marquee-separator">✦</span>
                        <span className="marquee-item">CONSTRUCT // WIREFRAME</span>
                        <span className="marquee-separator">✦</span>
                        <span className="marquee-item">ANALYZE DOM STRUCTURE</span>
                        <span className="marquee-separator">✦</span>
                        <span className="marquee-item">EXPORT TO FIGMA</span>
                        <span className="marquee-separator">✦</span>
                        <span className="marquee-item">INSPECT LAYOUT</span>
                        <span className="marquee-separator">✦</span>
                    </div>
                </div>
            </section>

            {/* Core Capabilities */}
            <section className="capabilities-section">
                <div className="container">
                    <div className="section-header">
                        <span className="section-number">01</span>
                        <h2 className="section-title">CORE CAPABILITIES</h2>
                    </div>

                    <div className="capabilities-grid">
                        <div className="capability-card">
                            <div className="cap-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4z" />
                                    <path d="M14 14h6v6h-6z" strokeDasharray="4 2" />
                                </svg>
                            </div>
                            <h3 className="cap-title">DOM EXTRACTION</h3>
                            <p className="cap-desc">
                                Pull the raw HTML structure without
                                the visual noise. Get the skeleton of
                                any website optimized.
                            </p>
                        </div>

                        <div className="capability-card">
                            <div className="cap-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="M12 3v18M3 12h18" strokeOpacity="0.3" />
                                    <path d="M8 8l8 8M16 8l-8 8" />
                                </svg>
                            </div>
                            <h3 className="cap-title">STYLE STRIPPING</h3>
                            <p className="cap-desc">
                                Remove CSS layers selectively. Toggle
                                between font changes, colors, or fully
                                deconstructed to HTML.
                            </p>
                        </div>

                        <div className="capability-card">
                            <div className="cap-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="3" y="3" width="18" height="18" rx="1" />
                                    <path d="M3 9h18M9 3v18" />
                                    <path d="M13 13h5v5h-5z" fill="currentColor" fillOpacity="0.15" />
                                </svg>
                            </div>
                            <h3 className="cap-title">WIREFRAME EXPORT</h3>
                            <p className="cap-desc">
                                Convert the deconstructed view
                                instantly into a pixelated wireframe
                                file in svg, figma, or JSON.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="footer">
                <div className="footer-inner">
                    <div className="footer-left">
                        <span className="footer-logo">INSPECTOR_V2</span>
                        <span className="footer-copy">© 2025 Orthoblast Systems Inc. All rights reserved.</span>
                    </div>
                    <div className="footer-right">
                        <a href="#" className="footer-link">[PRIVACY_POLICY]</a>
                        <a href="#" className="footer-link">[TERMS_OF_USE]</a>
                        <a href="#" className="footer-link">[SYSTEM_STATUS]</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
