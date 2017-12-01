import Document from "./Document";
import Selection from "./Selection";
import Change from "./Change";

export const MODE_EDIT = "edit";
export const MODE_COMPOSITION = "composition";

export default class Value {
  static create(props = {}) {
    return new Value(props);
  }

  constructor(props = {}) {
    const {
      mode = MODE_EDIT,
      document = Document.create(),
      selection = Selection.create(),
      undoStack = [],
      redoStack = []
    } = props;

    this.mode = mode;
    this.document = document;
    this.selection = selection;
    this.undoStack = undoStack;
    this.redoStack = redoStack;
  }

  merge(props) {
    return Value.create({ ...this, ...props });
  }

  change() {
    return new Change(this);
  }

  setDocument(document = Document.create()) {
    return this.merge({ document });
  }

  setSelection(selection = Selection.create()) {
    return this.merge({ selection });
  }

  setMode(mode = MODE_EDIT) {
    return this.merge({ mode });
  }

  setUndoStack(undoStack = []) {
    return this.merge({ undoStack });
  }

  setRedoStack(redoStack = []) {
    return this.merge({ redoStack });
  }
}
