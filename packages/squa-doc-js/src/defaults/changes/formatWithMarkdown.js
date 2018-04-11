export default function formatWithMarkdown(
  change,
  { blockMatchers = [], inlineMatchers = [] }
) {
  const { value } = change;
  const { document, selection } = value;
  const { isCollapsed } = selection;

  if (!isCollapsed) {
    return;
  }

  const { offset } = selection;

  const pos = document.findPosition(offset);

  if (!pos) {
    return;
  }

  const { node: block, offset: blockOffset } = pos;

  if (block.isEmbed) {
    return;
  }

  const text = block.text.slice(0, blockOffset);

  if (!block.type || block.type === "paragraph") {
    for (const { expr, type } of blockMatchers) {
      if (expr.test(text)) {
        const [{ length }] = text.match(expr);

        const newBlock = block.deleteAt(0, length).format({ type });
        const newOffset = offset - length;

        change
          .replaceBlock(newBlock, block)
          .select(newOffset, newOffset)
          .save();

        return;
      }
    }
  }

  for (const { expr, type } of inlineMatchers) {
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
        .format(lengthB, { [type]: true })
        .delete(lengthC)
        .build();

      const newOffset = offset - lengthA - lengthC;

      change
        .replaceBlock(newBlock, block)
        .select(newOffset, newOffset)
        .save();

      return;
    }
  }
}
