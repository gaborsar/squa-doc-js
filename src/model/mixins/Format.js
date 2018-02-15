import Style from "../Style";

const FormatMixin = superclass =>
  class extends superclass {
    setStyle(style = Style.create()) {
      return this.merge({ style });
    }

    clearStyle() {
      return this.setStyle();
    }

    hasMark(type) {
      return this.style.hasMark(type);
    }

    getMark(type) {
      return this.style.getMark(type);
    }

    format() {
      throw new Error("missing method");
    }
  };

export default FormatMixin;
