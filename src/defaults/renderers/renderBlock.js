export default function renderBlock(node) {
  switch (node.type) {
    case "unordered-list-item":
      return {
        component: "li"
      };

    case "ordered-list-item":
      return {
        component: "li"
      };

    case "code":
      return {
        component: "div"
      };

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

    case "paragraph":
      return {
        component: "p"
      };

    case "blockquote":
      return {
        component: "blockquote"
      };

    default:
      return {
        component: "p"
      };
  }
}
