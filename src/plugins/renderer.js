import BlockImage from "./BlockImage";
import InlineImage from "./InlineImage";

export function renderWrapper(node) {
  switch (node.type) {
    case "unordered-list-item":
      return { component: "ul" };

    case "ordered-list-item":
      return { component: "ol" };

    case "code":
      return { component: "pre" };

    default:
      return {};
  }
}

export function renderBlock(node) {
  switch (node.type) {
    case "unordered-list-item":
      return { component: "li" };

    case "ordered-list-item":
      return { component: "li" };

    case "code":
      return { component: "div" };

    case "heading-one":
      return { component: "h1" };

    case "heading-two":
      return { component: "h2" };

    case "heading-three":
      return { component: "h3" };

    case "heading-four":
      return { component: "h4" };

    case "heading-five":
      return { component: "h5" };

    case "heading-six":
      return { component: "h6" };

    case "paragraph":
      return { component: "p" };

    case "blockquote":
      return { component: "blockquote" };

    default:
      return {};
  }
}

export function renderEmbed(node) {
  switch (node.type) {
    case "block-image":
      return { component: BlockImage, props: { node } };

    case "inline-image":
      return { component: InlineImage, props: { node } };

    default:
      return {};
  }
}

export function renderMark(mark) {
  switch (mark.type) {
    case "align":
      return { className: `ed-align-${mark.value}` };

    case "indent":
      return { className: `ed-indent-${mark.value}` };

    case "link":
      return { component: "a", props: { href: mark.value } };

    case "anchor":
      return { className: `ed-anchor-${mark.value}` };

    case "bold":
      return { component: "b" };

    case "italic":
      return { component: "i" };

    case "underline":
      return { component: "u" };

    case "code":
      return { component: "code" };

    default:
      return {};
  }
}
