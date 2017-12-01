import Schema from "../Schema";
import Mark from "../Mark";
import Style from "../Style";
import Text from "../Text";
import Embed from "../Embed";
import Block from "../Block";
import Document from "../Document";
import DocumentBuilder from "../DocumentBuilder";

const schema = new Schema({
  block: {
    marks: ["align"],
    embeds: ["video"]
  },
  inline: {
    marks: ["bold"],
    embeds: ["image"]
  },
  video: {
    marks: ["quality"]
  },
  image: {
    marks: ["alt"]
  }
});

test("DocumentBuilder", () => {
  const actual = new DocumentBuilder(schema)
    .insert("foo", { bold: true })
    .insert({ image: "foo" }, { alt: "foo" })
    .insert("\n", { align: "left" })
    .insert({ video: "foo" }, { quality: "high" })
    .insert("foo\nfoo\n")
    .build();

  const expected = Document.create({
    children: [
      Block.create({
        style: Style.create({
          marks: [
            Mark.create({
              type: "align",
              value: "left"
            })
          ]
        }),
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
      }),
      Embed.create({
        style: Style.create({
          marks: [
            Mark.create({
              type: "quality",
              value: "high"
            })
          ]
        }),
        value: {
          video: "foo"
        }
      }),
      Block.create({
        children: [
          Text.create({
            value: "foo"
          })
        ]
      }),
      Block.create({
        children: [
          Text.create({
            value: "foo"
          })
        ]
      })
    ]
  });

  expect(actual.delta).toEqual(expected.delta);
});
