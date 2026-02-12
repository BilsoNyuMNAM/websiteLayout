import { createContext, useContext, useReducer } from 'react';

const InspectorContext = createContext(null);

const initialState = {
    url: '',
    loading: false,
    error: null,
    html: '',
    domTree: null,
    hoveredNodeId: null,
    selectedNodeId: null,
    deviceView: 'desktop', // desktop, tablet, mobile
    computedStyles: null,
    stripCss: false,
    removeImages: true,
    outlineDom: false,
};

const reducer = (state, action) => {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, url: action.payload, loading: true, error: null };
        case 'FETCH_SUCCESS':
            return {
                ...state,
                loading: false,
                html: action.payload.html,
                domTree: action.payload.tree
            };
        case 'FETCH_ERROR':
            return { ...state, loading: false, error: action.payload };
        case 'SET_HOVERED':
            return { ...state, hoveredNodeId: action.payload };
        case 'SET_SELECTED':
            return { ...state, selectedNodeId: action.payload };
        case 'SET_COMPUTED_STYLES':
            return { ...state, computedStyles: action.payload };
        case 'SET_DEVICE':
            return { ...state, deviceView: action.payload };
        case 'SET_OPTIONS':
            return { ...state, ...action.payload };
        default:
            return state;
    }
};

export const InspectorProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);



    return (
        <InspectorContext.Provider value={{ state, dispatch }}>
            {children}
        </InspectorContext.Provider>
    );
};

export const useInspector = () => useContext(InspectorContext);
