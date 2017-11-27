"use strict";

import Style from "../Style";

export default function formatMixin(Node) {
  if (!Node.prototype.format) {
    throw new Error("missing method: update");
  }

  Node.prototype.setStyle = function(style) {
    return this.merge({ style });
  };

  Node.prototype.clearStyle = function() {
    return this.setStyle(Style.create());
  };

  Node.prototype.hasMark = function(type) {
    return this.style.hasMark(type);
  };

  Node.prototype.getMark = function(type) {
    return this.style.getMark(type);
  };
}
