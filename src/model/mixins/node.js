"use strict";

import createKey from "../createKey";

export default function nodeMixin(Node) {
  if (!Node.prototype.merge) {
    throw new Error("missing method: merge");
  }

  Node.prototype.setKey = function(key) {
    return this.merge({ key });
  };

  Node.prototype.regenerateKey = function() {
    return this.setKey(createKey());
  };
}
