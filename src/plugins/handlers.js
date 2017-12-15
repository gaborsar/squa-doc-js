import {
  KEY_BACKSPACE,
  KEY_ENTER,
  KEY_TAB,
  KEY_B,
  KEY_I,
  INDENT_MAX
} from "../constants";

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

function indentBlock(change, block) {
  if (
    block.type === "unordered-list-item" ||
    block.type === "ordered-list-item"
  ) {
    const { attributes } = block;

    if (attributes.indent) {
      if (attributes.indent < INDENT_MAX) {
        change.replaceBlock(
          block.format({
            indent: attributes.indent + 1
          }),
          block
        );
      }
    } else {
      change.replaceBlock(
        block.format({
          indent: 1
        }),
        block
      );
    }
  }
}

function indent(change, event) {
  const { value } = change;
  const { document, selection } = value;

  event.preventDefault();

  const { isCollapsed } = selection;

  if (isCollapsed) {
    const { offset } = selection;

    const pos = document.createPosition(offset);

    if (!pos) {
      return false;
    }

    const { node: block } = pos;

    indentBlock(change, block);
  } else {
    const { startOffset, endOffset } = selection;

    document.createRange(startOffset, endOffset).forEach(el => {
      const { node: block } = el;

      indentBlock(change, block);
    });
  }

  if (change.value !== value) {
    change.save();
  }

  return true;
}

function outdentBlock(change, block) {
  if (
    block.type === "unordered-list-item" ||
    block.type === "ordered-list-item"
  ) {
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
}

function outdent(change, event) {
  const { value } = change;
  const { document, selection } = value;

  event.preventDefault();

  const { isCollapsed } = selection;

  if (isCollapsed) {
    const { offset } = selection;

    const pos = document.createPosition(offset);

    if (!pos) {
      return false;
    }

    const { node: block } = pos;

    outdentBlock(change, block);
  } else {
    const { startOffset, endOffset } = selection;

    document.createRange(startOffset, endOffset).forEach(el => {
      const { node: block } = el;

      outdentBlock(change, block);
    });
  }

  if (change.value !== value) {
    change.save();
  }

  return true;
}

function toggleBold(change, event) {
  const { value } = change;

  event.preventDefault();

  const attributes = value.getFormat();

  change.formatInline({ bold: attributes.bold ? null : true }).save();

  return true;
}

function toggleItalic(change, event) {
  const { value } = change;

  event.preventDefault();

  const attributes = value.getFormat();

  change.formatInline({ italic: attributes.italic ? null : true }).save();

  return true;
}

export function onKeyDown(change, event) {
  if (event.keyCode === KEY_BACKSPACE) {
    return removeListItem(change, event);
  }

  if (event.keyCode === KEY_ENTER) {
    return removeListItem(change, event);
  }

  if (event.keyCode === KEY_TAB) {
    if (event.shiftKey) {
      return outdent(change, event);
    } else {
      return indent(change, event);
    }
  }

  if (event.keyCode === KEY_B && event.metaKey) {
    return toggleBold(change, event);
  }

  if (event.keyCode === KEY_I && event.metaKey) {
    return toggleItalic(change, event);
  }

  if (event.keyCode === KEY_B && event.ctrlKey) {
    return toggleBold(change, event);
  }

  if (event.keyCode === KEY_I && event.ctrlKey) {
    return toggleItalic(change, event);
  }

  return false;
}
