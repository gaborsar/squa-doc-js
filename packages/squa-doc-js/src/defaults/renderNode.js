import {
    isTableNode,
    isRowNode,
    isCellNode,
    isBlockNode
} from "../model/Predicates";
import TableWithBody from "../components/TableWithBody";

const tableObj = {
    component: TableWithBody
};

const rowObj = {
    component: "tr"
};

const cellObj = {
    component: "td"
};

export default function renderNode(node) {
    if (isTableNode(node)) {
        return tableObj;
    }
    if (isRowNode(node)) {
        return rowObj;
    }
    if (isCellNode(node)) {
        return cellObj;
    }
    if (isBlockNode(node)) {
        return renderBlockNode(node);
    }
}

const blockMap = {
    "heading-one": {
        component: "h1"
    },
    "heading-two": {
        component: "h2"
    },
    "heading-three": {
        component: "h3"
    },
    "heading-four": {
        component: "h4"
    },
    "heading-five": {
        component: "h5"
    },
    "heading-six": {
        component: "h6"
    },
    "unordered-list-item": {
        component: "li"
    },
    "ordered-list-item": {
        component: "li"
    },
    paragraph: {
        component: "p"
    },
    blockquote: {
        component: "blockquote"
    },
    code: {
        component: "div"
    }
};

function renderBlockNode(node) {
    return blockMap[node.getAttribute("type")] || blockMap.paragraph;
}
