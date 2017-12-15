export default class Schema {
  constructor(rules = {}) {
    this.rules = rules;
  }

  isInlineEmbed(embedType) {
    return (
      this.rules.inline &&
      this.rules.inline.embeds &&
      this.rules.inline.embeds.indexOf(embedType) !== -1
    );
  }

  isBlockEmbed(embedType) {
    return (
      this.rules.block &&
      this.rules.block.embeds &&
      this.rules.block.embeds.indexOf(embedType) !== -1
    );
  }

  isInlineMark(markType) {
    return (
      this.rules.inline &&
      this.rules.inline.marks &&
      this.rules.inline.marks.indexOf(markType) !== -1
    );
  }

  isBlockMark(markType) {
    return (
      this.rules.block &&
      this.rules.block.marks &&
      this.rules.block.marks.indexOf(markType) !== -1
    );
  }

  isEmbedMark(embedType, markType) {
    return (
      (this.isInlineEmbed(embedType) && this.isInlineMark(markType)) ||
      (this.isBlockEmbed(embedType) && this.isBlockMark(markType)) ||
      (this.rules[embedType] &&
        this.rules[embedType].marks &&
        this.rules[embedType].marks.indexOf(markType) !== -1)
    );
  }
}
