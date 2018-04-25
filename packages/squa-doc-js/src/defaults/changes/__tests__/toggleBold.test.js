import Value from "../../../model/Value";
import schema from "../../schema";
import toggleBold from "../toggleBold";

describe("toggleBold", () => {
  test("add bold formatting", () => {
    expect(
      Value.createEmpty({ schema })
        .change()
        .insertText("aaa")
        .selectAll()
        .call(toggleBold)
        .getValue()
        .toDelta()
    ).toEqual(
      Value.createEmpty({ schema })
        .change()
        .insertText("aaa", { bold: true })
        .getValue()
        .toDelta()
    );
  });

  test("remove bold formatting", () => {
    expect(
      Value.createEmpty({ schema })
        .change()
        .insertText("aaa", { bold: true })
        .selectAll()
        .call(toggleBold)
        .getValue()
        .toDelta()
    ).toEqual(
      Value.createEmpty({ schema })
        .change()
        .insertText("aaa")
        .getValue()
        .toDelta()
    );
  });
});
