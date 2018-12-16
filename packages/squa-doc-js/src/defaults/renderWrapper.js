import { isBlockNode } from "../model/Predicates";

const blockMap = {
    "unordered-list-item": {
        component: "ul"
    },
    "ordered-list-item": {
        component: "ol"
    },
    code: {
        component: "pre"
    }
};

export default function renderWrapper(node) {
    if (isBlockNode(node)) {
        return blockMap[node.getAttribute("type")];
    }
}
