const LeafMixin = superclass =>
  class extends superclass {
    setValue(value) {
      return this.merge({ value });
    }
  };

export default LeafMixin;
