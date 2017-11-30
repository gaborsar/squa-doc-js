const defaultContext = {
  wrapper: {},
  block: {},
  inline: {}
};

// Accepted tokens:
//
// Update wrapper context:
// {
//   wrapper: {
//     ...
//   }
// }
//
// Update block context:
// {
//   block: {
//     ...
//   }
// }
//
// Update inline context:
// {
//   inline: {
//     ...
//   }
// }
//
// Insert embed:
// {
//   insert: {
//     ...
//   },
//   attributes: {
//     ...
//   }
// }

export default function parseNode(
  node,
  tokenizeNode,
  context = defaultContext
) {
  const ops = [];

  if (node.nodeType === Node.TEXT_NODE) {
    ops.push({
      insert: node.nodeValue,
      attributes: context.inline
    });
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
        ops.push(token);
      }
    }

    if (!isEmbed) {
      for (const child of node.childNodes) {
        ops.push(...parseNode(child, tokenizeNode, context));
      }

      if (isBlock) {
        ops.push({ insert: "\n", attributes: context.block });
      }
    }
  }

  return ops;
}
