import Delta from "quill-delta";
import Value from "../Value";

import { EDITOR_MODE_COMPOSITION } from "../../constants";

describe("Change", () => {
  test("history", () => {
    const value = Value.fromJSON();

    const change = value
      .change()

      // first change
      .insertText("aaa", { bold: true })
      .save("insert")
      .insertText("bbb", { italic: true })
      .save("insert")
      .select(0, 0)
      .insertText("ccc")
      .save("insert")

      // second change
      .select(0, 3)
      .delete()
      .save("delete")

      // undo
      .undo()
      .undo()

      // redo
      .redo()
      .redo();

    const expectedContents = new Delta()
      .insert("aaa", { bold: true })
      .insert("bbb", { italic: true })
      .insert("\n");

    expect(change.value.contents).toEqual(expectedContents);

    expect(change.value.selection.anchorOffset).toBe(0);
    expect(change.value.selection.focusOffset).toBe(0);
  });

  test("setMode()", () => {
    const value = Value.fromJSON();
    const change = value.change().setMode(EDITOR_MODE_COMPOSITION);
    expect(change.value.mode).toBe(EDITOR_MODE_COMPOSITION);
  });

  test("moveCursorLeft()", () => {
    const value = Value.fromJSON();
    const change = value
      .change()
      .select(3, 3)
      .moveCursorLeft();
    expect(change.value.selection.anchorOffset).toBe(2);
    expect(change.value.selection.focusOffset).toBe(2);
  });

  test("moveCursorRight()", () => {
    const value = Value.fromJSON({
      contents: new Delta().insert("aaabbb\n")
    });
    const change = value
      .change()
      .select(3, 3)
      .moveCursorRight();
    expect(change.value.selection.anchorOffset).toBe(4);
    expect(change.value.selection.focusOffset).toBe(4);
  });

  test("select()", () => {
    const value = Value.fromJSON();
    const change = value.change().select(3, 6);
    expect(change.value.selection.anchorOffset).toBe(3);
    expect(change.value.selection.focusOffset).toBe(6);
  });

  test("selectAll()", () => {
    const value = Value.fromJSON({
      contents: new Delta().insert("aaa\nbbb\n")
    });

    const change = value.change().selectAll();

    expect(change.value.selection.anchorOffset).toBe(0);
    expect(change.value.selection.focusOffset).toBe(8);
  });

  test("selectCharacterBackward()", () => {
    const value = Value.fromJSON();

    const change = value
      .change()
      .select(3, 3)
      .selectCharacterBackward();

    expect(change.value.selection.anchorOffset).toBe(2);
    expect(change.value.selection.focusOffset).toBe(3);
  });

  test("selectCharacterForward()", () => {
    const value = Value.fromJSON({
      contents: new Delta().insert("aaabbb\n")
    });

    const change = value
      .change()
      .select(3, 3)
      .selectCharacterForward();

    expect(change.value.selection.anchorOffset).toBe(3);
    expect(change.value.selection.focusOffset).toBe(4);
  });

  describe("selectWordBackward()", () => {
    test("select a word", () => {
      const value = Value.fromJSON({
        contents: new Delta().insert("aaa bbb \n")
      });

      const change = value
        .change()
        .select(8, 8)
        .selectWordBackward();

      expect(change.value.selection.anchorOffset).toBe(4);
      expect(change.value.selection.focusOffset).toBe(8);
    });

    test("select the first word", () => {
      const value = Value.fromJSON({
        contents: new Delta().insert("aaa bbb\n")
      });

      const change = value
        .change()
        .select(4, 4)
        .selectWordBackward();

      expect(change.value.selection.anchorOffset).toBe(0);
      expect(change.value.selection.focusOffset).toBe(4);
    });
  });

  describe("selectWordForward()", () => {
    test("select a word", () => {
      const value = Value.fromJSON({
        contents: new Delta().insert("aaa bbb ccc\n")
      });

      const change = value
        .change()
        .select(3, 3)
        .selectWordForward();

      expect(change.value.selection.anchorOffset).toBe(3);
      expect(change.value.selection.focusOffset).toBe(7);
    });

    test("select the last word", () => {
      const value = Value.fromJSON({
        contents: new Delta().insert("aaa bbb\n")
      });

      const change = value
        .change()
        .select(3, 3)
        .selectWordForward();

      expect(change.value.selection.anchorOffset).toBe(3);
      expect(change.value.selection.focusOffset).toBe(7);
    });
  });

  test("selectBlockBackward()", () => {
    const value = Value.fromJSON({
      contents: new Delta().insert("aaabbb\n").insert("cccddd\n")
    });

    const change = value
      .change()
      .select(10, 10)
      .selectBlockBackward();

    expect(change.value.selection.anchorOffset).toBe(7);
    expect(change.value.selection.focusOffset).toBe(10);
  });

  test("selectBlockForward()", () => {
    const value = Value.fromJSON({
      contents: new Delta().insert("aaabbb\n")
    });

    const change = value
      .change()
      .select(3, 3)
      .selectBlockForward();

    expect(change.value.selection.anchorOffset).toBe(3);
    expect(change.value.selection.focusOffset).toBe(6);
  });

  test("replaceBlock()", () => {
    const value = Value.fromJSON({
      contents: new Delta().insert("aaa\n")
    });

    const block = value.document.children[0];
    const newBlock = block.deleteAt(0, 3).insertAt(0, "bbb");

    const change = value.change().replaceBlock(newBlock, block);

    const expectedContents = new Delta().insert("bbb\n");

    expect(change.value.contents).toEqual(expectedContents);
  });

  test("format()", () => {
    const value = Value.fromJSON({
      contents: new Delta().insert("aaabbb\ncccddd\n")
    });

    const change = value
      .change()
      .select(3, 10)
      .format({ bold: true });

    const expectedContents = new Delta()
      .insert("aaa")
      .insert("bbb", { bold: true })
      .insert("\n")
      .insert("ccc", { bold: true })
      .insert("ddd")
      .insert("\n");

    expect(change.value.contents).toEqual(expectedContents);
  });

  test("formatBlock()", () => {
    const value = Value.fromJSON({
      contents: new Delta().insert("aaabbb\ncccddd\n")
    });

    const change = value
      .change()
      .select(3, 10)
      .formatBlock({ align: "left" });

    const expectedContents = new Delta()
      .insert("aaabbb")
      .insert("\n", { align: "left" })
      .insert("cccddd")
      .insert("\n", { align: "left" });

    expect(change.value.contents).toEqual(expectedContents);
  });

  test("formatInline()", () => {
    const value = Value.fromJSON({
      contents: new Delta().insert("aaabbb\ncccddd\n")
    });

    const change = value
      .change()
      .select(3, 10)
      .formatInline({ bold: true });

    const expectedContents = new Delta()
      .insert("aaa")
      .insert("bbb", { bold: true })
      .insert("\n")
      .insert("ccc", { bold: true })
      .insert("ddd")
      .insert("\n");

    expect(change.value.contents).toEqual(expectedContents);
  });

  test("insertText()", () => {
    const value = Value.fromJSON({
      contents: new Delta().insert("aaabbb\n")
    });

    const change = value
      .change()
      .select(3, 3)
      .insertText("ccc", { bold: true });

    const expectedContents = new Delta()
      .insert("aaa")
      .insert("ccc", { bold: true })
      .insert("bbb\n");

    expect(change.value.contents).toEqual(expectedContents);

    expect(change.value.selection.anchorOffset).toBe(6);
    expect(change.value.selection.focusOffset).toBe(6);
  });

  test("insertEmbed()", () => {
    const value = Value.fromJSON({
      contents: new Delta().insert("aaabbb\n")
    });

    const change = value
      .change()
      .select(3, 3)
      .insertEmbed({ "inline-image": "foo" }, { alt: "foo" });

    const expectedContents = new Delta()
      .insert("aaa")
      .insert({ "inline-image": "foo" }, { alt: "foo" })
      .insert("bbb\n");

    expect(change.value.contents).toEqual(expectedContents);

    expect(change.value.selection.anchorOffset).toBe(4);
    expect(change.value.selection.focusOffset).toBe(4);
  });

  test("delete()", () => {
    const value = Value.fromJSON({
      contents: new Delta()
        .insert("aaabbb")
        .insert("\n", { type: "heading-one" })
        .insert("cccddd\n")
    });

    const change = value
      .change()
      .select(3, 10)
      .delete();

    const expectedContents = new Delta()
      .insert("aaaddd")
      .insert("\n", { type: "heading-one" });

    expect(change.value.contents).toEqual(expectedContents);

    expect(change.value.selection.anchorOffset).toBe(3);
    expect(change.value.selection.focusOffset).toBe(3);
  });

  test("replaceBlockByKey()", () => {
    const value = Value.fromJSON({
      contents: new Delta()
        .insert("aaa\n")
        .insert("bbb\n")
        .insert("ccc\n")
    });

    const block = value.document.children[1];
    const newBlock = block.deleteAt(0, 3).insertAt(0, "ddd");

    const change = value.change().replaceBlockByKey(block.key, newBlock);

    const expectedContents = new Delta()
      .insert("aaa\n")
      .insert("ddd\n")
      .insert("ccc\n");

    expect(change.value.contents).toEqual(expectedContents);
  });

  test("replaceInlineByKey()", () => {
    const value = Value.fromJSON({
      contents: new Delta()
        .insert("aaa\n")
        .insert("bbb\n")
        .insert("ccc\n")
    });

    const block = value.document.children[1];
    const inline = block.children[0];

    const newInline = inline.setValue("ddd");

    const change = value
      .change()
      .replaceInlineByKey(block.key, inline.key, newInline);

    const expectedContents = new Delta()
      .insert("aaa\n")
      .insert("ddd\n")
      .insert("ccc\n");

    expect(change.value.contents).toEqual(expectedContents);
  });

  test("formatBlockByKey()", () => {
    const value = Value.fromJSON({
      contents: new Delta()
        .insert("aaa\n")
        .insert("bbb\n")
        .insert("ccc\n")
    });

    const block = value.document.children[1];

    const change = value
      .change()
      .formatBlockByKey(block.key, { align: "left" });

    const expectedContents = new Delta()
      .insert("aaa\n")
      .insert("bbb")
      .insert("\n", { align: "left" })
      .insert("ccc\n");

    expect(change.value.contents).toEqual(expectedContents);
  });

  test("formatInlineByKey()", () => {
    const value = Value.fromJSON({
      contents: new Delta()
        .insert("aaa\n")
        .insert("bbb\n")
        .insert("ccc\n")
    });

    const block = value.document.children[1];
    const inline = block.children[0];

    const change = value
      .change()
      .formatInlineByKey(block.key, inline.key, { bold: true });

    const expectedContents = new Delta()
      .insert("aaa\n")
      .insert("bbb", { bold: true })
      .insert("\n")
      .insert("ccc\n");

    expect(change.value.contents).toEqual(expectedContents);
  });

  test("deleteBlockByKey()", () => {
    const value = Value.fromJSON({
      contents: new Delta()
        .insert("aaa\n")
        .insert("bbb\n")
        .insert("ccc\n")
    });

    const block = value.document.children[1];

    const change = value.change().deleteBlockByKey(block.key);

    const expectedContents = new Delta().insert("aaa\n").insert("ccc\n");

    expect(change.value.contents).toEqual(expectedContents);
  });

  test("deleteInlineByKey()", () => {
    const value = Value.fromJSON({
      contents: new Delta()
        .insert("aaa\n")
        .insert("bbb\n")
        .insert("ccc\n")
    });

    const block = value.document.children[1];
    const inline = block.children[0];

    const change = value.change().deleteInlineByKey(block.key, inline.key);

    const expectedContents = new Delta()
      .insert("aaa\n")
      .insert("\n")
      .insert("ccc\n");

    expect(change.value.contents).toEqual(expectedContents);
  });
});
