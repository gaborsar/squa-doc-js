import Schema from "../Schema";
import DocumentBuilder from "../DocumentBuilder";
import Mark from "../Mark";
import Style from "../Style";
import Embed from "../Embed";
import Text from "../Text";
import Block from "../Block";
import Document from "../Document";

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
    .insert({ video: "foo" })
    .insert({ unknown: "foo" })
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

  expect(actual.toJSON()).toEqual(expected.toJSON());
});
