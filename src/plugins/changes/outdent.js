function outdentBlock(change, block) {
  const { attributes } = block;

  if (attributes.indent) {
    if (attributes.indent > 1) {
      change.replaceBlock(
        block.format({
          indent: Math.max(attributes.indent - 1, 0)
        }),
        block
      );
    } else {
      change.replaceBlock(
        block.format({
          indent: null
        }),
        block
      );
    }
  }
}

export default function outdent(change) {
  const { value } = change;
  const { document, selection } = value;

  const { isCollapsed } = selection;

  if (isCollapsed) {
    const { offset } = selection;

    const pos = document.createPosition(offset);

    if (pos) {
      const { node: block } = pos;

      outdentBlock(change, block);
    }
  } else {
    const { startOffset, endOffset } = selection;

    document.createRange(startOffset, endOffset).forEach(el => {
      const { node: block } = el;

      outdentBlock(change, block);
    });
  }
}
