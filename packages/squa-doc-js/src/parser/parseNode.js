import Delta from "quill-delta";
import SpecialCharacter from "../model/SpecialCharacter";
import TokenType from "./TokenType";

const defaultContext = {
    table: {},
    row: {},
    cell: {},
    wrapper: {},
    block: {},
    inline: {}
};

export default function parseNode(
    node,
    tokenizeNode,
    tokenizeClassName,
    parentContext = defaultContext
) {
    let context = parentContext;
    let delta = new Delta();

    if (node.nodeType === Node.TEXT_NODE) {
        delta.insert(node.nodeValue, context.inline);
    } else if (
        node.nodeType === Node.ELEMENT_NODE &&
        !node.hasOwnProperty("data-ignore")
    ) {
        let tokens = tokenizeNode(node, context);

        if (node.classList !== undefined) {
            for (let i = 0, l = node.classList.length; i < l; i++) {
                tokens = tokens.concat(
                    tokenizeClassName(node.classList.item(i), context)
                );
            }
        }

        let isTable = false;
        let isRow = false;
        let isCell = false;
        let isBlock = false;
        let isBlockEmbed = false;
        let isInlineEmbed = false;
        let embedValue = null;

        for (const token of tokens) {
            const { type, payload } = token;

            switch (type) {
                case TokenType.TableNode:
                    isTable = true;
                    break;

                case TokenType.TableRowNode:
                    isRow = true;
                    break;

                case TokenType.TableCellNode:
                    isCell = true;
                    break;

                case TokenType.WrapperNode:
                    context = {
                        ...context,
                        wrapper: {
                            ...context.wrapper,
                            ...payload
                        }
                    };
                    break;

                case TokenType.BlockNode:
                    isBlock = true;
                    context = {
                        ...context,
                        block: {
                            ...context.block,
                            ...payload
                        }
                    };
                    break;

                case TokenType.BlockEmbedNode:
                    isBlockEmbed = true;
                    embedValue = payload;
                    break;

                case TokenType.InlineEmbedNode:
                    isInlineEmbed = true;
                    embedValue = payload;
                    break;

                case TokenType.TableStyle:
                    context = {
                        ...context,
                        table: {
                            ...context.table,
                            ...payload
                        }
                    };
                    break;

                case TokenType.TableRowStyle:
                    context = {
                        ...context,
                        row: {
                            ...context.row,
                            ...payload
                        }
                    };
                    break;

                case TokenType.TableCellStyle:
                    context = {
                        ...context,
                        cell: {
                            ...context.cell,
                            ...payload
                        }
                    };
                    break;

                case TokenType.BlockStyle:
                    context = {
                        ...context,
                        block: {
                            ...context.block,
                            ...payload
                        }
                    };
                    break;

                case TokenType.InlineStyle:
                    context = {
                        ...context,
                        inline: {
                            ...context.inline,
                            ...payload
                        }
                    };
                    break;
            }
        }

        if (isTable) {
            delta.insert(SpecialCharacter.TableStart, context.table);
        } else if (isRow) {
            delta.insert(SpecialCharacter.RowStart, context.row);
        } else if (isCell) {
            delta.insert(SpecialCharacter.CellStart, context.cell);
        }

        if (isBlockEmbed) {
            delta.insert(embedValue, context.block);
        } else if (isInlineEmbed) {
            delta.insert(embedValue, context.inline);
        } else {
            for (const child of node.childNodes) {
                delta = delta.concat(
                    parseNode(child, tokenizeNode, tokenizeClassName, context)
                );
            }
        }

        if (isTable) {
            delta.insert(SpecialCharacter.TableEnd);
        } else if (isBlock) {
            delta.insert(SpecialCharacter.BlockEnd, context.block);
        }
    }

    return delta;
}
