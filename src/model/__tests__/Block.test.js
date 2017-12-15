import Delta from "quill-delta";
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

  test("delta", () => {
    const block = new BlockBuilder(schema)
      .insert("aaa", { bold: true })
      .insert({ image: "foo" })
      .insert("bbb")
      .build();

    const delta = new Delta()
      .insert("aaa", { bold: true })
      .insert({ image: "foo" })
      .insert("bbb")
      .insert("\n");

    expect(block.delta).toEqual(delta);
  });

  describe("apply()", () => {
    test("format a range", () => {
      const node = new BlockBuilder(schema).insert("aaabbbccc\n").build();

      const delta = new Delta().retain(3).retain(3, { bold: true });

      const actual = node.apply(delta);

      const expected = new BlockBuilder(schema)
        .insert("aaa")
        .insert("bbb", { bold: true })
        .insert("ccc\n")
        .build();

      expect(actual.delta).toEqual(expected.delta);
    });

    test("insert text", () => {
      const node = new BlockBuilder(schema).insert("aaabbb\n").build();

      const delta = new Delta().retain(3).insert("ccc", { bold: true });

      const actual = node.apply(delta);

      const expected = new BlockBuilder(schema)
        .insert("aaa")
        .insert("ccc", { bold: true })
        .insert("bbb\n")
        .build();

      expect(actual.delta).toEqual(expected.delta);
    });

    test("insert an inline embed", () => {
      const node = new BlockBuilder(schema).insert("aaabbb\n").build();

      const delta = new Delta()
        .retain(3)
        .insert({ image: "foo" }, { bold: true });

      const actual = node.apply(delta);

      const expected = new BlockBuilder(schema)
        .insert("aaa")
        .insert({ image: "foo" }, { bold: true })
        .insert("bbb\n")
        .build();

      expect(actual.delta).toEqual(expected.delta);
    });

    test("delete a range", () => {
      const node = new BlockBuilder(schema).insert("aaabbbccc\n").build();

      const delta = new Delta().retain(3).delete(3);

      const actual = node.apply(delta);

      const expected = new BlockBuilder(schema).insert("aaaccc\n").build();

      expect(actual.delta).toEqual(expected.delta);
    });
  });

  test("slice()", () => {
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

    expect(actual.delta).toEqual(expected.delta);
  });

  test("concat()", () => {
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

    expect(actual.delta).toEqual(expected.delta);
  });
});
