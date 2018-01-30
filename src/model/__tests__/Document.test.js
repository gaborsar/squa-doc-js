import Delta from "quill-delta";
import DocumentBuilder from "../DocumentBuilder";
import extendSchema from "../extendSchema";
import defaultSchema from "../../plugins/schema";

const schema = extendSchema(defaultSchema, {
  isBlockMark(markType) {
    if (markType === "common") {
      return true;
    }
  },
  isInlineMark(markType) {
    if (markType === "common") {
      return true;
    }
  },
  isEmbedMark(embedType, markType) {
    if (markType === "common") {
      return true;
    }
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

  test("delta", () => {
    const node = new DocumentBuilder(schema)
      .insert("aaa\n")
      .insert({ "block-image": "foo" })
      .insert("bbb\n")
      .build();

    const delta = new Delta()
      .insert("aaa\n")
      .insert({ "block-image": "foo" })
      .insert("bbb\n");

    expect(node.delta).toEqual(delta);
  });

  describe("apply()", () => {
    test("format a range", () => {
      const node = new DocumentBuilder(schema)
        .insert("aaabbb\nccc\ndddeee\n")
        .build();

      const delta = new Delta().retain(3).retain(11, { common: true });

      const actual = node.apply(delta);

      const expected = new DocumentBuilder(schema)
        .insert("aaa")
        .insert("bbb\n", { common: true })
        .insert("ccc\n", { common: true })
        .insert("ddd", { common: true })
        .insert("eee\n")
        .build();

      expect(actual.delta).toEqual(expected.delta);
    });

    test("insert text", () => {
      const node = new DocumentBuilder(schema).insert("aaabbb\n").build();

      const delta = new Delta()
        .retain(3)
        .insert("ccc\nddd\neee", { common: true });

      const actual = node.apply(delta);

      const expected = new DocumentBuilder(schema)
        .insert("aaa")
        .insert("ccc\n", { common: true })
        .insert("ddd\n", { common: true })
        .insert("eee", { common: true })
        .insert("bbb\n")
        .build();

      expect(actual.delta).toEqual(expected.delta);
    });

    test("insert inline embed", () => {
      const node = new DocumentBuilder(schema).insert("aaabbb\n").build();

      const delta = new Delta()
        .retain(3)
        .insert({ "inline-image": "foo" }, { common: true });

      const actual = node.apply(delta);

      const expected = new DocumentBuilder(schema)
        .insert("aaa")
        .insert({ "inline-image": "foo" }, { common: true })
        .insert("bbb\n")
        .build();

      expect(actual.delta).toEqual(expected.delta);
    });

    test("insert block embed", () => {
      const node = new DocumentBuilder(schema).insert("aaa\nbbb\n").build();

      const delta = new Delta()
        .retain(4)
        .insert({ "block-image": "foo" }, { common: true });

      const actual = node.apply(delta);

      const expected = new DocumentBuilder(schema)
        .insert("aaa\n")
        .insert({ "block-image": "foo" }, { common: true })
        .insert("bbb\n")
        .build();

      expect(actual.delta).toEqual(expected.delta);
    });

    test("delete a range", () => {
      const node = new DocumentBuilder(schema)
        .insert("aaabbb\nccc\ndddeee\n")
        .build();

      const delta = new Delta().retain(3).delete(11);

      const actual = node.apply(delta);

      const expected = new DocumentBuilder(schema).insert("aaaeee\n").build();

      expect(actual.delta).toEqual(expected.delta);
    });

    test("delete a range before a block embed node", () => {
      const node = new DocumentBuilder(schema)
        .insert("aaabbb\n")
        .insert({ "block-image": "foo" })
        .insert("ccc\n")
        .build();

      const delta = new Delta().retain(3).delete(4);

      const actual = node.apply(delta);
      const expected = new DocumentBuilder(schema)
        .insert("aaa\n")
        .insert({ "block-image": "foo" })
        .insert("ccc\n")
        .build();

      expect(actual.delta).toEqual(expected.delta);
    });
  });
});
