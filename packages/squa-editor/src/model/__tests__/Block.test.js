import Delta from "quill-delta";
import { random } from "lodash/fp";
import Schema from "../Schema";
import BlockBuilder from "../BlockBuilder";
import combineSchemas from "../../plugins/combineSchemas";
import defaultSchema from "../../defaults/schema";
import inlineImageSchema from "../../../../squa-editor-inline-image-plugin/schema";

const insertInlineOperations = [
  { insert: "aaa" },
  { insert: "aaa", attributes: { link: "http://foo.bar" } },
  { insert: "aaa", attributes: { anchor: "foo" } },
  { insert: "aaa", attributes: { bold: true } },
  { insert: "aaa", attributes: { italic: true } },
  { insert: "aaa", attributes: { underline: true } },
  { insert: "aaa", attributes: { code: true } },
  { insert: { "inline-image": "a" } },
  { insert: { "inline-image": "a" }, attributes: { link: "foo" } },
  { insert: { "inline-image": "a" }, attributes: { alt: "foo" } }
];

function randomElement(list) {
  return list[random(0, list.length - 1)];
}

function randomDelta() {
  const delta = new Delta();
  for (let i = 0; i < random(0, 100); i++) {
    for (let j = 0; j < random(0, 100); j++) {
      delta.push(randomElement(insertInlineOperations));
    }
  }
  return delta;
}

describe("Block", () => {
  test("apply()", () => {
    for (let i = 0; i < 100; i++) {
      const initialDelta = randomDelta();
      const eventualDelta = randomDelta();
      const changeDelta = initialDelta.diff(eventualDelta);

      const schema = new Schema(
        combineSchemas([defaultSchema, inlineImageSchema])
      );

      const builder = new BlockBuilder(schema);
      initialDelta.forEach(op => {
        builder.insert(op.insert, op.attributes);
      });

      const document = builder.build().apply(changeDelta);
      const { delta: blockDelta } = document;

      expect(blockDelta).toEqual(eventualDelta.insert("\n"));
    }
  });
});
