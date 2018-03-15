import Checkable from "./Checkable";

export default function renderNode(node, defaultProps) {
  if (node.type === "checkable") {
    const { blockKey, createChange, onChange } = defaultProps;
    return {
      component: Checkable,
      props: {
        blockKey,
        createChange,
        onChange,
        checked: !!node.getMark("checked")
      }
    };
  }
}
