import Checkable from "../Checkable";

function renderCheckable(node, defaultProps) {
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

export default function renderBlock(node, defaultProps) {
  if (node.type === "checkable") {
    return renderCheckable(node, defaultProps);
  }
}
