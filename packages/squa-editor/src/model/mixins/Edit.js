const EditMixin = superclass =>
  class extends superclass {
    edit() {
      throw new Error("missing method");
    }

    formatAt(startOffset, endOffset, attributes) {
      return this.edit()
        .retain(startOffset)
        .format(endOffset - startOffset, attributes)
        .build();
    }

    insertAt(offset, value, attributes = {}) {
      return this.edit()
        .retain(offset)
        .insert(value, attributes)
        .build();
    }

    deleteAt(startOffset, endOffset) {
      return this.edit()
        .retain(startOffset)
        .delete(endOffset - startOffset)
        .build();
    }

    apply(delta) {
      return this.edit()
        .apply(delta)
        .build();
    }
  };

export default EditMixin;
