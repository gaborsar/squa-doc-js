import Style from "./Style";
import { createKey } from "./Keys";
import { isTextNode, isInlineEmbedNode } from "./Predicates";

export default class BlockBuilder {
  constructor({
    schema,
    key = createKey(),
    style = Style.create(),
    children = []
  }) {
    this.schema = schema;
    this.key = key;
    this.style = style;
    this.children = children;
  }

  appendText(node) {
    this.children.push(node);
    return this;
  }

  appendInlineEmbed(node) {
    this.children.push(node);
    return this;
  }

  append(node) {
    if (isTextNode(node)) {
      return this.appendText(node);
    }
    if (isInlineEmbedNode(node)) {
      return this.appendInlineEmbed(node);
    }
    throw new Error();
  }

  insertText(value, attributes = {}) {
    return this.appendText(
      this.schema.createText({ value }).setAttributes(attributes)
    );
  }

  insertInlineEmbed(name, value, attributes = {}) {
    return this.appendInlineEmbed(
      this.schema.createInlineEmbed({ name, value }).setAttributes(attributes)
    );
  }

  insertObject(value, attributes = {}) {
    const [name] = Object.keys(value);
    if (this.schema.isInlineEmbed(name)) {
      return this.insertInlineEmbed(name, value[name], attributes);
    }
    throw new Error();
  }

  insert(value, attributes = {}) {
    if (typeof value === "string") {
      return this.insertText(value, attributes);
    }
    if (typeof value === "object" && value !== null) {
      return this.insertObject(value, attributes);
    }
    throw new Error();
  }

  build() {
    const { schema, key, style, children } = this;
    return schema.createBlock({ key, style, children });
  }
}
