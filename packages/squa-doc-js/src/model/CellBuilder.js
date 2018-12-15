import {
    isBlockNode,
    isBlockEndNode,
    isTextNode,
    isInlineEmbedNode
} from "./Predicates";

export default class CellBuilder {
    constructor(schema, key, style, children) {
        this.schema = schema;
        this.key = key;
        this.style = style;
        this.children = children;
        this.blockBuilder = null;
    }

    append(node) {
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
        if (this.blockBuilder !== null) {
            throw new Error();
        }
        return this.schema.createCell({
            key: this.key,
            style: this.style,
            children: this.children
        });
    }

    _appendBlock(node) {
        if (this.blockBuilder === null) {
            this.children.push(node);
        } else {
            this.children.push(this.blockBuilder.build().concat(node));
            this.blockBuilder = null;
        }
        return this;
    }

    _appendBlockEnd(node) {
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
        return this;
    }

    _appendText(node) {
        if (this.blockBuilder === null) {
            this.blockBuilder = this.schema.createBlockBuilder();
        }
        this.blockBuilder.append(node);
        return this;
    }

    _appendInlineEmbed(node) {
        if (this.blockBuilder === null) {
            this.blockBuilder = this.schema.createBlockBuilder();
        }
        this.blockBuilder.append(node);
        return this;
    }
}
