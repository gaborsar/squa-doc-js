function onKeyDownBackspace(change, event) {
  const { value } = change;
  const { document, selection } = value;
  const { isCollapsed, anchorOffset } = selection;

  if (!isCollapsed) {
    return false;
  }

  const pos = document.findPosition(anchorOffset);

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

function onKeyDownEnter(change, event) {
  const { value } = change;
  const { document, selection } = value;
  const { isCollapsed, anchorOffset } = selection;

  if (!isCollapsed) {
    return false;
  }

  const pos = document.findPosition(anchorOffset);

  if (!pos) {
    return false;
  }

  const { node: block } = pos;

  if (block.isEmbed || block.type !== "checkable") {
    return false;
  }

  event.preventDefault();

  if (block.isEmpty) {
    const newBlock = block.format({
      type: null,
      checked: null
    });

    change.replaceBlock(newBlock, block).save();
  } else {
    change
      .insertText("\n", block.style.toObject())
      .formatBlock({ checked: null })
      .save();
  }

  return true;
}

export default function onKeyDown(change, event) {
  if (event.key === "Backspace") {
    return onKeyDownBackspace(change, event);
  }

  if (event.key === "Enter") {
    return onKeyDownEnter(change, event);
  }

  return false;
}