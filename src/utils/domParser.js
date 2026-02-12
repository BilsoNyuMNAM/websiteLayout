export const domToJson = (node) => {
    if (!node) return null;

    // Generate a unique ID if not present
    const id = node.id || `n-${Math.random().toString(36).substr(2, 9)}`;
    node.dataset.inspectorId = id; // Add to DOM for reverse lookup

    const jsonNode = {
        id,
        tag: node.tagName.toLowerCase(),
        attrs: {},
        children: [],
        text: ''
    };

    // Collect attributes
    if (node.attributes) {
        for (let i = 0; i < node.attributes.length; i++) {
            const attr = node.attributes[i];
            if (attr.name !== 'style') { // Simplify for now
                jsonNode.attrs[attr.name] = attr.value;
            }
        }
    }

    // Handle specialized processing
    if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        if (text) {
            return { type: 'text', content: text };
        }
        return null;
    }

    // Recursively process children
    if (node.childNodes) {
        node.childNodes.forEach(child => {
            if (child.nodeType === Node.ELEMENT_NODE) {
                // Skip script and style tags for cleaner tree
                if (child.tagName !== 'SCRIPT' && child.tagName !== 'STYLE') {
                    const childJson = domToJson(child);
                    if (childJson) jsonNode.children.push(childJson);
                }
            } else if (child.nodeType === Node.TEXT_NODE) {
                const text = child.textContent.trim();
                if (text.length > 0) {
                    jsonNode.text = text.slice(0, 20) + (text.length > 20 ? '...' : '');
                }
            }
        });
    }

    return jsonNode;
};

export const parseHtml = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    // Process the tree to inject IDs and custom scripts if needed
    const json = domToJson(doc.documentElement);

    return {
        doc,
        json,
        html: doc.documentElement.outerHTML
    };
};
