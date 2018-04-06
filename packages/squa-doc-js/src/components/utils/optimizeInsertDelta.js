export default function optimiseInsertDelta(delta, attributes) {
  delta.forEach(op => {
    if (typeof op.insert === "string") {
      if (op.attributes) {
        op.attributes = { ...op.attributes, ...attributes };
      } else {
        op.attributes = attributes;
      }
    }
  });
}
