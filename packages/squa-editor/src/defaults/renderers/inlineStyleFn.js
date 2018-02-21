export default function inlineStyleFn(mark) {
  switch (mark.type) {
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
        className: `ed-color-${mark.value}`
      };
  }
}
