import createKey from "./createKey";

const NodeMixin = Class =>
    class extends Class {
        setKey(key) {
            return this.merge({ key });
        }

        regenerateKey() {
            return this.setKey(createKey());
        }
    };

export default NodeMixin;
