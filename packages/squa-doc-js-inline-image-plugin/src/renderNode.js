import { NodeType } from "squa-doc-js";
import InlineImage from "./InlineImage";

export default function renderNode(node) {
    if (node.type === NodeType.InlineEmbed && node.name === "inline-image") {
        return {
            component: InlineImage,
            props: { node }
        };
    }
}
