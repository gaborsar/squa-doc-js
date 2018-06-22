import Delta from "quill-delta";
import Value from "../Value";
import combineSchemas from "../../plugins/combineSchemas";
import defaultSchema from "../../defaults/schema";

const customSchema = {
  isBlockEmbed(name) {
    return name === "block-embed";
  },
  isInlineEmbed(name) {
    return name === "inline-embed";
  },
  isBlockEmbedMark(embedName, markName) {
    return embedName === "block-embed" && markName === "block-embed-mark";
  },
  isInlineEmbedMark(embedName, markName) {
    return embedName === "inline-embed" && markName === "inline-embed-mark";
  }
};

const schema = combineSchemas([defaultSchema, customSchema]);

describe("Change", () => {
  test("history", () => {
    const value = Value.createEmpty()
      .change()

      .insertText("aaa", { bold: true })
      .save("insert")

      .insertText("bbb", { italic: true })
      .save("insert")

      .select(0, 0)
      .insertText("ccc")
      .save("insert")

      .select(0, 3)
      .delete()
      .save("delete")

      .undo()
      .undo()

      .redo()
      .redo()

      .getValue();

    expect(value.toDelta()).toEqual(
      new Delta()
        .insert("aaa", { bold: true })
        .insert("bbb", { italic: true })
        .insert("\n")
    );

    const selection = value.getSelection();

    expect(selection.getAnchorOffset()).toBe(0);
    expect(selection.getFocusOffset()).toBe(0);
  });

  test("select a range", () => {
    const selection = Value.createEmpty()
      .change()
      .select(3, 3)
      .getValue()
      .getSelection();
    expect(selection.getAnchorOffset()).toBe(3);
    expect(selection.getFocusOffset()).toBe(6);
  });

  test("select a range backward", () => {
    const selection = Value.createEmpty()
      .change()
      .select(6, -3)
      .getValue()
      .getSelection();
    expect(selection.getAnchorOffset()).toBe(6);
    expect(selection.getFocusOffset()).toBe(3);
  });

  test("select everything", () => {
    const delta = new Delta().insert("aaa\nbbb\n");
    const selection = Value.fromDelta({ delta })
      .change()
      .selectAll()
      .getValue()
      .getSelection();
    expect(selection.getAnchorOffset()).toBe(0);
    expect(selection.getFocusOffset()).toBe(8);
  });

  test("collapse the selection", () => {
    const selection = Value.createEmpty()
      .change()
      .select(3, 3)
      .collapse()
      .getValue()
      .getSelection();
    expect(selection.getAnchorOffset()).toBe(3);
    expect(selection.getFocusOffset()).toBe(3);
  });

  test("collapse the selection to the left when the current selection is forward", () => {
    const selection = Value.createEmpty()
      .change()
      .select(3, 3)
      .collapseToLeft()
      .getValue()
      .getSelection();
    expect(selection.getAnchorOffset()).toBe(3);
    expect(selection.getFocusOffset()).toBe(3);
  });

  test("collapse the selection to the left when the current selection is backward", () => {
    const selection = Value.createEmpty()
      .change()
      .select(6, -3)
      .collapseToLeft()
      .getValue()
      .getSelection();
    expect(selection.getAnchorOffset()).toBe(3);
    expect(selection.getFocusOffset()).toBe(3);
  });

  test("collapse the selection to the end when the current selection isforward", () => {
    const selection = Value.createEmpty()
      .change()
      .select(3, 3)
      .collapseToRight()
      .getValue()
      .getSelection();
    expect(selection.getAnchorOffset()).toBe(6);
    expect(selection.getFocusOffset()).toBe(6);
  });

  test("collapse the selection to the end when the current selection isbackward", () => {
    const selection = Value.createEmpty()
      .change()
      .select(6, -3)
      .collapseToRight()
      .getValue()
      .getSelection();
    expect(selection.getAnchorOffset()).toBe(6);
    expect(selection.getFocusOffset()).toBe(6);
  });

  test("select a character backward", () => {
    const delta = new Delta().insert("aaa\n");
    const selection = Value.fromDelta({ delta })
      .change()
      .select(3, 0)
      .selectCharacterBackward()
      .getValue()
      .getSelection();
    expect(selection.getAnchorOffset()).toBe(3);
    expect(selection.getFocusOffset()).toBe(2);
  });

  test("select a character forward", () => {
    const delta = new Delta().insert("aaabbb\n");
    const selection = Value.fromDelta({ delta })
      .change()
      .select(3, 0)
      .selectCharacterForward()
      .getValue()
      .getSelection();
    expect(selection.getAnchorOffset()).toBe(3);
    expect(selection.getFocusOffset()).toBe(4);
  });

  test("select a word backward", () => {
    const delta = new Delta().insert("aaa bbb \n");
    const selection = Value.fromDelta({ delta })
      .change()
      .select(8, 0)
      .selectWordBackward()
      .getValue()
      .getSelection();
    expect(selection.getAnchorOffset()).toBe(8);
    expect(selection.getFocusOffset()).toBe(4);
  });

  test("select the first word", () => {
    const delta = new Delta().insert("aaa bbb\n");
    const selection = Value.fromDelta({ delta })
      .change()
      .select(4, 0)
      .selectWordBackward()
      .getValue()
      .getSelection();
    expect(selection.getAnchorOffset()).toBe(4);
    expect(selection.getFocusOffset()).toBe(0);
  });

  test("select a word forward()", () => {
    const delta = new Delta().insert("aaa bbb ccc\n");
    const selection = Value.fromDelta({ delta })
      .change()
      .select(3, 0)
      .selectWordForward()
      .getValue()
      .getSelection();
    expect(selection.getAnchorOffset()).toBe(3);
    expect(selection.getFocusOffset()).toBe(7);
  });

  test("select the last word", () => {
    const delta = new Delta().insert("aaa bbb\n");
    const selection = Value.fromDelta({ delta })
      .change()
      .select(3, 0)
      .selectWordForward()
      .getValue()
      .getSelection();
    expect(selection.getAnchorOffset()).toBe(3);
    expect(selection.getFocusOffset()).toBe(7);
  });

  test("select a block backward", () => {
    const delta = new Delta().insert("aaabbb\n").insert("cccddd\n");
    const selection = Value.fromDelta({ delta })
      .change()
      .select(10, 0)
      .selectBlockBackward()
      .getValue()
      .getSelection();
    expect(selection.getAnchorOffset()).toBe(10);
    expect(selection.getFocusOffset()).toBe(7);
  });

  test("select a block forward", () => {
    const delta = new Delta().insert("aaabbb\n");
    const selection = Value.fromDelta({ delta })
      .change()
      .select(3, 0)
      .selectBlockForward()
      .getValue()
      .getSelection();
    expect(selection.getAnchorOffset()).toBe(3);
    expect(selection.getFocusOffset()).toBe(6);
  });

  test("delete a range", () => {
    const delta = new Delta()
      .insert("aaabbb")
      .insert("\n", { type: "heading-one" })
      .insert("cccddd\n");

    const value = Value.fromDelta({ delta })
      .change()
      .select(3, 7)
      .delete()
      .getValue();

    expect(value.toDelta()).toEqual(
      new Delta().insert("aaaddd").insert("\n", { type: "heading-one" })
    );

    const selection = value.getSelection();

    expect(selection.getAnchorOffset()).toBe(3);
    expect(selection.getFocusOffset()).toBe(3);
  });

  test("insert text", () => {
    const delta = new Delta().insert("aaabbb\n");

    const value = Value.fromDelta({ delta })
      .change()
      .select(3, 0)
      .insertText("ccc", { bold: true })
      .getValue();

    expect(value.toDelta()).toEqual(
      new Delta()
        .insert("aaa")
        .insert("ccc", { bold: true })
        .insert("bbb\n")
    );

    const selection = value.getSelection();

    expect(selection.getAnchorOffset()).toBe(6);
    expect(selection.getFocusOffset()).toBe(6);
  });

  test("insert an embed element", () => {
    const delta = new Delta().insert("aaabbb\n");

    const value = Value.fromDelta({ schema, delta })
      .change()
      .select(3, 0)
      .insertEmbed({ "inline-embed": "foo" }, { "inline-embed-mark": "foo" })
      .getValue();

    expect(value.toDelta()).toEqual(
      new Delta()
        .insert("aaa")
        .insert({ "inline-embed": "foo" }, { "inline-embed-mark": "foo" })
        .insert("bbb\n")
    );

    const selection = value.getSelection();

    expect(selection.getAnchorOffset()).toBe(4);
    expect(selection.getFocusOffset()).toBe(4);
  });

  test("insert a fragment", () => {
    const delta = new Delta().insert("aaa\n").insert("bbb\n");

    const value = Value.fromDelta({ delta })
      .change()
      .select(4, 0)
      .insertFragment(new Delta().insert("ccc\n"))
      .getValue();

    expect(value.toDelta()).toEqual(new Delta().insert("aaa\nccc\nbbb\n"));

    const selection = value.getSelection();

    expect(selection.getAnchorOffset()).toBe(8);
    expect(selection.getFocusOffset()).toBe(8);
  });

  test("set attributes at a range", () => {
    const delta = new Delta().insert("aaabbb\ncccddd\n");

    const value = Value.fromDelta({ delta })
      .change()
      .select(3, 7)
      .setAttributes({ bold: true })
      .getValue();

    expect(value.toDelta()).toEqual(
      new Delta()
        .insert("aaa")
        .insert("bbb", { bold: true })
        .insert("\n")
        .insert("ccc", { bold: true })
        .insert("ddd")
        .insert("\n")
    );
  });

  test("set block attributes at an offset", () => {
    const delta = new Delta().insert("\n");

    const value = Value.fromDelta({ delta })
      .change()
      .setBlockAttributes({ align: "left" })
      .getValue();

    expect(value.toDelta()).toEqual(
      new Delta().insert("\n", { align: "left" })
    );
  });

  test("set block attributes at a range", () => {
    const delta = new Delta()
      .insert("\n")
      .insert({ "block-embed": "foo" })
      .insert("\n");

    const value = Value.fromDelta({ schema, delta })
      .change()
      .select(0, 3)
      .setBlockAttributes({ align: "left" })
      .getValue();

    expect(value.toDelta()).toEqual(
      new Delta()
        .insert("\n", { align: "left" })
        .insert({ "block-embed": "foo" }, { align: "left" })
        .insert("\n", { align: "left" })
    );
  });

  test("set inline attributes at an offset and insert some text", () => {
    const value = Value.createEmpty()
      .change()
      .setInlineAttributes({ bold: true })
      .insertText("aaa")
      .getValue();

    expect(value.toDelta()).toEqual(
      new Delta().insert("aaa", { bold: true }).insert("\n")
    );
  });

  test("set inline attributes at a range", () => {
    const delta = new Delta()
      .insert("aaabbb\n")
      .insert("ccc")
      .insert({ "inline-embed": "foo" })
      .insert("ddd\n");

    const value = Value.fromDelta({ schema, delta })
      .change()
      .select(3, 8)
      .setInlineAttributes({ bold: true })
      .getValue();

    expect(value.toDelta()).toEqual(
      new Delta()
        .insert("aaa")
        .insert("bbb", { bold: true })
        .insert("\n")
        .insert("ccc", { bold: true })
        .insert({ "inline-embed": "foo" }, { bold: true })
        .insert("ddd\n")
    );
  });

  test("remove a node by reference", () => {
    const oldValue = Value.fromDelta({
      delta: new Delta()
        .insert("aaa\n")
        .insert("bbb\n")
        .insert("ccc\n")
    });

    const node = oldValue.getDocument().getChildByIndex(1);

    const newValue = oldValue
      .change()
      .removeNode(node)
      .getValue();

    expect(newValue.toDelta()).toEqual(
      new Delta().insert("aaa\n").insert("ccc\n")
    );
  });

  test("replace a node by reference", () => {
    const oldValue = Value.fromDelta({
      delta: new Delta()
        .insert("aaa\n")
        .insert("bbb\n")
        .insert("ccc\n")
    });

    const oldNode = oldValue.getDocument().getChildByIndex(1);
    const newNode = oldNode
      .edit()
      .delete(3)
      .insert("ddd")
      .retain(Infinity)
      .build();

    const newValue = oldValue
      .change()
      .replaceNode(newNode, oldNode)
      .getValue();

    expect(newValue.toDelta()).toEqual(
      new Delta()
        .insert("aaa\n")
        .insert("ddd\n")
        .insert("ccc\n")
    );
  });
});
