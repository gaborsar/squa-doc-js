import DocumentBuilder from "./DocumentBuilder";
import TableBuilder from "./TableBuilder";
import RowBuilder from "./RowBuilder";
import CellBuilder from "./CellBuilder";
import BlockBuilder from "./BlockBuilder";
import Document from "./Document";
import Table from "./Table";
import TableStart from "./TableStart";
import TableEnd from "./TableEnd";
import Row from "./Row";
import RowStart from "./RowStart";
import Cell from "./Cell";
import CellStart from "./CellStart";
import Block from "./Block";
import BlockEnd from "./BlockEnd";
import BlockEmbed from "./BlockEmbed";
import Text from "./Text";
import InlineEmbed from "./InlineEmbed";
import Style from "./Style";
import createKey from "./createKey";

const alwaysFalse = () => false;

export default class Schema {
    constructor({
        isBlockEmbed = alwaysFalse,
        isInlineEmbed = alwaysFalse,
        isTableMark = alwaysFalse,
        isRowMark = alwaysFalse,
        isCellMark = alwaysFalse,
        isBlockMark = alwaysFalse,
        isTextMark = alwaysFalse,
        isBlockEmbedMark = alwaysFalse,
        isInlineEmbedMark = alwaysFalse
    } = {}) {
        this.isBlockEmbed = isBlockEmbed;
        this.isInlineEmbed = isInlineEmbed;
        this.isTableMark = isTableMark;
        this.isRowMark = isRowMark;
        this.isCellMark = isCellMark;
        this.isBlockMark = isBlockMark;
        this.isTextMark = isTextMark;
        this.isBlockEmbedMark = isBlockEmbedMark;
        this.isInlineEmbedMark = isInlineEmbedMark;
    }

    createDocumentBuilder({ key = createKey(), children = [] } = {}) {
        return new DocumentBuilder(this, key, children);
    }

    createTableBuilder({
        key = createKey(),
        style = Style.create(),
        children = []
    } = {}) {
        return new TableBuilder(this, key, style, children);
    }

    createRowBuilder({
        key = createKey(),
        style = Style.create(),
        children = []
    } = {}) {
        return new RowBuilder(this, key, style, children);
    }

    createCellBuilder({
        key = createKey(),
        style = Style.create(),
        children = []
    } = {}) {
        return new CellBuilder(this, key, style, children);
    }

    createBlockBuilder({
        key = createKey(),
        style = Style.create(),
        children = []
    } = {}) {
        return new BlockBuilder(this, key, style, children);
    }

    createDocument({ key = createKey(), children = [] } = {}) {
        return new Document(this, key, children).optimize();
    }

    createTable({
        key = createKey(),
        style = Style.create(),
        children = []
    } = {}) {
        return new Table(this, key, style, children).optimize();
    }

    createTableStart({ key = createKey(), style = Style.create() } = {}) {
        return new TableStart(this, key, style);
    }

    createTableEnd() {
        return new TableEnd();
    }

    createRow({
        key = createKey(),
        style = Style.create(),
        children = []
    } = {}) {
        return new Row(this, key, style, children).optimize();
    }

    createRowStart({ key = createKey(), style = Style.create() } = {}) {
        return new RowStart(this, key, style);
    }

    createCell({
        key = createKey(),
        style = Style.create(),
        children = []
    } = {}) {
        return new Cell(this, key, style, children).optimize();
    }

    createCellStart({ key = createKey(), style = Style.create() } = {}) {
        return new CellStart(this, key, style);
    }

    createBlock({
        key = createKey(),
        style = Style.create(),
        children = []
    } = {}) {
        return new Block(this, key, style, children).optimize();
    }

    createBlockEnd({ key = createKey(), style = Style.create() } = {}) {
        return new BlockEnd(this, key, style);
    }

    createText({ key = createKey(), style = Style.create(), value } = {}) {
        return new Text(this, key, style, value);
    }

    createBlockEmbed({
        key = createKey(),
        style = Style.create(),
        name,
        value
    }) {
        return new BlockEmbed(this, key, style, name, value);
    }

    createInlineEmbed({
        key = createKey(),
        style = Style.create(),
        name,
        value
    }) {
        return new InlineEmbed(this, key, style, name, value);
    }
}
