const EmbedMixin = {
  getName() {
    return this.name;
  },

  getValue() {
    return this.value;
  },

  setName(name) {
    return this.merge({ name });
  },

  setValue(value) {
    return this.merge({ value });
  }
};

export default EmbedMixin;
