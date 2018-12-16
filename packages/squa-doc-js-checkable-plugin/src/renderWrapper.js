import { NodeType } from "squa-doc-js";

export default function renderWrapper(node) {
    if (
        node.type === NodeType.Block &&
        node.getAttribute("type") === "checkable"
    ) {
        return {
            component: "div"
        };
    }
}
