import Value from "../../model/Value";
import schema from "../schema";
import outdent from "../outdent";

test("outdent", () => {
    const { value: valueA } = Value.createEmpty({ schema })
        .change()
        .insertText("aaa\nbbb\nccc")
        .select(0, 0)
        .setBlockAttributes({ type: "unordered-list-item" })
        .select(4, 0)
        .setBlockAttributes({ type: "unordered-list-item", indent: 1 })
        .select(8, 0)
        .setBlockAttributes({ type: "unordered-list-item", indent: 5 })
        .selectAll()
        .call(outdent);

    const { value: valueB } = Value.createEmpty({ schema })
        .change()
        .insertText("aaa\nbbb\nccc")
        .select(0, 0)
        .setBlockAttributes({ type: "unordered-list-item" })
        .select(4, 0)
        .setBlockAttributes({ type: "unordered-list-item" })
        .select(8, 0)
        .setBlockAttributes({ type: "unordered-list-item", indent: 4 });

    expect(valueA.toDelta()).toEqual(valueB.toDelta());
});
