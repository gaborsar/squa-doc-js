import Schema from "../model/Schema";

export const rules = {
  block: {
    marks: ["type", "align", "indent"],
    embeds: ["block-image"]
  },
  inline: {
    marks: ["link", "anchor", "bold", "italic", "underline", "code"],
    embeds: ["inline-image"]
  },
  "block-image": {
    marks: ["alt", "caption"]
  },
  "inline-image": {
    marks: ["alt"]
  }
};

export const schema = new Schema(rules);
