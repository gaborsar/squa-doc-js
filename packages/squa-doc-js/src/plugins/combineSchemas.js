const methodNames = [
  "isBlockEmbed",
  "isInlineEmbed",
  "isTableMark",
  "isTableRowMark",
  "isTableCellMark",
  "isBlockMark",
  "isBlockEmbedMark",
  "isTextMark",
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
