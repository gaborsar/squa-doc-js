const marks = ["alt", "caption"];

const schema = {
  isBlockEmbed(embedType) {
    return embedType === "block-image";
  },

  isEmbedMark(embedType, markType) {
    return embedType === "block-image" && marks.indexOf(markType) !== -1;
  }
};

export default schema;
