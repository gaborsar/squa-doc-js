export default function renderNode(node) {
  if (node.type === "inline-image") {
    return {
      component: "img",
      props: {
        src: node.value[node.type],
        alt: node.getMark("alt")
      }
    };
  }
}
