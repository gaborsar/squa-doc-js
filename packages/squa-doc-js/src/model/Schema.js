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
    constructor(config = {}) {
        this.config = config;
    }

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

    isRowMark(name) {
        const { isRowMark = alwaysFalse } = this.config;
        return isRowMark(name);
    }

    isCellMark(name) {
        const { isCellMark = alwaysFalse } = this.config;
        return isCellMark(name);
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

    createBlockEmbed({
        key = createKey(),
        style = Style.create(),
        name,
        value
    }) {
        return new BlockEmbed(this, key, style, name, value);
    }

    createText({ key = createKey(), style = Style.create(), value } = {}) {
        return new Text(this, key, style, value);
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
