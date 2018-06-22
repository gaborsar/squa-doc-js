export function setAttributes(attributes) {
  return node => {
    return node.setAttributes(attributes);
  };
}

export function setAttributesAt(attributes) {
  return (node, offset, length) => {
    return node
      .edit()
      .retain(offset)
      .retain(length, attributes)
      .retain(Infinity)
      .build();
  };
}
