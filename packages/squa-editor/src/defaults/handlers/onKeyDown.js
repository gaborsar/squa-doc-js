import indent from "../changes/indent";
import outdent from "../changes/outdent";
import toggleBold from "../changes/toggleBold";
import toggleItalic from "../changes/toggleItalic";

import {
  KEY_BACKSPACE,
  KEY_ENTER,
  KEY_TAB,
  KEY_B,
  KEY_I
} from "../../constants";

function removeListItem(change, event) {
  const { value } = change;
  const { document, selection } = value;
  const { isCollapsed, anchorOffset } = selection;

  if (!isCollapsed) {
    return false;
  }

  const pos = document.createPosition(anchorOffset);

  if (!pos || pos.offset !== 0) {
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

  const newBlock = block.format({
    type: null
  });

  change.replaceBlock(newBlock, block).save();

  return true;
}

function onIndent(change, event) {
  event.preventDefault();

  change.call(indent).save();

  return true;
}

function onOutdent(change, event) {
  event.preventDefault();

  change.call(outdent).save();

  return true;
}

function onToggleBold(change, event) {
  event.preventDefault();

  change.call(toggleBold).save();

  return true;
}

function onToggleItalic(change, event) {
  event.preventDefault();

  change.call(toggleItalic).save();

  return true;
}

export default function onKeyDown(change, event) {
  if (event.key === "Backspace") {
    return removeListItem(change, event);
  }

  if (event.key === "Enter") {
    return removeListItem(change, event);
  }

  if (event.key === "Tab") {
    if (event.shiftKey) {
      return onOutdent(change, event);
    } else {
      return onIndent(change, event);
    }
  }

  if (event.metaKey && event.key === "b") {
    return onToggleBold(change, event);
  }

  if (event.metaKey && event.key === "i") {
    return onToggleItalic(change, event);
  }

  if (event.ctrlKey && event.key === "b") {
    return onToggleBold(change, event);
  }

  if (event.ctrlKey && event.key === "i") {
    return onToggleItalic(change, event);
  }

  return false;
}
