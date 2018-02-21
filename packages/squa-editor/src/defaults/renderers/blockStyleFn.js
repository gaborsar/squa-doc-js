export default function blockStyleFn(mark) {
  switch (mark.type) {
    case "align":
      return {
        className: `ed-align-${mark.value}`
      };

    case "indent":
      return {
        className: `ed-indent-${mark.value}`
      };
  }
}
