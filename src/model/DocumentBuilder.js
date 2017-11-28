import Embed from "./Embed";
import Text from "./Text";
import Block, { EOL } from "./Block";
import Document from "./Document";

export default class DocumentBuilder {
  constructor(schema) {
    this._schema = schema;
    this._blocks = [];
    this._inlines = [];
  }

  _insertText(value, attributes) {
    const lines = value.split(EOL);
    let line = lines.pop();

    if (line.length) {
      let node = Text.create({
        schema: this._schema,
        value
      });

      node = node.format(attributes);

      this._inlines.push(node);
    }

    while (lines.length) {
      let node = Block.create({
        schema: this._schema,
        children: this._inlines
      });

      node = node.format(attributes);

      this._blocks.push(node);
      this._inlines = [];

      line = lines.pop();

      if (line.length) {
        let node = Text.create({
          schema: this._schema,
          value
        });

        node = node.format(attributes);

        this._inlines.push(node);
      }
    }

    return this;
  }

  _insertEmbed(value, attributes) {
    const type = Embed.type(value);

    if (this._schema.isBlockEmbed(type)) {
      if (this._inlines.length === 0) {
        let node = Embed.create({
          schema: this._schema,
          value
        });

        node = node.format(attributes);

        this._blocks.push(node);
      }
    } else if (this._schema.isInlineEmbed(type)) {
      let node = Embed.create({
        schema: this._schema,
        value
      });

      node = node.format(attributes);

      this._inlines.push(node);
    }

    return this;
  }

  insert(value, attributes = {}) {
    return typeof value === "string"
      ? this._insertText(value, attributes)
      : this._insertEmbed(value, attributes);
  }

  build() {
    return Document.create({
      children: this._blocks
    });
  }
}
