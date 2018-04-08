export default function renderMark(mark) {
  if (mark.type === "type" && mark.value === "checkable") {
    return {
      className: "Checkable"
    };
  }
  if (mark.type === "checked") {
    return {
      className: "Checkable-checked"
    };
  }
}
