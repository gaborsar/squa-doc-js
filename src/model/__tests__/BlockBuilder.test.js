import Schema from "../Schema";
import BlockBuilder from "../BlockBuilder";
import Mark from "../Mark";
import Style from "../Style";
import Embed from "../Embed";
import Text from "../Text";
import Block from "../Block";

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
    .insert("foobar", { bold: true })
    .insert({ image: "foobar" }, { alt: "foobar" })
    .insert({ unknown: "foobar" })
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
        value: "foobar"
      }),
      Embed.create({
        style: Style.create({
          marks: [
            Mark.create({
              type: "alt",
              value: "foobar"
            })
          ]
        }),
        value: {
          image: "foobar"
        }
      })
    ]
  });

  expect(actual.toJSON()).toEqual(expected.toJSON());
});
