const methodNames = [
    "isBlockEmbed",
    "isInlineEmbed",
    "isTableMark",
    "isRowMark",
    "isCellMark",
    "isBlockMark",
    "isTextMark",
    "isBlockEmbedMark",
    "isInlineEmbedMark"
];

const combineMethods = methods => (...args) => {
    return methods.some(method => method(...args));
};

export default function combineSchemas(schemas) {
    return methodNames.reduce((schema, name) => {
        const methods = schemas
            .filter(currentSchema => currentSchema.hasOwnProperty(name))
            .map(currentSchema => currentSchema[name]);
        return {
            ...schema,
            [name]: combineMethods(methods)
        };
    }, {});
}
