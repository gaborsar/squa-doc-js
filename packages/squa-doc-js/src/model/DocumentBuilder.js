import SpecialCharacter from "./SpecialCharacter";
import {
    isTableNode,
    isTableStartNode,
    isTableEndNode,
    isCellNode,
    isCellStartNode,
    isRowNode,
    isRowStartNode,
    isBlockNode,
    isBlockEndNode,
    isBlockEmbedNode,
    isTextNode,
    isInlineEmbedNode,
    isTableStartCharacter,
    isTableEndCharacter,
    isRowStartCharacter,
    isCellStartCharacter,
    isBlockEndCharacter
} from "./Predicates";

export default class DocumentBuilder {
    constructor(schema, key, children) {
        this.schema = schema;
        this.key = key;
        this.children = children;
        this.tableBuilder = null;
        this.blockBuilder = null;
    }

    append(node) {
        if (isTableNode(node)) {
            return this._appendTable(node);
        }
        if (isTableStartNode(node)) {
            return this._appendTableStart(node);
        }
        if (isTableEndNode(node)) {
            return this._appendTableEnd(node);
        }
        if (isCellNode(node)) {
            return this._appendCell(node);
        }
        if (isCellStartNode(node)) {
            return this._appendCellStart(node);
        }
        if (isRowNode(node)) {
            return this._appendRow(node);
        }
        if (isRowStartNode(node)) {
            return this._appendRowStart(node);
        }
        if (isBlockNode(node)) {
            return this._appendBlock(node);
        }
        if (isBlockEndNode(node)) {
            return this._appendBlockEnd(node);
        }
        if (isBlockEmbedNode(node)) {
            return this._appendBlockEmbed(node);
        }
        if (isTextNode(node)) {
            return this._appendText(node);
        }
        if (isInlineEmbedNode(node)) {
            return this._appendInlineEmbed(node);
        }
        throw new Error();
    }

    insert(value, attributes = {}) {
        if (typeof value === "string") {
            return this._insertString(value, attributes);
        }
        if (typeof value === "object" && value !== null) {
            return this._insertObject(value, attributes);
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
        return this.schema.createDocument({
            key: this.key,
            children: this.children
        });
    }

    _appendTable(node) {
        if (this.tableBuilder !== null) {
            throw new Error();
        }
        if (this.blockBuilder !== null) {
            throw new Error();
        }
        this.children.push(node);
        return this;
    }

    _appendTableStart(node) {
        if (this.tableBuilder !== null) {
            throw new Error();
        }
        if (this.blockBuilder !== null) {
            throw new Error();
        }
        this.tableBuilder = this.schema.createTableBuilder({
            key: node.key,
            style: node.style
        });
        return this;
    }

    _appendTableEnd() {
        if (this.tableBuilder === null) {
            throw new Error();
        }
        this.children.push(this.tableBuilder.build());
        this.tableBuilder = null;
        return this;
    }

    _appendRow(node) {
        if (this.tableBuilder === null) {
            throw new Error();
        }
        this.tableBuilder.append(node);
        return this;
    }

    _appendRowStart(node) {
        if (this.tableBuilder === null) {
            throw new Error();
        }
        this.tableBuilder.append(node);
        return this;
    }

    _appendCell(node) {
        if (this.tableBuilder === null) {
            throw new Error();
        }
        this.tableBuilder.append(node);
        return this;
    }

    _appendCellStart(node) {
        if (this.tableBuilder === null) {
            throw new Error();
        }
        this.tableBuilder.append(node);
        return this;
    }

    _appendBlock(node) {
        if (this.tableBuilder !== null) {
            this.tableBuilder.append(node);
        } else if (this.blockBuilder === null) {
            this.children.push(node);
        } else {
            this.children.push(this.blockBuilder.build().concat(node));
            this.blockBuilder = null;
        }
        return this;
    }

    _appendBlockEnd(node) {
        if (this.tableBuilder !== null) {
            this.tableBuilder.append(node);
        } else {
            if (this.blockBuilder === null) {
                this.children.push(
                    this.schema.createBlock({
                        key: node.key,
                        style: node.style
                    })
                );
            } else {
                this.children.push(
                    this.blockBuilder.build().merge({
                        key: node.key,
                        style: node.style
                    })
                );
                this.blockBuilder = null;
            }
        }
        return this;
    }

    _appendBlockEmbed(node) {
        if (this.tableBuilder !== null) {
            throw new Error();
        }
        if (this.blockBuilder !== null) {
            throw new Error();
        }
        this.children.push(node);
        return this;
    }

    _appendText(node) {
        if (this.tableBuilder !== null) {
            this.tableBuilder.append(node);
        } else {
            if (this.blockBuilder === null) {
                this.blockBuilder = this.schema.createBlockBuilder();
            }
            this.blockBuilder.append(node);
        }
        return this;
    }

    _appendInlineEmbed(node) {
        if (this.tableBuilder !== null) {
            this.tableBuilder.append(node);
        } else {
            if (this.blockBuilder === null) {
                this.blockBuilder = this.schema.createBlockBuilder();
            }
            this.blockBuilder.append(node);
        }
        return this;
    }

    _insertString(value, attributes = {}) {
        value.split(SpecialCharacter.SplitExpression).forEach(slice => {
            if (isTableStartCharacter(slice)) {
                this._insertTableStart(attributes);
            } else if (isTableEndCharacter(slice)) {
                this._insertTableEnd();
            } else if (isRowStartCharacter(slice)) {
                this._insertRowStart(attributes);
            } else if (isCellStartCharacter(slice)) {
                this._insertCellStart(attributes);
            } else if (isBlockEndCharacter(slice)) {
                this._insertBlockEnd(attributes);
            } else if (slice.length !== 0) {
                this._insertText(slice, attributes);
            }
        });
        return this;
    }

    _insertTableStart(attributes = {}) {
        const node = this.schema.createTableStart().setAttributes(attributes);
        return this._appendTableStart(node);
    }

    _insertTableEnd() {
        return this._appendTableEnd();
    }

    _insertRowStart(attributes = {}) {
        const node = this.schema.createRowStart().setAttributes(attributes);
        return this._appendRowStart(node);
    }

    _insertCellStart(attributes = {}) {
        return this._appendCellStart(
            this.schema.createCellStart().setAttributes(attributes)
        );
    }

    _insertBlockEnd(attributes = {}) {
        return this._appendBlockEnd(
            this.schema.createBlockEnd().setAttributes(attributes)
        );
    }

    _insertText(value, attributes = {}) {
        return this._appendText(
            this.schema.createText({ value }).setAttributes(attributes)
        );
    }

    _insertObject(value, attributes = {}) {
        const [name] = Object.keys(value);
        if (this.schema.isBlockEmbed(name)) {
            return this._insertBlockEmbed(name, value[name], attributes);
        }
        if (this.schema.isInlineEmbed(name)) {
            return this._insertInlineEmbed(name, value[name], attributes);
        }
        throw new Error();
    }

    _insertBlockEmbed(name, value, attributes = {}) {
        return this._appendBlockEmbed(
            this.schema
                .createBlockEmbed({ name, value })
                .setAttributes(attributes)
        );
    }

    _insertInlineEmbed(name, value, attributes = {}) {
        return this._appendInlineEmbed(
            this.schema
                .createInlineEmbed({ name, value })
                .setAttributes(attributes)
        );
    }
}
