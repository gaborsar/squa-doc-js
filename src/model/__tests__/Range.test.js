"use strict";

import Text from "../Text";
import RangeElement from "../RangeElement";
import Range from "../Range";

describe("Range", () => {
  describe("create(nodes, startOffset, endOffset)", () => {
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
      const actual = Range.create(nodes, 1, 3);
      const expected = new Range([new RangeElement(nodes[0], 1, 3)]);
      expect(actual).toEqual(expected);
    });

    test("right side of the first node", () => {
      const actual = Range.create(nodes, 2, 4);
      const expected = new Range([new RangeElement(nodes[0], 2, 4)]);
      expect(actual).toEqual(expected);
    });

    test("the first node", () => {
      const actual = Range.create(nodes, 0, 4);
      const expected = new Range([new RangeElement(nodes[0], 0, 4)]);
      expect(actual).toEqual(expected);
    });

    test("left side of an intermediate node", () => {
      const actual = Range.create(nodes, 4, 6);
      const expected = new Range([new RangeElement(nodes[1], 0, 2)]);
      expect(actual).toEqual(expected);
    });

    test("middle of an intermediate node", () => {
      const actual = Range.create(nodes, 5, 7);
      const expected = new Range([new RangeElement(nodes[1], 1, 3)]);
      expect(actual).toEqual(expected);
    });

    test("right side of an intermediate node", () => {
      const actual = Range.create(nodes, 6, 8);
      const expected = new Range([new RangeElement(nodes[1], 2, 4)]);
      expect(actual).toEqual(expected);
    });

    test("an intermediate node", () => {
      const actual = Range.create(nodes, 4, 8);
      const expected = new Range([new RangeElement(nodes[1], 0, 4)]);
      expect(actual).toEqual(expected);
    });

    test("left side of the last node", () => {
      const actual = Range.create(nodes, 8, 10);
      const expected = new Range([new RangeElement(nodes[2], 0, 2)]);
      expect(actual).toEqual(expected);
    });

    test("middle of the last node", () => {
      const actual = Range.create(nodes, 9, 11);
      const expected = new Range([new RangeElement(nodes[2], 1, 3)]);
      expect(actual).toEqual(expected);
    });

    test("right side of the last node", () => {
      const actual = Range.create(nodes, 10, 12);
      const expected = new Range([new RangeElement(nodes[2], 2, 4)]);
      expect(actual).toEqual(expected);
    });

    test("the last node", () => {
      const actual = Range.create(nodes, 8, 12);
      const expected = new Range([new RangeElement(nodes[2], 0, 4)]);
      expect(actual).toEqual(expected);
    });

    test("right side of the first node, an intermediate node, left side of the last node", () => {
      const actual = Range.create(nodes, 2, 10);
      const expected = new Range([
        new RangeElement(nodes[0], 2, 4),
        new RangeElement(nodes[1], 0, 4),
        new RangeElement(nodes[2], 0, 2)
      ]);
      expect(actual).toEqual(expected);
    });
  });
});
