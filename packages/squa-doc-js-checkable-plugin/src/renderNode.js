import { NodeType } from "squa-doc-js";
import Checkable from "./Checkable";

export default function renderNode(node, { createChange, onChange }) {
    if (
        node.type === NodeType.Block &&
        node.getAttribute("type") === "checkable"
    ) {
        return {
            component: Checkable,
            props: {
                internal: {
                    node,
                    createChange,
                    onChange
                }
            }
        };
    }
}
