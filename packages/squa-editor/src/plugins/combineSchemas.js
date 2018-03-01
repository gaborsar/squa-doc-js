const methods = [
  "isBlockEmbed",
  "isInlineEmbed",
  "isBlockMark",
  "isInlineMark",
  "isEmbedMark"
];

const combineSchemaMethods = methods => (...args) =>
  methods.some(method => method(...args));

const combineSchemas = schemas =>
  methods.reduce((schema, name) => {
    const methods = schemas
      .filter(schema => schema.hasOwnProperty(name))
      .map(schema => schema[name]);
    return {
      ...schema,
      [name]: combineSchemaMethods(methods)
    };
  }, {});

export default combineSchemas;
