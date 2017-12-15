import isElementNode from "./isElementNode";
import isBlockNode from "./isBlockNode";
import findParentNode from "./findParentNode";

export default function findBlockParentNode(node) {
  return findParentNode(node, node => isElementNode(node) && isBlockNode(node));
}
