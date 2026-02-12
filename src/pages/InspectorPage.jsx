import { useEffect } from 'react';
import { useInspector } from '../context/InspectorContext';
import { parseHtml } from '../utils/domParser';
import DomTree from '../components/DomTree';
import ComputedStyles from '../components/ComputedStyles';
import WireframePreview from '../components/WireframePreview';
import './InspectorPage.css';

const PROXY_URLS = [
    (url) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
    (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url) => `https://cors-anywhere.herokuapp.com/${url}` // Fallback, might work if user has access
];

const InspectorPage = () => {
    const { state, dispatch } = useInspector();
    const { url, loading, error } = state;

    useEffect(() => {
        if (!url) return;

        const fetchData = async () => {
            dispatch({ type: 'FETCH_START', payload: url });

            let html = null;
            let fetchError = null;

            for (const proxyGenerator of PROXY_URLS) {
                try {
                    const proxyUrl = proxyGenerator(url);
                    console.log(`Attempting fetch via: ${proxyUrl}`);

                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

                    const response = await fetch(proxyUrl, { signal: controller.signal });
                    clearTimeout(timeoutId);

                    if (!response.ok) {
                        throw new Error(`Status ${response.status}`);
                    }

                    const text = await response.text();

                    // Basic validation
                    if (!text || text.trim().length < 50 || !text.toLowerCase().includes('<html')) {
                        throw new Error('Invalid or empty HTML content');
                    }

                    html = text;
                    break; // Success!
                } catch (err) {
                    console.warn(`Proxy failed: ${err.message}`);
                    fetchError = err;
                }
            }

            if (html) {
                try {
                    const { json, html: processedHtml } = parseHtml(html);
                    dispatch({
                        type: 'FETCH_SUCCESS',
                        payload: { html: processedHtml, tree: json }
                    });
                } catch (parseErr) {
                    dispatch({ type: 'FETCH_ERROR', payload: `Parsing failed: ${parseErr.message}` });
                }
            } else {
                dispatch({
                    type: 'FETCH_ERROR',
                    payload: `Failed to fetch URL. Last error: ${fetchError?.message || 'Unknown error'}`
                });
            }
        };

        fetchData();
    }, [url, dispatch]);

    if (loading) {
        return (
            <div className="inspector-loading">
                <div className="loading-spinner"></div>
                <p className="loading-text">DECONSTRUCTING TARGET...</p>
                <p className="loading-subtext">Trying multiple gateways...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="inspector-error">
                <p className="error-text">ERROR: {error}</p>
                <p className="error-subtext">Check the URL or try again later.</p>
                <button className="retry-btn" onClick={() => window.location.reload()}>RETRY</button>
            </div>
        );
    }

    return (
        <div className="inspector">
            {/* Left Sidebar */}
            <aside className="inspector-sidebar">
                <div className="sidebar-dom">
                    <DomTree />
                </div>
                <div className="sidebar-styles">
                    <ComputedStyles />
                </div>
            </aside>

            {/* Main Content */}
            <main className="inspector-main">
                <WireframePreview />
            </main>
        </div>
    );
};

export default InspectorPage;
