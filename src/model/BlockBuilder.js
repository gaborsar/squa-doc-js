import Embed from "./Embed";
import Text from "./Text";
import Block from "./Block";

export default class BlockBuilder {
  constructor(schema) {
    this._schema = schema;
    this._nodes = [];
  }

  _insertText(value, attributes) {
    let node = Text.create({
      schema: this._schema,
      value
    });

    node = node.format(attributes);

    this._nodes.push(node);

    return this;
  }

  _insertEmbed(value, attributes) {
    const type = Embed.type(value);

    if (this._schema.isInlineEmbed(type)) {
      let node = Embed.create({
        schema: this._schema,
        value
      });

      node = node.format(attributes);

      this._nodes.push(node);
    }

    return this;
  }

  insert(value, attributes = {}) {
    return typeof value === "string"
      ? this._insertText(value, attributes)
      : this._insertEmbed(value, attributes);
  }

  build() {
    return Block.create({
      children: this._nodes
    });
  }
}
