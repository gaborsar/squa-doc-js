import getNativePosition from "./getNativePosition";

export default function getNativeRange(rootNode, startOffset, endOffset) {
  const { node: anchorNode, offset: anchorOffset } = getNativePosition(
    rootNode,
    startOffset
  );

  const { node: focusNode, offset: focusOffset } = getNativePosition(
    rootNode,
    endOffset
  );

  return { anchorNode, anchorOffset, focusNode, focusOffset };
}
