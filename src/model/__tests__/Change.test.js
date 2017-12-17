import Schema from "../Schema";
import Value from "../Value";
import DocumentBuilder from "../DocumentBuilder";

import { EDITOR_MODE_COMPOSITION } from "../../constants";

const schema = new Schema({
  block: {
    marks: ["align"],
    embeds: ["video"]
  },
  inline: {
    marks: ["bold", "italic"],
    embeds: ["image"]
  },
  video: {
    marks: ["quality"]
  },
  image: {
    marks: ["alt"]
  }
});

describe("Change", () => {
  test("history", () => {
    const value = Value.create({
      document: new DocumentBuilder(schema).insert("\n").build()
    });

    const { value: actualValue } = value
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

    const expectedDocument = new DocumentBuilder(schema)
      .insert("aaa", { bold: true })
      .insert("bbb", { italic: true })
      .insert("\n")
      .build();

    expect(actualValue.document.delta).toEqual(expectedDocument.delta);

    expect(actualValue.selection.anchorOffset).toBe(0);
    expect(actualValue.selection.focusOffset).toBe(0);
  });

  test("setMode()", () => {
    const { value } = Value.create()
      .change()
      .setMode(EDITOR_MODE_COMPOSITION);
    expect(value.mode).toBe(EDITOR_MODE_COMPOSITION);
  });

  test("select()", () => {
    const { value } = Value.create()
      .change()
      .select(3, 6);
    expect(value.selection.anchorOffset).toBe(3);
    expect(value.selection.focusOffset).toBe(6);
  });

  test("selectCharacterBackward()", () => {
    const { value } = Value.create()
      .change()
      .select(3, 3)
      .selectCharacterBackward();
    expect(value.selection.anchorOffset).toBe(2);
    expect(value.selection.focusOffset).toBe(3);
  });

  test("selectCharacterForward()", () => {
    const value = Value.create({
      document: new DocumentBuilder(schema).insert("aaabbb\n").build()
    });

    const { value: actualValue } = value
      .change()
      .select(3, 3)
      .selectCharacterForward();

    expect(actualValue.selection.anchorOffset).toBe(3);
    expect(actualValue.selection.focusOffset).toBe(4);
  });

  describe("selectWordBackward()", () => {
    test("select a word", () => {
      const value = Value.create({
        document: new DocumentBuilder(schema).insert("aaa bbb \n").build()
      });

      const { value: actualValue } = value
        .change()
        .select(8, 8)
        .selectWordBackward();

      expect(actualValue.selection.anchorOffset).toBe(4);
      expect(actualValue.selection.focusOffset).toBe(8);
    });

    test("select the first word", () => {
      const value = Value.create({
        document: new DocumentBuilder(schema).insert("aaa bbb\n").build()
      });

      const { value: actualValue } = value
        .change()
        .select(4, 4)
        .selectWordBackward();

      expect(actualValue.selection.anchorOffset).toBe(0);
      expect(actualValue.selection.focusOffset).toBe(4);
    });
  });

  describe("selectWordForward()", () => {
    test("select a word", () => {
      const value = Value.create({
        document: new DocumentBuilder(schema).insert("aaa bbb ccc\n").build()
      });

      const { value: actualValue } = value
        .change()
        .select(3, 3)
        .selectWordForward();

      expect(actualValue.selection.anchorOffset).toBe(3);
      expect(actualValue.selection.focusOffset).toBe(7);
    });

    test("select the last word", () => {
      const value = Value.create({
        document: new DocumentBuilder(schema).insert("aaa bbb\n").build()
      });

      const { value: actualValue } = value
        .change()
        .select(3, 3)
        .selectWordForward();

      expect(actualValue.selection.anchorOffset).toBe(3);
      expect(actualValue.selection.focusOffset).toBe(7);
    });
  });

  test("selectBlockBackward()", () => {
    const value = Value.create({
      document: new DocumentBuilder(schema)
        .insert("aaabbb\n")
        .insert("cccddd\n")
        .build()
    });

    const { value: actualValue } = value
      .change()
      .select(10, 10)
      .selectBlockBackward();

    expect(actualValue.selection.anchorOffset).toBe(7);
    expect(actualValue.selection.focusOffset).toBe(10);
  });

  test("selectBlockForward()", () => {
    const value = Value.create({
      document: new DocumentBuilder(schema).insert("aaabbb\n").build()
    });

    const { value: actualValue } = value
      .change()
      .select(3, 3)
      .selectBlockForward();

    expect(actualValue.selection.anchorOffset).toBe(3);
    expect(actualValue.selection.focusOffset).toBe(6);
  });

  test("replaceBlock()", () => {
    const value = Value.create({
      document: new DocumentBuilder(schema).insert("aaa\n").build()
    });

    const block = value.document.children[0];
    const newBlock = block.deleteAt(0, 3).insertAt(0, "bbb");

    const { value: actualValue } = value.change().replaceBlock(newBlock, block);

    const expectedDocument = new DocumentBuilder(schema)
      .insert("bbb\n")
      .build();

    expect(actualValue.document.delta).toEqual(expectedDocument.delta);
  });

  test("format()", () => {
    const value = Value.create({
      document: new DocumentBuilder(schema).insert("aaabbb\ncccddd\n").build()
    });

    const { value: actualValue } = value
      .change()
      .select(3, 10)
      .format({ bold: true });

    const expectedDocument = new DocumentBuilder(schema)
      .insert("aaa")
      .insert("bbb", { bold: true })
      .insert("\n")
      .insert("ccc", { bold: true })
      .insert("ddd")
      .insert("\n")
      .build();

    expect(actualValue.document.delta).toEqual(expectedDocument.delta);
  });

  test("formatBlock()", () => {
    const value = Value.create({
      document: new DocumentBuilder(schema).insert("aaabbb\ncccddd\n").build()
    });

    const { value: actualValue } = value
      .change()
      .select(3, 10)
      .formatBlock({ align: "left" });

    const expectedDocument = new DocumentBuilder(schema)
      .insert("aaabbb")
      .insert("\n", { align: "left" })
      .insert("cccddd")
      .insert("\n", { align: "left" })
      .build();

    expect(actualValue.document.delta).toEqual(expectedDocument.delta);
  });

  test("formatInline()", () => {
    const value = Value.create({
      document: new DocumentBuilder(schema).insert("aaabbb\ncccddd\n").build()
    });

    const { value: actualValue } = value
      .change()
      .select(3, 10)
      .formatInline({ bold: true });

    const expectedDocument = new DocumentBuilder(schema)
      .insert("aaa")
      .insert("bbb", { bold: true })
      .insert("\n")
      .insert("ccc", { bold: true })
      .insert("ddd")
      .insert("\n")
      .build();

    expect(actualValue.document.delta).toEqual(expectedDocument.delta);
  });

  test("insertText()", () => {
    const value = Value.create({
      document: new DocumentBuilder(schema).insert("aaabbb\n").build()
    });

    const { value: actualValue } = value
      .change()
      .select(3, 3)
      .insertText("ccc", { bold: true });

    const expectedDocument = new DocumentBuilder(schema)
      .insert("aaa")
      .insert("ccc", { bold: true })
      .insert("bbb\n")
      .build();

    expect(actualValue.document.delta).toEqual(expectedDocument.delta);

    expect(actualValue.selection.anchorOffset).toBe(6);
    expect(actualValue.selection.focusOffset).toBe(6);
  });

  test("insertEmbed()", () => {
    const value = Value.create({
      document: new DocumentBuilder(schema).insert("aaabbb\n").build()
    });

    const { value: actualValue } = value
      .change()
      .select(3, 3)
      .insertEmbed({ image: "foo" }, { bold: true });

    const expectedDocument = new DocumentBuilder(schema)
      .insert("aaa")
      .insert({ image: "foo" }, { bold: true })
      .insert("bbb\n")
      .build();

    expect(actualValue.document.delta).toEqual(expectedDocument.delta);

    expect(actualValue.selection.anchorOffset).toBe(4);
    expect(actualValue.selection.focusOffset).toBe(4);
  });

  test("delete()", () => {
    const value = Value.create({
      document: new DocumentBuilder(schema)
        .insert("aaabbb")
        .insert("\n", { type: "heading-one" })
        .insert("cccddd\n")
        .build()
    });

    const { value: actualValue } = value
      .change()
      .select(3, 10)
      .delete();

    const expectedDocument = new DocumentBuilder(schema)
      .insert("aaaddd")
      .insert("\n", { type: "heading-one" })
      .build();

    expect(actualValue.document.delta).toEqual(expectedDocument.delta);

    expect(actualValue.selection.anchorOffset).toBe(3);
    expect(actualValue.selection.focusOffset).toBe(3);
  });

  test("replaceBlockByKey()", () => {
    const value = Value.create({
      document: new DocumentBuilder(schema)
        .insert("aaa\n")
        .insert("bbb\n")
        .insert("ccc\n")
        .build()
    });

    const block = value.document.children[1];
    const newBlock = block.deleteAt(0, 3).insertAt(0, "ddd");

    const { value: actualValue } = value
      .change()
      .replaceBlockByKey(block.key, newBlock);

    const expectedDocument = new DocumentBuilder(schema)
      .insert("aaa\n")
      .insert("ddd\n")
      .insert("ccc\n")
      .build();

    expect(actualValue.document.delta).toEqual(expectedDocument.delta);
  });

  test("replaceInlineByKey()", () => {
    const value = Value.create({
      document: new DocumentBuilder(schema)
        .insert("aaa\n")
        .insert("bbb\n")
        .insert("ccc\n")
        .build()
    });

    const block = value.document.children[1];
    const inline = block.children[0];

    const newInline = inline.setValue("ddd");

    const { value: actualValue } = value
      .change()
      .replaceInlineByKey(block.key, inline.key, newInline);

    const expectedDocument = new DocumentBuilder(schema)
      .insert("aaa\n")
      .insert("ddd\n")
      .insert("ccc\n")
      .build();

    expect(actualValue.document.delta).toEqual(expectedDocument.delta);
  });

  test("formatBlockByKey()", () => {
    const value = Value.create({
      document: new DocumentBuilder(schema)
        .insert("aaa\n")
        .insert("bbb\n")
        .insert("ccc\n")
        .build()
    });

    const block = value.document.children[1];

    const { value: actualValue } = value
      .change()
      .formatBlockByKey(block.key, { align: "left" });

    const expectedDocument = new DocumentBuilder(schema)
      .insert("aaa\n")
      .insert("bbb")
      .insert("\n", { align: "left" })
      .insert("ccc\n")
      .build();

    expect(actualValue.document.delta).toEqual(expectedDocument.delta);
  });

  test("formatInlineByKey()", () => {
    const value = Value.create({
      document: new DocumentBuilder(schema)
        .insert("aaa\n")
        .insert("bbb\n")
        .insert("ccc\n")
        .build()
    });

    const block = value.document.children[1];
    const inline = block.children[0];

    const { value: actualValue } = value
      .change()
      .formatInlineByKey(block.key, inline.key, { bold: true });

    const expectedDocument = new DocumentBuilder(schema)
      .insert("aaa\n")
      .insert("bbb", { bold: true })
      .insert("\n")
      .insert("ccc\n")
      .build();

    expect(actualValue.document.delta).toEqual(expectedDocument.delta);
  });

  test("deleteBlockByKey()", () => {
    const value = Value.create({
      document: new DocumentBuilder(schema)
        .insert("aaa\n")
        .insert("bbb\n")
        .insert("ccc\n")
        .build()
    });

    const block = value.document.children[1];

    const { value: actualValue } = value.change().deleteBlockByKey(block.key);

    const expectedDocument = new DocumentBuilder(schema)
      .insert("aaa\n")
      .insert("ccc\n")
      .build();

    expect(actualValue.document.delta).toEqual(expectedDocument.delta);
  });

  test("deleteInlineByKey()", () => {
    const value = Value.create({
      document: new DocumentBuilder(schema)
        .insert("aaa\n")
        .insert("bbb\n")
        .insert("ccc\n")
        .build()
    });

    const block = value.document.children[1];
    const inline = block.children[0];

    const { value: actualValue } = value
      .change()
      .deleteInlineByKey(block.key, inline.key);

    const expectedDocument = new DocumentBuilder(schema)
      .insert("aaa\n")
      .insert("\n")
      .insert("ccc\n")
      .build();

    expect(actualValue.document.delta).toEqual(expectedDocument.delta);
  });
});
