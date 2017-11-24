"use strict";

/**
 * Counter.
 *
 * @type {number}
 */
let counter = 0;

/**
 * Returns a new key.
 *
 * @return {string}
 */
export default function createKey() {
  return `${++counter}`;
}
