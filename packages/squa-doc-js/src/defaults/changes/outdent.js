function outdentBlock(change, block) {
  let depth = block.getMark("indent");

  if (!depth) {
    return;
  }

  depth = depth - 1 || null;

  const newBlock = block.format({ depth });

  change.replaceBlock(newBlock, block);
}

export default function outdent(change) {
  const { value } = change;
  const { document, selection } = value;
  const { isCollapsed } = selection;

  if (isCollapsed) {
    const { offset } = selection;

    const pos = document.findPosition(offset);

    if (pos) {
      outdentBlock(change, pos.node);
    }
  } else {
    const { startOffset, endOffset } = selection;

    const range = document.createRange(startOffset, endOffset);

    range.forEach(el => {
      outdentBlock(change, el.node);
    });
  }
}
