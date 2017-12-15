import { KEY_BACKSPACE, KEY_ENTER } from "../constants";

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

  const { node: blockBefore } = pos;

  if (blockBefore.kind !== "block" || !blockBefore.isEmpty) {
    return false;
  }

  if (
    blockBefore.type !== "unordered-list-item" &&
    blockBefore.type !== "ordered-list-item"
  ) {
    return false;
  }

  event.preventDefault();

  const blockAfter = blockBefore.format({ type: null });

  change.replaceBlock(blockAfter, blockBefore).save();

  return true;
}

export function onKeyDown(change, event) {
  if (event.keyCode === KEY_BACKSPACE) {
    return removeListItem(change, event);
  }

  if (event.keyCode === KEY_ENTER) {
    return removeListItem(change, event);
  }

  return false;
}
