export default function rendermark(mark) {
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
