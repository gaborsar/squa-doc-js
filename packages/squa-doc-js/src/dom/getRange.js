import getPosition from "./getPosition";

export default function getRange(
  rootNode,
  anchorNode,
  anchorOffset,
  focusNode,
  focusOffset
) {
  return {
    anchorOffset: getPosition(rootNode, anchorNode, anchorOffset),
    focusOffset: getPosition(rootNode, focusNode, focusOffset)
  };
}
