import normalizeNativePosition from "./normalizeNativePosition";
import getNodeOffset from "./getNodeOffset";

export default function getPosition(rootNode, nativeNode, nativeOffset) {
  const { node, offset } = normalizeNativePosition(nativeNode, nativeOffset);
  return getNodeOffset(rootNode, node) + offset;
}
