import { NodeType } from "squa-doc-js";
import BlockImage from "./BlockImage";

export default function renderNode(node, { createChange, onChange }) {
    if (node.type === NodeType.BlockEmbed && node.name === "block-image") {
        return {
            component: BlockImage,
            props: {
                internals: {
                    node,
                    createChange,
                    onChange
                }
            }
        };
    }
}
