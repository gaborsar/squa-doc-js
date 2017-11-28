import Schema from "../Schema";
import DocumentBuilder from "../DocumentBuilder";

const schema = new Schema({
  block: {
    embeds: ["block-image"],
    marks: ["common"]
  },
  inline: {
    embeds: ["inline-image"],
    marks: ["common"]
  },
  "block-image": {
    marks: ["alt"]
  },
  "inline-image": {
    marks: ["alt"]
  }
});

describe("Document", () => {
  test("length", () => {
    const node = new DocumentBuilder(schema)
      .insert("aaa\n")
      .insert("bbb\n")
      .insert("ccc\n")
      .build();

    expect(node.length).toBe(12);
  });

  test("text", () => {
    const node = new DocumentBuilder(schema)
      .insert("aaa\n")
      .insert("bbb\n")
      .insert("ccc\n")
      .build();

    expect(node.text).toBe("aaa\nbbb\nccc\n");
  });

  describe("formatAt(offset, length, attributes)", () => {
    test("format the left slice of a child", () => {
      const actual = new DocumentBuilder(schema)
        .insert("aaa\n")
        .insert("bbbccc\n")
        .insert("ddd\n")
        .build()
        .formatAt(4, 7, { common: "foo" });

      const expected = new DocumentBuilder(schema)
        .insert("aaa\n")
        .insert("bbb", { common: "foo" })
        .insert("ccc\n")
        .insert("ddd\n")
        .build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("format a middle slice of a child", () => {
      const actual = new DocumentBuilder(schema)
        .insert("aaa\n")
        .insert("bbbcccddd\n")
        .insert("eee\n")
        .build()
        .formatAt(7, 10, { common: "foo" });

      const expected = new DocumentBuilder(schema)
        .insert("aaa\n")
        .insert("bbb")
        .insert("ccc", { common: "foo" })
        .insert("ddd\n")
        .insert("eee\n")
        .build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("format the right slice of a child", () => {
      const actual = new DocumentBuilder(schema)
        .insert("aaa\n")
        .insert("bbbccc\n")
        .insert("ddd\n")
        .build()
        .formatAt(7, 11, { common: "foo" });

      const expected = new DocumentBuilder(schema)
        .insert("aaa\n")
        .insert("bbb")
        .insert("ccc\n", { common: "foo" })
        .insert("ddd\n")
        .build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    describe("format the first child", () => {
      test("the child is a block node", () => {
        const actual = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert("bbb\n")
          .build()
          .formatAt(0, 4, { common: "foo" });

        const expected = new DocumentBuilder(schema)
          .insert("aaa\n", { common: "foo" })
          .insert("bbb\n")
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the child is an embed node", () => {
        const actual = new DocumentBuilder(schema)
          .insert({ "block-image": "foo" })
          .insert("bbb\n")
          .build()
          .formatAt(0, 1, { common: "foo" });

        const expected = new DocumentBuilder(schema)
          .insert({ "block-image": "foo" }, { common: "foo" })
          .insert("bbb\n")
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    describe("format a child", () => {
      test("the child is a block node", () => {
        const actual = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert("bbb\n")
          .insert("ccc\n")
          .build()
          .formatAt(4, 8, { common: "foo" });

        const expected = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert("bbb\n", { common: "foo" })
          .insert("ccc\n")
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the child is an embed node", () => {
        const actual = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert({ "block-image": "foo" })
          .insert("ccc\n")
          .build()
          .formatAt(4, 5, { common: "foo" });

        const expected = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert({ "block-image": "foo" }, { common: "foo" })
          .insert("ccc\n")
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    describe("format the last child", () => {
      test("the child is a block node", () => {
        const actual = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert("bbb\n")
          .build()
          .formatAt(4, 8, { common: "foo" });

        const expected = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert("bbb\n", { common: "foo" })
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the child is an embed node", () => {
        const actual = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert({ "block-image": "foo" })
          .build()
          .formatAt(4, 5, { common: "foo" });

        const expected = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert({ "block-image": "foo" }, { common: "foo" })
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    test("format the right slice of the first child, a child, and the left slice of the last child", () => {
      const actual = new DocumentBuilder(schema)
        .insert("aaabbb\n")
        .insert("ccc\n")
        .insert("dddeee\n")
        .build()
        .formatAt(3, 14, { common: "foo" });

      const expected = new DocumentBuilder(schema)
        .insert("aaa")
        .insert("bbb\n", { common: "foo" })
        .insert("ccc\n", { common: "foo" })
        .insert("ddd", { common: "foo" })
        .insert("eee\n")
        .build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("format every children", () => {
      const actual = new DocumentBuilder(schema)
        .insert("aaa\n")
        .insert("bbb\n")
        .insert("ccc\n")
        .build()
        .formatAt(0, 12, { common: "foo" });

      const expected = new DocumentBuilder(schema)
        .insert("aaa\n", { common: "foo" })
        .insert("bbb\n", { common: "foo" })
        .insert("ccc\n", { common: "foo" })
        .build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });
  });

  describe("insertAt(offset, value, attributes)", () => {
    describe("insert a child before the first child", () => {
      test("the new child is a text node", () => {
        const actual = new DocumentBuilder(schema)
          .insert("aaa\n")
          .build()
          .insertAt(0, "bbb", { common: "foo" });

        const expected = new DocumentBuilder(schema)
          .insert("bbb", { common: "foo" })
          .insert("aaa\n")
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the new child is a block embed node", () => {
        const actual = new DocumentBuilder(schema)
          .insert("aaa\n")
          .build()
          .insertAt(0, { "block-image": "foo" }, { alt: "foo" });

        const expected = new DocumentBuilder(schema)
          .insert({ "block-image": "foo" }, { alt: "foo" })
          .insert("aaa\n")
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the new child is an inline embed node", () => {
        const actual = new DocumentBuilder(schema)
          .insert("aaa\n")
          .build()
          .insertAt(0, { "inline-image": "foo" }, { alt: "foo" });

        const expected = new DocumentBuilder(schema)
          .insert({ "inline-image": "foo" }, { alt: "foo" })
          .insert("aaa\n")
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    describe("insert between two children", () => {
      test("the new child is a text node", () => {
        const actual = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert("bbb\n")
          .build()
          .insertAt(4, "ccc", { common: "foo" });

        const expected = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert("ccc", { common: "foo" })
          .insert("bbb\n")
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the new child is a block embed node", () => {
        const actual = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert("bbb\n")
          .build()
          .insertAt(4, { "block-image": "foo" }, { alt: "foo" });

        const expected = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert({ "block-image": "foo" }, { alt: "foo" })
          .insert("bbb\n")
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the new child is an inline embed node", () => {
        const actual = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert("bbb\n")
          .build()
          .insertAt(4, { "inline-image": "foo" }, { alt: "foo" });

        const expected = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert({ "inline-image": "foo" }, { alt: "foo" })
          .insert("bbb\n")
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    test("insert after the last child", () => {
      const actual = new DocumentBuilder(schema)
        .insert("aaa\n")
        .build()
        .insertAt(4, "aaa", { common: "foo" });

      const expected = new DocumentBuilder(schema).insert("aaa\n").build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    describe("insert into the first child", () => {
      test("the new child is a text node", () => {
        const actual = new DocumentBuilder(schema)
          .insert("aaabbb\n")
          .insert("ccc\n")
          .build()
          .insertAt(3, "ddd", { common: "foo" });

        const expected = new DocumentBuilder(schema)
          .insert("aaa")
          .insert("ddd", { common: "foo" })
          .insert("bbb\n")
          .insert("ccc\n")
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the new child is a block embed node", () => {
        const actual = new DocumentBuilder(schema)
          .insert("aaabbb\n")
          .insert("ccc\n")
          .build()
          .insertAt(3, { "block-image": "foo" }, { alt: "foo" });

        const expected = new DocumentBuilder(schema)
          .insert("aaabbb\n")
          .insert("ccc\n")
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the new child is an inline embed node", () => {
        const actual = new DocumentBuilder(schema)
          .insert("aaabbb\n")
          .insert("ccc\n")
          .build()
          .insertAt(3, { "inline-image": "foo" }, { alt: "foo" });

        const expected = new DocumentBuilder(schema)
          .insert("aaa")
          .insert({ "inline-image": "foo" }, { alt: "foo" })
          .insert("bbb\n")
          .insert("ccc\n")
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    describe("insert into a child", () => {
      test("the new child is a text node", () => {
        const actual = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert("bbbccc\n")
          .insert("ddd\n")
          .build()
          .insertAt(7, "eee", { common: "foo" });

        const expected = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert("bbb")
          .insert("eee", { common: "foo" })
          .insert("ccc\n")
          .insert("ddd\n")
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the new child is a block embed node", () => {
        const actual = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert("bbbccc\n")
          .insert("ddd\n")
          .build()
          .insertAt(7, { "block-image": "foo" }, { alt: "foo" });

        const expected = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert("bbbccc\n")
          .insert("ddd\n")
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the new child is an inline embed node", () => {
        const actual = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert("bbbccc\n")
          .insert("ddd\n")
          .build()
          .insertAt(7, { "inline-image": "foo" }, { alt: "foo" });

        const expected = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert("bbb")
          .insert({ "inline-image": "foo" }, { alt: "foo" })
          .insert("ccc\n")
          .insert("ddd\n")
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    describe("insert into the last child", () => {
      test("the new child is a text node", () => {
        const actual = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert("bbbccc\n")
          .build()
          .insertAt(7, "ddd", { common: "foo" });

        const expected = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert("bbb")
          .insert("ddd", { common: "foo" })
          .insert("ccc\n")
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the new child is a block embed node", () => {
        const actual = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert("bbbccc\n")
          .build()
          .insertAt(7, { "block-image": "foo" }, { alt: "foo" });

        const expected = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert("bbbccc\n")
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the new child is an inline embed node", () => {
        const actual = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert("bbbccc\n")
          .build()
          .insertAt(7, { "inline-image": "foo" }, { alt: "foo" });

        const expected = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert("bbb")
          .insert({ "inline-image": "foo" }, { alt: "foo" })
          .insert("ccc\n")
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    test("insert an unknown embed", () => {
      const actual = new DocumentBuilder(schema)
        .insert("aaa\n")
        .build()
        .insertAt(0, { unknown: "foo" });

      const expected = new DocumentBuilder(schema).insert("aaa\n").build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("insert multiple lines", () => {
      const actual = new DocumentBuilder(schema)
        .insert("aaabbb\n")
        .build()
        .insertAt(3, "ccc\nddd\neee", { common: "foo" });

      const expected = new DocumentBuilder(schema)
        .insert("aaa")
        .insert("ccc\n", { common: "foo" })
        .insert("ddd\n", { common: "foo" })
        .insert("eee", { common: "foo" })
        .insert("bbb\n")
        .build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });
  });

  describe("deleteAt(offset, length", () => {
    test("delete the left slice of a child", () => {
      const actual = new DocumentBuilder(schema)
        .insert("aaa\n")
        .insert("bbbccc\n")
        .insert("ddd\n")
        .build()
        .deleteAt(4, 7);

      const expected = new DocumentBuilder(schema)
        .insert("aaa\n")
        .insert("ccc\n")
        .insert("ddd\n")
        .build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("delete the middle slice of a child", () => {
      const actual = new DocumentBuilder(schema)
        .insert("aaa\n")
        .insert("bbbcccddd\n")
        .insert("eee\n")
        .build()
        .deleteAt(7, 10);

      const expected = new DocumentBuilder(schema)
        .insert("aaa\n")
        .insert("bbbddd\n")
        .insert("eee\n")
        .build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("delete the right slice of a child", () => {
      const actual = new DocumentBuilder(schema)
        .insert("aaa\n")
        .insert("bbbccc\n")
        .insert("ddd\n")
        .build()
        .deleteAt(7, 10);

      const expected = new DocumentBuilder(schema)
        .insert("aaa\n")
        .insert("bbb\n")
        .insert("ddd\n")
        .build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    describe("delete the first child", () => {
      test("the child is a block node", () => {
        const actual = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert("bbb\n")
          .build()
          .deleteAt(0, 4);

        const expected = new DocumentBuilder(schema).insert("bbb\n").build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the child is an embed node", () => {
        const actual = new DocumentBuilder(schema)
          .insert({ "block-image": "foo" })
          .insert("aaa\n")
          .build()
          .deleteAt(0, 1);

        const expected = new DocumentBuilder(schema).insert("aaa\n").build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    describe("delete a child", () => {
      test("the child is a block node", () => {
        const actual = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert("bbb\n")
          .insert("ccc\n")
          .build()
          .deleteAt(4, 8);

        const expected = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert("ccc\n")
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the child is an embed node", () => {
        const actual = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert({ "block-image": "foo" })
          .insert("bbb\n")
          .build()
          .deleteAt(4, 5);

        const expected = new DocumentBuilder(schema)
          .insert("aaa\n")
          .insert("bbb\n")
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    test("delete the last child", () => {
      const actual = new DocumentBuilder(schema)
        .insert("aaa\n")
        .insert("bbb\n")
        .build()
        .deleteAt(4, 8);

      const expected = new DocumentBuilder(schema)
        .insert("aaa\n")
        .insert("bbb\n")
        .build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("delete the right slice of the first child, a child, and the right slice of the last child", () => {
      const actual = new DocumentBuilder(schema)
        .insert("aaabbb\n")
        .insert("ccc\n")
        .insert("dddeee\n")
        .build()
        .deleteAt(3, 14);

      const expected = new DocumentBuilder(schema).insert("aaaeee\n").build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("delete a child and the left slice of a child", () => {
      const actual = new DocumentBuilder(schema)
        .insert("aaa\n")
        .insert("bbbccc\n")
        .build()
        .deleteAt(0, 7);

      const expected = new DocumentBuilder(schema).insert("ccc\n").build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("delete every children", () => {
      const actual = new DocumentBuilder(schema)
        .insert("aaa\n")
        .insert("bbb\n")
        .insert("ccc\n")
        .build()
        .deleteAt(0, 12);

      const expected = new DocumentBuilder(schema)
        .insert("aaa\n")
        .insert("bbb\n")
        .insert("ccc\n")
        .build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("delete a block node before an embed node", () => {
      const actual = new DocumentBuilder(schema)
        .insert("aaa\n")
        .insert({ "block-image": "foo" })
        .build()
        .deleteAt(0, 4);

      const expected = new DocumentBuilder(schema)
        .insert({ "block-image": "foo" })
        .build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("delete a slice of a block node before an embed node", () => {
      const actual = new DocumentBuilder(schema)
        .insert("aaabbb\n")
        .insert("ccc\n")
        .insert({ "block-image": "foo" })
        .insert("ddd\n")
        .build()
        .deleteAt(3, 11);

      const expected = new DocumentBuilder(schema)
        .insert("aaa\n")
        .insert("ddd\n")
        .build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });
  });
});
