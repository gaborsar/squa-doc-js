"use strict";

import Mark from "./Mark";

/**
 * Style pool.
 *
 * @type {Style[]}
 */
const styles = [];

/**
 * Represents the style of a node.
 */
export default class Style {
  /**
   * Returns a new style based on the given props object.
   *
   * Note: this function uses an object pool to save memory,
   * so it is very important to avoid any mutation of what it returns.
   *
   * @param {Object} [props]
   * @param {Mark[]} [props.marks]
   * @returns {Style}
   */
  static create(props = {}) {
    const { marks = [] } = props;

    const style = new Style(marks);

    for (let i = 0, l = styles.length; i < l; i++) {
      const pooledStyle = styles[i];

      if (pooledStyle.equals(style)) {
        return pooledStyle;
      }
    }

    styles.push(style);

    return style;
  }

  /**
   * Constructor.
   *
   * @param {Mark[]} marks
   */
  constructor(marks = []) {
    /** @type {Mark[]} */
    this.marks = marks;
  }

  /**
   * Returns the JSON representation of the style.
   *
   * @returns {Object}
   */
  toJSON() {
    return {
      marks: this.marks.map(mark => mark.toJSON())
    };
  }

  /**
   * Returns the object representation of the style.
   *
   * @returns {Object}
   */
  toObject() {
    const attributes = {};

    this.marks.forEach(mark => {
      attributes[mark.type] = mark.value;
    });

    return attributes;
  }

  /**
   * Updates the style.
   *
   * @param {Object} attributes
   * @param {function} predicate
   * @returns {Style}
   */
  format(attributes, predicate) {
    let marks = this.marks;

    Object.keys(attributes)
      .filter(predicate)
      .forEach(type => {
        marks = marks.filter(mark => mark.type !== type);

        const value = attributes[type];

        if (value !== null) {
          marks = marks.concat(Mark.create({ type, value }));
        }
      });

    marks.sort(Mark.compare);

    return Style.create({ marks });
  }

  /**
   * Returns true if the given style is equal to the style,
   * false otherwise.
   *
   * @param {Style} other
   * @returns {boolean}
   */
  equals(other) {
    if (this.marks.length !== other.marks.length) {
      return false;
    }

    for (let i = 0, l = this.marks.length; i < l; i++) {
      if (this.marks[i] !== other.marks[i]) {
        return false;
      }
    }

    return true;
  }
}
