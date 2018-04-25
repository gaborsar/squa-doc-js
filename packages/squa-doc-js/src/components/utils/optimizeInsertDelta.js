export default function optimizeInsertDelta(delta, attributes) {
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
