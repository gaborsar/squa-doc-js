export default function findChildNode(node, predicate) {
  const queue = [node];

  while (queue.length) {
    const node = queue.shift();

    for (const child of node.childNodes) {
      if (predicate(child)) {
        return child;
      }

      queue.push(child);
    }
  }

  return null;
}
