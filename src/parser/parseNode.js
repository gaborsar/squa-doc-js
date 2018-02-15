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
    let tokens;

    if (customTokenizeNode) {
      tokens = customTokenizeNode(node, context);
    }

    if (tokens === undefined) {
      tokens = [];
    }

    if (tokens) {
      tokens.push(...defaultTokenizeNode(node, context));

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
          delta = delta.concat(parseNode(child, customTokenizeNode, context));
        }

        if (isBlock) {
          delta.insert(EOL, context.block);
        }
      }
    }
  }

  return delta;
}
