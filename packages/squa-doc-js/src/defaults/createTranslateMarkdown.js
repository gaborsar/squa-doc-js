import { isBlockNode } from "../model/Predicates";

export default function createTranslateMarkdown({
    lineMatchers = [],
    textMatchers = []
}) {
    return change => {
        const { value } = change;
        const { document, selection } = value;

        if (selection.isExpanded) {
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
            for (let i = 0, l = lineMatchers.length; i < l; i++) {
                const { expr, attributes } = lineMatchers[i];

                if (expr.test(text)) {
                    const [{ length }] = text.match(expr);

                    const nextBlock = block
                        .editor()
                        .delete(length)
                        .retain(Infinity)
                        .build()
                        .setAttributes(attributes);

                    const nextOffset = selection.offset - length;

                    change
                        .replaceNode(nextBlock, block)
                        .select(nextOffset, nextOffset)
                        .save();

                    return;
                }
            }
        }

        for (let i = 0, l = textMatchers.length; i < l; i++) {
            const { expr, attributes } = textMatchers[i];

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

                const nextOffset = selection.offset - lengthA - lengthC;

                change
                    .replaceNode(nextBlock, block)
                    .select(nextOffset, nextOffset)
                    .save();

                return;
            }
        }
    };
}
