const checkableObj = {
    className: "Checkable"
};

const checkedObj = {
    className: "Checkable-checked"
};

export default function renderMark(mark) {
    if (mark.name === "type" && mark.value === "checkable") {
        return checkableObj;
    }
    if (mark.name === "checked") {
        return checkedObj;
    }
}
