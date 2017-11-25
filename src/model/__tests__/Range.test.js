"use strict";

import Text from "../Text";
import RangeElement from "../RangeElement";
import Range from "../Range";

describe("Range", () => {
  let nodes;

  beforeEach(() => {
    nodes = [
      Text.create({ value: "aaaa" }),
      Text.create({ value: "bbbb" }),
      Text.create({ value: "cccc" })
    ];
  });

  test("left side of the first node", () => {
    const actual = Range.create(nodes, 0, 2);
    const expected = new Range([new RangeElement(nodes[0], 0, 2)]);
    expect(actual).toEqual(expected);
  });

  test("middle of the first node", () => {
    const actual = Range.create(nodes, 1, 2);
    const expected = new Range([new RangeElement(nodes[0], 1, 2)]);
    expect(actual).toEqual(expected);
  });

  test("right side of the first node", () => {
    const actual = Range.create(nodes, 2, 2);
    const expected = new Range([new RangeElement(nodes[0], 2, 2)]);
    expect(actual).toEqual(expected);
  });

  test("the first node", () => {
    const actual = Range.create(nodes, 0, 4);
    const expected = new Range([new RangeElement(nodes[0], 0, 4)]);
    expect(actual).toEqual(expected);
  });

  test("left side of an intermediate node", () => {
    const actual = Range.create(nodes, 4, 2);
    const expected = new Range([new RangeElement(nodes[1], 0, 2)]);
    expect(actual).toEqual(expected);
  });

  test("middle of an intermediate node", () => {
    const actual = Range.create(nodes, 5, 2);
    const expected = new Range([new RangeElement(nodes[1], 1, 2)]);
    expect(actual).toEqual(expected);
  });

  test("right side of an intermediate node", () => {
    const actual = Range.create(nodes, 6, 2);
    const expected = new Range([new RangeElement(nodes[1], 2, 2)]);
    expect(actual).toEqual(expected);
  });

  test("an intermediate node", () => {
    const actual = Range.create(nodes, 4, 4);
    const expected = new Range([new RangeElement(nodes[1], 0, 4)]);
    expect(actual).toEqual(expected);
  });

  test("left side of the last node", () => {
    const actual = Range.create(nodes, 8, 2);
    const expected = new Range([new RangeElement(nodes[2], 0, 2)]);
    expect(actual).toEqual(expected);
  });

  test("middle of the last node", () => {
    const actual = Range.create(nodes, 9, 2);
    const expected = new Range([new RangeElement(nodes[2], 1, 2)]);
    expect(actual).toEqual(expected);
  });

  test("right side of the last node", () => {
    const actual = Range.create(nodes, 10, 2);
    const expected = new Range([new RangeElement(nodes[2], 2, 2)]);
    expect(actual).toEqual(expected);
  });

  test("the last node", () => {
    const actual = Range.create(nodes, 8, 4);
    const expected = new Range([new RangeElement(nodes[2], 0, 4)]);
    expect(actual).toEqual(expected);
  });

  test("right side of the first node, an intermediate node, left side of the last node", () => {
    const actual = Range.create(nodes, 2, 8);
    const expected = new Range([
      new RangeElement(nodes[0], 2, 2),
      new RangeElement(nodes[1], 0, 4),
      new RangeElement(nodes[2], 0, 2)
    ]);
    expect(actual).toEqual(expected);
  });
});
