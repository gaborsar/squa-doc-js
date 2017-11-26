"use strict";

import Style from "../Style";

export default function formatMixin(Node) {
  if (!Node.prototype.format) {
    throw new Error("missing method: format");
  }

  Node.prototype.setStyle = function(style) {
    return this.merge({ style });
  };

  Node.prototype.clearStyle = function() {
    return this.setStyle(Style.create());
  };
}
