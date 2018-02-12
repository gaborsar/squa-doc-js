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
    marks: ["align", "caption", "alt"]
  },
  "inline-image": {
    marks: ["link", "alt"]
  }
});

export default schema;
