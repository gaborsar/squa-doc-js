import Schema from "../model/Schema";

export const rules = {
  block: {
    marks: ["type"],
    embeds: ["block-image"]
  },
  inline: {
    marks: ["bold", "italic"],
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
