import Delta from "quill-delta";
import SpecialCharacter from "../model/SpecialCharacter";

const defaultContext = {
  table: {},
  row: {},
  cell: {},
  wrapper: {},
  block: {},
  inline: {}
};

export default function parseNode(
  node,
  tokenizeNode,
  tokenizeClassName,
  parentContext = defaultContext
) {
  let context = parentContext;
  let delta = new Delta();

  if (node.nodeType === Node.TEXT_NODE) {
    delta.insert(node.nodeValue, context.inline);
  } else if (
    node.nodeType === Node.ELEMENT_NODE &&
    !node.hasOwnProperty("data-ignore")
  ) {
    let tokens = tokenizeNode(node, context);

    if (node.classList !== undefined) {
      for (let i = 0, l = node.classList.length; i < l; i++) {
        tokens = tokens.concat(
          tokenizeClassName(node.classList.item(i), context)
        );
      }
    }

    let isTable = false;
    let isRow = false;
    let isCell = false;
    let isBlock = false;
    let isBlockEmbed = false;
    let isInlineEmbed = false;
    let embedValue;

    for (const token of tokens) {
      const { type, payload } = token;

      switch (type) {
        case "table-node":
          isTable = true;
          break;

        case "table-row-node":
          isRow = true;
          break;

        case "table-cell-node":
          isCell = true;
          break;

        case "wrapper-node":
          context = {
            ...context,
            wrapper: {
              ...context.wrapper,
              ...payload
            }
          };
          break;

        case "block-node":
          isBlock = true;
          context = {
            ...context,
            block: {
              ...context.block,
              ...payload
            }
          };
          break;

        case "block-embed-node":
          isBlockEmbed = true;
          embedValue = payload;
          break;

        case "inline-embed-node":
          isInlineEmbed = true;
          embedValue = payload;
          break;

        case "table-style":
          context = {
            ...context,
            table: {
              ...context.table,
              ...payload
            }
          };
          break;

        case "table-row-style":
          context = {
            ...context,
            row: {
              ...context.row,
              ...payload
            }
          };
          break;

        case "table-cell-style":
          context = {
            ...context,
            cell: {
              ...context.cell,
              ...payload
            }
          };
          break;

        case "block-style":
          context = {
            ...context,
            block: {
              ...context.block,
              ...payload
            }
          };
          break;

        case "inline-style":
          context = {
            ...context,
            inline: {
              ...context.inline,
              ...payload
            }
          };
          break;
      }
    }

    if (isTable) {
      delta.insert(SpecialCharacter.TableStart, context.table);
    } else if (isRow) {
      delta.insert(SpecialCharacter.TableRowStart, context.row);
    } else if (isCell) {
      delta.insert(SpecialCharacter.TableCellStart, context.cell);
    }

    if (isBlockEmbed) {
      delta.insert(embedValue, context.block);
    } else if (isInlineEmbed) {
      delta.insert(embedValue, context.inline);
    } else {
      for (const child of node.childNodes) {
        delta = delta.concat(
          parseNode(child, tokenizeNode, tokenizeClassName, context)
        );
      }
    }

    if (isTable) {
      delta.insert(SpecialCharacter.TableEnd);
    } else if (isBlock) {
      delta.insert(SpecialCharacter.BlockEnd, context.block);
    }
  }

  return delta;
}
