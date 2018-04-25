import Delta from "quill-delta";
import Value from "../Value";
import tokenizeNode from "../../defaults/tokenizeNode";
import tokenizeClassName from "../../defaults/tokenizeClassName";

describe("Value", () => {
  test("create a value from a delta", () => {
    const delta = new Delta()
      .insert("aaa")
      .insert("\n", { type: "heading-one" })
      .insert("bbb")
      .insert("\n", { type: "paragraph" });
    expect(Value.fromDelta({ delta }).toDelta()).toEqual(delta);
  });

  test("create a value form JSON", () => {
    const actual = Value.fromJSON({
      contents: [
        { insert: "aaa" },
        { insert: "\n", attributes: { type: "heading-one" } },
        { insert: "bbb" },
        { insert: "\n", attributes: { type: "paragraph" } }
      ]
    });
    const expected = Value.fromDelta({
      delta: new Delta()
        .insert("aaa")
        .insert("\n", { type: "heading-one" })
        .insert("bbb")
        .insert("\n", { type: "paragraph" })
    });
    expect(actual.toDelta()).toEqual(expected.toDelta());
  });

  test("create a value from HTML", () => {
    const actual = Value.fromHTML({
      contents: "<div><h1>aaa</h1><p>bbb</p></div>",
      tokenizeNode,
      tokenizeClassName
    });
    const expected = Value.fromDelta({
      delta: new Delta()
        .insert("aaa")
        .insert("\n", { type: "heading-one" })
        .insert("bbb")
        .insert("\n", { type: "paragraph" })
    });
    expect(actual.toDelta()).toEqual(expected.toDelta());
  });

  test("create an empty value", () => {
    const actual = Value.createEmpty();
    const expected = Value.fromDelta({
      delta: new Delta().insert("\n")
    });
    expect(actual.toDelta()).toEqual(expected.toDelta());
  });

  test("get the current block attributes at an ofset", () => {
    const value = Value.createEmpty()
      .change()
      .insertText("\n", { align: "left" })
      .select(0, 0)
      .getValue();
    expect(value.getBlockAttributes()).toEqual({ align: "left" });
  });

  test("get the current block attributes at a range", () => {
    const value = Value.createEmpty()
      .change()
      .insertText("\n", { align: "left", indent: 0 })
      .insertText("\n", { align: "left", indent: 1 })
      .select(0, 2)
      .getValue();
    expect(value.getBlockAttributes()).toEqual({ align: "left" });
  });

  test("get the current inline attributes at an ofset", () => {
    const value = Value.createEmpty()
      .change()
      .insertText("aaa", { bold: true })
      .insertText("bbb", { italic: true })
      .select(3, 0)
      .getValue();
    expect(value.getInlineAttributes()).toEqual({ bold: true });
  });

  test("get the current inline attributes at a range", () => {
    const value = Value.createEmpty()
      .change()
      .insertText("aaa", { bold: true })
      .select(0, 3)
      .getValue();
    expect(value.getInlineAttributes()).toEqual({ bold: true });
  });

  test("get the current attributes", () => {
    const value = Value.createEmpty()
      .change()
      .insertText("aaa", { bold: true })
      .insertText("\n", { align: "left" })
      .select(0, 3)
      .getValue();
    expect(value.getAttributes()).toEqual({ bold: true, align: "left" });
  });
});
