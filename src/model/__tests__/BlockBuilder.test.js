import Schema from "../Schema";
import Mark from "../Mark";
import Style from "../Style";
import Text from "../Text";
import Embed from "../Embed";
import Block from "../Block";
import BlockBuilder from "../BlockBuilder";

const schema = new Schema({
  inline: {
    marks: ["bold"],
    embeds: ["image"]
  },
  image: {
    marks: ["alt"]
  }
});

test("BlockBuilder", () => {
  const actual = new BlockBuilder(schema)
    .insert("foo", { bold: true })
    .insert({ image: "foo" }, { alt: "foo" })
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
          image: "foo"
        }
      })
    ]
  });

  expect(actual.delta).toEqual(expected.delta);
});