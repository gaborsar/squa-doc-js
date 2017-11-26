"use strict";

import createKey from "../createKey";

export default function nodeMixin(Node) {
  Node.prototype.setKey = function(key) {
    return this.merge({ key });
  };

  Node.prototype.regenerateKey = function() {
    return this.setKey(createKey());
  };
}
