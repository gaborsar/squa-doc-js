const alwaysFalse = () => false;

export default class Schema {
  constructor(methods = {}) {
    this.methods = methods;
  }

  isBlockEmbed(embedType) {
    const { isBlockEmbed = alwaysFalse } = this.methods;
    return isBlockEmbed(embedType);
  }

  isInlineEmbed(embedType) {
    const { isInlineEmbed = alwaysFalse } = this.methods;
    return isInlineEmbed(embedType);
  }

  isBlockMark(markType) {
    const { isBlockMark = alwaysFalse } = this.methods;
    return isBlockMark(markType);
  }

  isInlineMark(markType) {
    const { isInlineMark = alwaysFalse } = this.methods;
    return isInlineMark(markType);
  }

  isEmbedMark(embedType, markType) {
    const { isEmbedMark = alwaysFalse } = this.methods;
    return isEmbedMark(embedType, markType);
  }
}
