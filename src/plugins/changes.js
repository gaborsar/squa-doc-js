import { INDENT_MAX } from "../constants";

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

export function indent(change) {
  const { value } = change;
  const { document, selection } = value;

  const { isCollapsed } = selection;

  if (isCollapsed) {
    const { offset } = selection;

    const pos = document.createPosition(offset);

    if (pos) {
      const { node: block } = pos;

      indentBlock(change, block);
    }
  } else {
    const { startOffset, endOffset } = selection;

    document.createRange(startOffset, endOffset).forEach(el => {
      const { node: block } = el;

      indentBlock(change, block);
    });
  }
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

export function outdent(change) {
  const { value } = change;
  const { document, selection } = value;

  const { isCollapsed } = selection;

  if (isCollapsed) {
    const { offset } = selection;

    const pos = document.createPosition(offset);

    if (pos) {
      const { node: block } = pos;

      outdentBlock(change, block);
    }
  } else {
    const { startOffset, endOffset } = selection;

    document.createRange(startOffset, endOffset).forEach(el => {
      const { node: block } = el;

      outdentBlock(change, block);
    });
  }
}

export function toggleBold(change) {
  const { value } = change;

  const attributes = value.getFormat();

  change.formatInline({ bold: attributes.bold ? null : true }).save();
}

export function toggleItalic(change) {
  const { value } = change;

  const attributes = value.getFormat();

  change.formatInline({ italic: attributes.italic ? null : true }).save();
}
