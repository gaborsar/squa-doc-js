import Position from "./Position";

export default function findPosition(nodes, offset, inclusive = false) {
  for (let i = 0, l = nodes.length; i < l; i++) {
    const node = nodes[i];
    const nodeLength = node.length;

    if (offset < nodeLength || (inclusive && offset === nodeLength)) {
      return new Position(node, i, offset);
    }

    offset -= nodeLength;
  }
}
