import DocumentBuilder from "../DocumentBuilder";
import Schema from "../Schema";
import Selection from "../Selection";
import Value from "../Value";
import defaultSchema from "../../defaults/schema";

describe("Value", () => {
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
