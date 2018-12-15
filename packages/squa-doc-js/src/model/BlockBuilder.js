import { isTextNode, isInlineEmbedNode } from "./Predicates";

export default class BlockBuilder {
    constructor(schema, key, style, children) {
        this.schema = schema;
        this.key = key;
        this.style = style;
        this.children = children;
    }

    append(node) {
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
            return this._insertText(value, attributes);
        }
        if (typeof value === "object" && value !== null) {
            return this._insertObject(value, attributes);
        }
        throw new Error();
    }

    build() {
        return this.schema.createBlock({
            key: this.key,
            style: this.style,
            children: this.children
        });
    }

    _appendText(node) {
        this.children.push(node);
        return this;
    }

    _appendInlineEmbed(node) {
        this.children.push(node);
        return this;
    }

    _insertText(value, attributes = {}) {
        return this._appendText(
            this.schema.createText({ value }).setAttributes(attributes)
        );
    }

    _insertInlineEmbed(name, value, attributes = {}) {
        return this._appendInlineEmbed(
            this.schema
                .createInlineEmbed({ name, value })
                .setAttributes(attributes)
        );
    }

    _insertObject(value, attributes = {}) {
        const [name] = Object.keys(value);
        if (this.schema.isInlineEmbed(name)) {
            return this._insertInlineEmbed(name, value[name], attributes);
        }
        throw new Error();
    }
}
