import { useEffect, useRef, useState } from 'react';
import { useInspector } from '../context/InspectorContext';
import './DomTree.css';

const TreeNode = ({ node, depth = 0 }) => {
    const { state, dispatch } = useInspector();
    const { hoveredNodeId, selectedNodeId } = state;
    const [expanded, setExpanded] = useState(true);
    const nodeRef = useRef(null);

    const hasChildren = node.children && node.children.length > 0;
    const isSelected = node.id === selectedNodeId;
    const isHovered = node.id === hoveredNodeId;

    // Auto-expand if a child is selected
    // This is tricky with deep trees, might need optimization or context-based expansion
    // For now, keep it simple: defaulting to expanded=true

    useEffect(() => {
        if (isSelected && nodeRef.current) {
            nodeRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [isSelected]);

    const handleClick = (e) => {
        e.stopPropagation();
        dispatch({ type: 'SET_SELECTED', payload: node.id });
        // Also toggle expansion if it's the target
        if (hasChildren) setExpanded(!expanded);
    };

    const handleMouseEnter = (e) => {
        e.stopPropagation();
        dispatch({ type: 'SET_HOVERED', payload: node.id });
    };

    const renderAttrs = () => {
        if (!node.attrs) return null;
        return Object.entries(node.attrs).map(([key, value]) => (
            <span key={key}>
                <span className="attr-key"> {key}=</span>
                <span className="attr-value">&quot;{value}&quot;</span>
            </span>
        ));
    };

    if (node.type === 'text') {
        return (
            <div className="tree-node text-node" style={{ paddingLeft: `${depth * 18}px` }}>
                <span className="node-text">&quot;{node.content}&quot;</span>
            </div>
        );
    }

    return (
        <div className="tree-node">
            <div
                ref={nodeRef}
                className={`node-line ${isSelected ? 'node-selected' : ''} ${isHovered ? 'node-hovered' : ''}`}
                style={{ paddingLeft: `${depth * 18}px` }}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
            >
                {hasChildren ? (
                    <span className={`node-arrow ${expanded ? 'expanded' : ''}`} onClick={(e) => {
                        e.stopPropagation();
                        setExpanded(!expanded);
                    }}>▸</span>
                ) : (
                    <span className="node-spacer"></span>
                )}
                <span className="node-tag">&lt;{node.tag}</span>
                {renderAttrs()}
                <span className="node-tag">&gt;</span>
                {node.text && <span className="node-text"> {node.text}</span>}
            </div>
            {expanded && hasChildren && (
                <div className="node-children">
                    {node.children.map((child) => (
                        <TreeNode key={child.id || Math.random()} node={child} depth={depth + 1} />
                    ))}
                    <div className="node-line" style={{ paddingLeft: `${depth * 18}px` }}>
                        <span className="node-tag">&lt;/{node.tag}&gt;</span>
                    </div>
                </div>
            )}
        </div>
    );
};

const DomTree = () => {
    const { state } = useInspector();
    const { domTree, loading } = state;

    if (loading) return null; // Logic handled by parent, but safety check

    if (!domTree) {
        return (
            <div className="dom-tree-empty">
                <p>NO DOM DATA</p>
            </div>
        );
    }

    // Count nodes roughly
    const countNodes = (node) => {
        let count = 1;
        if (node.children) {
            node.children.forEach(child => count += countNodes(child));
        }
        return count;
    };
    const nodeCount = countNodes(domTree);

    return (
        <div className="dom-tree">
            <div className="dom-tree-header">
                <span className="dom-tree-icon">&lt;/&gt;</span>
                <span className="dom-tree-title">DOM STRUCTURE</span>
                <span className="dom-tree-count">NODES: {nodeCount}</span>
            </div>
            <div className="dom-tree-content" onMouseLeave={() => {
                // Optional: clear hover when leaving tree
                // dispatch({ type: 'SET_HOVERED', payload: null });
            }}>
                <TreeNode node={domTree} />
            </div>
        </div>
    );
};

export default DomTree;
