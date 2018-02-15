export default function renderMark(mark) {
  switch (mark.type) {
    case "align":
      return {
        className: `ed-align-${mark.value}`
      };

    case "indent":
      return {
        className: `ed-indent-${mark.value}`
      };

    case "link":
      return {
        component: "a",
        props: {
          href: mark.value
        }
      };

    case "anchor":
      return {
        className: `ed-anchor-${mark.value}`
      };

    case "bold":
      return {
        component: "b"
      };

    case "italic":
      return {
        component: "i"
      };

    case "underline":
      return {
        component: "u"
      };

    case "strikethrough":
      return {
        component: "s"
      };

    case "code":
      return {
        component: "code"
      };

    case "color":
      return {
        style: {
          color: mark.value
        }
      };
  }
}
