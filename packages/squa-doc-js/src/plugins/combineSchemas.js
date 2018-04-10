const methodNames = [
  "isBlockEmbed",
  "isInlineEmbed",
  "isBlockMark",
  "isInlineMark",
  "isEmbedMark"
];

function combineMethods(methods) {
  return (...args) => methods.some(method => method(...args));
}

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
