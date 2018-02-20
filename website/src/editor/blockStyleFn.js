export default function blockStyleFn(mark) {
  if (mark.type === "type" && mark.value === "checkable") {
    return {
      className: "checkable"
    };
  }
  if (mark.type === "checked") {
    return {
      className: "checked"
    };
  }
}
