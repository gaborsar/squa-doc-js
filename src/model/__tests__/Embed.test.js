"use strict";

import Schema from "../Schema";
import Embed from "../Embed";

const schema = new Schema({
  image: {
    marks: ["width", "height"]
  }
});

describe("Embed", () => {
  test("update(attributes)", () => {
    const node = Embed.create({
      schema,
      value: {
        image: "foo.png"
      }
    });

    const actual = node
      .format({ width: 100 })
      .format({ width: null, height: 100 });

    const expected = node.format({ height: 100 });

    expect(actual.toJSON()).toEqual(expected.toJSON());
  });

  describe("formatAt(offset, length, attributes)", () => {
    test("offset is not 0", () => {
      const node = Embed.create({
        schema,
        value: {
          image: "foo.png"
        }
      });

      const actual = node
        .format({ width: 100 })
        .formatAt(1, 1, { width: null, height: 100 });

      const expected = node.format({ width: 100 });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("length is not 1", () => {
      const node = Embed.create({
        schema,
        value: {
          image: "foo.png"
        }
      });

      const actual = node
        .format({ width: 100 })
        .formatAt(0, 0, { width: null, height: 100 });

      const expected = node.format({ width: 100 });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("offset is 0 and length is 1", () => {
      const node = Embed.create({
        schema,
        value: {
          image: "foo.png"
        }
      });

      const actual = node
        .format({ width: 100 })
        .formatAt(0, 1, { width: null, height: 100 });

      const expected = node.format({ height: 100 });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });
  });
});
