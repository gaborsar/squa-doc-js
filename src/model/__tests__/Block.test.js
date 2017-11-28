import Schema from "../Schema";
import BlockBuilder from "../BlockBuilder";

const schema = new Schema({
  block: {
    marks: ["align"]
  },
  inline: {
    marks: ["bold"],
    embeds: ["image"]
  }
});

describe("Block", () => {
  test("length", () => {
    const node = new BlockBuilder(schema)
      .insert("aaa")
      .insert({ image: "foo" })
      .insert("bbb")
      .build();

    expect(node.length).toBe(8);
  });

  test("text", () => {
    const node = new BlockBuilder(schema)
      .insert("aaa")
      .insert({ image: "foo" })
      .insert("bbb")
      .build();

    expect(node.text).toBe("aaa*bbb\n");
  });

  describe("formatAt(offset, length, attributes)", () => {
    test("format the left slice of a child", () => {
      const actual = new BlockBuilder(schema)
        .insert("aaa")
        .insert("bbbccc")
        .insert("ddd")
        .build()
        .formatAt(3, 6, { bold: true });

      const expected = new BlockBuilder(schema)
        .insert("aaa")
        .insert("bbb", { bold: true })
        .insert("cccddd")
        .build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("format a middle slice of a child", () => {
      const actual = new BlockBuilder(schema)
        .insert("aaa")
        .insert("bbbcccddd")
        .insert("eee")
        .build()
        .formatAt(6, 9, { bold: true });

      const expected = new BlockBuilder(schema)
        .insert("aaabbb")
        .insert("ccc", { bold: true })
        .insert("dddeee")
        .build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("format the right slice of a child", () => {
      const actual = new BlockBuilder(schema)
        .insert("aaa")
        .insert("bbbccc")
        .insert("ddd")
        .build()
        .formatAt(6, 9, { bold: true });

      const expected = new BlockBuilder(schema)
        .insert("aaabbb")
        .insert("ccc", { bold: true })
        .insert("ddd")
        .build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    describe("format the first child", () => {
      test("the first child is a text node", () => {
        const actual = new BlockBuilder(schema)
          .insert("aaa")
          .insert("bbb")
          .build()
          .formatAt(0, 3, { bold: true });

        const expected = new BlockBuilder(schema)
          .insert("aaa", { bold: true })
          .insert("bbb")
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the first child is an embed node", () => {
        const actual = new BlockBuilder(schema)
          .insert({ image: "foo" })
          .insert("aaa")
          .build()
          .formatAt(0, 1, { bold: true });

        const expected = new BlockBuilder(schema)
          .insert({ image: "foo" }, { bold: true })
          .insert("aaa")
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    describe("format a child", () => {
      test("the child is a text node", () => {
        const actual = new BlockBuilder(schema)
          .insert("aaa")
          .insert("bbb")
          .insert("ccc")
          .build()
          .formatAt(3, 6, { bold: true });

        const expected = new BlockBuilder(schema)
          .insert("aaa")
          .insert("bbb", { bold: true })
          .insert("ccc")
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the child is an embed node", () => {
        const actual = new BlockBuilder(schema)
          .insert("aaa")
          .insert({ image: "foo" })
          .insert("bbb")
          .build()
          .formatAt(3, 4, { bold: true });

        const expected = new BlockBuilder(schema)
          .insert("aaa")
          .insert({ image: "foo" }, { bold: true })
          .insert("bbb")
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    describe("format the last child", () => {
      test("the child is a text node", () => {
        const actual = new BlockBuilder(schema)
          .insert("aaa")
          .insert("bbb")
          .build()
          .formatAt(3, 6, { bold: true });

        const expected = new BlockBuilder(schema)
          .insert("aaa")
          .insert("bbb", { bold: true })
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the child is an embed node", () => {
        const actual = new BlockBuilder(schema)
          .insert("aaa")
          .insert({ image: "foo" })
          .build()
          .formatAt(3, 1, { bold: true });

        const expected = new BlockBuilder(schema)
          .insert("aaa")
          .insert({ image: "foo" }, { bold: true })
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    test("format the right slice of the first child, a child, and the left slice of the last child", () => {
      const actual = new BlockBuilder(schema)
        .insert("aaabbb")
        .insert("ccc")
        .insert("dddeee")
        .build()
        .formatAt(3, 12, { bold: true });

      const expected = new BlockBuilder(schema)
        .insert("aaa")
        .insert("bbbcccddd", { bold: true })
        .insert("eee")
        .build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("format every children", () => {
      const actual = new BlockBuilder(schema)
        .insert("aaa")
        .insert("bbb")
        .insert("ccc")
        .build()
        .formatAt(0, 9, { bold: true });

      const expected = new BlockBuilder(schema)
        .insert("aaabbbccc", { bold: true })
        .build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("format the EOL", () => {
      const actual = new BlockBuilder()
        .build()
        .formatAt(0, 1, { align: "left" });

      const expected = new BlockBuilder().build().format({ align: "left" });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });
  });

  describe("insertAt(offset, value, attributes)", () => {
    describe("insert into an empty node", () => {
      test("the value is a string", () => {
        const actual = new BlockBuilder(schema)
          .build()
          .insertAt(0, "aaa", { bold: true });

        const expected = new BlockBuilder(schema)
          .insert("aaa", { bold: true })
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the value is an object", () => {
        const actual = new BlockBuilder(schema)
          .build()
          .insertAt(0, { image: "foo" }, { bold: true });

        const expected = new BlockBuilder(schema)
          .insert({ image: "foo" }, { bold: true })
          .build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    test("insert before the first child", () => {
      const actual = new BlockBuilder(schema)
        .insert("aaa")
        .build()
        .insertAt(0, "bbb", { bold: true });

      const expected = new BlockBuilder(schema)
        .insert("bbb", { bold: true })
        .insert("aaa")
        .build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("insert between two children", () => {
      const actual = new BlockBuilder(schema)
        .insert("aaa")
        .insert("bbb")
        .build()
        .insertAt(3, "ccc", { bold: true });

      const expected = new BlockBuilder(schema)
        .insert("aaa")
        .insert("ccc", { bold: true })
        .insert("bbb")
        .build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("insert after the last child", () => {
      const actual = new BlockBuilder(schema)
        .insert("aaa")
        .build()
        .insertAt(3, "bbb", { bold: true });

      const expected = new BlockBuilder(schema)
        .insert("aaa")
        .insert("bbb", { bold: true })
        .build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("insert into a the first child", () => {
      const actual = new BlockBuilder(schema)
        .insert("aaabbb")
        .insert("ccc")
        .build()
        .insertAt(3, "ddd", { bold: true });

      const expected = new BlockBuilder(schema)
        .insert("aaa")
        .insert("ddd", { bold: true })
        .insert("bbbccc")
        .build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("insert into a child", () => {
      const actual = new BlockBuilder(schema)
        .insert("aaa")
        .insert("bbbccc")
        .insert("ddd")
        .build()
        .insertAt(6, "eee", { bold: true });

      const expected = new BlockBuilder(schema)
        .insert("aaabbb")
        .insert("eee", { bold: true })
        .insert("cccddd")
        .build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("insert into the last child", () => {
      const actual = new BlockBuilder(schema)
        .insert("aaa")
        .insert("bbbccc")
        .build()
        .insertAt(6, "ddd", { bold: true });

      const expected = new BlockBuilder(schema)
        .insert("aaabbb")
        .insert("ddd", { bold: true })
        .insert("ccc")
        .build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("insert an unknown embed", () => {
      const actual = new BlockBuilder(schema)
        .insert("aaa")
        .build()
        .insertAt(9, { unknown: "foo" });

      const expected = new BlockBuilder(schema).insert("aaa").build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });
  });

  describe("deleteAt(offset, length)", () => {
    test("delete the left slice of a child", () => {
      const actual = new BlockBuilder(schema)
        .insert("aaa")
        .insert("bbbccc")
        .insert("ddd")
        .build()
        .deleteAt(3, 6);

      const expected = new BlockBuilder(schema).insert("aaacccddd").build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("delete a middle slice of a child", () => {
      const actual = new BlockBuilder(schema)
        .insert("aaa")
        .insert("bbbcccddd")
        .insert("eee")
        .build()
        .deleteAt(6, 9);

      const expected = new BlockBuilder(schema).insert("aaabbbdddeee").build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("delete the right slice of a child", () => {
      const actual = new BlockBuilder(schema)
        .insert("aaa")
        .insert("bbbccc")
        .insert("ddd")
        .build()
        .deleteAt(6, 9);

      const expected = new BlockBuilder(schema).insert("aaabbbddd").build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    describe("delete the first child", () => {
      test("the child is a text node", () => {
        const actual = new BlockBuilder(schema)
          .insert("aaa")
          .insert("bbb")
          .build()
          .deleteAt(0, 3);

        const expected = new BlockBuilder(schema).insert("bbb").build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the child is an embed node", () => {
        const actual = new BlockBuilder(schema)
          .insert({ image: "foo" })
          .insert("aaa")
          .build()
          .deleteAt(0, 1);

        const expected = new BlockBuilder(schema).insert("aaa").build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    describe("delete a child", () => {
      test("the child is a text node", () => {
        const actual = new BlockBuilder(schema)
          .insert("aaa")
          .insert("bbb")
          .insert("ccc")
          .build()
          .deleteAt(3, 6);

        const expected = new BlockBuilder(schema).insert("aaaccc").build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the child is an embed node", () => {
        const actual = new BlockBuilder(schema)
          .insert("aaa")
          .insert({ image: "foo" })
          .insert("bbb")
          .build()
          .deleteAt(3, 4);

        const expected = new BlockBuilder(schema).insert("aaabbb").build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    describe("delete the last child", () => {
      test("the child is a text node", () => {
        const actual = new BlockBuilder(schema)
          .insert("aaa")
          .insert("bbb")
          .build()
          .deleteAt(3, 6);

        const expected = new BlockBuilder(schema).insert("aaa").build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the child is an embed node", () => {
        const actual = new BlockBuilder(schema)
          .insert("aaa")
          .insert({ image: "foo" })
          .build()
          .deleteAt(3, 4);

        const expected = new BlockBuilder(schema).insert("aaa").build();

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    test("delete the right slice of the first child, a child, and the left slice of the last child", () => {
      const actual = new BlockBuilder(schema)
        .insert("aaabbb")
        .insert("ccc")
        .insert("dddeee")
        .build()
        .deleteAt(3, 12);

      const expected = new BlockBuilder().insert("aaaeee").build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("delete every children", () => {
      const actual = new BlockBuilder(schema)
        .insert("aaa")
        .insert("bbb")
        .insert("ccc")
        .build()
        .deleteAt(0, 9);

      const expected = new BlockBuilder(schema).build();

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });
  });

  test("slice(startOffset, endOffset)", () => {
    const actual = new BlockBuilder(schema)
      .insert("aaabbb")
      .insert({ image: "foo" })
      .insert("cccddd")
      .build()
      .slice(3, 10);

    const expected = new BlockBuilder(schema)
      .insert("bbb")
      .insert({ image: "foo" })
      .insert("ccc")
      .build();

    expect(actual.toJSON()).toEqual(expected.toJSON());
  });

  test("concat(other)", () => {
    const nodeA = new BlockBuilder(schema)
      .insert("aaa")
      .build()
      .format({ align: "left" });

    const nodeB = new BlockBuilder(schema)
      .insert("bbb")
      .build()
      .format({ align: "right" });

    const actual = nodeA.concat(nodeB);

    const expected = new BlockBuilder(schema)
      .insert("aaabbb")
      .build()
      .format({ align: "right" });

    expect(actual.toJSON()).toEqual(expected.toJSON());
  });
});
