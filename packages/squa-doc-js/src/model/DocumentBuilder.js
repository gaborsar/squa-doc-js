import SpecialCharacter from "./SpecialCharacter";
import { createKey } from "./Keys";
import {
  isTableNode,
  isTableStartNode,
  isTableEndNode,
  isTableCellNode,
  isTableCellStartNode,
  isTableRowNode,
  isTableRowStartNode,
  isBlockNode,
  isBlockEndNode,
  isBlockEmbedNode,
  isTextNode,
  isInlineEmbedNode,
  isTableStartCharacter,
  isTableEndCharacter,
  isTableRowStartCharacter,
  isTableCellStartCharacter,
  isBlockEndCharacter
} from "./Predicates";

export default class DocumentBuilder {
  constructor({ schema, key = createKey(), children = [] }) {
    this.schema = schema;
    this.key = key;
    this.children = children;
    this.tableBuilder = null;
    this.blockBuilder = null;
  }

  appendTable(node) {
    if (this.tableBuilder !== null) {
      throw new Error();
    }
    if (this.blockBuilder !== null) {
      throw new Error();
    }
    this.children.push(node);
    return this;
  }

  appendTableStart(node) {
    if (this.tableBuilder !== null) {
      throw new Error();
    }
    if (this.blockBuilder !== null) {
      throw new Error();
    }
    const { key, style } = node;
    this.tableBuilder = this.schema.createTableBuilder({ key, style });
    return this;
  }

  appendTableEnd() {
    if (this.tableBuilder === null) {
      throw new Error();
    }
    this.children.push(this.tableBuilder.build());
    this.tableBuilder = null;
    return this;
  }

  appendTableRow(node) {
    if (this.tableBuilder === null) {
      throw new Error();
    }
    this.tableBuilder.appendTableRow(node);
    return this;
  }

  appendTableRowStart(node) {
    if (this.tableBuilder === null) {
      throw new Error();
    }
    this.tableBuilder.appendTableRowStart(node);
    return this;
  }

  appendTableCell(node) {
    if (this.tableBuilder === null) {
      throw new Error();
    }
    this.tableBuilder.appendTableCell(node);
    return this;
  }

  appendTableCellStart(node) {
    if (this.tableBuilder === null) {
      throw new Error();
    }
    this.tableBuilder.appendTableCellStart(node);
    return this;
  }

  appendBlock(node) {
    if (this.tableBuilder !== null) {
      this.tableBuilder.appendBlock(node);
    } else if (this.blockBuilder === null) {
      this.children.push(node);
    } else {
      this.children.push(this.blockBuilder.build().concat(node));
      this.blockBuilder = null;
    }
    return this;
  }

  appendBlockEnd(node) {
    if (this.tableBuilder !== null) {
      this.tableBuilder.appendBlockEnd(node);
    } else {
      const { key, style } = node;
      if (this.blockBuilder === null) {
        this.children.push(this.schema.createBlock({ key, style }));
      } else {
        this.children.push(this.blockBuilder.build().merge({ key, style }));
        this.blockBuilder = null;
      }
    }
    return this;
  }

  appendBlockEmbed(node) {
    if (this.tableBuilder !== null) {
      throw new Error();
    }
    if (this.blockBuilder !== null) {
      throw new Error();
    }
    this.children.push(node);
    return this;
  }

  appendText(node) {
    if (this.tableBuilder !== null) {
      this.tableBuilder.appendText(node);
    } else {
      if (this.blockBuilder === null) {
        this.blockBuilder = this.schema.createBlockBuilder();
      }
      this.blockBuilder.appendText(node);
    }
    return this;
  }

  appendInlineEmbed(node) {
    if (this.tableBuilder !== null) {
      this.tableBuilder.appendInlineEmbed(node);
    } else {
      if (this.blockBuilder === null) {
        this.blockBuilder = this.schema.createBlockBuilder();
      }
      this.blockBuilder.appendInlineEmbed(node);
    }
    return this;
  }

  append(node) {
    if (isTableNode(node)) {
      return this.appendTable(node);
    }
    if (isTableStartNode(node)) {
      return this.appendTableStart(node);
    }
    if (isTableEndNode(node)) {
      return this.appendTableEnd(node);
    }
    if (isTableCellNode(node)) {
      return this.appendTableCell(node);
    }
    if (isTableCellStartNode(node)) {
      return this.appendTableCellStart(node);
    }
    if (isTableRowNode(node)) {
      return this.appendTableRow(node);
    }
    if (isTableRowStartNode(node)) {
      return this.appendTableRowStart(node);
    }
    if (isBlockNode(node)) {
      return this.appendBlock(node);
    }
    if (isBlockEndNode(node)) {
      return this.appendBlockEnd(node);
    }
    if (isBlockEmbedNode(node)) {
      return this.appendBlockEmbed(node);
    }
    if (isTextNode(node)) {
      return this.appendText(node);
    }
    if (isInlineEmbedNode(node)) {
      return this.appendInlineEmbed(node);
    }
    throw new Error();
  }

  insertTableStart(attributes = {}) {
    const node = this.schema.createTableStart().setAttributes(attributes);
    return this.appendTableStart(node);
  }

  insertTableEnd() {
    return this.appendTableEnd();
  }

  insertTableRowStart(attributes = {}) {
    const node = this.schema.createTableRowStart().setAttributes(attributes);
    return this.appendTableRowStart(node);
  }

  insertTableCellStart(attributes = {}) {
    return this.appendTableCellStart(
      this.schema.createTableCellStart().setAttributes(attributes)
    );
  }

  insertBlockEnd(attributes = {}) {
    return this.appendBlockEnd(
      this.schema.createBlockEnd().setAttributes(attributes)
    );
  }

  insertBlockEmbed(name, value, attributes = {}) {
    return this.appendBlockEmbed(
      this.schema.createBlockEmbed({ name, value }).setAttributes(attributes)
    );
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

  insertString(value, attributes = {}) {
    value.split(SpecialCharacter.SplitExpression).forEach(slice => {
      if (isTableStartCharacter(slice)) {
        this.insertTableStart(attributes);
      } else if (isTableEndCharacter(slice)) {
        this.insertTableEnd();
      } else if (isTableRowStartCharacter(slice)) {
        this.insertTableRowStart(attributes);
      } else if (isTableCellStartCharacter(slice)) {
        this.insertTableCellStart(attributes);
      } else if (isBlockEndCharacter(slice)) {
        this.insertBlockEnd(attributes);
      } else if (slice.length !== 0) {
        this.insertText(slice, attributes);
      }
    });
    return this;
  }

  insertObject(value, attributes = {}) {
    const [name] = Object.keys(value);
    if (this.schema.isBlockEmbed(name)) {
      return this.insertBlockEmbed(name, value[name], attributes);
    }
    if (this.schema.isInlineEmbed(name)) {
      return this.insertInlineEmbed(name, value[name], attributes);
    }
    throw new Error();
  }

  insert(value, attributes = {}) {
    if (typeof value === "string") {
      return this.insertString(value, attributes);
    }
    if (typeof value === "object" && value !== null) {
      return this.insertObject(value, attributes);
    }
    throw new Error();
  }

  build() {
    if (this.tableBuilder !== null) {
      throw new Error();
    }
    if (this.blockBuilder !== null) {
      throw new Error();
    }
    const { key, children } = this;
    return this.schema.createDocument({ key, children });
  }
}
