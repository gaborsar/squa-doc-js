import Value from "../../model/Value";
import schema from "../schema";
import indent from "../indent";

test("indent", () => {
    const { value: valueA } = Value.createEmpty({ schema })
        .change()
        .insertText("aaa\nbbb\nccc")
        .select(0, 0)
        .setBlockAttributes({ type: "unordered-list-item" })
        .select(4, 4)
        .setBlockAttributes({ type: "unordered-list-item", indent: 1 })
        .select(8, 8)
        .setBlockAttributes({ type: "unordered-list-item", indent: 5 })
        .selectAll()
        .call(indent);

    const { value: valueB } = Value.createEmpty({ schema })
        .change()
        .insertText("aaa\nbbb\nccc")
        .select(0, 0)
        .setBlockAttributes({ type: "unordered-list-item", indent: 1 })
        .select(4, 4)
        .setBlockAttributes({ type: "unordered-list-item", indent: 2 })
        .select(8, 8)
        .setBlockAttributes({ type: "unordered-list-item", indent: 5 });

    expect(valueA.toDelta()).toEqual(valueB.toDelta());
});
