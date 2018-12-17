import Value from "../../model/Value";
import schema from "../schema";
import toggleItalic from "../toggleItalic";

describe("toggleItalic", () => {
    test("add italic formatting", () => {
        const { value: valueA } = Value.createEmpty({ schema })
            .change()
            .insertText("aaa")
            .selectAll()
            .call(toggleItalic);
        const { value: valueB } = Value.createEmpty({ schema })
            .change()
            .insertText("aaa", { italic: true });
        expect(valueA.toDelta()).toEqual(valueB.toDelta());
    });

    test("remove italic formatting", () => {
        const { value: valueA } = Value.createEmpty({ schema })
            .change()
            .insertText("aaa", { italic: true })
            .selectAll()
            .call(toggleItalic);
        const { value: valueB } = Value.createEmpty({ schema })
            .change()
            .insertText("aaa");
        expect(valueA.toDelta()).toEqual(valueB.toDelta());
    });
});
