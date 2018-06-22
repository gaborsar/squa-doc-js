export default function renderMark(mark) {
  if (mark.getName() === "type" && mark.getValue() === "checkable") {
    return {
      className: "Checkable"
    };
  }
  if (mark.getName() === "checked") {
    return {
      className: "Checkable-checked"
    };
  }
}
