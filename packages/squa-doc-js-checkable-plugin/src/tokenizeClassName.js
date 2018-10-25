import { TokenType } from "squa-doc-js";

export default function tokenizeClassName(className) {
    const tokens = [];
    switch (className) {
        case "Checkable":
            tokens.push({
                type: TokenType.BlockNode,
                payload: {
                    type: "checkable"
                }
            });
            break;
        case "Checkable-checked":
            tokens.push({
                type: TokenType.BlockStyle,
                payload: {
                    checked: true
                }
            });
            break;
    }
    return tokens;
}
