function onKeyDownBackspace(change, event) {
  const value = change.getValue();

  const document = value.getDocument();
  const selection = value.getSelection();

  if (!selection.isCollapsed()) {
    return false;
  }

  const pos = document.findChildAtOffset(
    selection.getOffset(),
    node => node.getNodeType() === "block"
  );

  if (pos === null) {
    return false;
  }

  const block = pos.getNode();

  if (!block.isEmpty() || block.getAttribute("type") !== "checkable") {
    return false;
  }

  event.preventDefault();

  let newBlock;

  const depth = block.getAttribute("indent");

  if (depth) {
    newBlock = block.setAttributes({ indent: depth - 1 });
  } else {
    newBlock = block.setAttributes({ type: null, indent: null });
  }

  change.replaceNode(newBlock, block).save();

  return true;
}

function onKeyDownEnter(change, event) {
  const value = change.getValue();

  const document = value.getDocument();
  const selection = value.getSelection();

  if (!selection.isCollapsed()) {
    return false;
  }

  const pos = document.findChildAtOffset(
    selection.getOffset(),
    node => node.getNodeType() === "block"
  );

  if (pos === null) {
    return false;
  }

  const block = pos.getNode();

  if (block.getAttribute("type") !== "checkable") {
    return false;
  }

  event.preventDefault();

  if (block.isEmpty()) {
    let newBlock;

    const depth = block.getAttribute("indent");

    if (depth) {
      newBlock = block.setAttributes({ indent: depth - 1 });
    } else {
      newBlock = block.setAttributes({ type: null, indent: null });
    }

    change.replaceNode(newBlock, block).save();
  } else {
    change
      .insertText("\n", block.getAttributes())
      .setBlockAttributes({ checked: null })
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
