export default function combineTokenizers(tokenizers) {
  return (...args) =>
    tokenizers.reduce(
      (tokens, tokenizer) => tokens.concat(tokenizer(...args)),
      []
    );
}
