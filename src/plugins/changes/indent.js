import { INDENT_MAX } from "../../constants";

function indentBlock(change, block) {
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

export default function indent(change) {
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
