import RangeBuilder from "../traversal/RangeBuilder";
import { isParentNode } from "../Predicates";

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

  getChildByIndex(index) {
    return this.children[index];
  },

  removeChildByIndex(index) {
    const { children } = this;

    const before = children.slice(0, index);
    const after = children.slice(index + 1);

    return this.setChildren(before.concat(after));
  },

  replaceChildByIndex(index, child) {
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

      if (child.getKey() === key) {
        return this.removeChildByIndex(i);
      }

      if (isParentNode(child)) {
        const newChild = child.removeDescendantByKey(key);

        if (newChild !== child) {
          return this.replaceChildByIndex(i, newChild);
        }
      }
    }

    return this;
  },

  replaceDescendantByKey(key, descendant) {
    const { children } = this;

    for (let i = 0, l = children.length; i < l; i++) {
      const child = children[i];

      if (child.getKey() === key) {
        return this.replaceChildByIndex(i, descendant);
      }

      if (isParentNode(child)) {
        const newChild = child.replaceDescendantByKey(key, descendant);

        if (newChild !== child) {
          return this.replaceChildByIndex(i, newChild);
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

    const child = pos.getNode();

    if (predicate(child)) {
      return pos;
    }

    if (isParentNode(child)) {
      return child.findDescendantAtOffset(pos.getOffset(), predicate);
    }

    return null;
  },

  updateDescendantAtOffset(offset, predicate, updater) {
    const pos = this.findChildAtOffset(offset);

    if (pos === null) {
      return this;
    }

    const oldChild = pos.getNode();

    let newChild;
    if (predicate(oldChild)) {
      newChild = updater(oldChild, pos.getOffset());
    } else if (isParentNode(oldChild)) {
      newChild = oldChild.updateDescendantAtOffset(
        pos.getOffset(),
        predicate,
        updater
      );
    } else {
      newChild = oldChild;
    }

    if (newChild !== oldChild) {
      return this.replaceChildByIndex(pos.getIndex(), newChild);
    }

    return this;
  },

  findDescendantsAtRange(offset, length, predicate) {
    const builder = new RangeBuilder();

    this.findChildrenAtRange(offset, length).forEach(item => {
      const child = item.getNode();

      if (predicate(child)) {
        builder.pushRangeItem(item);
      } else if (isParentNode(child)) {
        builder.pushRange(
          child.findDescendantsAtRange(
            item.getOffset(),
            item.getLength(),
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
      const oldChild = item.getNode();

      let newChild;
      if (predicate(oldChild)) {
        newChild = updater(oldChild, item.getOffset(), item.getLength());
      } else if (isParentNode(oldChild)) {
        newChild = oldChild.updateDescendantsAtRange(
          item.getOffset(),
          item.getLength(),
          predicate,
          updater
        );
      } else {
        newChild = oldChild;
      }

      if (newChild !== oldChild) {
        node = node.replaceChildByIndex(item.getIndex(), newChild);
      }
    });

    return node;
  },

  getAttributesAtOffset(offset, predicate, override = null) {
    const pos = this.findDescendantAtOffset(offset, predicate);

    if (pos === null) {
      return {};
    }

    const attributes = pos.getNode().getAttributes();

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
        (style, item) => style.intersect(item.getNode().getStyle()),
        range
          .head()
          .getNode()
          .getStyle()
      )
      .getAttributes();

    return { ...attributes, ...override };
  }
};

export default ParentMixin;
