import Schema from "../Schema";
import Value, { MODE_COMPOSITION } from "../Value";
import DocumentBuilder from "../DocumentBuilder";

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
      .setMode(MODE_COMPOSITION);
    expect(value.mode).toBe(MODE_COMPOSITION);
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

  test("delete()", () => {
    const value = Value.create({
      document: new DocumentBuilder(schema).insert("aaabbbccc\n").build()
    });

    const { value: actualValue } = value
      .change()
      .select(3, 6)
      .delete();

    const expectedDocument = new DocumentBuilder(schema)
      .insert("aaaccc\n")
      .build();

    expect(actualValue.document.delta).toEqual(expectedDocument.delta);

    expect(actualValue.selection.anchorOffset).toBe(3);
    expect(actualValue.selection.focusOffset).toBe(3);
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
