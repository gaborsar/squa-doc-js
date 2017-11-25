"use strict";

import Schema from "../Schema";
import Mark from "../Mark";
import Style from "../Style";
import Text from "../Text";
import Embed from "../Embed";
import Block from "../Block";

const schema = new Schema({
  block: {
    marks: ["align", "indent"]
  },
  inline: {
    marks: ["bold"],
    embeds: ["image"]
  }
});

describe("Block", () => {
  test("length", () => {
    const node = Block.create({
      children: [
        Text.create({
          value: "aaa"
        }),
        Embed.create({
          value: {
            image: "foo.png"
          }
        }),
        Text.create({
          value: "bbb"
        })
      ]
    });

    expect(node.length).toBe(8);
  });

  test("text", () => {
    const node = Block.create({
      children: [
        Text.create({
          value: "aaa"
        }),
        Embed.create({
          value: {
            image: "foo.png"
          }
        }),
        Text.create({
          value: "bbb"
        })
      ]
    });

    expect(node.text).toBe("aaa*bbb\n");
  });

  test("format(attributes)", () => {
    const node = Block.create({ schema });

    const actual = node
      .format({ align: "left" })
      .format({ align: null, indent: 1 });

    const expected = node.format({ indent: 1 });

    expect(actual.toJSON()).toEqual(expected.toJSON());
  });

  describe("formatAt(offset, length, attributes)", () => {
    test("format the left slice of a child", () => {
      const node = Block.create({
        children: [
          Text.create({
            value: "aaa"
          }),
          Text.create({
            schema,
            value: "bbbccc"
          }),
          Text.create({
            value: "ddd"
          })
        ]
      });

      const actual = node.formatAt(3, 3, { bold: true });

      const expected = Block.create({
        children: [
          Text.create({
            value: "aaa"
          }),
          Text.create({
            style: Style.create({
              marks: [
                Mark.create({
                  type: "bold"
                })
              ]
            }),
            value: "bbb"
          }),
          Text.create({
            value: "ccc"
          }),
          Text.create({
            value: "ddd"
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("format a middle slice of a child", () => {
      const node = Block.create({
        children: [
          Text.create({
            value: "aaa"
          }),
          Text.create({
            schema,
            value: "bbbcccddd"
          }),
          Text.create({
            value: "eee"
          })
        ]
      });

      const actual = node.formatAt(6, 3, { bold: true });

      const expected = Block.create({
        children: [
          Text.create({
            value: "aaa"
          }),
          Text.create({
            value: "bbb"
          }),
          Text.create({
            style: Style.create({
              marks: [
                Mark.create({
                  type: "bold"
                })
              ]
            }),
            value: "ccc"
          }),
          Text.create({
            value: "ddd"
          }),
          Text.create({
            value: "eee"
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("format the right slice of a child", () => {
      const node = Block.create({
        children: [
          Text.create({
            value: "aaa"
          }),
          Text.create({
            schema,
            value: "bbbccc"
          }),
          Text.create({
            value: "ddd"
          })
        ]
      });

      const actual = node.formatAt(6, 3, { bold: true });

      const expected = Block.create({
        children: [
          Text.create({
            value: "aaa"
          }),
          Text.create({
            value: "bbb"
          }),
          Text.create({
            style: Style.create({
              marks: [
                Mark.create({
                  type: "bold"
                })
              ]
            }),
            value: "ccc"
          }),
          Text.create({
            value: "ddd"
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    describe("format the first child", () => {
      test("the first child is a text node", () => {
        const node = Block.create({
          children: [
            Text.create({
              schema,
              value: "aaa"
            }),
            Text.create({
              value: "bbb"
            })
          ]
        });

        const actual = node.formatAt(0, 3, { bold: true });

        const expected = Block.create({
          children: [
            Text.create({
              style: Style.create({
                marks: [
                  Mark.create({
                    type: "bold"
                  })
                ]
              }),
              value: "aaa"
            }),
            Text.create({
              value: "bbb"
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the first child is an embed node", () => {
        const node = Block.create({
          children: [
            Embed.create({
              schema,
              value: {
                image: "foo.png"
              }
            }),
            Text.create({
              value: "aaa"
            })
          ]
        });

        const actual = node.formatAt(0, 1, { bold: true });

        const expected = Block.create({
          children: [
            Embed.create({
              style: Style.create({
                marks: [
                  Mark.create({
                    type: "bold"
                  })
                ]
              }),
              value: {
                image: "foo.png"
              }
            }),
            Text.create({
              value: "aaa"
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    describe("format a child", () => {
      test("the child is a text node", () => {
        const node = Block.create({
          children: [
            Text.create({
              value: "aaa"
            }),
            Text.create({
              schema,
              value: "bbb"
            }),
            Text.create({
              value: "ccc"
            })
          ]
        });

        const actual = node.formatAt(3, 3, { bold: true });

        const expected = Block.create({
          children: [
            Text.create({
              value: "aaa"
            }),
            Text.create({
              style: Style.create({
                marks: [
                  Mark.create({
                    type: "bold"
                  })
                ]
              }),
              value: "bbb"
            }),
            Text.create({
              value: "ccc"
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the child is an embed node", () => {
        const node = Block.create({
          children: [
            Text.create({
              value: "aaa"
            }),
            Embed.create({
              schema,
              value: {
                image: "foo.png"
              }
            }),
            Text.create({
              value: "bbb"
            })
          ]
        });

        const actual = node.formatAt(3, 1, { bold: true });

        const expected = Block.create({
          children: [
            Text.create({
              value: "aaa"
            }),
            Embed.create({
              style: Style.create({
                marks: [
                  Mark.create({
                    type: "bold"
                  })
                ]
              }),
              value: {
                image: "foo.png"
              }
            }),
            Text.create({
              value: "bbb"
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    describe("format the last child", () => {
      test("the child is a text node", () => {
        const node = Block.create({
          children: [
            Text.create({
              value: "aaa"
            }),
            Text.create({
              schema,
              value: "bbb"
            })
          ]
        });

        const actual = node.formatAt(3, 3, { bold: true });

        const expected = Block.create({
          children: [
            Text.create({
              value: "aaa"
            }),
            Text.create({
              style: Style.create({
                marks: [
                  Mark.create({
                    type: "bold"
                  })
                ]
              }),
              value: "bbb"
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the child is an embed node", () => {
        const node = Block.create({
          children: [
            Text.create({
              value: "aaa"
            }),
            Embed.create({
              schema,
              value: {
                image: "foo.png"
              }
            })
          ]
        });

        const actual = node.formatAt(3, 1, { bold: true });

        const expected = Block.create({
          children: [
            Text.create({
              value: "aaa"
            }),
            Embed.create({
              style: Style.create({
                marks: [
                  Mark.create({
                    type: "bold"
                  })
                ]
              }),
              value: {
                image: "foo.png"
              }
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    test("format the right slice of the first child, a child, and the left slice of the last child", () => {
      const node = Block.create({
        children: [
          Text.create({
            schema,
            value: "aaabbb"
          }),
          Text.create({
            schema,
            value: "ccc"
          }),
          Text.create({
            schema,
            value: "dddeee"
          })
        ]
      });

      const actual = node.formatAt(3, 9, { bold: true });

      const expected = Block.create({
        children: [
          Text.create({
            value: "aaa"
          }),
          Text.create({
            style: Style.create({
              marks: [
                Mark.create({
                  type: "bold"
                })
              ]
            }),
            value: "bbb"
          }),
          Text.create({
            style: Style.create({
              marks: [
                Mark.create({
                  type: "bold"
                })
              ]
            }),
            value: "ccc"
          }),
          Text.create({
            style: Style.create({
              marks: [
                Mark.create({
                  type: "bold"
                })
              ]
            }),
            value: "ddd"
          }),
          Text.create({
            value: "eee"
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("format every children", () => {
      const node = Block.create({
        children: [
          Text.create({
            schema,
            value: "aaa"
          }),
          Text.create({
            schema,
            value: "bbb"
          }),
          Text.create({
            schema,
            value: "ccc"
          })
        ]
      });

      const actual = node.formatAt(0, 9, { bold: true });

      const expected = Block.create({
        children: [
          Text.create({
            style: Style.create({
              marks: [
                Mark.create({
                  type: "bold"
                })
              ]
            }),
            value: "aaa"
          }),
          Text.create({
            style: Style.create({
              marks: [
                Mark.create({
                  type: "bold"
                })
              ]
            }),
            value: "bbb"
          }),
          Text.create({
            style: Style.create({
              marks: [
                Mark.create({
                  type: "bold"
                })
              ]
            }),
            value: "ccc"
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("format the EOL", () => {
      const node = Block.create({ schema });

      const actual = node.formatAt(0, 1, { align: "left" });

      const expected = Block.create({
        style: Style.create({
          marks: [
            Mark.create({
              type: "align",
              value: "left"
            })
          ]
        })
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });
  });

  describe("insertAt(offset, value, attributes)", () => {
    describe("insert into an empty node", () => {
      test("the value is a string", () => {
        const node = Block.create({ schema });

        const actual = node.insertAt(0, "aaa", { bold: true });

        const expected = Block.create({
          children: [
            Text.create({
              style: Style.create({
                marks: [
                  Mark.create({
                    type: "bold"
                  })
                ]
              }),
              value: "aaa"
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the value is an object", () => {
        const node = Block.create({ schema });

        const actual = node.insertAt(0, { image: "foo.png" }, { bold: true });

        const expected = Block.create({
          children: [
            Embed.create({
              style: Style.create({
                marks: [
                  Mark.create({
                    type: "bold"
                  })
                ]
              }),
              value: {
                image: "foo.png"
              }
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    test("insert before the first child", () => {
      const node = Block.create({
        schema,
        children: [
          Text.create({
            value: "aaa"
          })
        ]
      });

      const actual = node.insertAt(0, "bbb", { bold: true });

      const expected = Block.create({
        children: [
          Text.create({
            style: Style.create({
              marks: [
                Mark.create({
                  type: "bold"
                })
              ]
            }),
            value: "bbb"
          }),
          Text.create({
            value: "aaa"
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("insert between two children", () => {
      const node = Block.create({
        schema,
        children: [
          Text.create({
            value: "aaa"
          }),
          Text.create({
            value: "bbb"
          })
        ]
      });

      const actual = node.insertAt(3, "ccc", { bold: true });

      const expected = Block.create({
        children: [
          Text.create({
            value: "aaa"
          }),
          Text.create({
            style: Style.create({
              marks: [
                Mark.create({
                  type: "bold"
                })
              ]
            }),
            value: "ccc"
          }),
          Text.create({
            value: "bbb"
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("insert after the last child", () => {
      const node = Block.create({
        schema,
        children: [
          Text.create({
            value: "aaa"
          })
        ]
      });

      const actual = node.insertAt(3, "bbb", { bold: true });

      const expected = Block.create({
        children: [
          Text.create({
            value: "aaa"
          }),
          Text.create({
            style: Style.create({
              marks: [
                Mark.create({
                  type: "bold"
                })
              ]
            }),
            value: "bbb"
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("insert into a the first child", () => {
      const node = Block.create({
        schema,
        children: [
          Text.create({
            value: "aaabbb"
          }),
          Text.create({
            value: "ccc"
          })
        ]
      });

      const actual = node.insertAt(3, "ddd", { bold: true });

      const expected = Block.create({
        children: [
          Text.create({
            value: "aaa"
          }),
          Text.create({
            style: Style.create({
              marks: [
                Mark.create({
                  type: "bold"
                })
              ]
            }),
            value: "ddd"
          }),
          Text.create({
            value: "bbb"
          }),
          Text.create({
            value: "ccc"
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("insert into a child", () => {
      const node = Block.create({
        schema,
        children: [
          Text.create({
            value: "aaa"
          }),
          Text.create({
            value: "bbbccc"
          }),
          Text.create({
            value: "ddd"
          })
        ]
      });

      const actual = node.insertAt(6, "eee", { bold: true });

      const expected = Block.create({
        children: [
          Text.create({
            value: "aaa"
          }),
          Text.create({
            value: "bbb"
          }),
          Text.create({
            style: Style.create({
              marks: [
                Mark.create({
                  type: "bold"
                })
              ]
            }),
            value: "eee"
          }),
          Text.create({
            value: "ccc"
          }),
          Text.create({
            value: "ddd"
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("insert into the last child", () => {
      const node = Block.create({
        schema,
        children: [
          Text.create({
            value: "aaa"
          }),
          Text.create({
            value: "bbbccc"
          })
        ]
      });

      const actual = node.insertAt(6, "ddd", { bold: true });

      const expected = Block.create({
        children: [
          Text.create({
            value: "aaa"
          }),
          Text.create({
            value: "bbb"
          }),
          Text.create({
            style: Style.create({
              marks: [
                Mark.create({
                  type: "bold"
                })
              ]
            }),
            value: "ddd"
          }),
          Text.create({
            value: "ccc"
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("insert an unknown embed", () => {
      const node = Block.create({
        schema,
        children: [
          Text.create({
            value: "aaa"
          })
        ]
      });

      const actual = node.insertAt(0, { unknown: "foo" }, {});

      const expected = Block.create({
        children: [
          Text.create({
            value: "aaa"
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });
  });

  describe("deleteAt(offset, length)", () => {
    test("delete the left slice of a child", () => {
      const node = Block.create({
        children: [
          Text.create({
            value: "aaa"
          }),
          Text.create({
            value: "bbbccc"
          }),
          Text.create({
            value: "ddd"
          })
        ]
      });

      const actual = node.deleteAt(3, 3);

      const expected = Block.create({
        children: [
          Text.create({
            value: "aaa"
          }),
          Text.create({
            value: "ccc"
          }),
          Text.create({
            value: "ddd"
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("delete a middle slice of a child", () => {
      const node = Block.create({
        children: [
          Text.create({
            value: "aaa"
          }),
          Text.create({
            value: "bbbcccddd"
          }),
          Text.create({
            value: "eee"
          })
        ]
      });

      const actual = node.deleteAt(6, 3);

      const expected = Block.create({
        children: [
          Text.create({
            value: "aaa"
          }),
          Text.create({
            value: "bbb"
          }),
          Text.create({
            value: "ddd"
          }),
          Text.create({
            value: "eee"
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("delete the right slice of a child", () => {
      const node = Block.create({
        children: [
          Text.create({
            value: "aaa"
          }),
          Text.create({
            value: "bbbccc"
          }),
          Text.create({
            value: "ddd"
          })
        ]
      });

      const actual = node.deleteAt(6, 3);

      const expected = Block.create({
        children: [
          Text.create({
            value: "aaa"
          }),
          Text.create({
            value: "bbb"
          }),
          Text.create({
            value: "ddd"
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    describe("delete the first child", () => {
      test("the child is a text node", () => {
        const node = Block.create({
          children: [
            Text.create({
              value: "aaa"
            }),
            Text.create({
              value: "bbb"
            })
          ]
        });

        const actual = node.deleteAt(0, 3);

        const expected = Block.create({
          children: [
            Text.create({
              value: "bbb"
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the child is an embed node", () => {
        const node = Block.create({
          children: [
            Embed.create({
              value: {
                image: "foo.png"
              }
            }),
            Text.create({
              value: "aaa"
            })
          ]
        });

        const actual = node.deleteAt(0, 1);

        const expected = Block.create({
          children: [
            Text.create({
              value: "aaa"
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    describe("delete a child", () => {
      test("the child is a text node", () => {
        const node = Block.create({
          children: [
            Text.create({
              value: "aaa"
            }),
            Text.create({
              value: "bbb"
            }),
            Text.create({
              value: "ccc"
            })
          ]
        });

        const actual = node.deleteAt(3, 3);

        const expected = Block.create({
          children: [
            Text.create({
              value: "aaa"
            }),
            Text.create({
              value: "ccc"
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the child is an embed node", () => {
        const node = Block.create({
          children: [
            Text.create({
              value: "aaa"
            }),
            Embed.create({
              value: {
                image: "foo.png"
              }
            }),
            Text.create({
              value: "bbb"
            })
          ]
        });

        const actual = node.deleteAt(3, 1);

        const expected = Block.create({
          children: [
            Text.create({
              value: "aaa"
            }),
            Text.create({
              value: "bbb"
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    describe("delete the last child", () => {
      test("the child is a text node", () => {
        const node = Block.create({
          children: [
            Text.create({
              value: "aaa"
            }),
            Text.create({
              value: "bbb"
            })
          ]
        });

        const actual = node.deleteAt(3, 3);

        const expected = Block.create({
          children: [
            Text.create({
              value: "aaa"
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the child is an embed node", () => {
        const node = Block.create({
          children: [
            Text.create({
              value: "aaa"
            }),
            Embed.create({
              value: {
                image: "foo.png"
              }
            })
          ]
        });

        const actual = node.deleteAt(3, 1);

        const expected = Block.create({
          children: [
            Text.create({
              value: "aaa"
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    test("delete the right slice of the first child, a child, and the left slice of the last child", () => {
      const actual = Block.create({
        children: [
          Text.create({
            value: "aaabbb"
          }),
          Text.create({
            value: "ccc"
          }),
          Text.create({
            value: "dddeee"
          })
        ]
      }).deleteAt(3, 9);

      const expected = Block.create({
        children: [
          Text.create({
            value: "aaa"
          }),
          Text.create({
            value: "eee"
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("delete every children", () => {
      const actual = Block.create({
        children: [
          Text.create({
            value: "aaa"
          }),
          Text.create({
            value: "bbb"
          }),
          Text.create({
            value: "ccc"
          })
        ]
      }).deleteAt(0, 9);

      const expected = Block.create({
        children: []
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });
  });

  test("concat(other)", () => {
    const nodeA = Block.create({
      marks: [
        Mark.create({
          type: "align",
          value: "left"
        })
      ],
      children: [
        Text.create({
          value: "aaa"
        })
      ]
    });
    const nodeB = Block.create({
      marks: [
        Mark.create({
          type: "align",
          value: "right"
        })
      ],
      children: [
        Text.create({
          value: "bbb"
        })
      ]
    });

    const actual = nodeA.concat(nodeB);

    const expected = Block.create({
      marks: [
        Mark.create({
          type: "align",
          value: "right"
        })
      ],
      children: [
        Text.create({
          value: "aaa"
        }),
        Text.create({
          value: "bbb"
        })
      ]
    });

    expect(actual.toJSON()).toEqual(expected.toJSON());
  });

  test("normalize()", () => {
    const node = Block.create({
      children: [
        Text.create({
          style: Style.create({
            marks: [
              Mark.create({
                type: "bold"
              })
            ]
          }),
          value: "aaa"
        }),
        Text.create({
          style: Style.create({
            marks: [
              Mark.create({
                type: "bold"
              })
            ]
          }),
          value: "bbb"
        }),
        Text.create({
          style: Style.create({
            marks: [
              Mark.create({
                type: "italic"
              })
            ]
          }),
          value: "ccc"
        })
      ]
    });

    const actual = node.normalize();

    const expected = Block.create({
      children: [
        Text.create({
          style: Style.create({
            marks: [
              Mark.create({
                type: "bold"
              })
            ]
          }),
          value: "aaabbb"
        }),
        Text.create({
          style: Style.create({
            marks: [
              Mark.create({
                type: "italic"
              })
            ]
          }),
          value: "ccc"
        })
      ]
    });

    expect(actual.toJSON()).toEqual(expected.toJSON());
  });
});
