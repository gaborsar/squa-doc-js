const schema = {
  isInlineEmbed(name) {
    return name === "inline-image";
  },

  isInlineEmbedMark(embedName, markName) {
    return embedName === "inline-image" && markName === "alt";
  }
};

export default schema;
