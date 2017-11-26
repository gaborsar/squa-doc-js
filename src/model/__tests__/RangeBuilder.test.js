"use strict";

import Text from "../Text";
import RangeElement from "../RangeElement";
import Range from "../Range";
import RangeBuilder from "../RangeBuilder";

describe("RangeBuilder", () => {
  let nodes;

  beforeEach(() => {
    nodes = [
      Text.create({ value: "aaaa" }),
      Text.create({ value: "bbbb" }),
      Text.create({ value: "cccc" })
    ];
  });

  test("left side of the first node", () => {
    const actual = new RangeBuilder(nodes).keep(2).build();
    const expected = new Range([new RangeElement(nodes[0], 0, 2)]);
    expect(actual).toEqual(expected);
  });

  test("middle of the first node", () => {
    const actual = new RangeBuilder(nodes)
      .skip(1)
      .keep(2)
      .build();
    const expected = new Range([new RangeElement(nodes[0], 1, 3)]);
    expect(actual).toEqual(expected);
  });

  test("right side of the first node", () => {
    const actual = new RangeBuilder(nodes)
      .skip(2)
      .keep(2)
      .build();
    const expected = new Range([new RangeElement(nodes[0], 2, 4)]);
    expect(actual).toEqual(expected);
  });

  test("the first node", () => {
    const actual = new RangeBuilder(nodes).keep(4).build();
    const expected = new Range([new RangeElement(nodes[0], 0, 4)]);
    expect(actual).toEqual(expected);
  });

  test("left side of an intermediate node", () => {
    const actual = new RangeBuilder(nodes)
      .skip(4)
      .keep(2)
      .build();
    const expected = new Range([new RangeElement(nodes[1], 0, 2)]);
    expect(actual).toEqual(expected);
  });

  test("middle of an intermediate node", () => {
    const actual = new RangeBuilder(nodes)
      .skip(5)
      .keep(2)
      .build();
    const expected = new Range([new RangeElement(nodes[1], 1, 3)]);
    expect(actual).toEqual(expected);
  });

  test("right side of an intermediate node", () => {
    const actual = new RangeBuilder(nodes)
      .skip(6)
      .keep(2)
      .build();
    const expected = new Range([new RangeElement(nodes[1], 2, 4)]);
    expect(actual).toEqual(expected);
  });

  test("an intermediate node", () => {
    const actual = new RangeBuilder(nodes)
      .skip(4)
      .keep(4)
      .build();
    const expected = new Range([new RangeElement(nodes[1], 0, 4)]);
    expect(actual).toEqual(expected);
  });

  test("left side of the last node", () => {
    const actual = new RangeBuilder(nodes)
      .skip(8)
      .keep(2)
      .build();
    const expected = new Range([new RangeElement(nodes[2], 0, 2)]);
    expect(actual).toEqual(expected);
  });

  test("middle of the last node", () => {
    const actual = new RangeBuilder(nodes)
      .skip(9)
      .keep(2)
      .build();
    const expected = new Range([new RangeElement(nodes[2], 1, 3)]);
    expect(actual).toEqual(expected);
  });

  test("right side of the last node", () => {
    const actual = new RangeBuilder(nodes)
      .skip(10)
      .keep(2)
      .build();
    const expected = new Range([new RangeElement(nodes[2], 2, 4)]);
    expect(actual).toEqual(expected);
  });

  test("the last node", () => {
    const actual = new RangeBuilder(nodes)
      .skip(8)
      .keep(4)
      .build();
    const expected = new Range([new RangeElement(nodes[2], 0, 4)]);
    expect(actual).toEqual(expected);
  });

  test("right side of the first node, an intermediate node, left side of the last node", () => {
    const actual = new RangeBuilder(nodes)
      .skip(2)
      .keep(8)
      .build();
    const expected = new Range([
      new RangeElement(nodes[0], 2, 4),
      new RangeElement(nodes[1], 0, 4),
      new RangeElement(nodes[2], 0, 2)
    ]);
    expect(actual).toEqual(expected);
  });
});
