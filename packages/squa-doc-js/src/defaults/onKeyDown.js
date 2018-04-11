import indent from "./changes/indent";
import outdent from "./changes/outdent";
import toggleBold from "./changes/toggleBold";
import toggleItalic from "./changes/toggleItalic";

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

  if (block.isEmbed || !block.isEmpty) {
    return false;
  }

  if (
    block.type !== "unordered-list-item" &&
    block.type !== "ordered-list-item"
  ) {
    return false;
  }

  event.preventDefault();

  let newBlock;

  const depth = block.getMark("indent");

  if (depth) {
    newBlock = block.format({ indent: depth - 1 });
  } else {
    newBlock = block.format({ type: null, indent: null });
  }

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

  if (block.isEmbed || !block.isEmpty || !block.type) {
    return false;
  }

  event.preventDefault();

  let newBlock;

  if (
    block.type === "unordered-list-item" ||
    block.type === "ordered-list-item"
  ) {
    const depth = block.getMark("indent");

    if (depth) {
      newBlock = block.format({ indent: depth - 1 });
    } else {
      newBlock = block.format({ type: null, indent: null });
    }
  } else {
    newBlock = block.format({ type: null });
  }

  change.replaceBlock(newBlock, block).save();

  return true;
}

function onKeyDownIndent(change, event) {
  event.preventDefault();

  change.call(indent).save();

  return true;
}

function onKeyDownOutdent(change, event) {
  event.preventDefault();

  change.call(outdent).save();

  return true;
}

function onKeyDownToggleBold(change, event) {
  event.preventDefault();

  change.call(toggleBold).save();

  return true;
}

function onKeyDownToggleItalic(change, event) {
  event.preventDefault();

  change.call(toggleItalic).save();

  return true;
}

export default function onKeyDown(change, event) {
  if (event.key === "Backspace") {
    return onKeyDownBackspace(change, event);
  }

  if (event.key === "Enter") {
    return onKeyDownEnter(change, event);
  }

  if (event.key === "Tab") {
    if (event.shiftKey) {
      return onKeyDownOutdent(change, event);
    } else {
      return onKeyDownIndent(change, event);
    }
  }

  if ((event.metaKey || event.ctrlKey) && event.key === "b") {
    return onKeyDownToggleBold(change, event);
  }

  if ((event.metaKey || event.ctrlKey) && event.key === "i") {
    return onKeyDownToggleItalic(change, event);
  }

  return false;
}
