import Mark from "../Mark";
import Style from "../Style";
import Text from "../Text";
import Embed from "../Embed";
import Block from "../Block";
import BlockBuilder from "../BlockBuilder";

test("BlockBuilder", () => {
  const actual = new BlockBuilder()
    .insert("foo", { bold: true })
    .insert({ "inline-image": "foo" }, { alt: "foo" })
    .build();

  const expected = Block.create({
    children: [
      Text.create({
        style: Style.create({
          marks: [
            Mark.create({
              type: "bold",
              value: true
            })
          ]
        }),
        value: "foo"
      }),
      Embed.create({
        style: Style.create({
          marks: [
            Mark.create({
              type: "alt",
              value: "foo"
            })
          ]
        }),
        value: {
          "inline-image": "foo"
        }
      })
    ]
  });

  expect(actual.delta).toEqual(expected.delta);
});
