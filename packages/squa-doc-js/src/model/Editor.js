export default class Editor {
  constructor(iterator, builder) {
    this.iterator = iterator;
    this.builder = builder;
  }

  retain(length, attributes = null) {
    const { iterator, builder } = this;

    let remainingLength = length;

    if (attributes !== null) {
      while (remainingLength !== 0 && !iterator.isDone()) {
        const node = iterator.next(remainingLength, "deep");

        remainingLength -= node.getLength();

        builder.append(node.setAttributes(attributes));
      }
    } else {
      while (remainingLength !== 0 && !iterator.isDone()) {
        const node = iterator.next(remainingLength, "shallow");

        remainingLength -= node.getLength();

        builder.append(node);
      }
    }

    return this;
  }

  insert(value, attributes) {
    this.builder.insert(value, attributes);
    return this;
  }

  delete(length) {
    const { iterator } = this;

    let remainingLength = length;

    while (remainingLength !== 0 && !iterator.isDone()) {
      const node = iterator.next(remainingLength, "shallow");

      remainingLength -= node.getLength();
    }

    return this;
  }

  build() {
    return this.builder.build();
  }
}
