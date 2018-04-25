import { isBlockNode } from "../model/Predicates";
import indent from "./changes/indent";
import outdent from "./changes/outdent";
import toggleBold from "./changes/toggleBold";
import toggleItalic from "./changes/toggleItalic";

function onKeyDownBackspace(change, event) {
  const value = change.getValue();

  const document = value.getDocument();
  const selection = value.getSelection();

  if (!selection.isCollapsed()) {
    return false;
  }

  const pos = document.findChildAtOffset(selection.getOffset(), isBlockNode);

  if (pos === null) {
    return false;
  }

  const block = pos.getNode();

  if (!block.isEmpty()) {
    return false;
  }

  const type = block.getAttribute("type");

  if (type !== "unordered-list-item" && type !== "ordered-list-item") {
    return false;
  }

  event.preventDefault();

  const depth = block.getAttribute("indent") || 0;
  const newBlock =
    depth > 0
      ? block.setAttribute("indent", depth - 1 || null)
      : block.setAttribute("type", null);

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

  const pos = document.findChildAtOffset(selection.getOffset(), isBlockNode);

  if (pos === null) {
    return false;
  }

  const block = pos.getNode();

  if (!block.isEmpty()) {
    return false;
  }

  const type = block.getAttribute("type");

  if (type === null) {
    return false;
  }

  event.preventDefault();

  let newBlock;

  if (type === "unordered-list-item" || type === "ordered-list-item") {
    const depth = block.getAttribute("indent") || 0;
    newBlock =
      depth > 0
        ? block.setAttribute("indent", depth - 1 || null)
        : block.setAttribute("type", null);
  } else {
    newBlock = block.setAttribute("type", null);
  }

  change.replaceNode(newBlock, block).save();

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
