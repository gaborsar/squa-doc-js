import Value from "../../model/Value";
import schema from "../schema";
import afterInput from "../afterInput";

describe("afterInput", () => {
  test("insert a level one heading", () => {
    expect(
      Value.createEmpty({ schema })
        .change()
        .insertText("# ")
        .call(afterInput)
        .getValue()
        .toDelta()
    ).toEqual(
      Value.createEmpty({ schema })
        .change()
        .setBlockAttributes({ type: "heading-one" })
        .getValue()
        .toDelta()
    );
  });

  test("insert a level two heading", () => {
    expect(
      Value.createEmpty({ schema })
        .change()
        .insertText("## ")
        .call(afterInput)
        .getValue()
        .toDelta()
    ).toEqual(
      Value.createEmpty({ schema })
        .change()
        .setBlockAttributes({ type: "heading-two" })
        .getValue()
        .toDelta()
    );
  });

  test("insert a level three heading", () => {
    expect(
      Value.createEmpty({ schema })
        .change()
        .insertText("### ")
        .call(afterInput)
        .getValue()
        .toDelta()
    ).toEqual(
      Value.createEmpty({ schema })
        .change()
        .setBlockAttributes({ type: "heading-three" })
        .getValue()
        .toDelta()
    );
  });

  test("insert a level four heading", () => {
    expect(
      Value.createEmpty({ schema })
        .change()
        .insertText("#### ")
        .call(afterInput)
        .getValue()
        .toDelta()
    ).toEqual(
      Value.createEmpty({ schema })
        .change()
        .setBlockAttributes({ type: "heading-four" })
        .getValue()
        .toDelta()
    );
  });

  test("insert a level five heading", () => {
    expect(
      Value.createEmpty({ schema })
        .change()
        .insertText("##### ")
        .call(afterInput)
        .getValue()
        .toDelta()
    ).toEqual(
      Value.createEmpty({ schema })
        .change()
        .setBlockAttributes({ type: "heading-five" })
        .getValue()
        .toDelta()
    );
  });

  test("insert a level six heading", () => {
    expect(
      Value.createEmpty({ schema })
        .change()
        .insertText("###### ")
        .call(afterInput)
        .getValue()
        .toDelta()
    ).toEqual(
      Value.createEmpty({ schema })
        .change()
        .setBlockAttributes({ type: "heading-six" })
        .getValue()
        .toDelta()
    );
  });

  test("insert an unordered list item", () => {
    expect(
      Value.createEmpty({ schema })
        .change()
        .insertText("* ")
        .call(afterInput)
        .getValue()
        .toDelta()
    ).toEqual(
      Value.createEmpty({ schema })
        .change()
        .setBlockAttributes({ type: "unordered-list-item" })
        .getValue()
        .toDelta()
    );
  });

  test("insert an ordered list item with a dot", () => {
    expect(
      Value.createEmpty({ schema })
        .change()
        .insertText("1. ")
        .call(afterInput)
        .getValue()
        .toDelta()
    ).toEqual(
      Value.createEmpty({ schema })
        .change()
        .setBlockAttributes({ type: "ordered-list-item" })
        .getValue()
        .toDelta()
    );
  });

  test("insert an ordered list item with a bracket", () => {
    expect(
      Value.createEmpty({ schema })
        .change()
        .insertText("1) ")
        .call(afterInput)
        .getValue()
        .toDelta()
    ).toEqual(
      Value.createEmpty({ schema })
        .change()
        .setBlockAttributes({ type: "ordered-list-item" })
        .getValue()
        .toDelta()
    );
  });

  test("insert a clode block", () => {
    expect(
      Value.createEmpty({ schema })
        .change()
        .insertText("``` ")
        .call(afterInput)
        .getValue()
        .toDelta()
    ).toEqual(
      Value.createEmpty({ schema })
        .change()
        .setBlockAttributes({ type: "code" })
        .getValue()
        .toDelta()
    );
  });

  test("insert a blockquote", () => {
    expect(
      Value.createEmpty({ schema })
        .change()
        .insertText("> ")
        .call(afterInput)
        .getValue()
        .toDelta()
    ).toEqual(
      Value.createEmpty({ schema })
        .change()
        .setBlockAttributes({ type: "blockquote" })
        .getValue()
        .toDelta()
    );
  });

  test("insert bold text with asterisks", () => {
    expect(
      Value.createEmpty({ schema })
        .change()
        .insertText("**aaa** ")
        .call(afterInput)
        .getValue()
        .toDelta()
    ).toEqual(
      Value.createEmpty({ schema })
        .change()
        .insertText("aaa", { bold: true })
        .insertText(" ")
        .getValue()
        .toDelta()
    );
  });

  test("insert bold text with underlines", () => {
    expect(
      Value.createEmpty({ schema })
        .change()
        .insertText("__aaa__ ")
        .call(afterInput)
        .getValue()
        .toDelta()
    ).toEqual(
      Value.createEmpty({ schema })
        .change()
        .insertText("aaa", { bold: true })
        .insertText(" ")
        .getValue()
        .toDelta()
    );
  });

  test("insert italic text with an asterisk", () => {
    expect(
      Value.createEmpty({ schema })
        .change()
        .insertText("*aaa* ")
        .call(afterInput)
        .getValue()
        .toDelta()
    ).toEqual(
      Value.createEmpty({ schema })
        .change()
        .insertText("aaa", { italic: true })
        .insertText(" ")
        .getValue()
        .toDelta()
    );
  });

  test("insert italic text with an underline", () => {
    expect(
      Value.createEmpty({ schema })
        .change()
        .insertText("_aaa_ ")
        .call(afterInput)
        .getValue()
        .toDelta()
    ).toEqual(
      Value.createEmpty({ schema })
        .change()
        .insertText("aaa", { italic: true })
        .insertText(" ")
        .getValue()
        .toDelta()
    );
  });

  test("insert monospace text", () => {
    expect(
      Value.createEmpty({ schema })
        .change()
        .insertText("`aaa` ")
        .call(afterInput)
        .getValue()
        .toDelta()
    ).toEqual(
      Value.createEmpty({ schema })
        .change()
        .insertText("aaa", { code: true })
        .insertText(" ")
        .getValue()
        .toDelta()
    );
  });
});
