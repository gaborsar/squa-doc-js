const schema = {
  isInlineEmbed(embedType) {
    return embedType === "inline-image";
  },

  isEmbedMark(embedType, markType) {
    return embedType === "inline-image" && markType === "alt";
  }
};

export default schema;
