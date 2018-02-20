import createSchema from "../model/createSchema";

const schema = createSchema({
  block: {
    marks: ["type", "align", "indent"],
    embeds: ["block-image"]
  },
  inline: {
    marks: [
      "link",
      "anchor",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "code",
      "color"
    ],
    embeds: ["inline-image"]
  },
  "block-image": {
    marks: ["alt", "caption"]
  },
  "inline-image": {
    marks: ["alt"]
  }
});

export default schema;
