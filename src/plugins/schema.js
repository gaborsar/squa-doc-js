import createSchema from "../model/createSchema";

const schema = createSchema({
  block: {
    marks: ["type", "align", "indent"],
    embeds: ["block-image"]
  },
  inline: {
    marks: ["link", "anchor", "bold", "italic", "underline", "code"],
    embeds: ["inline-image"]
  },
  "block-image": {
    marks: ["alt", "caption", "align"]
  },
  "inline-image": {
    marks: ["alt", "link"]
  }
});

export default schema;
