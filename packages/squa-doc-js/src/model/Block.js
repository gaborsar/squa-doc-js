import Delta from "quill-delta";
import SpecialCharacter from "./SpecialCharacter";
import NodeMixin from "./mixins/Node";
import FormatMixin from "./mixins/Format";
import ParentMixin from "./mixins/Parent";
import EditableMixin from "./mixins/Editable";
import ListIterator from "./iterators/ListIterator";
import Editor from "./Editor";
import Style from "./Style";
import findPosition from "./traversal/findPosition";
import createRange from "./traversal/createRange";
import { createKey } from "./Keys";
import { addLength, concatText, concatDelta } from "./Reducers";

class Block {
  constructor({
    schema,
    key = createKey(),
    style = Style.create(),
    children = []
  }) {
    this.schema = schema;
    this.key = key;
    this.style = style;
    this.children = children;
  }

  // Getters

  getNodeType() {
    return "block";
  }

  getLength() {
    return this.children.reduce(addLength, 1);
  }

  getText() {
    return this.children.reduce(concatText, "") + SpecialCharacter.BlockEnd;
  }

  getDelta() {
    return this.children
      .reduce(concatDelta, new Delta())
      .insert(SpecialCharacter.BlockEnd, this.getAttributes());
  }

  getEnd() {
    const { key, style } = this;
    return this.schema.createBlockEnd({ key, style });
  }

  isEmpty() {
    return this.children.length === 0;
  }

  // Node mixin methods

  merge(props) {
    return new Block({ ...this, ...props });
  }

  // Editable mixin methods

  iterator() {
    const end = this.getEnd();
    return new ListIterator([...this.children, end]);
  }

  edit() {
    const { schema, key, style, children } = this;

    const iterator = new ListIterator(children);
    const builder = schema.createBlockBuilder({ key, style });

    return new Editor(iterator, builder);
  }

  // Format mixin methods

  isValidMark(name) {
    return this.schema.isBlockMark(name);
  }

  // Parent mixin methods

  findChildAtOffset(offset) {
    return findPosition(this.children, offset, true);
  }

  findChildrenAtRange(offset, length) {
    return createRange(this.children, offset, length);
  }

  // Own methods

  concat(other) {
    return other.setChildren(this.children.concat(other.children));
  }
}

Object.assign(
  Block.prototype,
  NodeMixin,
  EditableMixin,
  FormatMixin,
  ParentMixin
);

export default Block;
