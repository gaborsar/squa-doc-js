export default function combineTokenizers(...tokenizers) {
  return (node, context) => {
    const tokens = [];

    for (const tokenizer of tokenizers) {
      const out = tokenizer(node, context);

      if (typeof out === "object") {
        if (Array.isArray(out)) {
          tokens.push(...out);
        } else {
          return [out];
        }
      }
    }

    return tokens;
  };
}
