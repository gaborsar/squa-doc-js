import Style from "./Style";
import { createKey } from "./Keys";

export default class TableRowBuilder {
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
    this.tableCellBuilder = null;
  }

  appendTableCell(node) {
    if (this.tableCellBuilder !== null) {
      this.children.push(this.tableCellBuilder.build());
    }
    const { key, style, children } = node;
    this.tableCellBuilder = this.schema.createTableCellBuilder({
      key,
      style,
      children
    });
    return this;
  }

  appendTableCellStart(node) {
    if (this.tableCellBuilder !== null) {
      this.children.push(this.tableCellBuilder.build());
    }
    const { key, style } = node;
    this.tableCellBuilder = this.schema.createTableCellBuilder({ key, style });
    return this;
  }

  appendBlock(node) {
    if (this.tableCellBuilder === null) {
      throw new Error();
    }
    this.tableCellBuilder.appendBlock(node);
    return this;
  }

  appendBlockEnd(node) {
    if (this.tableCellBuilder === null) {
      throw new Error();
    }
    this.tableCellBuilder.appendBlockEnd(node);
    return this;
  }

  appendText(node) {
    if (this.tableCellBuilder === null) {
      throw new Error();
    }
    this.tableCellBuilder.appendText(node);
    return this;
  }

  appendInlineEmbed(node) {
    if (this.tableCellBuilder === null) {
      throw new Error();
    }
    this.tableCellBuilder.appendInlineEmbed(node);
    return this;
  }

  build() {
    if (this.tableCellBuilder !== null) {
      this.children.push(this.tableCellBuilder.build());
    }
    const { schema, key, style, children } = this;
    return schema.createTableRow({ key, style, children });
  }
}
