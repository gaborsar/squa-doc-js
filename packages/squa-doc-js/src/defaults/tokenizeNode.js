import TokenType from "../parser/TokenType";

export default function tokenizeNode(node, context) {
    const tokens = [];

    switch (node.nodeName) {
        case "TABLE":
            tokens.push({
                type: TokenType.TableNode
            });
            break;

        case "TR":
            tokens.push({
                type: TokenType.TableRowNode
            });
            break;

        case "TH":
        case "TD":
            tokens.push({
                type: TokenType.TableCellNode
            });
            if (node.hasAttribute("colspan")) {
                tokens.push({
                    type: TokenType.TableCellStyle,
                    payload: {
                        colspan: parseInt(node.getAttribute("colspan"), 10)
                    }
                });
            }
            if (node.hasAttribute("rowspan")) {
                tokens.push({
                    type: TokenType.TableCellStyle,
                    payload: {
                        rowspan: parseInt(node.getAttribute("rowspan"), 10)
                    }
                });
            }
            break;

        case "UL":
            tokens.push({
                type: TokenType.WrapperNode,
                payload: {
                    type: "unordered-list"
                }
            });
            break;

        case "OL":
            tokens.push({
                type: TokenType.WrapperNode,
                payload: {
                    type: "ordered-list"
                }
            });
            break;

        case "PRE":
            tokens.push({
                type: TokenType.WrapperNode,
                payload: {
                    type: "code"
                }
            });
            break;

        case "H1":
            tokens.push({
                type: TokenType.BlockNode,
                payload: {
                    type: "heading-one"
                }
            });
            break;

        case "H2":
            tokens.push({
                type: TokenType.BlockNode,
                payload: {
                    type: "heading-two"
                }
            });
            break;

        case "H3":
            tokens.push({
                type: TokenType.BlockNode,
                payload: {
                    type: "heading-three"
                }
            });
            break;

        case "H4":
            tokens.push({
                type: TokenType.BlockNode,
                payload: {
                    type: "heading-four"
                }
            });
            break;

        case "H5":
            tokens.push({
                type: TokenType.BlockNode,
                payload: {
                    type: "heading-five"
                }
            });
            break;

        case "H6":
            tokens.push({
                type: TokenType.BlockNode,
                payload: {
                    type: "heading-six"
                }
            });
            break;

        case "BLOCKQUOTE":
            tokens.push({
                type: TokenType.BlockNode,
                payload: {
                    type: "blockquote"
                }
            });
            break;

        case "P":
            tokens.push({
                type: TokenType.BlockNode,
                payload: {
                    type: "paragraph"
                }
            });
            break;

        case "LI":
            if (context.wrapper.type === "unordered-list") {
                tokens.push({
                    type: TokenType.BlockNode,
                    payload: {
                        type: "unordered-list-item"
                    }
                });
            } else if (context.wrapper.type === "ordered-list") {
                tokens.push({
                    type: TokenType.BlockNode,
                    payload: {
                        type: "ordered-list-item"
                    }
                });
            }
            break;

        case "DIV":
        case "BR":
            if (context.wrapper.type === "code") {
                tokens.push({
                    type: TokenType.BlockNode,
                    payload: {
                        type: "code"
                    }
                });
            }
            break;

        case "A":
            tokens.push({
                type: TokenType.InlineStyle,
                payload: {
                    link: node.getAttribute("href")
                }
            });
            break;

        case "B":
        case "STRONG":
            tokens.push({
                type: TokenType.InlineStyle,
                payload: {
                    bold: true
                }
            });
            break;

        case "I":
        case "EM":
            tokens.push({
                type: TokenType.InlineStyle,
                payload: {
                    italic: true
                }
            });
            break;

        case "U":
            tokens.push({
                type: TokenType.InlineStyle,
                payload: {
                    underline: true
                }
            });
            break;

        case "S":
        case "DEL":
            tokens.push({
                type: TokenType.InlineStyle,
                payload: {
                    strikethrough: true
                }
            });
            break;

        case "CODE":
            tokens.push({
                type: TokenType.InlineStyle,
                payload: {
                    code: true
                }
            });
            break;
    }

    return tokens;
}
