import Text from "./Text";
import Embed from "./Embed";
import Block from "./Block";

export default class BlockBuilder {
  constructor(schema) {
    this.schema = schema;
    this.nodes = [];
  }

  insertText(value, attributes) {
    const { schema } = this;

    const node = Text.create({ schema, value }).format(attributes);

    this.nodes.push(node);

    return this;
  }

  insertEmbed(value, attributes) {
    const { schema } = this;

    const node = Embed.create({ schema, value }).format(attributes);

    this.nodes.push(node);

    return this;
  }

  insert(value, attributes = {}) {
    if (typeof value === "string") {
      return this.insertText(value, attributes);
    }

    if (typeof value === "object") {
      const { schema: schema } = this;

      const type = Embed.type(value);

      if (schema.isInlineEmbed(type)) {
        return this.insertEmbed(value, attributes);
      }
    }

    return this;
  }

  build() {
    return Block.create({
      schema: this.schema,
      children: this.nodes
    });
  }
}
