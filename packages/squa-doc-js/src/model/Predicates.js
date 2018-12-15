import NodeType from "./NodeType";
import SpecialCharacter from "./SpecialCharacter";

export function isParentNode(node) {
    return node.hasOwnProperty("children");
}

export function isTableNode(node) {
    return node.type === NodeType.Table;
}

export function isTableStartNode(node) {
    return node.type === NodeType.TableStart;
}

export function isTableEndNode(node) {
    return node.type === NodeType.TableEnd;
}

export function isRowNode(node) {
    return node.type === NodeType.Row;
}

export function isRowStartNode(node) {
    return node.type === NodeType.RowStart;
}

export function isCellNode(node) {
    return node.type === NodeType.Cell;
}

export function isCellStartNode(node) {
    return node.type === NodeType.CellStart;
}

export function isBlockNode(node) {
    return node.type === NodeType.Block;
}

export function isBlockEndNode(node) {
    return node.type === NodeType.BlockEnd;
}

export function isBlockEmbedNode(node) {
    return node.type === NodeType.BlockEmbed;
}

export function isTextNode(node) {
    return node.type === NodeType.Text;
}

export function isInlineEmbedNode(node) {
    return node.type === NodeType.InlineEmbed;
}

export function isTablePartNode(node) {
    return (
        isTableStartNode(node) ||
        isTableEndNode(node) ||
        isRowNode(node) ||
        isRowStartNode(node) ||
        isCellNode(node) ||
        isCellStartNode(node)
    );
}

export function isBlockLevelNode(node) {
    return isBlockNode(node) || isBlockEmbedNode(node);
}

export function isInlineNode(node) {
    return isTextNode(node) || isInlineEmbedNode(node);
}

export function isTableStartCharacter(char) {
    return char === SpecialCharacter.TableStart;
}

export function isTableEndCharacter(char) {
    return char === SpecialCharacter.TableEnd;
}

export function isRowStartCharacter(char) {
    return char === SpecialCharacter.RowStart;
}

export function isCellStartCharacter(char) {
    return char === SpecialCharacter.CellStart;
}

export function isBlockEndCharacter(char) {
    return char === SpecialCharacter.BlockEnd;
}
