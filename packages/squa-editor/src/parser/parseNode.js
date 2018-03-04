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
  tokenizeClassName,
  context = defaultContext
) {
  let delta = new Delta();

  if (node.nodeType === Node.TEXT_NODE) {
    delta.insert(node.nodeValue, context.inline);
  } else if (
    node.nodeType === Node.ELEMENT_NODE &&
    !node.hasOwnProperty("data-ignore")
  ) {
    let tokens = tokenizeNode(node, context);

    if (node.classList) {
      for (let i = 0; i < node.classList.length; i++) {
        const className = node.classList.item(i);

        tokens = tokens.concat(tokenizeClassName(className, context));
      }
    }

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
        delta = delta.concat(
          parseNode(child, tokenizeNode, tokenizeClassName, context)
        );
      }
      if (isBlock) {
        delta.insert(EOL, context.block);
      }
    }
  }

  return delta;
}
