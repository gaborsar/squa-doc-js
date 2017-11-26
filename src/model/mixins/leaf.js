"use strict";

export default function formatMixin(Node) {
  Node.prototype.setValue = function(value) {
    return this.merge({ value });
  };
}
