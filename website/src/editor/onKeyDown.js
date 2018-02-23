function removeCheckable(change, event) {
  const { value } = change;
  const { document, selection } = value;
  const { isCollapsed, anchorOffset } = selection;

  if (!isCollapsed) {
    return false;
  }

  const pos = document.createPosition(anchorOffset);

  if (!pos) {
    return false;
  }

  const { node: block } = pos;

  if (block.isEmbed || !block.isEmpty || block.type !== "checkable") {
    return false;
  }

  event.preventDefault();

  const newBlock = block.format({
    type: null,
    checked: null
  });

  change.replaceBlock(newBlock, block).save();

  return true;
}

export default function onKeyDown(change, event) {
  if (event.key === "Backspace" || event.key === "Enter") {
    return removeCheckable(change, event);
  }

  return false;
}
