import Delta from "quill-delta";
import { isEqual } from "lodash/fp";
import Node from "./Node";
import DocumentEditor from "./DocumentEditor";
import ParentMixin from "./mixins/Parent";
import EditMixin from "./mixins/Edit";
import cache from "./utils/cache";

function getLength(node) {
  return node.children.reduce((length, child) => length + child.length, 0);
}

function getDelta(node) {
  let delta = new Delta();

  node.children.forEach(child => {
    delta = delta.concat(child.delta);
  });

  return delta;
}

export default class Document extends EditMixin(ParentMixin(Node)) {
  static create(props = {}) {
    return new Document(props);
  }

  constructor(props = {}) {
    const { schema, key, children = [] } = props;

    super(schema, key);

    this.children = children;

    this._length = null;
    this._delta = null;
  }

  merge(props) {
    return Document.create({ ...this, ...props });
  }

  get isEmpty() {
    if (this.children.length !== 1) {
      return false;
    }

    const child = this.children[0];

    return child.isEmpty && child.isPristine;
  }

  get length() {
    return cache(this, "_length", getLength);
  }

  get delta() {
    return cache(this, "_delta", getDelta);
  }

  edit() {
    return new DocumentEditor(this);
  }

  diff(other) {
    const { children: blocksA } = this;
    const { children: blocksB } = other;

    let startIndex = 0;
    let retainLength = 0;

    let { length: endIndexA } = blocksA;
    let { length: endIndexB } = blocksB;

    while (
      startIndex < endIndexA &&
      startIndex < endIndexB &&
      isEqual(blocksA[startIndex], blocksB[startIndex])
    ) {
      retainLength += blocksA[startIndex].length;
      startIndex++;
    }

    while (
      startIndex < endIndexA &&
      startIndex < endIndexB &&
      isEqual(blocksA[endIndexA - 1], blocksB[endIndexB - 1])
    ) {
      endIndexA--;
      endIndexB--;
    }

    let deltaA = new Delta();
    for (let i = startIndex; i < endIndexA; i++) {
      deltaA = deltaA.concat(blocksA[i].delta);
    }

    let deltaB = new Delta();
    for (let i = startIndex; i < endIndexB; i++) {
      deltaB = deltaB.concat(blocksB[i].delta);
    }

    return new Delta().retain(retainLength).concat(deltaA.diff(deltaB));
  }
}
