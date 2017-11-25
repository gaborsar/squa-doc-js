"use strict";

import Schema from "../Schema";
import Mark from "../Mark";
import Style from "../Style";
import Text from "../Text";
import Embed from "../Embed";
import Block from "../Block";
import Document from "../Document";

const schema = new Schema({
  block: {
    embeds: ["blockImage"],
    marks: ["align", "bold"]
  },
  inline: {
    embeds: ["inlineImage"],
    marks: ["bold"]
  },
  blockImage: {
    marks: ["width"]
  },
  inlineImage: {
    marks: ["width"]
  }
});

describe("Document", () => {
  test("length", () => {
    const node = Document.create({
      children: [
        Block.create({
          children: [
            Text.create({
              value: "aaa"
            })
          ]
        }),
        Block.create({
          children: [
            Text.create({
              value: "bbb"
            })
          ]
        }),
        Block.create({
          children: [
            Text.create({
              value: "ccc"
            })
          ]
        })
      ]
    });

    expect(node.length).toBe(12);
  });

  test("text", () => {
    const node = Document.create({
      children: [
        Block.create({
          children: [
            Text.create({
              value: "aaa"
            })
          ]
        }),
        Block.create({
          children: [
            Text.create({
              value: "bbb"
            })
          ]
        }),
        Block.create({
          children: [
            Text.create({
              value: "ccc"
            })
          ]
        })
      ]
    });

    expect(node.text).toBe("aaa\nbbb\nccc\n");
  });

  describe("formatAt(offset, length, attributes)", () => {
    test("format the left slice of a child", () => {
      const node = Document.create({
        children: [
          Block.create({
            children: [
              Text.create({
                schema,
                value: "aaa"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                schema,
                value: "bbbccc"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                value: "ddd"
              })
            ]
          })
        ]
      });

      const actual = node.formatAt(4, 3, { bold: true });

      const expected = Document.create({
        children: [
          Block.create({
            children: [
              Text.create({
                value: "aaa"
              })
            ]
          }),
          Block.create({
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
                value: "ccc"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                value: "ddd"
              })
            ]
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("format a middle slice of a child", () => {
      const node = Document.create({
        children: [
          Block.create({
            children: [
              Text.create({
                value: "aaa"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                schema,
                value: "bbbcccddd"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                value: "eee"
              })
            ]
          })
        ]
      });

      const actual = node.formatAt(7, 3, { bold: true });

      const expected = Document.create({
        children: [
          Block.create({
            children: [
              Text.create({
                value: "aaa"
              })
            ]
          }),
          Block.create({
            children: [
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
          }),
          Block.create({
            children: [
              Text.create({
                value: "eee"
              })
            ]
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("format the right slice of a child", () => {
      const node = Document.create({
        children: [
          Block.create({
            children: [
              Text.create({
                value: "aaa"
              })
            ]
          }),
          Block.create({
            schema,
            children: [
              Text.create({
                schema,
                value: "bbbccc"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                value: "ddd"
              })
            ]
          })
        ]
      });

      const actual = node.formatAt(7, 4, { bold: true });

      const expected = Document.create({
        children: [
          Block.create({
            children: [
              Text.create({
                value: "aaa"
              })
            ]
          }),
          Block.create({
            style: Style.create({
              marks: [
                Mark.create({
                  type: "bold"
                })
              ]
            }),
            children: [
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
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                value: "ddd"
              })
            ]
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    describe("format the first child", () => {
      test("the child is a block node", () => {
        const node = Document.create({
          children: [
            Block.create({
              schema,
              children: [
                Text.create({
                  schema,
                  value: "aaa"
                })
              ]
            }),
            Block.create({
              children: [
                Text.create({
                  value: "bbb"
                })
              ]
            })
          ]
        });

        const actual = node.formatAt(0, 4, { bold: true });

        const expected = Document.create({
          children: [
            Block.create({
              style: Style.create({
                marks: [
                  Mark.create({
                    type: "bold"
                  })
                ]
              }),
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
            }),
            Block.create({
              children: [
                Text.create({
                  value: "bbb"
                })
              ]
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the child is an embed node", () => {
        const node = Document.create({
          children: [
            Embed.create({
              schema,
              value: {
                blockImage: "foo.png"
              }
            }),
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            })
          ]
        });

        const actual = node.formatAt(0, 1, { bold: true });

        const expected = Document.create({
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
                blockImage: "foo.png"
              }
            }),
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    describe("format a child", () => {
      test("the child is a block node", () => {
        const node = Document.create({
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Block.create({
              schema,
              children: [
                Text.create({
                  schema,
                  value: "bbb"
                })
              ]
            }),
            Block.create({
              children: [
                Text.create({
                  value: "ccc"
                })
              ]
            })
          ]
        });

        const actual = node.formatAt(4, 4, { bold: true });

        const expected = Document.create({
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Block.create({
              style: Style.create({
                marks: [
                  Mark.create({
                    type: "bold"
                  })
                ]
              }),
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
                })
              ]
            }),
            Block.create({
              children: [
                Text.create({
                  value: "ccc"
                })
              ]
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the child is an embed node", () => {
        const node = Document.create({
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Embed.create({
              schema,
              value: {
                blockImage: "foo.png"
              }
            }),
            Block.create({
              children: [
                Text.create({
                  value: "ccc"
                })
              ]
            })
          ]
        });

        const actual = node.formatAt(4, 1, { bold: true });

        const expected = Document.create({
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
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
                blockImage: "foo.png"
              }
            }),
            Block.create({
              children: [
                Text.create({
                  value: "ccc"
                })
              ]
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    describe("format the last child", () => {
      test("the child is a block node", () => {
        const node = Document.create({
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Block.create({
              schema,
              children: [
                Text.create({
                  schema,
                  value: "bbb"
                })
              ]
            })
          ]
        });

        const actual = node.formatAt(4, 4, { bold: true });

        const expected = Document.create({
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Block.create({
              style: Style.create({
                marks: [
                  Mark.create({
                    type: "bold"
                  })
                ]
              }),
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
                })
              ]
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the child is an embed node", () => {
        const node = Document.create({
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Embed.create({
              schema,
              value: {
                blockImage: "foo.png"
              }
            })
          ]
        });

        const actual = node.formatAt(4, 1, { bold: true });

        const expected = Document.create({
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
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
                blockImage: "foo.png"
              }
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    test("format the right slice of the first child, a child, and the left slice of the last child", () => {
      const node = Document.create({
        children: [
          Block.create({
            schema,
            children: [
              Text.create({
                schema,
                value: "aaabbb"
              })
            ]
          }),
          Block.create({
            schema,
            children: [
              Text.create({
                schema,
                value: "ccc"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                schema,
                value: "dddeee"
              })
            ]
          })
        ]
      });

      const actual = node.formatAt(3, 11, { bold: true });

      const expected = Document.create({
        children: [
          Block.create({
            style: Style.create({
              marks: [
                Mark.create({
                  type: "bold"
                })
              ]
            }),
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
          }),
          Block.create({
            style: Style.create({
              marks: [
                Mark.create({
                  type: "bold"
                })
              ]
            }),
            children: [
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
          }),
          Block.create({
            children: [
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
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("format every children", () => {
      const node = Document.create({
        children: [
          Block.create({
            schema,
            children: [
              Text.create({
                schema,
                value: "aaa"
              })
            ]
          }),
          Block.create({
            schema,
            children: [
              Text.create({
                schema,
                value: "bbb"
              })
            ]
          }),
          Block.create({
            schema,
            children: [
              Text.create({
                schema,
                value: "ccc"
              })
            ]
          })
        ]
      });

      const actual = node.formatAt(0, 12, { bold: true });

      const expected = Document.create({
        children: [
          Block.create({
            style: Style.create({
              marks: [
                Mark.create({
                  type: "bold"
                })
              ]
            }),
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
          }),
          Block.create({
            style: Style.create({
              marks: [
                Mark.create({
                  type: "bold"
                })
              ]
            }),
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
              })
            ]
          }),
          Block.create({
            style: Style.create({
              marks: [
                Mark.create({
                  type: "bold"
                })
              ]
            }),
            children: [
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
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });
  });

  describe("insertAt(offset, value, attributes)", () => {
    describe("insert a child before the first child", () => {
      test("the new child is a text node", () => {
        const node = Document.create({
          children: [
            Block.create({
              schema,
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            })
          ]
        });

        const actual = node.insertAt(0, "bbb", { bold: true });

        const expected = Document.create({
          children: [
            Block.create({
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
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the new child is a block embed node", () => {
        const node = Document.create({
          schema,
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            })
          ]
        });

        const actual = node.insertAt(
          0,
          { blockImage: "foo.png" },
          { width: 100 }
        );

        const expected = Document.create({
          children: [
            Embed.create({
              style: Style.create({
                marks: [
                  Mark.create({
                    type: "width",
                    value: 100
                  })
                ]
              }),
              value: {
                blockImage: "foo.png"
              }
            }),
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the new child is an inline embed node", () => {
        const node = Document.create({
          schema,
          children: [
            Block.create({
              schema,
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            })
          ]
        });

        const actual = node.insertAt(
          0,
          { inlineImage: "foo.png" },
          { width: 100 }
        );

        const expected = Document.create({
          children: [
            Block.create({
              children: [
                Embed.create({
                  style: Style.create({
                    marks: [
                      Mark.create({
                        type: "width",
                        value: 100
                      })
                    ]
                  }),
                  value: {
                    inlineImage: "foo.png"
                  }
                }),
                Text.create({
                  value: "aaa"
                })
              ]
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    describe("insert between two children", () => {
      test("the new child is a text node", () => {
        const node = Document.create({
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Block.create({
              schema,
              children: [
                Text.create({
                  value: "bbb"
                })
              ]
            })
          ]
        });

        const actual = node.insertAt(4, "ccc", { bold: true });

        const expected = Document.create({
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Block.create({
              children: [
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
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the new child is a block embed node", () => {
        const node = Document.create({
          schema,
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Block.create({
              children: [
                Text.create({
                  value: "bbb"
                })
              ]
            })
          ]
        });

        const actual = node.insertAt(
          4,
          { blockImage: "foo.png" },
          { width: 100 }
        );

        const expected = Document.create({
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Embed.create({
              style: Style.create({
                marks: [
                  Mark.create({
                    type: "width",
                    value: 100
                  })
                ]
              }),
              value: {
                blockImage: "foo.png"
              }
            }),
            Block.create({
              children: [
                Text.create({
                  value: "bbb"
                })
              ]
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the new child is an inline embed node", () => {
        const node = Document.create({
          schema,
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Block.create({
              schema,
              children: [
                Text.create({
                  value: "bbb"
                })
              ]
            })
          ]
        });

        const actual = node.insertAt(
          4,
          { inlineImage: "foo.png" },
          { width: 100 }
        );

        const expected = Document.create({
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Block.create({
              children: [
                Embed.create({
                  style: Style.create({
                    marks: [
                      Mark.create({
                        type: "width",
                        value: 100
                      })
                    ]
                  }),
                  value: {
                    inlineImage: "foo.png"
                  }
                }),
                Text.create({
                  value: "bbb"
                })
              ]
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    test("insert after the last child", () => {
      const node = Document.create({
        children: [
          Block.create({
            children: [
              Text.create({
                value: "aaa"
              })
            ]
          })
        ]
      });

      const actual = node.insertAt(4, "aaa", { bold: true });

      const expected = Document.create({
        children: [
          Block.create({
            children: [
              Text.create({
                value: "aaa"
              })
            ]
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    describe("insert into the first child", () => {
      test("the new child is a text node", () => {
        const node = Document.create({
          children: [
            Block.create({
              schema,
              children: [
                Text.create({
                  value: "aaabbb"
                })
              ]
            }),
            Block.create({
              children: [
                Text.create({
                  value: "ccc"
                })
              ]
            })
          ]
        });

        const actual = node.insertAt(3, "ddd", { bold: true });

        const expected = Document.create({
          children: [
            Block.create({
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
                })
              ]
            }),
            Block.create({
              children: [
                Text.create({
                  value: "ccc"
                })
              ]
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the new child is a block embed node", () => {
        const node = Document.create({
          schema,
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaabbb"
                })
              ]
            }),
            Block.create({
              children: [
                Text.create({
                  value: "ccc"
                })
              ]
            })
          ]
        });

        const actual = node.insertAt(
          3,
          { blockImage: "foo.png" },
          { width: 100 }
        );

        const expected = Document.create({
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaabbb"
                })
              ]
            }),
            Block.create({
              children: [
                Text.create({
                  value: "ccc"
                })
              ]
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the new child is an inline embed node", () => {
        const node = Document.create({
          schema,
          children: [
            Block.create({
              schema,
              children: [
                Text.create({
                  value: "aaabbb"
                })
              ]
            }),
            Block.create({
              children: [
                Text.create({
                  value: "ccc"
                })
              ]
            })
          ]
        });

        const actual = node.insertAt(
          3,
          { inlineImage: "foo.png" },
          { width: 100 }
        );

        const expected = Document.create({
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                }),
                Embed.create({
                  style: Style.create({
                    marks: [
                      Mark.create({
                        type: "width",
                        value: 100
                      })
                    ]
                  }),
                  value: {
                    inlineImage: "foo.png"
                  }
                }),
                Text.create({
                  value: "bbb"
                })
              ]
            }),
            Block.create({
              children: [
                Text.create({
                  value: "ccc"
                })
              ]
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    describe("insert into a child", () => {
      test("the new child is a text node", () => {
        const node = Document.create({
          schema,
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Block.create({
              schema,
              children: [
                Text.create({
                  value: "bbbccc"
                })
              ]
            }),
            Block.create({
              children: [
                Text.create({
                  value: "ddd"
                })
              ]
            })
          ]
        });

        const actual = node.insertAt(7, "eee", { bold: true });

        const expected = Document.create({
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Block.create({
              children: [
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
                })
              ]
            }),
            Block.create({
              children: [
                Text.create({
                  value: "ddd"
                })
              ]
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the new child is a block embed node", () => {
        const node = Document.create({
          schema,
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Block.create({
              children: [
                Text.create({
                  value: "bbbccc"
                })
              ]
            }),
            Block.create({
              children: [
                Text.create({
                  value: "ddd"
                })
              ]
            })
          ]
        });

        const actual = node.insertAt(
          7,
          { blockImage: "foo.png" },
          { width: 100 }
        );

        const expected = Document.create({
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Block.create({
              children: [
                Text.create({
                  value: "bbbccc"
                })
              ]
            }),
            Block.create({
              children: [
                Text.create({
                  value: "ddd"
                })
              ]
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the new child is an inline embed node", () => {
        const node = Document.create({
          schema,
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Block.create({
              schema,
              children: [
                Text.create({
                  value: "bbbccc"
                })
              ]
            }),
            Block.create({
              children: [
                Text.create({
                  value: "ddd"
                })
              ]
            })
          ]
        });

        const actual = node.insertAt(
          7,
          { inlineImage: "foo.png" },
          { width: 100 }
        );

        const expected = Document.create({
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Block.create({
              children: [
                Text.create({
                  value: "bbb"
                }),
                Embed.create({
                  style: Style.create({
                    marks: [
                      Mark.create({
                        type: "width",
                        value: 100
                      })
                    ]
                  }),
                  value: {
                    inlineImage: "foo.png"
                  }
                }),
                Text.create({
                  value: "ccc"
                })
              ]
            }),
            Block.create({
              children: [
                Text.create({
                  value: "ddd"
                })
              ]
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    describe("insert into the last child", () => {
      test("the new child is a text node", () => {
        const node = Document.create({
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Block.create({
              schema,
              children: [
                Text.create({
                  value: "bbbccc"
                })
              ]
            })
          ]
        });

        const actual = node.insertAt(7, "ddd", { bold: true });

        const expected = Document.create({
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Block.create({
              children: [
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
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the new child is a block embed node", () => {
        const node = Document.create({
          schema,
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Block.create({
              children: [
                Text.create({
                  value: "bbbccc"
                })
              ]
            })
          ]
        });

        const actual = node.insertAt(
          7,
          { blockImage: "foo.png" },
          { bold: true }
        );

        const expected = Document.create({
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Block.create({
              children: [
                Text.create({
                  value: "bbbccc"
                })
              ]
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the new child is an inline embed node", () => {
        const node = Document.create({
          schema,
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Block.create({
              schema,
              children: [
                Text.create({
                  value: "bbbccc"
                })
              ]
            })
          ]
        });

        const actual = node.insertAt(
          7,
          { inlineImage: "foo.png" },
          { width: 100 }
        );

        const expected = Document.create({
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Block.create({
              children: [
                Text.create({
                  value: "bbb"
                }),
                Embed.create({
                  style: Style.create({
                    marks: [
                      Mark.create({
                        type: "width",
                        value: 100
                      })
                    ]
                  }),
                  value: {
                    inlineImage: "foo.png"
                  }
                }),
                Text.create({
                  value: "ccc"
                })
              ]
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    test("insert an unknown embed", () => {
      const node = Document.create({
        schema,
        children: [
          Block.create({
            children: [
              Text.create({
                value: "aaa"
              })
            ]
          })
        ]
      });

      const actual = node.insertAt(0, { unknown: "foo" }, {});

      const expected = Document.create({
        children: [
          Block.create({
            children: [
              Text.create({
                value: "aaa"
              })
            ]
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("insert multiple lines", () => {
      const node = Document.create({
        schema,
        children: [
          Block.create({
            schema,
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
                value: "aaabbb"
              })
            ]
          })
        ]
      });

      const actual = node.insertAt(3, "cccccc\nddd\neeeeee", {
        align: "right"
      });

      const expected = Document.create({
        children: [
          Block.create({
            style: Style.create({
              marks: [
                Mark.create({
                  type: "align",
                  value: "right"
                })
              ]
            }),
            children: [
              Text.create({
                value: "aaacccccc"
              })
            ]
          }),
          Block.create({
            style: Style.create({
              marks: [
                Mark.create({
                  type: "align",
                  value: "right"
                })
              ]
            }),
            children: [
              Text.create({
                value: "ddd"
              })
            ]
          }),
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
                value: "eeeeeebbb"
              })
            ]
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });
  });

  describe("deleteAt(offset, length", () => {
    test("delete the left slice of a child", () => {
      const node = Document.create({
        children: [
          Block.create({
            children: [
              Text.create({
                value: "aaa"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                value: "bbbccc"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                value: "ddd"
              })
            ]
          })
        ]
      });

      const actual = node.deleteAt(4, 3);

      const expected = Document.create({
        children: [
          Block.create({
            children: [
              Text.create({
                value: "aaa"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                value: "ccc"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                value: "ddd"
              })
            ]
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("delete the middle slice of a child", () => {
      const node = Document.create({
        children: [
          Block.create({
            children: [
              Text.create({
                value: "aaa"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                value: "bbbcccddd"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                value: "eee"
              })
            ]
          })
        ]
      });

      const actual = node.deleteAt(7, 3);

      const expected = Document.create({
        children: [
          Block.create({
            children: [
              Text.create({
                value: "aaa"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                value: "bbbddd"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                value: "eee"
              })
            ]
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("delete the right slice of a child", () => {
      const node = Document.create({
        children: [
          Block.create({
            children: [
              Text.create({
                value: "aaa"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                value: "bbbccc"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                value: "ddd"
              })
            ]
          })
        ]
      });

      const actual = node.deleteAt(7, 3);

      const expected = Document.create({
        children: [
          Block.create({
            children: [
              Text.create({
                value: "aaa"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                value: "bbb"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                value: "ddd"
              })
            ]
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    describe("delete the first child", () => {
      test("the child is a block node", () => {
        const node = Document.create({
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Block.create({
              children: [
                Text.create({
                  value: "bbb"
                })
              ]
            })
          ]
        });

        const actual = node.deleteAt(0, 4);

        const expected = Document.create({
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "bbb"
                })
              ]
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the child is an embed node", () => {
        const node = Document.create({
          children: [
            Embed.create({
              value: {
                blockImage: "foo.png"
              }
            }),
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            })
          ]
        });

        const actual = node.deleteAt(0, 1);

        const expected = Document.create({
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    describe("delete a child", () => {
      test("the child is a block node", () => {
        const node = Document.create({
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Block.create({
              children: [
                Text.create({
                  value: "bbb"
                })
              ]
            }),
            Block.create({
              children: [
                Text.create({
                  value: "ccc"
                })
              ]
            })
          ]
        });

        const actual = node.deleteAt(4, 4);

        const expected = Document.create({
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Block.create({
              children: [
                Text.create({
                  value: "ccc"
                })
              ]
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });

      test("the child is an embed node", () => {
        const node = Document.create({
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Embed.create({
              value: {
                blockImage: "foo.png"
              }
            }),
            Block.create({
              children: [
                Text.create({
                  value: "bbb"
                })
              ]
            })
          ]
        });

        const actual = node.deleteAt(4, 1);

        const expected = Document.create({
          children: [
            Block.create({
              children: [
                Text.create({
                  value: "aaa"
                })
              ]
            }),
            Block.create({
              children: [
                Text.create({
                  value: "bbb"
                })
              ]
            })
          ]
        });

        expect(actual.toJSON()).toEqual(expected.toJSON());
      });
    });

    test("delete the last child", () => {
      const node = Document.create({
        children: [
          Block.create({
            children: [
              Text.create({
                value: "aaa"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                value: "bbb"
              })
            ]
          })
        ]
      });

      const actual = node.deleteAt(4, 4);

      const expected = Document.create({
        children: [
          Block.create({
            children: [
              Text.create({
                value: "aaa"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                value: "bbb"
              })
            ]
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("delete the right slice of the first child, a child, and the right slice of the last child", () => {
      const node = Document.create({
        children: [
          Block.create({
            children: [
              Text.create({
                value: "aaabbb"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                value: "ccc"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                value: "dddeee"
              })
            ]
          })
        ]
      });

      const actual = node.deleteAt(3, 11);

      const expected = Document.create({
        children: [
          Block.create({
            children: [
              Text.create({
                value: "aaaeee"
              })
            ]
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("delete a child and the left slice of a child", () => {
      const node = Document.create({
        children: [
          Block.create({
            children: [
              Text.create({
                value: "aaa"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                value: "bbbccc"
              })
            ]
          })
        ]
      });

      const actual = node.deleteAt(0, 7);

      const expected = Document.create({
        children: [
          Block.create({
            children: [
              Text.create({
                value: "ccc"
              })
            ]
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("delete every children", () => {
      const node = Document.create({
        children: [
          Block.create({
            children: [
              Text.create({
                value: "aaa"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                value: "bbb"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                value: "ccc"
              })
            ]
          })
        ]
      });

      const actual = node.deleteAt(0, 12);

      const expected = Document.create({
        children: [
          Block.create({
            children: [
              Text.create({
                value: "aaa"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                value: "bbb"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                value: "ccc"
              })
            ]
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("delete a block node before an embed node", () => {
      const node = Document.create({
        children: [
          Block.create({
            children: [
              Text.create({
                value: "aaa"
              })
            ]
          }),
          Embed.create({
            value: {
              blockImage: "foo.png"
            }
          })
        ]
      });

      const actual = node.deleteAt(0, 4);

      const expected = Document.create({
        children: [
          Embed.create({
            value: {
              blockImage: "foo.png"
            }
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });

    test("delete a slice of a block node before an embed node", () => {
      const node = Document.create({
        children: [
          Block.create({
            children: [
              Text.create({
                value: "aaabbb"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                value: "ccc"
              })
            ]
          }),
          Embed.create({
            value: {
              blockImage: "foo.png"
            }
          }),
          Block.create({
            children: [
              Text.create({
                value: "ddd"
              })
            ]
          })
        ]
      });

      const actual = node.deleteAt(3, 8);

      const expected = Document.create({
        children: [
          Block.create({
            children: [
              Text.create({
                value: "aaa"
              })
            ]
          }),
          Block.create({
            children: [
              Text.create({
                value: "ddd"
              })
            ]
          })
        ]
      });

      expect(actual.toJSON()).toEqual(expected.toJSON());
    });
  });
});
