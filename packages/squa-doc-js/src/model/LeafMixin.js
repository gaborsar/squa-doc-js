const LeafMixin = Class =>
    class extends Class {
        setValue(value) {
            return this.merge({ value });
        }
    };

export default LeafMixin;
