import { useEffect } from 'react';
import { useInspector } from '../context/InspectorContext';
import { parseHtml } from '../utils/domParser';
import DomTree from '../components/DomTree';
import ComputedStyles from '../components/ComputedStyles';
import WireframePreview from '../components/WireframePreview';
import './InspectorPage.css';

const InspectorPage = () => {
    const { state, dispatch } = useInspector();
    const { url, loading, error } = state;

    useEffect(() => {
        if (!url) return;

        const fetchData = async () => {
            dispatch({ type: 'FETCH_START', payload: url });
            try {
                const proxyUrl = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`;
                const response = await fetch(proxyUrl);
                if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

                const html = await response.text();

                if (!html) throw new Error('No content returned from URL');

                const { json, html: processedHtml } = parseHtml(html);

                dispatch({
                    type: 'FETCH_SUCCESS',
                    payload: { html: processedHtml, tree: json }
                });

            } catch (err) {
                console.error(err);
                dispatch({ type: 'FETCH_ERROR', payload: err.message });
            }
        };

        fetchData();
    }, [url, dispatch]);

    if (loading) {
        return (
            <div className="inspector-loading">
                <div className="loading-spinner"></div>
                <p className="loading-text">DECONSTRUCTING TARGET...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="inspector-error">
                <p className="error-text">ERROR: {error}</p>
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
