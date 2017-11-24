"use strict";

import Mark from "../../Mark";
import Style from "../../Style";
import Block from "../../Block";
import Document from "../../Document";
import getBlockFormat from "../getBlockFormat";

describe("rich", () => {
  test("getBlockFormat(document, offset)", () => {
    const document = Document.create({
      children: [
        Block.create(),
        Block.create({
          style: Style.create({
            marks: [
              Mark.create({
                type: "align",
                value: "left"
              })
            ]
          })
        })
      ]
    });
    const attributes = getBlockFormat(document, 1);
    expect(attributes).toEqual({ align: "left" })
  });
});