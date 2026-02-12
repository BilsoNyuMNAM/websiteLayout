import { useInspector } from '../context/InspectorContext';
import './ComputedStyles.css';

const ComputedStyles = () => {
    const { state } = useInspector();
    const { computedStyles, selectedNodeId } = state;

    if (!selectedNodeId || !computedStyles) {
        return (
            <div className="computed-styles empty">
                <div className="cs-header">
                    <span className="cs-title">COMPUTED STYLES</span>
                </div>
                <div className="cs-placeholder">
                    Select an element to view styles
                </div>
            </div>
        );
    }

    // Parse margin/padding for box model
    const parseBox = (val) => val ? val.replace('px', '') : '0';

    // Simplified box model values (just taking top/one value for demo)
    const margin = computedStyles.margin?.split(' ')[0] || '-';
    const padding = computedStyles.padding?.split(' ')[0] || '-';
    const width = Math.round(parseFloat(computedStyles.width) || 0);
    const height = Math.round(parseFloat(computedStyles.height) || 0);

    return (
        <div className="computed-styles">
            <div className="cs-header">
                <span className="cs-title">COMPUTED STYLES</span>
            </div>

            {/* Box Model */}
            <div className="box-model">
                <div className="box-margin">
                    <span className="box-label-margin">margin</span>
                    <div className="box-padding">
                        <span className="box-label-padding">padding</span>
                        <div className="box-content">
                            <span className="box-dims">{width} × {height}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Properties */}
            <div className="cs-properties">
                <div className="cs-prop-row">
                    <span className="cs-prop-key">display</span>
                    <span className="cs-prop-value cs-highlight">{computedStyles.display}</span>
                </div>
                <div className="cs-prop-row">
                    <span className="cs-prop-key">justify</span>
                    <span className="cs-prop-value">{computedStyles.justifyContent}</span>
                </div>
                <div className="cs-prop-row">
                    <span className="cs-prop-key">font-fam</span>
                    <span className="cs-prop-value" title={computedStyles.fontFamily}>
                        {computedStyles.fontFamily?.split(',')[0].replace(/['"]/g, '')}
                    </span>
                </div>
                <div className="cs-prop-row">
                    <span className="cs-prop-key">color</span>
                    <span className="cs-prop-value">
                        <span className="color-swatch" style={{ background: computedStyles.color }}></span>
                        {computedStyles.color}
                    </span>
                </div>
                <div className="cs-prop-row">
                    <span className="cs-prop-key">bg-color</span>
                    <span className="cs-prop-value">
                        <span className="color-swatch" style={{ background: computedStyles.backgroundColor }}></span>
                        {computedStyles.backgroundColor}
                    </span>
                </div>
                <div className="cs-prop-row">
                    <span className="cs-prop-key">font-size</span>
                    <span className="cs-prop-value">{computedStyles.fontSize}</span>
                </div>
            </div>

            {/* Raw Data Fragment */}
            <div className="cs-raw">
                <span className="cs-raw-label">SELECTED NODE ID</span>
                <pre className="cs-raw-code">
                    {selectedNodeId}
                </pre>
            </div>
        </div>
    );
};

export default ComputedStyles;
