import Style from "./Style";
import { createKey } from "./Keys";

export default class TableBuilder {
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
    this.tableRowBuilder = null;
  }

  appendTableRow(node) {
    if (this.tableRowBuilder !== null) {
      this.children.push(this.tableRowBuilder.build());
    }
    const { key, style, children } = node;
    this.tableRowBuilder = this.schema.createTableRowBuilder({
      key,
      style,
      children
    });
    return this;
  }

  appendTableRowStart(node) {
    if (this.tableRowBuilder !== null) {
      this.children.push(this.tableRowBuilder.build());
    }
    const { key, style } = node;
    this.tableRowBuilder = this.schema.createTableRowBuilder({ key, style });
    return this;
  }

  appendTableCell(node) {
    if (this.tableRowBuilder === null) {
      throw new Error();
    }
    this.tableRowBuilder.appendTableCell(node);
    return this;
  }

  appendTableCellStart(node) {
    if (this.tableRowBuilder === null) {
      throw new Error();
    }
    this.tableRowBuilder.appendTableCellStart(node);
    return this;
  }

  appendBlock(node) {
    if (this.tableRowBuilder === null) {
      throw new Error();
    }
    this.tableRowBuilder.appendBlock(node);
    return this;
  }

  appendBlockEnd(node) {
    if (this.tableRowBuilder === null) {
      throw new Error();
    }
    this.tableRowBuilder.appendBlockEnd(node);
    return this;
  }

  appendText(node) {
    if (this.tableRowBuilder === null) {
      throw new Error();
    }
    this.tableRowBuilder.appendText(node);
    return this;
  }

  appendInlineEmbed(node) {
    if (this.tableRowBuilder === null) {
      throw new Error();
    }
    this.tableRowBuilder.appendInlineEmbed(node);
    return this;
  }

  build() {
    if (this.tableRowBuilder !== null) {
      this.children.push(this.tableRowBuilder.build());
    }
    const { schema, key, style, children } = this;
    return schema.createTable({ key, style, children });
  }
}
