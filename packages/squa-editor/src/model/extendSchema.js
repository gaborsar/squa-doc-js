export default function extendSchema(schema, customSchema) {
  return {
    isBlockEmbed(embedType) {
      let result;

      if (customSchema.isBlockEmbed) {
        result = customSchema.isBlockEmbed(embedType);
      }

      if (result === undefined) {
        result = schema.isBlockEmbed(embedType);
      }

      if (result === undefined) {
        result = false;
      }

      return result;
    },

    isInlineEmbed(embedType) {
      let result;

      if (customSchema.isInlineEmbed) {
        result = customSchema.isInlineEmbed(embedType);
      }

      if (result === undefined) {
        result = schema.isInlineEmbed(embedType);
      }

      if (result === undefined) {
        result = false;
      }

      return result;
    },

    isBlockMark(markType) {
      let result;

      if (customSchema.isBlockMark) {
        result = customSchema.isBlockMark(markType);
      }

      if (result === undefined) {
        result = schema.isBlockMark(markType);
      }

      if (result === undefined) {
        result = false;
      }

      return result;
    },

    isInlineMark(markType) {
      let result;

      if (customSchema.isInlineMark) {
        result = customSchema.isInlineMark(markType);
      }

      if (result === undefined) {
        result = schema.isInlineMark(markType);
      }

      if (result === undefined) {
        result = false;
      }

      return result;
    },

    isEmbedMark(embedType, markType) {
      let result;

      if (customSchema.isEmbedMark) {
        result = customSchema.isEmbedMark(embedType, markType);
      }

      if (result === undefined) {
        result = schema.isEmbedMark(embedType, markType);
      }

      if (result === undefined) {
        result = false;
      }

      return result;
    }
  };
}
