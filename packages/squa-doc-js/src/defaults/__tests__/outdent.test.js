import Delta from "quill-delta";
import Value from "../../model/Value";
import schema from "../schema";
import outdent from "../outdent";

test("outdent", () => {
    expect(
        Value.fromDelta({
            schema,
            delta: new Delta()
                .insert("aaa")
                .insert("\n", { type: "unordered-list-item" })
                .insert("bbb")
                .insert("\n", { type: "unordered-list-item", indent: 1 })
                .insert("ccc")
                .insert("\n", { type: "unordered-list-item", indent: 5 })
        })
            .change()
            .selectAll()
            .call(outdent)
            .getValue()
            .toDelta()
    ).toEqual(
        new Delta()
            .insert("aaa")
            .insert("\n", { type: "unordered-list-item" })
            .insert("bbb")
            .insert("\n", { type: "unordered-list-item" })
            .insert("ccc")
            .insert("\n", { type: "unordered-list-item", indent: 4 })
    );
});
