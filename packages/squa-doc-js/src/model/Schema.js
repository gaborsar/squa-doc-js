import DocumentBuilder from "./DocumentBuilder";
import TableBuilder from "./TableBuilder";
import TableRowBuilder from "./TableRowBuilder";
import TableCellBuilder from "./TableCellBuilder";
import BlockBuilder from "./BlockBuilder";
import Document from "./Document";
import Table from "./Table";
import TableStart from "./TableStart";
import TableEnd from "./TableEnd";
import TableRow from "./TableRow";
import TableRowStart from "./TableRowStart";
import TableCell from "./TableCell";
import TableCellStart from "./TableCellStart";
import Block from "./Block";
import BlockEnd from "./BlockEnd";
import BlockEmbed from "./BlockEmbed";
import Text from "./Text";
import InlineEmbed from "./InlineEmbed";

const alwaysFalse = () => false;

export default class Schema {
  constructor(config = {}) {
    this.config = config;
  }

  // Validators

  isBlockEmbed(name) {
    const { isBlockEmbed = alwaysFalse } = this.config;
    return isBlockEmbed(name);
  }

  isInlineEmbed(name) {
    const { isInlineEmbed = alwaysFalse } = this.config;
    return isInlineEmbed(name);
  }

  isTableMark(name) {
    const { isTableMark = alwaysFalse } = this.config;
    return isTableMark(name);
  }

  isTableRowMark(name) {
    const { isTableRowMark = alwaysFalse } = this.config;
    return isTableRowMark(name);
  }

  isTableCellMark(name) {
    const { isTableCellMark = alwaysFalse } = this.config;
    return isTableCellMark(name);
  }

  isBlockMark(name) {
    const { isBlockMark = alwaysFalse } = this.config;
    return isBlockMark(name);
  }

  isBlockEmbedMark(embedName, markName) {
    const { isBlockEmbedMark = alwaysFalse } = this.config;
    return isBlockEmbedMark(embedName, markName);
  }

  isTextMark(name) {
    const { isTextMark = alwaysFalse } = this.config;
    return isTextMark(name);
  }

  isInlineEmbedMark(embedName, markName) {
    const { isInlineEmbedMark = alwaysFalse } = this.config;
    return isInlineEmbedMark(embedName, markName);
  }

  // Builder factories

  createDocumentBuilder(props = {}) {
    return new DocumentBuilder({ schema: this, ...props });
  }

  createTableBuilder(props = {}) {
    return new TableBuilder({ schema: this, ...props });
  }

  createTableRowBuilder(props = {}) {
    return new TableRowBuilder({ schema: this, ...props });
  }

  createTableCellBuilder(props = {}) {
    return new TableCellBuilder({ schema: this, ...props });
  }

  createBlockBuilder(props = {}) {
    return new BlockBuilder({ schema: this, ...props });
  }

  // Node factories

  createDocument(props = {}) {
    return new Document({ schema: this, ...props });
  }

  createTable(props = {}) {
    return new Table({ schema: this, ...props });
  }

  createTableStart(props = {}) {
    return new TableStart({ schema: this, ...props });
  }

  createTableEnd() {
    return new TableEnd();
  }

  createTableRow(props = {}) {
    return new TableRow({ schema: this, ...props });
  }

  createTableRowStart(props = {}) {
    return new TableRowStart({ schema: this, ...props });
  }

  createTableCell(props = {}) {
    return new TableCell({ schema: this, ...props });
  }

  createTableCellStart(props = {}) {
    return new TableCellStart({ schema: this, ...props });
  }

  createBlock(props = {}) {
    return new Block({ schema: this, ...props });
  }

  createBlockEnd(props = {}) {
    return new BlockEnd({ schema: this, ...props });
  }

  createBlockEmbed(props = {}) {
    return new BlockEmbed({ schema: this, ...props });
  }

  createText(props = {}) {
    return new Text({ schema: this, ...props });
  }

  createInlineEmbed(props = {}) {
    return new InlineEmbed({ schema: this, ...props });
  }
}
