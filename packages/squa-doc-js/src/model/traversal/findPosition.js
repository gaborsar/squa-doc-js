import Position from "./Position";

export default function findPosition(nodes, offset, inclusive = false) {
  let remainingOffset = offset;

  for (let index = 0, l = nodes.length; index < l; index++) {
    const node = nodes[index];
    const nodeLength = node.getLength();

    if (
      remainingOffset < nodeLength ||
      (inclusive && remainingOffset === nodeLength)
    ) {
      return new Position(node, index, remainingOffset);
    }

    remainingOffset -= nodeLength;
  }

  return null;
}
