import createSchema from "../model/createSchema";

const blockMarks = ["type", "align", "indent"];

const inlineMarks = [
  "link",
  "anchor",
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "code",
  "color"
];

const schema = {
  isBlockMark(markType) {
    return blockMarks.indexOf(markType) !== -1;
  },

  isInlineMark(markType) {
    return inlineMarks.indexOf(markType) !== -1;
  }
};

export default schema;
