import createTranslateMarkdown from "./createTranslateMarkdown";

const lineMatchers = [
    {
        expr: /^\s*#\s$/,
        attributes: {
            type: "heading-one"
        }
    },
    {
        expr: /^\s*#{2}\s$/,
        attributes: {
            type: "heading-two"
        }
    },
    {
        expr: /^\s*#{3}\s$/,
        attributes: {
            type: "heading-three"
        }
    },
    {
        expr: /^\s*#{4}\s$/,
        attributes: {
            type: "heading-four"
        }
    },
    {
        expr: /^\s*#{5}\s$/,
        attributes: {
            type: "heading-five"
        }
    },
    {
        expr: /^\s*#{6}\s$/,
        attributes: {
            type: "heading-six"
        }
    },
    {
        expr: /^\s*\*\s$/,
        attributes: {
            type: "unordered-list-item"
        }
    },
    {
        expr: /^\s*1[.)]\s$/,
        attributes: {
            type: "ordered-list-item"
        }
    },
    {
        expr: /^\s*```\s$/,
        attributes: {
            type: "code"
        }
    },
    {
        expr: /^\s*>\s$/,
        attributes: {
            type: "blockquote"
        }
    }
];

const textMatchers = [
    {
        expr: /(\*{2})(.+)(\*{2})\s$/,
        attributes: {
            bold: true
        }
    },
    {
        expr: /(_{2})(.+)(_{2})\s$/,
        attributes: {
            bold: true
        }
    },
    {
        expr: /(\*)(.+)(\*)\s$/,
        attributes: {
            italic: true
        }
    },
    {
        expr: /(_)(.+)(_)\s$/,
        attributes: {
            italic: true
        }
    },
    {
        expr: /(`)(.+)(`)\s$/,
        attributes: {
            code: true
        }
    }
];

const afterInput = createTranslateMarkdown({
    lineMatchers,
    textMatchers
});

export default afterInput;
