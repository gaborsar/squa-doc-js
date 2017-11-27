"use strict";

import createKey from "./utils/createKey";

export default class Node {
  constructor(schema, key) {
    this.schema = schema;
    this.key = key;
  }

  merge() {
    throw new Error("missing method");
  }

  setKey(key) {
    return this.merge({ key });
  }

  regenerateKey() {
    return this.setKey(createKey());
  }
}
