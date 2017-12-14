import Schema from "../Schema";
import DocumentBuilder from "../DocumentBuilder";
import Selection from "../Selection";
import Value from "../Value";

const schema = new Schema({
  block: { marks: ["align", "indent"] },
  inline: { marks: ["bold", "italic"] }
});

describe("Value", () => {
  describe("getBlockFormat()", () => {
    test("at offset", () => {
      const document = new DocumentBuilder(schema)
        .insert("aaabbb")
        .insert("\n", { align: "left" })
        .build();

      const selection = Selection.create({
        anchorOffset: 3,
        focusOffset: 3
      });

      const value = Value.create({ document, selection });

      expect(value.getBlockFormat()).toEqual({ align: "left" });
    });

    test("at range", () => {
      const document = new DocumentBuilder(schema)
        .insert("aaabbb")
        .insert("\n", { align: "left", indent: 1 })
        .insert("cccddd")
        .insert("\n", { align: "left" })
        .build();

      const selection = Selection.create({
        anchorOffset: 3,
        focusOffset: 10
      });

      const value = Value.create({ document, selection });

      expect(value.getBlockFormat()).toEqual({ align: "left" });
    });
  });

  describe("getInlineFormat()", () => {
    test("at offset", () => {
      const document = new DocumentBuilder(schema)
        .insert("aaa", { bold: true })
        .insert("bbb", { italic: true })
        .insert("\n")
        .build();

      const selection = Selection.create({
        anchorOffset: 3,
        focusOffset: 3
      });

      const value = Value.create({ document, selection });

      expect(value.getInlineFormat()).toEqual({ bold: true });
    });

    test("at range", () => {
      const document = new DocumentBuilder(schema)
        .insert("aaabbb", { bold: true, italic: true })
        .insert("\n")
        .insert("cccddd", { bold: true })
        .insert("\n")
        .build();

      const selection = Selection.create({
        anchorOffset: 3,
        focusOffset: 10
      });

      const value = Value.create({ document, selection });

      expect(value.getInlineFormat()).toEqual({ bold: true });
    });
  });
});
