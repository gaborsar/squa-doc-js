import tokenizeBlockImage from "./tokenizeBlockImage";
import tokenizeInlineImage from "./tokenizeInlineImage";
import tokenizeWrapper from "./tokenizeWrapper";
import tokenizeBlock from "./tokenizeBlock";
import tokenizeMark from "./tokenizeMark";

export default function tokenizeNode(node, context) {
  const tokens = [];

  tokens.push(
    ...tokenizeBlockImage(node),
    ...tokenizeInlineImage(node),
    ...tokenizeWrapper(node),
    ...tokenizeBlock(node, context),
    ...tokenizeMark(node)
  );

  return tokens;
}
