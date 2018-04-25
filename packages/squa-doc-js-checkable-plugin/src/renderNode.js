import Checkable from "./Checkable";

export default function renderNode(node, { createChange, onChange }) {
  if (
    node.getNodeType() === "block" &&
    node.getAttribute("type") === "checkable"
  ) {
    return {
      component: Checkable,
      props: {
        internal: {
          node,
          createChange,
          onChange
        }
      }
    };
  }
}
