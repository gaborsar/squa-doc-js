export default function renderNode(node) {
  switch (node.getAttribute("type")) {
    case "heading-one":
      return {
        component: "h1"
      };

    case "heading-two":
      return {
        component: "h2"
      };

    case "heading-three":
      return {
        component: "h3"
      };

    case "heading-four":
      return {
        component: "h4"
      };

    case "heading-five":
      return {
        component: "h5"
      };

    case "heading-six":
      return {
        component: "h6"
      };

    case "blockquote":
      return {
        component: "blockquote"
      };

    case "unordered-list-item":
      return {
        wrapper: "ul",
        component: "li"
      };

    case "ordered-list-item":
      return {
        wrapper: "ol",
        component: "li"
      };

    case "code":
      return {
        wrapper: "pre",
        component: "div"
      };

    default:
      return {
        component: "p"
      };
  }
}
