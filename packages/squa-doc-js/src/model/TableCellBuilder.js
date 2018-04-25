import Style from "./Style";
import { createKey } from "./Keys";

export default class TableCellBuilder {
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
    this.blockBuilder = null;
  }

  appendBlock(node) {
    if (this.blockBuilder === null) {
      this.children.push(node);
    } else {
      this.children.push(this.blockBuilder.build().concat(node));
      this.blockBuilder = null;
    }
    return this;
  }

  appendBlockEnd(node) {
    const { key, style } = node;
    if (this.blockBuilder === null) {
      this.children.push(this.schema.createBlock({ key, style }));
    } else {
      this.children.push(this.blockBuilder.build().merge({ key, style }));
      this.blockBuilder = null;
    }
    return this;
  }

  appendText(node) {
    if (this.blockBuilder === null) {
      this.blockBuilder = this.schema.createBlockBuilder();
    }
    this.blockBuilder.appendText(node);
    return this;
  }

  appendInlineEmbed(node) {
    if (this.blockBuilder === null) {
      this.blockBuilder = this.schema.createBlockBuilder();
    }
    this.blockBuilder.appendInlineEmbed(node);
    return this;
  }

  build() {
    if (this.blockBuilder !== null) {
      throw new Error();
    }
    const { schema, key, style, children } = this;
    return schema.createTableCell({ key, style, children });
  }
}
