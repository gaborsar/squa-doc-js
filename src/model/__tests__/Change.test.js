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
      .insert("aaa", { bold: true })
      .save("insert")
      .insert("bbb", { italic: true })
      .save("insert")
      .select(0, 0)
      .insert("ccc")
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

  test("insert()", () => {
    const value = Value.create({
      document: new DocumentBuilder(schema).insert("aaabbb\n").build()
    });

    const { value: actualValue } = value
      .change()
      .select(3, 3)
      .insert("ccc", { bold: true });

    const expectedDocument = new DocumentBuilder(schema)
      .insert("aaa")
      .insert("ccc", { bold: true })
      .insert("bbb\n")
      .build();

    expect(actualValue.document.delta).toEqual(expectedDocument.delta);

    expect(actualValue.selection.anchorOffset).toBe(6);
    expect(actualValue.selection.focusOffset).toBe(6);
  });

  test("replaceBlock()", () => {
    const value = Value.create({
      document: new DocumentBuilder(schema).insert("aaa\n").build()
    });

    const blockBefore = value.document.children[0];
    const blockAfter = blockBefore.deleteAt(0, 3).insertAt(0, "bbb");

    const { value: actualValue } = value
      .change()
      .replaceBlock(blockAfter, blockBefore);

    const expectedDocument = new DocumentBuilder(schema)
      .insert("bbb\n")
      .build();

    expect(actualValue.document.delta).toEqual(expectedDocument.delta);
  });
});
