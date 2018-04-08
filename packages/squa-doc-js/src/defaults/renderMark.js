export default function renderMark(mark) {
  switch (mark.type) {
    case "align":
    case "indent":
    case "anchor":
    case "color":
      return {
        className: `SquaDocJs-${mark.type}-${mark.value}`
      };

    case "link":
      return {
        component: "a",
        props: {
          href: mark.value
        }
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
  }
}
