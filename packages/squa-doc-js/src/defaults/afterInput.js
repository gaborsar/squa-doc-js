const blockMatchers = [
  { expr: /^\s*\*\s+$/, type: "unordered-list-item" },
  { expr: /^\s*1[.)]\s+$/, type: "ordered-list-item" },
  { expr: /^\s*```$/, type: "code" },
  { expr: /^\s*>\s+$/, type: "blockquote" }
];

export default function afterInput(change) {
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

  const { text } = block;
  const leftText = text.slice(0, blockOffset);

  let newBlock = block;
  let newOffset = offset;

  if (!newBlock.type || newBlock.type === "paragraph") {
    for (const { expr, type } of blockMatchers) {
      if (expr.test(leftText)) {
        const [{ length }] = leftText.match(expr);

        newBlock = newBlock.deleteAt(0, length).format({ type });
        newOffset -= length;
      }
    }
  }

  if (newBlock !== block) {
    change
      .replaceBlock(newBlock, block)
      .select(newOffset, newOffset)
      .save();
  }
}
