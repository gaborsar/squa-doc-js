"use strict";

/**
 * Represents a document validation schema.
 */
export default class Schema {
  /**
   * Constructor.
   *
   * Example rules:
   * {
   *   block: {
   *     marks: ["type", "align", "indent"],
   *     embeds: ["block-image"]
   *   },
   *   inline: {
   *     marks: ["bold", "italic", "underline"],
   *     embeds: ["inline-image"]
   *   },
   *   "block-image": {
   *     marks: ["alt", "width"]
   *   },
   *   "inline-image": {
   *     marks: ["alt"]
   *   }
   * }
   *
   * @param {Object} [rules]
   */
  constructor(rules = {}) {
    /** @type {Object} */
    this.rules = rules;
  }

  /**
   * Returns true if the given embed type is registered as an inline embed,
   * false otherwise.
   *
   * @param {string} embedType
   * @returns {boolean}
   */
  isInlineEmbed(embedType) {
    return (
      this.rules.inline &&
      this.rules.inline.embeds &&
      this.rules.inline.embeds.indexOf(embedType) !== -1
    );
  }

  /**
   * Returns true if the given embed type is registered as a block embed,
   * false otherwise.
   *
   * @param {string} embedType
   * @returns {boolean}
   */
  isBlockEmbed(embedType) {
    return (
      this.rules.block &&
      this.rules.block.embeds &&
      this.rules.block.embeds.indexOf(embedType) !== -1
    );
  }

  /**
   * Returns true if the given mark type is registered as an inline mark,
   * false otherwise.
   *
   * @param {string} markType
   * @returns {boolean}
   */
  isInlineMark(markType) {
    return (
      this.rules.inline &&
      this.rules.inline.marks &&
      this.rules.inline.marks.indexOf(markType) !== -1
    );
  }

  /**
   * Returns true if the given mark type is registered as a block mark,
   * false otherwise.
   *
   * @param {string} markType
   * @returns {boolean}
   */
  isBlockMark(markType) {
    return (
      this.rules.block &&
      this.rules.block.marks &&
      this.rules.block.marks.indexOf(markType) !== -1
    );
  }

  /**
   * Returns true if the given mark type is registered as an embed mark for the
   * given embed type, or for the scope of the given embed type,
   * false otherwise.
   *
   * @param {string} embedType
   * @param {string} markType
   * @returns {boolean}
   */
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
