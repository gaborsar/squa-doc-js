const schema = {
  isBlockMark(markType) {
    if (markType === "checked") {
      return true;
    }
  }
};

export default schema;
