import Value from "../../model/Value";
import schema from "../schema";
import afterInput from "../afterInput";

describe("afterInput", () => {
    test("insert a level one heading", () => {
        const { value: valueA } = Value.createEmpty({ schema })
            .change()
            .insertText("# ")
            .call(afterInput);
        const { value: valueB } = Value.createEmpty({ schema })
            .change()
            .setBlockAttributes({ type: "heading-one" });
        expect(valueA.toDelta()).toEqual(valueB.toDelta());
    });

    test("insert a level two heading", () => {
        const { value: valueA } = Value.createEmpty({ schema })
            .change()
            .insertText("## ")
            .call(afterInput);
        const { value: valueB } = Value.createEmpty({ schema })
            .change()
            .setBlockAttributes({ type: "heading-two" });
        expect(valueA.toDelta()).toEqual(valueB.toDelta());
    });

    test("insert a level three heading", () => {
        const { value: valueA } = Value.createEmpty({ schema })
            .change()
            .insertText("### ")
            .call(afterInput);
        const { value: valueB } = Value.createEmpty({ schema })
            .change()
            .setBlockAttributes({ type: "heading-three" });
        expect(valueA.toDelta()).toEqual(valueB.toDelta());
    });

    test("insert a level four heading", () => {
        const { value: valueA } = Value.createEmpty({ schema })
            .change()
            .insertText("#### ")
            .call(afterInput);
        const { value: valueB } = Value.createEmpty({ schema })
            .change()
            .setBlockAttributes({ type: "heading-four" });
        expect(valueA.toDelta()).toEqual(valueB.toDelta());
    });

    test("insert a level five heading", () => {
        const { value: valueA } = Value.createEmpty({ schema })
            .change()
            .insertText("##### ")
            .call(afterInput);
        const { value: valueB } = Value.createEmpty({ schema })
            .change()
            .setBlockAttributes({ type: "heading-five" });
        expect(valueA.toDelta()).toEqual(valueB.toDelta());
    });

    test("insert a level six heading", () => {
        const { value: valueA } = Value.createEmpty({ schema })
            .change()
            .insertText("###### ")
            .call(afterInput);
        const { value: valueB } = Value.createEmpty({ schema })
            .change()
            .setBlockAttributes({ type: "heading-six" });
        expect(valueA.toDelta()).toEqual(valueB.toDelta());
    });

    test("insert an unordered list item", () => {
        const { value: valueA } = Value.createEmpty({ schema })
            .change()
            .insertText("* ")
            .call(afterInput);
        const { value: valueB } = Value.createEmpty({ schema })
            .change()
            .setBlockAttributes({ type: "unordered-list-item" });
        expect(valueA.toDelta()).toEqual(valueB.toDelta());
    });

    test("insert an ordered list item with a dot", () => {
        const { value: valueA } = Value.createEmpty({ schema })
            .change()
            .insertText("1. ")
            .call(afterInput);
        const { value: valueB } = Value.createEmpty({ schema })
            .change()
            .setBlockAttributes({ type: "ordered-list-item" });
        expect(valueA.toDelta()).toEqual(valueB.toDelta());
    });

    test("insert an ordered list item with a bracket", () => {
        const { value: valueA } = Value.createEmpty({ schema })
            .change()
            .insertText("1) ")
            .call(afterInput);
        const { value: valueB } = Value.createEmpty({ schema })
            .change()
            .setBlockAttributes({ type: "ordered-list-item" });
        expect(valueA.toDelta()).toEqual(valueB.toDelta());
    });

    test("insert a code block", () => {
        const { value: valueA } = Value.createEmpty({ schema })
            .change()
            .insertText("``` ")
            .call(afterInput);
        const { value: valueB } = Value.createEmpty({ schema })
            .change()
            .setBlockAttributes({ type: "code" });
        expect(valueA.toDelta()).toEqual(valueB.toDelta());
    });

    test("insert a blockquote", () => {
        const { value: valueA } = Value.createEmpty({ schema })
            .change()
            .insertText("> ")
            .call(afterInput);
        const { value: valueB } = Value.createEmpty({ schema })
            .change()
            .setBlockAttributes({ type: "blockquote" });
        expect(valueA.toDelta()).toEqual(valueB.toDelta());
    });

    test("insert bold text with asterisks", () => {
        const { value: valueA } = Value.createEmpty({ schema })
            .change()
            .insertText("**aaa** ")
            .call(afterInput);
        const { value: valueB } = Value.createEmpty({ schema })
            .change()
            .insertText("aaa", { bold: true })
            .insertText(" ");
        expect(valueA.toDelta()).toEqual(valueB.toDelta());
    });

    test("insert bold text with underlines", () => {
        const { value: valueA } = Value.createEmpty({ schema })
            .change()
            .insertText("__aaa__ ")
            .call(afterInput);
        const { value: valueB } = Value.createEmpty({ schema })
            .change()
            .insertText("aaa", { bold: true })
            .insertText(" ");
        expect(valueA.toDelta()).toEqual(valueB.toDelta());
    });

    test("insert italic text with an asterisk", () => {
        const { value: valueA } = Value.createEmpty({ schema })
            .change()
            .insertText("*aaa* ")
            .call(afterInput);
        const { value: valueB } = Value.createEmpty({ schema })
            .change()
            .insertText("aaa", { italic: true })
            .insertText(" ");
        expect(valueA.toDelta()).toEqual(valueB.toDelta());
    });

    test("insert italic text with an underline", () => {
        const { value: valueA } = Value.createEmpty({ schema })
            .change()
            .insertText("_aaa_ ")
            .call(afterInput);
        const { value: valueB } = Value.createEmpty({ schema })
            .change()
            .insertText("aaa", { italic: true })
            .insertText(" ");
        expect(valueA.toDelta()).toEqual(valueB.toDelta());
    });

    test("insert monospace text", () => {
        const { value: valueA } = Value.createEmpty({ schema })
            .change()
            .insertText("`aaa` ")
            .call(afterInput);
        const { value: valueB } = Value.createEmpty({ schema })
            .change()
            .insertText("aaa", { code: true })
            .insertText(" ");
        expect(valueA.toDelta()).toEqual(valueB.toDelta());
    });
});
