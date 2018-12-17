import Value from "../../model/Value";
import schema from "../schema";
import toggleBold from "../toggleBold";

describe("toggleBold", () => {
    test("add bold formatting", () => {
        const { value: valueA } = Value.createEmpty({ schema })
            .change()
            .insertText("aaa")
            .selectAll()
            .call(toggleBold);
        const { value: valueB } = Value.createEmpty({ schema })
            .change()
            .insertText("aaa", { bold: true });
        expect(valueA.toDelta()).toEqual(valueB.toDelta());
    });

    test("remove bold formatting", () => {
        const { value: valueA } = Value.createEmpty({ schema })
            .change()
            .insertText("aaa", { bold: true })
            .selectAll()
            .call(toggleBold);
        const { value: valueB } = Value.createEmpty({ schema })
            .change()
            .insertText("aaa");
        expect(valueA.toDelta()).toEqual(valueB.toDelta());
    });
});
