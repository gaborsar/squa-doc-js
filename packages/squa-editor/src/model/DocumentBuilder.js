import Text from "./Text";
import Embed from "./Embed";
import Block from "./Block";
import Document from "./Document";
import { EOL } from "../constants";

export default class DocumentBuilder {
  constructor(schema) {
    this.schema = schema;
    this.blocks = [];
    this.inlines = [];
  }

  insertBlock(attributes) {
    const node = Block.create({ schema: this.schema, children: this.inlines }).format(attributes);

    this.blocks.push(node);
    this.inlines = [];

    return this;
  }

  insertBlockEmbed(value, attributes) {
    const node = Embed.create({ schema: this.schema, value }).format(attributes);

    this.blocks.push(node);
    this.inlines = [];

    return this;
  }

  insertText(value, attributes) {
    const lines = value.split(EOL);

    let line = lines.shift();

    if (line.length) {
      const node = Text.create({ schema: this.schema, value: line }).format(attributes);

      this.inlines.push(node);
    }

    while (lines.length) {
      this.insertBlock(attributes);

      line = lines.shift();

      if (line.length) {
        const node = Text.create({ schema: this.schema, value: line }).format(attributes);

        this.inlines.push(node);
      }
    }

    return this;
  }

  insertInlineEmbed(value, attributes) {
    const node = Embed.create({ schema: this.schema, value }).format(attributes);

    this.inlines.push(node);

    return this;
  }

  insert(value, attributes = {}) {
    if (typeof value === "string") {
      return this.insertText(value, attributes);
    }

    if (typeof value === "object") {
      const type = Embed.type(value);

      if (this.schema.isInlineEmbed(type)) {
        return this.insertInlineEmbed(value, attributes);
      }

      if (this.schema.isBlockEmbed(type)) {
        return this.insertBlockEmbed(value, attributes);
      }
    }

    return this;
  }

  build() {
    return Document.create({
      schema: this.schema,
      children: this.blocks
    });
  }
}
