export default function combineTokenizers(tokenizers) {
    return (...args) => {
        return tokenizers.reduce(
            (tokens, tokenizer) => tokens.concat(tokenizer(...args)),
            []
        );
    };
}
