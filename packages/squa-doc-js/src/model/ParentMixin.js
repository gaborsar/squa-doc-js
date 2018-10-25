import RangeBuilder from "./RangeBuilder";
import Style from "./Style";
import { isParentNode } from "./Predicates";

const ParentMixin = {
    getChildren() {
        return this.children;
    },

    setChildren(children) {
        return this.merge({ children });
    },

    isEmpty() {
        return this.children.length === 0;
    },

    getChildAtIndex(index) {
        return this.children[index];
    },

    insertChildAtIndex(index, child) {
        const { children } = this;

        const before = children.slice(0, index);
        const after = children.slice(index);

        return this.setChildren(before.concat(child).concat(after));
    },

    removeChildAtIndex(index) {
        const { children } = this;

        const before = children.slice(0, index);
        const after = children.slice(index + 1);

        return this.setChildren(before.concat(after));
    },

    replaceChildAtIndex(index, child) {
        const { children } = this;

        const before = children.slice(0, index);
        const after = children.slice(index + 1);

        return this.setChildren(before.concat(child).concat(after));
    },

    findPreviousDescendant(node) {
        const queue = [this];

        while (queue.length !== 0) {
            const { children } = queue.shift();

            for (let i = 0, l = children.length; i < l; i++) {
                const child = children[i];

                if (child === node) {
                    return i > 0 ? children[i - 1] : null;
                }

                if (isParentNode(child)) {
                    queue.push(child);
                }
            }
        }

        return null;
    },

    findNextDescendant(node) {
        const queue = [this];

        while (queue.length !== 0) {
            const { children } = queue.shift();

            for (let i = 0, l = children.length; i < l; i++) {
                const child = children[i];

                if (child === node) {
                    return i < l - 1 ? children[i + 1] : null;
                }

                if (isParentNode(child)) {
                    queue.push(child);
                }
            }
        }

        return null;
    },

    removeDescendantByKey(key) {
        const { children } = this;

        for (let i = 0, l = children.length; i < l; i++) {
            const child = children[i];

            if (child.key === key) {
                return this.removeChildAtIndex(i);
            }

            if (isParentNode(child)) {
                const nextChild = child.removeDescendantByKey(key);

                if (nextChild !== child) {
                    return this.replaceChildAtIndex(i, nextChild);
                }
            }
        }

        return this;
    },

    replaceDescendantByKey(key, descendant) {
        const { children } = this;

        for (let i = 0, l = children.length; i < l; i++) {
            const child = children[i];

            if (child.key === key) {
                return this.replaceChildAtIndex(i, descendant);
            }

            if (isParentNode(child)) {
                const nextChild = child.replaceDescendantByKey(key, descendant);

                if (nextChild !== child) {
                    return this.replaceChildAtIndex(i, nextChild);
                }
            }
        }

        return this;
    },

    findDescendantAtOffset(offset, predicate) {
        const pos = this.findChildAtOffset(offset);

        if (pos === null) {
            return null;
        }

        const child = pos.node;

        if (predicate(child)) {
            return pos;
        }

        if (isParentNode(child)) {
            return child.findDescendantAtOffset(pos.offset, predicate);
        }

        return null;
    },

    updateDescendantAtOffset(offset, predicate, updater) {
        const pos = this.findChildAtOffset(offset);

        if (pos === null) {
            return this;
        }

        const oldChild = pos.node;

        let nextChild;
        if (predicate(oldChild)) {
            nextChild = updater(oldChild, pos.offset);
        } else if (isParentNode(oldChild)) {
            nextChild = oldChild.updateDescendantAtOffset(
                pos.offset,
                predicate,
                updater
            );
        } else {
            nextChild = oldChild;
        }

        if (nextChild !== oldChild) {
            return this.replaceChildAtIndex(pos.index, nextChild);
        }

        return this;
    },

    findDescendantsAtRange(offset, length, predicate) {
        const builder = new RangeBuilder();

        this.findChildrenAtRange(offset, length).forEach(item => {
            const child = item.node;

            if (predicate(child)) {
                builder.pushRangeItem(item);
            } else if (isParentNode(child)) {
                builder.pushRange(
                    child.findDescendantsAtRange(
                        item.offset,
                        item.length,
                        predicate
                    )
                );
            }
        });

        return builder.build();
    },

    updateDescendantsAtRange(offset, length, predicate, updater) {
        let node = this;

        node.findChildrenAtRange(offset, length).forEach(item => {
            const oldChild = item.node;

            let nextChild;
            if (predicate(oldChild)) {
                nextChild = updater(oldChild, item.offset, item.length);
            } else if (isParentNode(oldChild)) {
                nextChild = oldChild.updateDescendantsAtRange(
                    item.offset,
                    item.length,
                    predicate,
                    updater
                );
            } else {
                nextChild = oldChild;
            }

            if (nextChild !== oldChild) {
                node = node.replaceChildAtIndex(item.index, nextChild);
            }
        });

        return node;
    },

    getAttributesAtOffset(offset, predicate, override = null) {
        const pos = this.findDescendantAtOffset(offset, predicate);

        if (pos === null) {
            return {};
        }

        const attributes = pos.node.getAttributes();

        return { ...attributes, ...override };
    },

    getAttributesAtRange(offset, length, predicate, override = null) {
        const range = this.findDescendantsAtRange(offset, length, predicate);

        if (range.isEmpty()) {
            return {};
        }

        const attributes = range
            .tail()
            .reduce(
                (style, item) => Style.intersect(style, item.node.style),
                range.head().node.style
            )
            .getAttributes();

        return { ...attributes, ...override };
    }
};

export default ParentMixin;
