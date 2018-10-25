import { createTranslateMarkdown } from "squa-doc-js";

const afterInput = createTranslateMarkdown({
    lineMatchers: [
        {
            expr: /^\s*\[\s?\]\s$/,
            attributes: {
                type: "checkable"
            }
        },
        {
            expr: /^\s*\[x\]\s$/,
            attributes: {
                type: "checkable",
                checked: true
            }
        }
    ]
});

export default afterInput;
