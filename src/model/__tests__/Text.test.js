"use strict";

import Schema from "../Schema";
import Text from "../Text";

const schema = new Schema({
  inline: {
    marks: ["bold", "italic"]
  }
});

describe("Text", () => {
  test("format(attributes)", () => {
    const node = Text.create({ schema });

    const actual = node
      .format({ bold: true })
      .format({ bold: null, italic: true });

    const expected = node.format({ italic: true });

    expect(actual.toJSON()).toEqual(expected.toJSON());
  });

  test("slice(startOffset, endOffset)", () => {
    const node = Text.create({
      value: "aaabbbccc"
    });

    const actual = node.slice(3, 6);

    expect(actual.value).toBe("bbb");
  });

  test("concat(other)", () => {
    const one = Text.create({
      value: "aaa"
    });
    const two = Text.create({
      value: "bbb"
    });

    const actual = one.concat(two);

    expect(actual.value).toBe("aaabbb");
  });
});
