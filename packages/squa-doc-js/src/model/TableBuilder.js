import {
    isRowNode,
    isRowStartNode,
    isCellNode,
    isCellStartNode,
    isBlockNode,
    isBlockEndNode,
    isTextNode,
    isInlineEmbedNode
} from "./Predicates";

export default class TableBuilder {
    constructor(schema, key, style, children) {
        this.schema = schema;
        this.key = key;
        this.style = style;
        this.children = children;
        this.tableRowBuilder = null;
    }

    append(node) {
        if (isRowNode(node)) {
            return this._appendRow(node);
        }
        if (isRowStartNode(node)) {
            return this._appendRowStart(node);
        }
        if (isCellNode(node)) {
            return this._appendCell(node);
        }
        if (isCellStartNode(node)) {
            return this._appendCellStart(node);
        }
        if (isBlockNode(node)) {
            return this._appendBlock(node);
        }
        if (isBlockEndNode(node)) {
            return this._appendBlockEnd(node);
        }
        if (isTextNode(node)) {
            return this._appendText(node);
        }
        if (isInlineEmbedNode(node)) {
            return this._appendInlineEmbed(node);
        }
        throw new Error();
    }

    build() {
        if (this.tableRowBuilder !== null) {
            this.children.push(this.tableRowBuilder.build());
        }
        return this.schema.createTable({
            key: this.key,
            style: this.style,
            children: this.children
        });
    }

    _appendRow(node) {
        if (this.tableRowBuilder !== null) {
            this.children.push(this.tableRowBuilder.build());
        }
        this.tableRowBuilder = this.schema.createRowBuilder({
            key: node.key,
            style: node.style,
            children: node.children
        });
        return this;
    }

    _appendRowStart(node) {
        if (this.tableRowBuilder !== null) {
            this.children.push(this.tableRowBuilder.build());
        }
        this.tableRowBuilder = this.schema.createRowBuilder({
            key: node.key,
            style: node.style
        });
        return this;
    }

    _appendCell(node) {
        if (this.tableRowBuilder === null) {
            throw new Error();
        }
        this.tableRowBuilder.append(node);
        return this;
    }

    _appendCellStart(node) {
        if (this.tableRowBuilder === null) {
            throw new Error();
        }
        this.tableRowBuilder.append(node);
        return this;
    }

    _appendBlock(node) {
        if (this.tableRowBuilder === null) {
            throw new Error();
        }
        this.tableRowBuilder.append(node);
        return this;
    }

    _appendBlockEnd(node) {
        if (this.tableRowBuilder === null) {
            throw new Error();
        }
        this.tableRowBuilder.append(node);
        return this;
    }

    _appendText(node) {
        if (this.tableRowBuilder === null) {
            throw new Error();
        }
        this.tableRowBuilder.append(node);
        return this;
    }

    _appendInlineEmbed(node) {
        if (this.tableRowBuilder === null) {
            throw new Error();
        }
        this.tableRowBuilder.append(node);
        return this;
    }
}
