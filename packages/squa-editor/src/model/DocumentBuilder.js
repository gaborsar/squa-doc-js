import Text from "./Text";
import Embed from "./Embed";
import Block from "./Block";
import Document from "./Document";
import { EOL } from "../constants";

export default class DocumentBuilder {
  constructor(schema) {
    this._schema = schema;
    this._inlines = [];
    this._blocks = [];
  }

  _insertText(value, attributes) {
    const { _schema: schema } = this;

    const node = Text.create({ schema, value }).format(attributes);

    this._inlines.push(node);

    return this;
  }

  _insertInlineEmbed(value, attributes) {
    const { _schema: schema } = this;

    const node = Embed.create({ schema, value }).format(attributes);

    this._inlines.push(node);

    return this;
  }

  _insertBlockEmbed(value, attributes) {
    const { _schema: schema } = this;

    const type = Embed.type(value);

    if (this._inlines.length) {
      throw new Error(`Invalid embed type: ${type}`);
    }

    const node = Embed.create({ schema, value }).format(attributes);

    this._blocks.push(node);

    return this;
  }

  _insertBlock(attributes) {
    const { _schema: schema, _inlines: children } = this;

    const node = Block.create({ schema, children }).format(attributes);

    this._blocks.push(node);
    this._inlines = [];

    return this;
  }

  insert(value, attributes = {}) {
    if (typeof value === "string") {
      const lines = value.split(EOL);
      let line = lines.shift();

      if (line.length) {
        this._insertText(line, attributes);
      }

      while (lines.length) {
        this._insertBlock(attributes);
        line = lines.shift();

        if (line.length) {
          this._insertText(line, attributes);
        }
      }

      return this;
    }

    if (typeof value === "object") {
      const { _schema: schema } = this;
      const type = Embed.type(value);

      if (schema.isInlineEmbed(type)) {
        return this._insertInlineEmbed(value, attributes);
      }

      if (schema.isBlockEmbed(type)) {
        return this._insertBlockEmbed(value, attributes);
      }

      throw new Error(`Invalid embed type: ${type}`);
    }

    throw new Error(`Invalid value: ${value}`);
  }

  build() {
    return Document.create({
      schema: this._schema,
      children: this._blocks
    });
  }
}
