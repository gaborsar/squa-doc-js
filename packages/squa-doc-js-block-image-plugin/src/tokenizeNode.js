import { TokenType } from "squa-doc-js";

export default function tokenizeNode(node) {
    const tokens = [];

    if (node.nodeName === "FIGURE") {
        const img = node.childNodes[0];
        const figcaption = node.childNodes[1];

        if (img && img.nodeName === "IMG" && img.hasAttribute("src")) {
            tokens.push({
                type: TokenType.BlockEmbedNode,
                payload: {
                    "block-image": img.getAttribute("src")
                }
            });

            if (img.hasAttribute("alt")) {
                tokens.push({
                    type: TokenType.BlockStyle,
                    payload: {
                        alt: img.getAttribute("alt")
                    }
                });
            }

            if (figcaption) {
                tokens.push({
                    type: TokenType.BlockStyle,
                    payload: {
                        caption: figcaption.textContent
                    }
                });
            }
        }
    }

    return tokens;
}
