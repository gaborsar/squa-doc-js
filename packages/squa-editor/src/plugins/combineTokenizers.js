const combineTokenizers = tokenizers => (...args) =>
  tokenizers.reduce(
    (tokens, tokenizer) => tokens.concat(tokenizer(...args)),
    []
  );

export default combineTokenizers;
