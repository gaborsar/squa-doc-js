import Text from "./Text";
import Embed from "./Embed";
import Block from "./Block";
import defaultSchema from "../plugins/schema";

export default class BlockBuilder {
  constructor(schema = defaultSchema) {
    this._schema = schema;
    this._nodes = [];
  }

  _insertText(value, attributes) {
    const { _schema: schema } = this;

    const node = Text.create({ schema, value }).format(attributes);

    this._nodes.push(node);

    return this;
  }

  _insertEmbed(value, attributes) {
    const { _schema: schema } = this;

    const node = Embed.create({ schema, value }).format(attributes);

    this._nodes.push(node);

    return this;
  }

  insert(value, attributes = {}) {
    if (typeof value === "string") {
      return this._insertText(value, attributes);
    }

    if (typeof value === "object") {
      const { _schema: schema } = this;

      const type = Embed.type(value);

      if (schema.isInlineEmbed(type)) {
        return this._insertEmbed(value, attributes);
      }

      throw new Error(`Invalid embed type: ${type}`);
    }

    throw new Error(`Invalid value: ${value}`);
  }

  build() {
    return Block.create({
      schema: this._schema,
      children: this._nodes
    });
  }
}
