import {
    isCellNode,
    isCellStartNode,
    isBlockNode,
    isBlockEndNode,
    isTextNode,
    isInlineEmbedNode
} from "./Predicates";

export default class RowBuilder {
    constructor(schema, key, style, children) {
        this.schema = schema;
        this.key = key;
        this.style = style;
        this.children = children;
        this.tableCellBuilder = null;
    }

    append(node) {
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
        if (this.tableCellBuilder !== null) {
            this.children.push(this.tableCellBuilder.build());
        }
        return this.schema.createRow({
            key: this.key,
            style: this.style,
            children: this.children
        });
    }

    _appendCell(node) {
        if (this.tableCellBuilder !== null) {
            this.children.push(this.tableCellBuilder.build());
        }
        this.tableCellBuilder = this.schema.createCellBuilder({
            key: node.key,
            style: node.style,
            children: node.children
        });
        return this;
    }

    _appendCellStart(node) {
        if (this.tableCellBuilder !== null) {
            this.children.push(this.tableCellBuilder.build());
        }
        this.tableCellBuilder = this.schema.createCellBuilder({
            key: node.key,
            style: node.style
        });
        return this;
    }

    _appendBlock(node) {
        if (this.tableCellBuilder === null) {
            throw new Error();
        }
        this.tableCellBuilder.append(node);
        return this;
    }

    _appendBlockEnd(node) {
        if (this.tableCellBuilder === null) {
            throw new Error();
        }
        this.tableCellBuilder.append(node);
        return this;
    }

    _appendText(node) {
        if (this.tableCellBuilder === null) {
            throw new Error();
        }
        this.tableCellBuilder.append(node);
        return this;
    }

    _appendInlineEmbed(node) {
        if (this.tableCellBuilder === null) {
            throw new Error();
        }
        this.tableCellBuilder.append(node);
        return this;
    }
}
