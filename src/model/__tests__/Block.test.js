import Delta from "quill-delta";
import BlockBuilder from "../BlockBuilder";

describe("Block", () => {
  test("length", () => {
    const node = new BlockBuilder()
      .insert("aaa")
      .insert({ "inline-image": "foo" })
      .insert("bbb")
      .build();

    expect(node.length).toBe(8);
  });

  test("text", () => {
    const node = new BlockBuilder()
      .insert("aaa")
      .insert({ "inline-image": "foo" })
      .insert("bbb")
      .build();

    expect(node.text).toBe("aaa*bbb\n");
  });

  test("delta", () => {
    const block = new BlockBuilder()
      .insert("aaa", { bold: true })
      .insert({ "inline-image": "foo" })
      .insert("bbb")
      .build();

    const delta = new Delta()
      .insert("aaa", { bold: true })
      .insert({ "inline-image": "foo" })
      .insert("bbb")
      .insert("\n");

    expect(block.delta).toEqual(delta);
  });

  describe("apply()", () => {
    test("format a range", () => {
      const node = new BlockBuilder().insert("aaabbbccc").build();

      const delta = new Delta().retain(3).retain(3, { bold: true });

      const actual = node.apply(delta);

      const expected = new BlockBuilder()
        .insert("aaa")
        .insert("bbb", { bold: true })
        .insert("ccc")
        .build();

      expect(actual.delta).toEqual(expected.delta);
    });

    test("insert text", () => {
      const node = new BlockBuilder().insert("aaabbb").build();

      const delta = new Delta().retain(3).insert("ccc", { bold: true });

      const actual = node.apply(delta);

      const expected = new BlockBuilder()
        .insert("aaa")
        .insert("ccc", { bold: true })
        .insert("bbb")
        .build();

      expect(actual.delta).toEqual(expected.delta);
    });

    test("insert an inline embed", () => {
      const node = new BlockBuilder().insert("aaabbb").build();

      const delta = new Delta()
        .retain(3)
        .insert({ "inline-image": "foo" }, { alt: "foo" });

      const actual = node.apply(delta);

      const expected = new BlockBuilder()
        .insert("aaa")
        .insert({ "inline-image": "foo" }, { alt: "foo" })
        .insert("bbb")
        .build();

      expect(actual.delta).toEqual(expected.delta);
    });

    test("delete a range", () => {
      const node = new BlockBuilder().insert("aaabbbccc").build();

      const delta = new Delta().retain(3).delete(3);

      const actual = node.apply(delta);

      const expected = new BlockBuilder().insert("aaaccc").build();

      expect(actual.delta).toEqual(expected.delta);
    });
  });

  test("slice()", () => {
    const actual = new BlockBuilder()
      .insert("aaabbb")
      .insert({ "inline-image": "foo" })
      .insert("cccddd")
      .build()
      .slice(3, 10);

    const expected = new BlockBuilder()
      .insert("bbb")
      .insert({ "inline-image": "foo" })
      .insert("ccc")
      .build();

    expect(actual.delta).toEqual(expected.delta);
  });

  test("concat()", () => {
    const nodeA = new BlockBuilder()
      .insert("aaa")
      .build()
      .format({ align: "left" });

    const nodeB = new BlockBuilder()
      .insert("bbb")
      .build()
      .format({ align: "right" });

    const actual = nodeA.concat(nodeB);

    const expected = new BlockBuilder()
      .insert("aaabbb")
      .build()
      .format({ align: "right" });

    expect(actual.delta).toEqual(expected.delta);
  });
});
