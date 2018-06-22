const tableCellMarks = ["colspan", "rowspan"];
const blockMarks = ["type", "align", "indent"];

const inlineMarks = [
  "anchor",
  "link",
  "color",
  "bold",
  "italic",
  "underline",
  "strikethrough",
  "code"
];

const schema = {
  isTableCellMark(name) {
    return tableCellMarks.indexOf(name) !== -1;
  },

  isBlockMark(name) {
    return blockMarks.indexOf(name) !== -1;
  },

  isTextMark(name) {
    return inlineMarks.indexOf(name) !== -1;
  }
};

export default schema;
