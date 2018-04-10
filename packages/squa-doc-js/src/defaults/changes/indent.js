const INDENT_MAX = 5;

function indentBlock(change, block) {
  let depth = block.getMark("indent");

  if (depth === INDENT_MAX) {
    return;
  }

  depth = (depth || 0) + 1;

  const newBlock = block.format({ indent: depth });

  change.replaceBlock(newBlock, block);
}

export default function indent(change) {
  const { value } = change;
  const { document, selection } = value;
  const { isCollapsed } = selection;

  if (isCollapsed) {
    const { offset } = selection;

    const pos = document.findPosition(offset);

    if (pos) {
      indentBlock(change, pos.node);
    }
  } else {
    const { startOffset, endOffset } = selection;

    const range = document.createRange(startOffset, endOffset);

    range.forEach(el => {
      indentBlock(change, el.node);
    });
  }
}
