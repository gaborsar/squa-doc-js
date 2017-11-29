export default function combineTokenizers(...tokenizers) {
  return (node, context) => {
    const tokens = [];

    for (const tokenizer of tokenizers) {
      tokens.push(...tokenizer(node, context));
    }

    return tokens;
  };
}
