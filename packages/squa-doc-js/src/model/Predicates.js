import SpecialCharacter from "./SpecialCharacter";

// Nodes

export function isParentNode(node) {
  return node.hasOwnProperty("children");
}

export function isTableNode(node) {
  return node.getNodeType() === "table";
}

export function isTableStartNode(node) {
  return node.getNodeType() === "table-start";
}

export function isTableEndNode(node) {
  return node.getNodeType() === "table-end";
}

export function isTableCellNode(node) {
  return node.getNodeType() === "table-cell";
}

export function isTableCellStartNode(node) {
  return node.getNodeType() === "table-cell-start";
}

export function isTableRowNode(node) {
  return node.getNodeType() === "table-row";
}

export function isTableRowStartNode(node) {
  return node.getNodeType() === "table-row-start";
}

export function isBlockNode(node) {
  return node.getNodeType() === "block";
}

export function isBlockEndNode(node) {
  return node.getNodeType() === "block-end";
}

export function isBlockEmbedNode(node) {
  return node.getNodeType() === "block-embed";
}

export function isTextNode(node) {
  return node.getNodeType() === "text";
}

export function isInlineEmbedNode(node) {
  return node.getNodeType() === "inline-embed";
}

export function isBlockOrBlockEmbedNode(node) {
  return isBlockNode(node) || isBlockEmbedNode(node);
}

export function isTextOrInlineEmbedNode(node) {
  return isTextNode(node) || isInlineEmbedNode(node);
}

// Special characters

export function isTableStartCharacter(char) {
  return char === SpecialCharacter.TableStart;
}

export function isTableEndCharacter(char) {
  return char === SpecialCharacter.TableEnd;
}

export function isTableRowStartCharacter(char) {
  return char === SpecialCharacter.TableRowStart;
}

export function isTableCellStartCharacter(char) {
  return char === SpecialCharacter.TableCellStart;
}

export function isBlockEndCharacter(char) {
  return char === SpecialCharacter.BlockEnd;
}
