import combinePlugins from "../combinePlugins";

describe("combinePlugins", () => {
  describe("schema", () => {
    test("isBlockEmbed()", () => {
      const { schema: { isBlockEmbed } } = combinePlugins([
        { schema: { isBlockEmbed: v => v === "a" } },
        { schema: { isBlockEmbed: v => v === "b" } }
      ]);
      expect(isBlockEmbed("a")).toBe(true);
      expect(isBlockEmbed("b")).toBe(true);
      expect(isBlockEmbed("c")).toBe(false);
    });

    test("isInlineEmbed()", () => {
      const { schema: { isInlineEmbed } } = combinePlugins([
        { schema: { isInlineEmbed: v => v === "a" } },
        { schema: { isInlineEmbed: v => v === "b" } }
      ]);
      expect(isInlineEmbed("a")).toBe(true);
      expect(isInlineEmbed("b")).toBe(true);
      expect(isInlineEmbed("c")).toBe(false);
    });

    test("isBlockMark()", () => {
      const { schema: { isBlockMark } } = combinePlugins([
        { schema: { isBlockMark: v => v === "a" } },
        { schema: { isBlockMark: v => v === "b" } }
      ]);
      expect(isBlockMark("a")).toBe(true);
      expect(isBlockMark("b")).toBe(true);
      expect(isBlockMark("c")).toBe(false);
    });

    test("isInlineMark()", () => {
      const { schema: { isInlineMark } } = combinePlugins([
        { schema: { isInlineMark: v => v === "a" } },
        { schema: { isInlineMark: v => v === "b" } }
      ]);
      expect(isInlineMark("a")).toBe(true);
      expect(isInlineMark("b")).toBe(true);
      expect(isInlineMark("c")).toBe(false);
    });

    test("isEmbedMark()", () => {
      const { schema: { isEmbedMark } } = combinePlugins([
        { schema: { isEmbedMark: v => v === "a" } },
        { schema: { isEmbedMark: v => v === "b" } }
      ]);
      expect(isEmbedMark("a")).toBe(true);
      expect(isEmbedMark("b")).toBe(true);
      expect(isEmbedMark("c")).toBe(false);
    });
  });

  test("renderNode()", () => {
    const { renderNode } = combinePlugins([
      { renderNode: v => (v === "a" ? "a" : undefined) },
      { renderNode: v => (v === "b" ? "b" : undefined) }
    ]);
    expect(renderNode("a")).toEqual("a");
    expect(renderNode("b")).toEqual("b");
    expect(renderNode("c")).toBe(undefined);
  });

  test("renderMark()", () => {
    const { renderMark } = combinePlugins([
      { renderMark: v => (v === "a" ? "a" : undefined) },
      { renderMark: v => (v === "b" ? "b" : undefined) }
    ]);
    expect(renderMark("a")).toEqual("a");
    expect(renderMark("b")).toEqual("b");
    expect(renderMark("c")).toBe(undefined);
  });

  test("tokenizeNode()", () => {
    const { tokenizeNode } = combinePlugins([
      { tokenizeNode: v => (v === "a" ? ["a"] : []) },
      { tokenizeNode: v => (v === "b" ? ["b"] : []) }
    ]);
    expect(tokenizeNode("a")).toEqual(["a"]);
    expect(tokenizeNode("b")).toEqual(["b"]);
    expect(tokenizeNode("c")).toEqual([]);
  });

  test("tokenizeClassName()", () => {
    const { tokenizeClassName } = combinePlugins([
      { tokenizeClassName: v => (v === "a" ? ["a"] : []) },
      { tokenizeClassName: v => (v === "b" ? ["b"] : []) }
    ]);
    expect(tokenizeClassName("a")).toEqual(["a"]);
    expect(tokenizeClassName("b")).toEqual(["b"]);
    expect(tokenizeClassName("c")).toEqual([]);
  });

  test("onKeyDown()", () => {
    const handlers = [
      jest.fn(v => v === "a"),
      jest.fn(v => v === "b"),
      jest.fn()
    ];

    const { onKeyDown } = combinePlugins([
      { onKeyDown: handlers[0] },
      { onKeyDown: handlers[1] },
      { onKeyDown: handlers[2] }
    ]);

    onKeyDown("a");
    onKeyDown("b");
    onKeyDown("c");

    expect(handlers[0]).toHaveBeenCalledTimes(3);
    expect(handlers[1]).toHaveBeenCalledTimes(2);
    expect(handlers[2]).toHaveBeenCalledTimes(1);
  });

  test("afterInput()", () => {
    const hooks = [jest.fn(), jest.fn(), jest.fn()];

    const { afterInput } = combinePlugins([
      { afterInput: hooks[0] },
      { afterInput: hooks[1] },
      { afterInput: hooks[2] }
    ]);

    afterInput("a");

    expect(hooks[0]).toHaveBeenCalledWith("a");
    expect(hooks[1]).toHaveBeenCalledWith("a");
    expect(hooks[2]).toHaveBeenCalledWith("a");
  });
});
