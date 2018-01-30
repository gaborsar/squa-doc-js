export default function renderWrapper(node) {
  switch (node.type) {
    case "unordered-list-item":
      return { component: "ul" };

    case "ordered-list-item":
      return { component: "ol" };

    case "code":
      return { component: "pre" };
  }
}
