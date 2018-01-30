import Mark from "../Mark";
import Style from "../Style";
import Text from "../Text";
import Embed from "../Embed";
import Block from "../Block";
import Document from "../Document";
import DocumentBuilder from "../DocumentBuilder";

test("DocumentBuilder", () => {
  const actual = new DocumentBuilder()
    .insert("foo", { bold: true })
    .insert({ "inline-image": "foo" }, { alt: "foo" })
    .insert("\n", { align: "left" })
    .insert({ "block-image": "foo" }, { alt: "foo" })
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
              "inline-image": "foo"
            }
          })
        ]
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
          "block-image": "foo"
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
