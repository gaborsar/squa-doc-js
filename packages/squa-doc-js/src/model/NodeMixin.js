import createKey from "./createKey";

export default class NodeMixin {
    setKey(key) {
        return this.merge({ key });
    }

    regenerateKey() {
        return this.setKey(createKey());
    }
}
