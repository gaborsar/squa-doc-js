import { TokenType } from "squa-doc-js";

export default function tokenizeNode(node) {
    const tokens = [];

    if (node.nodeName === "FIGURE") {
        const img = node.querySelector("img");
        const figcaption = node.querySelector("figcaption");

        if (img && img.hasAttribute("src")) {
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
