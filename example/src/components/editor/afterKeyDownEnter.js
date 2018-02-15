export default function afterKeyDownEnter(change) {
  const { value } = change;
  const { document, selection } = value;
  const { anchorOffset } = selection;

  const pos = document.createPosition(anchorOffset);

  if (!pos) {
    return;
  }

  const { node: block } = pos;

  if (block.isEmbed || !block.isEmpty || block.type !== "checkable") {
    return;
  }

  const newBlock = block.format({
    checked: null
  });

  change.replaceBlock(newBlock, block).save();
}
