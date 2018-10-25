export default function renderMark(mark) {
    if (mark.name === "type" && mark.value === "checkable") {
        return {
            className: "Checkable"
        };
    }
    if (mark.name === "checked") {
        return {
            className: "Checkable-checked"
        };
    }
}
