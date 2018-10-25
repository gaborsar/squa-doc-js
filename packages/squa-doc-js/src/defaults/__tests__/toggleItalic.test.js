import Value from "../../model/Value";
import schema from "../schema";
import toggleItalic from "../toggleItalic";

describe("toggleItalic", () => {
    test("add italic formatting", () => {
        expect(
            Value.createEmpty({ schema })
                .change()
                .insertText("aaa")
                .selectAll()
                .call(toggleItalic)
                .getValue()
                .toDelta()
        ).toEqual(
            Value.createEmpty({ schema })
                .change()
                .insertText("aaa", { italic: true })
                .getValue()
                .toDelta()
        );
    });

    test("remove italic formatting", () => {
        expect(
            Value.createEmpty({ schema })
                .change()
                .insertText("aaa", { italic: true })
                .selectAll()
                .call(toggleItalic)
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
