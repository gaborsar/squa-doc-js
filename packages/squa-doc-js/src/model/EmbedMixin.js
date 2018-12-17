const EmbedMixin = Class =>
    class extends Class {
        setName(name) {
            return this.merge({ name });
        }

        setValue(value) {
            return this.merge({ value });
        }
    };

export default EmbedMixin;
