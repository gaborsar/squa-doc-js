import Checkable from "./components/Checkable";

function checkableRenderFn(node, defaultProps) {
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

export default function blockRenderFn(node, defaultProps) {
  if (node.type === "checkable") {
    return checkableRenderFn(node, defaultProps);
  }
}
