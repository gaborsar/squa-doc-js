import Delta from "quill-delta";
import NodeMixin from "./mixins/Node";
import ParentMixin from "./mixins/Parent";
import EditableMixin from "./mixins/Editable";
import ListIterator from "./iterators/ListIterator";
import Editor from "./Editor";
import findPosition from "./traversal/findPosition";
import createRange from "./traversal/createRange";
import { createKey } from "./Keys";
import { isBlockNode } from "./Predicates";
import { addLength, concatText, concatDelta } from "./Reducers";

class Document {
  constructor({ schema, key = createKey(), children = [] }) {
    this.schema = schema;
    this.key = key;
    this.children = children;
  }

  // Getters

  getNodeType() {
    return "document";
  }

  getLength() {
    return this.children.reduce(addLength, 0);
  }

  getText() {
    return this.children.reduce(concatText, "");
  }

  getDelta() {
    return this.children.reduce(concatDelta, new Delta());
  }

  isPristine() {
    const { children } = this;

    if (children.length !== 1) {
      return false;
    }

    const child = children[0];

    return isBlockNode(child) && child.isEmpty() && child.isPristine();
  }

  // Node mixin methods

  merge(props) {
    return new Document({ ...this, ...props });
  }

  // Editable mixin methods

  iterator() {
    return new ListIterator(this.children);
  }

  edit() {
    const { schema, key } = this;

    const iterator = this.iterator();
    const builder = schema.createDocumentBuilder({ key });

    return new Editor(iterator, builder);
  }

  // Parent mixin methods

  findChildAtOffset(offset) {
    return findPosition(this.children, offset, false);
  }

  findChildrenAtRange(offset, length) {
    return createRange(this.children, offset, length);
  }

  // Own methods

  diff(other) {
    return this.getDelta().diff(other.getDelta());
  }
}

Object.assign(Document.prototype, NodeMixin, EditableMixin, ParentMixin);

export default Document;
