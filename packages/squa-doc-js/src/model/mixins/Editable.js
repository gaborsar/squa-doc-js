function applyOperation(editor, op) {
  if (typeof op.retain === "number") {
    return editor.retain(op.retain, op.attributes);
  }
  if (
    typeof op.insert === "string" ||
    (typeof op.insert === "object" && op.insert !== null)
  ) {
    return editor.insert(op.insert, op.attributes);
  }
  if (typeof op.delete === "number") {
    return editor.delete(op.delete);
  }
  return editor;
}

function applyDelta(editor, delta) {
  return delta.reduce(applyOperation, editor).retain(Infinity);
}

const EditableMixin = {
  apply(delta) {
    return applyDelta(this.edit(), delta).build();
  }
};

export default EditableMixin;
