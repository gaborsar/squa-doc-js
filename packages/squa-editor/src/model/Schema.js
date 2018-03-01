const alwaysFalse = () => false;

export default class Schema {
  constructor(schema = {}) {
    this._schema = schema;
  }

  isBlockEmbed(embedType) {
    const { isBlockEmbed = alwaysFalse } = this._schema;
    return isBlockEmbed(embedType);
  }

  isInlineEmbed(embedType) {
    const { isInlineEmbed = alwaysFalse } = this._schema;
    return isInlineEmbed(embedType);
  }

  isBlockMark(markType) {
    const { isBlockMark = alwaysFalse } = this._schema;
    return isBlockMark(markType);
  }

  isInlineMark(markType) {
    const { isInlineMark = alwaysFalse } = this._schema;
    return isInlineMark(markType);
  }

  isEmbedMark(embedType, markType) {
    const { isEmbedMark = alwaysFalse } = this._schema;
    return isEmbedMark(embedType, markType);
  }
}
