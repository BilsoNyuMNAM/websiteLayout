import { useEffect, useRef, useState } from 'react';
import { useInspector } from '../context/InspectorContext';
import './WireframePreview.css';

const WireframePreview = () => {
    const { state, dispatch } = useInspector();
    const { html, loading, stripCss, removeImages, outlineDom, hoveredNodeId, selectedNodeId, deviceView } = state;
    const iframeRef = useRef(null);
    const [gridOn, setGridOn] = useState(true);

    // Helper to inject styles and scripts into the iframe
    const updateIframeContent = () => {
        const iframe = iframeRef.current;
        if (!iframe || !iframe.contentDocument) return;

        const doc = iframe.contentDocument;

        // Inject Custom Styles
        const styleId = 'inspector-styles';
        let styleTag = doc.getElementById(styleId);
        if (!styleTag) {
            styleTag = doc.createElement('style');
            styleTag.id = styleId;
            doc.head.appendChild(styleTag);
        }

        let css = `
      body {
        cursor: default; 
        min-height: 100vh;
      }
      * {
        transition: outline 0.1s;
      }
      [data-inspector-hover="true"] {
        outline: 2px solid #00ff41 !important;
        outline-offset: -2px;
        background-color: rgba(0, 255, 65, 0.1) !important;
      }
      [data-inspector-selected="true"] {
        outline: 3px solid #ff6b00 !important;
        outline-offset: -3px;
        background-color: rgba(255, 107, 0, 0.15) !important;
      }
    `;

        if (stripCss) {
            css += `
        * {
          background: transparent !important;
          color: #000 !important;
          border: 1px solid #ccc !important;
          font-family: monospace !important;
          box-shadow: none !important;
        }
        img, video, canvas {
          display: none !important;
        }
      `;
        }

        if (removeImages) {
            css += `
        img, video, canvas, [style*="background-image"] {
          opacity: 0 !important;
          visibility: hidden !important;
        }
        img::before {
          content: '';
          display: block;
          width: 100%;
          height: 100%;
          background: #eee;
          border: 1px solid #999;
          opacity: 1;
          visibility: visible;
        }
      `;
        }

        if (outlineDom) {
            css += `
        * {
          outline: 1px solid rgba(0, 255, 65, 0.3) !important;
        }
      `;
        }

        styleTag.textContent = css;

        // Add Interaction Listeners
        const handleMouseOver = (e) => {
            e.stopPropagation();
            const targetId = e.target.dataset.inspectorId;
            if (targetId) {
                dispatch({ type: 'SET_HOVERED', payload: targetId });
            }
        };

        const handleClick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const targetId = e.target.dataset.inspectorId;
            if (targetId) {
                dispatch({ type: 'SET_SELECTED', payload: targetId });

                // Extract computed styles
                const computed = window.getComputedStyle(e.target);
                const styles = {
                    width: computed.width,
                    height: computed.height,
                    display: computed.display,
                    justifyContent: computed.justifyContent,
                    alignItems: computed.alignItems,
                    fontFamily: computed.fontFamily,
                    color: computed.color,
                    backgroundColor: computed.backgroundColor,
                    margin: computed.margin,
                    padding: computed.padding,
                    fontSize: computed.fontSize,
                    lineHeight: computed.lineHeight,
                };
                dispatch({ type: 'SET_COMPUTED_STYLES', payload: styles });
            }
        };

        // Remove old listeners to prevent duplicates (though we re-render iframe mostly)
        doc.body.removeEventListener('mouseover', handleMouseOver);
        doc.body.removeEventListener('click', handleClick);

        doc.body.addEventListener('mouseover', handleMouseOver);
        doc.body.addEventListener('click', handleClick);
    };

    // Effect to update highlight state based on context changes (without reloading iframe)
    useEffect(() => {
        const iframe = iframeRef.current;
        if (!iframe || !iframe.contentDocument) return;

        const doc = iframe.contentDocument;

        // Clear previous highlights
        const prevHover = doc.querySelector('[data-inspector-hover="true"]');
        if (prevHover) delete prevHover.dataset.inspectorHover;

        const prevSelected = doc.querySelector('[data-inspector-selected="true"]');
        if (prevSelected) delete prevSelected.dataset.inspectorSelected;

        // Set new highlights
        if (hoveredNodeId) {
            const el = doc.querySelector(`[data-inspector-id="${hoveredNodeId}"]`);
            if (el) el.dataset.inspectorHover = "true";
        }

        if (selectedNodeId) {
            const el = doc.querySelector(`[data-inspector-id="${selectedNodeId}"]`);
            if (el) {
                el.dataset.inspectorSelected = "true";
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [hoveredNodeId, selectedNodeId]);

    // Effect to re-inject styles when options change
    useEffect(() => {
        updateIframeContent();
    }, [stripCss, removeImages, outlineDom, html]);


    // Determine container width based on deviceView
    const getContainerStyle = () => {
        switch (deviceView) {
            case 'mobile': return { width: '375px', height: '667px' };
            case 'tablet': return { width: '768px', height: '1024px' };
            default: return { width: '100%', height: '100%' };
        }
    };

    if (!html && !loading) {
        return (
            <div className="wireframe-preview empty-state">
                <div className="wf-toolbar">
                    <div className="wf-toolbar-left"><span className="wf-label">WIREFRAME</span></div>
                </div>
                <div className="wf-placeholder">
                    <p>NO TARGET LOADED</p>
                    <p className="sub">Enter a URL on the home page to begin.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="wireframe-preview">
            {/* Toolbar */}
            <div className="wf-toolbar">
                <div className="wf-toolbar-left">
                    <span className="wf-label">WIREFRAME</span>
                    <span className="wf-badge">Stitch - Design with AI</span>
                </div>
                <div className="wf-toolbar-center">
                    <div className="device-toggles">
                        <button
                            className={`device-btn ${deviceView === 'desktop' ? 'active' : ''}`}
                            onClick={() => dispatch({ type: 'SET_DEVICE', payload: 'desktop' })}
                            title="Desktop"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="2" y="3" width="20" height="14" rx="1" />
                                <path d="M8 21h8M12 17v4" />
                            </svg>
                        </button>
                        <button
                            className={`device-btn ${deviceView === 'tablet' ? 'active' : ''}`}
                            onClick={() => dispatch({ type: 'SET_DEVICE', payload: 'tablet' })}
                            title="Tablet"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="4" y="2" width="16" height="20" rx="2" />
                                <circle cx="12" cy="18" r="1" fill="currentColor" />
                            </svg>
                        </button>
                        <button
                            className={`device-btn ${deviceView === 'mobile' ? 'active' : ''}`}
                            onClick={() => dispatch({ type: 'SET_DEVICE', payload: 'mobile' })}
                            title="Mobile"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <rect x="6" y="2" width="12" height="20" rx="2" />
                                <circle cx="12" cy="18" r="1" fill="currentColor" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="wf-toolbar-right">
                    <span className="grid-label">GRID:</span>
                    <button
                        className={`grid-toggle ${gridOn ? 'on' : ''}`}
                        onClick={() => setGridOn(true)}
                    >
                        ON
                    </button>
                    <span className="grid-separator">/</span>
                    <button
                        className={`grid-toggle ${!gridOn ? 'on' : ''}`}
                        onClick={() => setGridOn(false)}
                    >
                        OFF
                    </button>
                </div>
            </div>

            {/* Wireframe Canvas */}
            <div className={`wf-canvas ${gridOn ? 'show-grid' : ''}`}>
                <div className="iframe-container" style={getContainerStyle()}>
                    <iframe
                        ref={iframeRef}
                        srcDoc={html}
                        title="Wireframe Preview"
                        className="wf-iframe"
                        onLoad={updateIframeContent}
                        sandbox="allow-same-origin allow-scripts"
                    />
                </div>
            </div>

            {/* Action Bar */}
            <div className="wf-actions">
                <div className="wf-actions-left">
                    {hoveredNodeId && <div className="node-id-badge">ID: {hoveredNodeId}</div>}
                </div>
                <div className="wf-actions-right">
                    <button className="wf-btn-download">
                        <span className="btn-icon">⬇</span>
                        DOWNLOAD JSON
                    </button>
                    <button className="wf-btn-export">
                        <span className="btn-icon">🖼</span>
                        EXPORT SVG
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WireframePreview;
