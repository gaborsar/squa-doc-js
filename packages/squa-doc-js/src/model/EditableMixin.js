const EditableMixin = Class =>
    class extends Class {
        apply(delta) {
            return applyDelta(this.editor(), delta).build();
        }
    };

export default EditableMixin;

function applyDelta(editor, delta) {
    return delta.reduce(applyOperation, editor).retain(Infinity);
}

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
