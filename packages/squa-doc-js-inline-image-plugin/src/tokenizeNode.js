import { TokenType } from "squa-doc-js";

export default function tokenizeNode(node) {
    const tokens = [];

    if (node.nodeName === "IMG" && node.hasAttribute("src")) {
        tokens.push({
            type: TokenType.InlineEmbedNode,
            payload: {
                "inline-image": node.getAttribute("src")
            }
        });

        if (node.hasAttribute("alt")) {
            tokens.push({
                type: TokenType.InlineStyle,
                payload: {
                    alt: node.getAttribute("alt")
                }
            });
        }
    }

    return tokens;
}
