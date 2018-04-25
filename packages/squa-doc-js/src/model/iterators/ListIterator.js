export default class ListIterator {
  constructor(nodes) {
    this.nodes = nodes;
    this.index = 0;
    this.iterator = null;
  }

  isDone() {
    return this.nodes.length <= this.index;
  }

  next(length, strategy = "shallow") {
    const { nodes } = this;

    if (nodes.length <= this.index) {
      return null;
    }

    if (this.iterator === null) {
      const node = nodes[this.index];

      if (strategy === "shallow" && node.getLength() <= length) {
        this.index++;
        return node;
      }

      this.iterator = node.iterator();
    }

    const node = this.iterator.next(length, strategy);

    if (this.iterator.isDone()) {
      this.index++;
      this.iterator = null;
    }

    return node;
  }
}
