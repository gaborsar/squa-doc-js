export default function findChildNode(node, predicate) {
  const queue = [node];

  while (queue.length) {
    const currentNode = queue.shift();

    for (const child of currentNode.childNodes) {
      if (predicate(child)) {
        return child;
      }

      queue.push(child);
    }
  }

  return null;
}
