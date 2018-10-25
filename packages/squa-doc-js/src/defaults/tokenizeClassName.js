import TokenType from "../parser/TokenType";

const exp = /^SquaDocJs-(\w+)-(\w+)$/;

export default function tokenizeClassName(className) {
    const tokens = [];

    if (exp.test(className)) {
        const [, type, value] = className.match(exp);

        switch (type) {
            case "align":
                tokens.push({
                    type: TokenType.BlockStyle,
                    payload: {
                        align: value
                    }
                });
                break;

            case "indent":
                tokens.push({
                    type: TokenType.BlockStyle,
                    payload: {
                        indent: parseInt(value, 10)
                    }
                });
                break;

            case "anchor":
                tokens.push({
                    type: TokenType.InlineStyle,
                    payload: {
                        anchor: value
                    }
                });
                break;

            case "color":
                tokens.push({
                    type: TokenType.InlineStyle,
                    payload: {
                        color: value
                    }
                });
                break;
        }
    }

    return tokens;
}
