const LeafMixin = {
    getValue() {
        return this.value;
    },

    setValue(value) {
        return this.merge({ value });
    }
};

export default LeafMixin;
