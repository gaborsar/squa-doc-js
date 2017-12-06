import getPosition from "./getPosition";

export default function getRange(
  rootNode,
  anchorNode,
  anchorOffset,
  focusNode,
  focusOffset
) {
  return {
    startOffset: getPosition(rootNode, anchorNode, anchorOffset),
    endOffset: getPosition(rootNode, focusNode, focusOffset)
  };
}
