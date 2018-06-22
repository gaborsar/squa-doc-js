export default function renderMark(mark) {
  switch (mark.getName()) {
    case "align":
    case "indent":
    case "anchor":
    case "color":
      return {
        className: `SquaDocJs-${mark.getName()}-${mark.getValue()}`
      };

    case "link":
      return {
        component: "a",
        props: {
          href: mark.getValue()
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
