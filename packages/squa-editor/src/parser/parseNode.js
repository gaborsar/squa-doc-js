import Delta from "quill-delta";
import defaultTokenizeNode from "../defaults/tokenizers/tokenizeNode";

import { EOL } from "../constants";

const defaultContext = {
  wrapper: {},
  block: {},
  inline: {}
};

export default function parseNode(
  node,
  customTokenizeNode,
  context = defaultContext
) {
  let delta = new Delta();

  if (node.nodeType === Node.TEXT_NODE) {
    delta.insert(node.nodeValue, context.inline);
  } else if (
    node.nodeType === Node.ELEMENT_NODE &&
    !node.hasOwnProperty("data-ignore")
  ) {
    let tokens = [];

    if (customTokenizeNode) {
      tokens = tokens.concat(customTokenizeNode(node, context));
    }

    tokens = tokens.concat(defaultTokenizeNode(node, context));

    let isBlock = false;
    let isBlockEmbed = false;
    let isInlineEmbed = false;

    let embedValue;

    for (const token of tokens) {
      const { type, payload } = token;

      switch (type) {
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

        case "block-embed":
          isBlockEmbed = true;
          embedValue = payload;
          break;

        case "inline-embed":
          isInlineEmbed = true;
          embedValue = payload;
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

    if (isBlockEmbed) {
      delta.insert(embedValue, context.block);
    } else if (isInlineEmbed) {
      delta.insert(embedValue, context.inline);
    } else {
      for (const child of node.childNodes) {
        delta = delta.concat(parseNode(child, customTokenizeNode, context));
      }
      if (isBlock) {
        delta.insert(EOL, context.block);
      }
    }
  }

  return delta;
}
