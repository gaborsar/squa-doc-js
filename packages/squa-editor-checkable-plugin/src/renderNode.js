import Checkable from "./Checkable";

export default function renderNode(node, defaultProps) {
  if (node.type === "checkable") {
    const { blockKey, formatBlockByKey } = defaultProps;
    return {
      component: Checkable,
      props: {
        blockKey,
        formatBlockByKey,
        checked: !!node.getMark("checked")
      }
    };
  }
}
