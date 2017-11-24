"use strict";

/**
 * Mark pool.
 *
 * @type {Mark[]}
 */
const marks = [];

/**
 * Represents a style mark (bold, italic, etc...).
 */
export default class Mark {
  /**
   * Returns a new mark based on the given props object.
   *
   * Note: this function uses an object pool to save memory,
   * so it is very important to avoid any mutation of what it returns.
   *
   * @param {Object} [props]
   * @param {string} [props.type]
   * @param {*} [props.value]
   * @returns {Mark}
   */
  static create(props = {}) {
    const { type = "", value = true } = props;

    const mark = new Mark(type, value);

    for (let i = 0, l = marks.length; i < l; i++) {
      const pooledMark = marks[i];

      if (pooledMark.equals(mark)) {
        return pooledMark;
      }
    }

    marks.push(mark);

    return mark;
  }

  /**
   * Returns a number (-1, 0, 1) indicating the order of the given marks.
   *
   * @param {Mark} markA
   * @param {Mark} markB
   * @returns {number}
   */
  static compare(markA, markB) {
    if (markA.type < markB.type) {
      return -1;
    }

    if (markB.type > markA.type) {
      return 1;
    }

    if (markA.value < markB.value) {
      return -1;
    }

    if (markA.value > markB.value) {
      return -1;
    }

    return 0;
  }

  /**
   * Constructor.
   *
   * @param {string} type
   * @param {*} value
   */
  constructor(type, value) {
    /** @type {string} */
    this.type = type;

    /** @type {*} */
    this.value = value;
  }

  /**
   * Returns the JSON representation of the mark.
   *
   * @returns {Object}
   */
  toJSON() {
    return {
      type: this.type,
      value: this.value
    };
  }

  /**
   * Returns true if the given mark is equal to the mark,
   * false otherwise.
   *
   * @param {Mark} other
   * @returns {boolean}
   */
  equals(other) {
    return this.type === other.type && this.value === other.value;
  }
}
