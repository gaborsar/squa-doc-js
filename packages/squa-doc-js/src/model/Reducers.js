export function addLength(length, node) {
  return length + node.getLength();
}

export function concatText(text, node) {
  return text + node.getText();
}

export function concatDelta(delta, node) {
  return delta.concat(node.getDelta());
}
