import Delta from "quill-delta";
import Value from "../../../model/Value";
import schema from "../../schema";
import indent from "../indent";

test("indent", () => {
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
      .call(indent)
      .getValue()
      .toDelta()
  ).toEqual(
    new Delta()
      .insert("aaa")
      .insert("\n", { type: "unordered-list-item", indent: 1 })
      .insert("bbb")
      .insert("\n", { type: "unordered-list-item", indent: 2 })
      .insert("ccc")
      .insert("\n", { type: "unordered-list-item", indent: 5 })
  );
});
