import Delta from "quill-delta";
import DocumentBuilder from "../DocumentBuilder";
import Schema from "../Schema";
import Selection from "../Selection";
import Value from "../Value";
import defaultSchema from "../../defaults/schema";
import tokenizeNode from "../../defaults/tokenizeNode";
import tokenizeClassName from "../../defaults/tokenizeClassName";

describe("Value", () => {
  test("fromDelta()", () => {
    const { delta: actual } = Value.fromDelta({
      schema: defaultSchema,
      contents: new Delta()
        .insert("aaa")
        .insert("\n", { type: "heading-one" })
        .insert("bbb")
        .insert("\n", { type: "paragraph" })
    });
    const { delta: expected } = Value.create({
      document: new DocumentBuilder(new Schema(defaultSchema))
        .insert("aaa")
        .insert("\n", { type: "heading-one" })
        .insert("bbb")
        .insert("\n", { type: "paragraph" })
        .build()
    });
    expect(actual).toEqual(expected);
  });

  test("fromJSON()", () => {
    const { delta: actual } = Value.fromDelta({
      schema: defaultSchema,
      contents: [
        { insert: "aaa" },
        { insert: "\n", attributes: { type: "heading-one" } },
        { insert: "bbb" },
        { insert: "\n", attributes: { type: "paragraph" } }
      ]
    });
    const { delta: expected } = Value.create({
      document: new DocumentBuilder(new Schema(defaultSchema))
        .insert("aaa")
        .insert("\n", { type: "heading-one" })
        .insert("bbb")
        .insert("\n", { type: "paragraph" })
        .build()
    });
    expect(actual).toEqual(expected);
  });

  test("fromHTML", () => {
    const { delta: actual } = Value.fromHTML({
      schema: defaultSchema,
      contents: "<div><h1>aaa</h1><p>bbb</p></div>",
      tokenizeNode,
      tokenizeClassName
    });
    const { delta: expected } = Value.create({
      document: new DocumentBuilder(new Schema(defaultSchema))
        .insert("aaa")
        .insert("\n", { type: "heading-one" })
        .insert("bbb")
        .insert("\n", { type: "paragraph" })
        .build()
    });
    expect(actual).toEqual(expected);
  });

  test("createEmpty", () => {
    const { delta: actual } = Value.createEmpty({
      schema: defaultSchema
    });
    const { delta: expected } = Value.create({
      document: new DocumentBuilder(new Schema(defaultSchema))
        .insert("\n")
        .build()
    });
    expect(actual).toEqual(expected);
  });

  describe("getSelectedBlocks()", () => {
    test("at offset", () => {
      const document = new DocumentBuilder(new Schema(defaultSchema))
        .insert("aaa\n")
        .insert("bbb\n")
        .insert("ccc\n")
        .build();

      const selection = Selection.create({
        anchorOffset: 5,
        focusOffset: 5
      });

      const value = Value.create({ document, selection });

      const actualBlocks = value.getSelectedBlocks();

      const expectedBlocks = [document.children[1]];

      expect(actualBlocks).toEqual(expectedBlocks);
    });

    test("at range", () => {
      const document = new DocumentBuilder(new Schema(defaultSchema))
        .insert("aaa\n")
        .insert("bbb\n")
        .insert("ccc\n")
        .build();

      const selection = Selection.create({
        anchorOffset: 5,
        focusOffset: 9
      });

      const value = Value.create({ document, selection });

      const actualBlocks = value.getSelectedBlocks();

      const expectedBlocks = [document.children[1], document.children[2]];

      expect(actualBlocks).toEqual(expectedBlocks);
    });
  });

  describe("getSelectedInlines()", () => {
    test("at offset", () => {
      const document = new DocumentBuilder(new Schema(defaultSchema))
        .insert("aaa\n")
        .insert("bbb\n")
        .insert("ccc\n")
        .build();

      const selection = Selection.create({
        anchorOffset: 5,
        focusOffset: 5
      });

      const value = Value.create({ document, selection });

      const actualInlines = value.getSelectedInlines();

      const expectedInlines = [document.children[1].children[0]];

      expect(actualInlines).toEqual(expectedInlines);
    });

    test("at range", () => {
      const document = new DocumentBuilder(new Schema(defaultSchema))
        .insert("aaa\n")
        .insert("bbb\n")
        .insert("ccc\n")
        .build();

      const selection = Selection.create({
        anchorOffset: 5,
        focusOffset: 9
      });

      const value = Value.create({ document, selection });

      const actualInlines = value.getSelectedInlines();

      const expectedInlines = [
        document.children[1].children[0],
        document.children[2].children[0]
      ];

      expect(actualInlines).toEqual(expectedInlines);
    });
  });

  describe("getFormat()", () => {
    test("at offset", () => {
      const document = new DocumentBuilder(new Schema(defaultSchema))
        .insert("aaa", { bold: true })
        .insert("bbb", { italic: true })
        .insert("\n", { align: "left" })
        .build();

      const selection = Selection.create({
        anchorOffset: 3,
        focusOffset: 3
      });

      const value = Value.create({ document, selection });

      expect(value.getFormat()).toEqual({ align: "left", bold: true });
    });

    test("at range", () => {
      const document = new DocumentBuilder(new Schema(defaultSchema))
        .insert("aaabbb", { bold: true, italic: true })
        .insert("\n", { align: "left", indent: 1 })
        .insert("cccddd", { bold: true })
        .insert("\n", { align: "left" })
        .build();

      const selection = Selection.create({
        anchorOffset: 3,
        focusOffset: 10
      });

      const value = Value.create({ document, selection });

      expect(value.getFormat()).toEqual({ align: "left", bold: true });
    });
  });
});
