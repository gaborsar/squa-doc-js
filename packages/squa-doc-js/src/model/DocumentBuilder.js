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
    const { schema, inlines: children } = this;

    const node = Block.create({ schema, children }).format(attributes);

    this.blocks.push(node);
    this.inlines = [];

    return this;
  }

  insertBlockEmbed(value, attributes) {
    const { schema } = this;

    const node = Embed.create({ schema, value }).format(attributes);

    this.blocks.push(node);
    this.inlines = [];

    return this;
  }

  insertText(value, attributes) {
    const { schema } = this;

    const lines = value.split(EOL);

    let line = lines.shift();

    if (line.length !== 0) {
      const node = Text.create({ schema, value: line }).format(attributes);

      this.inlines.push(node);
    }

    while (lines.length !== 0) {
      this.insertBlock(attributes);

      line = lines.shift();

      if (line.length !== 0) {
        const node = Text.create({ schema, value: line }).format(attributes);

        this.inlines.push(node);
      }
    }

    return this;
  }

  insertInlineEmbed(value, attributes) {
    const { schema } = this;

    const node = Embed.create({ schema, value }).format(attributes);

    this.inlines.push(node);

    return this;
  }

  insert(value, attributes = {}) {
    if (typeof value === "string") {
      return this.insertText(value, attributes);
    }

    if (typeof value === "object") {
      const { schema } = this;

      const type = Embed.type(value);

      if (schema.isBlockEmbed(type)) {
        return this.insertBlockEmbed(value, attributes);
      }

      if (schema.isInlineEmbed(type)) {
        return this.insertInlineEmbed(value, attributes);
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
