const methods = [
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
  return methods.reduce((schema, name) => {
    const methods = schemas
      .filter(schema => schema.hasOwnProperty(name))
      .map(schema => schema[name]);
    return {
      ...schema,
      [name]: combineMethods(methods)
    };
  }, {});
}
