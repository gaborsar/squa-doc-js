import Delta from "quill-delta";
import Selection from "../Selection";

describe("Selection", () => {
  describe("apply()", () => {
    test("insert text before start offset", () => {
      const selection = Selection.create({
        anchorOffset: 6,
        focusOffset: 9
      });

      const delta = new Delta().retain(6).insert("aaa");

      const actual = selection.apply(delta);

      const expected = Selection.create({
        anchorOffset: 9,
        focusOffset: 12
      });

      expect(actual).toEqual(expected);
    });

    test("insert text before end offset", () => {
      const selection = Selection.create({
        anchorOffset: 3,
        focusOffset: 6
      });

      const delta = new Delta().retain(6).insert("aaa");

      const actual = selection.apply(delta);

      const expected = Selection.create({
        anchorOffset: 3,
        focusOffset: 9
      });

      expect(actual).toEqual(expected);
    });

    test("insert text after and offset", () => {
      const selection = Selection.create({
        anchorOffset: 3,
        focusOffset: 6
      });

      const delta = new Delta().retain(9).insert("aaa");

      const actual = selection.apply(delta);

      expect(actual).toBe(selection);
    });

    test("insert embed before start offset", () => {
      const selection = Selection.create({
        anchorOffset: 6,
        focusOffset: 9
      });

      const delta = new Delta().retain(6).insert({ image: "foo" });

      const actual = selection.apply(delta);

      const expected = Selection.create({
        anchorOffset: 7,
        focusOffset: 10
      });

      expect(actual).toEqual(expected);
    });

    test("insert embed before end offset", () => {
      const selection = Selection.create({
        anchorOffset: 3,
        focusOffset: 6
      });

      const delta = new Delta().retain(6).insert({ image: "foo" });

      const actual = selection.apply(delta);

      const expected = Selection.create({
        anchorOffset: 3,
        focusOffset: 7
      });

      expect(actual).toEqual(expected);
    });

    test("insert embed after and offset", () => {
      const selection = Selection.create({
        anchorOffset: 3,
        focusOffset: 6
      });

      const delta = new Delta().retain(9).insert({ image: "foo" });

      const actual = selection.apply(delta);

      expect(actual).toBe(selection);
    });

    test("delete before the start offset", () => {
      const selection = Selection.create({
        anchorOffset: 6,
        focusOffset: 9
      });

      const delta = new Delta().retain(3).delete(3);

      const actual = selection.apply(delta);

      const expected = Selection.create({
        anchorOffset: 3,
        focusOffset: 6
      });

      expect(actual).toEqual(expected);
    });

    test("delete before the end offset", () => {
      const selection = Selection.create({
        anchorOffset: 3,
        focusOffset: 9
      });

      const delta = new Delta().retain(6).delete(3);

      const actual = selection.apply(delta);

      const expected = Selection.create({
        anchorOffset: 3,
        focusOffset: 6
      });

      expect(actual).toEqual(expected);
    });

    test("delete after the end offset", () => {
      const selection = Selection.create({
        anchorOffset: 3,
        focusOffset: 6
      });

      const delta = new Delta().retain(6).delete(3);

      const actual = selection.apply(delta);

      expect(actual).toBe(selection);
    });
  });
});
