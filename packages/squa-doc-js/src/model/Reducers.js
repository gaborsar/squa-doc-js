export function addLength(length, node) {
    return length + node.length;
}

export function concatText(text, node) {
    return text + node.text;
}

export function concatDelta(delta, node) {
    return delta.concat(node.delta);
}
