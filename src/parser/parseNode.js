import Delta from "quill-delta";

import { EOL } from "../constants";

const defaultContext = {
  wrapper: {},
  block: {},
  inline: {}
};

export default function parseNode(
  node,
  tokenizeNode,
  context = defaultContext
) {
  let delta = new Delta();

  if (node.nodeType === Node.TEXT_NODE) {
    delta.insert(node.nodeValue, context.inline);
  } else if (
    node.nodeType === Node.ELEMENT_NODE &&
    !node.hasOwnProperty("data-ignore")
  ) {
    const tokens = tokenizeNode(node, context);

    let isBlock = false;
    let isEmbed = false;

    for (const token of tokens) {
      if (token.wrapper) {
        context = {
          ...context,
          wrapper: {
            ...context.wrapper,
            ...token.wrapper
          }
        };
      } else if (token.block) {
        if (token.block.type) {
          isBlock = true;
        }
        context = {
          ...context,
          block: {
            ...context.block,
            ...token.block
          }
        };
      } else if (token.inline) {
        context = {
          ...context,
          inline: {
            ...context.inline,
            ...token.inline
          }
        };
      } else if (token.insert) {
        isEmbed = true;
        delta.insert(token.insert, token.attributes);
      }
    }

    if (!isEmbed) {
      for (const child of node.childNodes) {
        delta = delta.concat(parseNode(child, tokenizeNode, context));
      }

      if (isBlock) {
        delta.insert(EOL, context.block);
      }
    }
  }

  return delta;
}
