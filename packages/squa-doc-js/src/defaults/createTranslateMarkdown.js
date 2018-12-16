import { isBlockNode } from "../model/Predicates";

export default function createTranslateMarkdown({
    lineMatchers = [],
    textMatchers = []
}) {
    return change => {
        const { value } = change;
        const { document, selection } = value;

        if (selection.isExpanded()) {
            return;
        }

        const pos = document.findDescendantAtOffset(
            selection.offset,
            isBlockNode
        );
        if (pos === null) {
            return;
        }

        const { node: block } = pos;
        const type = block.getAttribute("type");
        const text = block.text.slice(0, pos.offset);

        if (type === null || type === "paragraph") {
            for (const { expr, attributes } of lineMatchers) {
                if (expr.test(text)) {
                    const [{ length }] = text.match(expr);

                    const nextBlock = block
                        .editor()
                        .delete(length)
                        .retain(Infinity)
                        .build()
                        .setAttributes(attributes);

                    change
                        .replaceNode(nextBlock, block)
                        .select(selection.offset - length, 0)
                        .save();

                    return;
                }
            }
        }

        for (const { expr, attributes } of textMatchers) {
            if (expr.test(text)) {
                const [
                    { length: totalLength },
                    { length: lengthA },
                    { length: lengthB },
                    { length: lengthC }
                ] = text.match(expr);

                const nextBlock = block
                    .editor()
                    .retain(pos.offset - totalLength)
                    .delete(lengthA)
                    .retain(lengthB, attributes)
                    .delete(lengthC)
                    .retain(Infinity)
                    .build();

                change
                    .replaceNode(nextBlock, block)
                    .select(selection.offset - lengthA - lengthC, 0)
                    .save();

                return;
            }
        }
    };
}
