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
    .insert("foobar", { bold: true })
    .insert({ image: "foobar" }, { alt: "foobar" })
    .insert({ video: "foobar" })
    .insert({ unknown: "foobar" })
    .insert("\n", { align: "left" })
    .insert({ video: "foobar" }, { quality: "high" })
    .insert("foobar")
    .insert("\n")
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
          video: "foobar"
        }
      }),
      Block.create({
        children: [
          Text.create({
            value: "foobar"
          })
        ]
      })
    ]
  });

  expect(actual.toJSON()).toEqual(expected.toJSON());
});
