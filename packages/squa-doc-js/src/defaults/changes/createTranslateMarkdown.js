import { isBlockNode } from "../../model/Predicates";

export default function createTranslateMarkdown({
  lineMatchers = [],
  textMatchers = []
}) {
  return change => {
    const value = change.getValue();

    const document = value.getDocument();
    const selection = value.getSelection();

    if (!selection.isCollapsed()) {
      return;
    }

    const offset = selection.getOffset();

    const pos = document.findChildAtOffset(offset, isBlockNode);

    if (pos === null) {
      return;
    }

    const block = pos.getNode();
    const blockOffset = pos.getOffset();

    const blockType = block.getAttribute("type");
    const text = block.getText().slice(0, blockOffset);

    if (blockType === null || blockType === "paragraph") {
      for (const { expr, attributes } of lineMatchers) {
        if (expr.test(text)) {
          const [{ length }] = text.match(expr);

          const newBlock = block
            .edit()
            .delete(length)
            .retain(Infinity)
            .build()
            .setAttributes(attributes);

          change
            .replaceNode(newBlock, block)
            .select(offset - length, 0)
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

        const newBlock = block
          .edit()
          .retain(blockOffset - totalLength)
          .delete(lengthA)
          .retain(lengthB, attributes)
          .delete(lengthC)
          .retain(Infinity)
          .build();

        change
          .replaceNode(newBlock, block)
          .select(offset - lengthA - lengthC, 0)
          .save();

        return;
      }
    }
  };
}
