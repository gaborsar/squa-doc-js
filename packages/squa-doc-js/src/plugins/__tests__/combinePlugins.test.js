import combinePlugins from "../combinePlugins";

describe("combinePlugins", () => {
    describe("schema", () => {
        test("isBlockEmbed()", () => {
            const {
                schema: { isBlockEmbed }
            } = combinePlugins([
                { schema: { isBlockEmbed: v => v === "a" } },
                { schema: { isBlockEmbed: v => v === "b" } }
            ]);
            expect(isBlockEmbed("a")).toBe(true);
            expect(isBlockEmbed("b")).toBe(true);
            expect(isBlockEmbed("c")).toBe(false);
        });

        test("isInlineEmbed()", () => {
            const {
                schema: { isInlineEmbed }
            } = combinePlugins([
                { schema: { isInlineEmbed: v => v === "a" } },
                { schema: { isInlineEmbed: v => v === "b" } }
            ]);
            expect(isInlineEmbed("a")).toBe(true);
            expect(isInlineEmbed("b")).toBe(true);
            expect(isInlineEmbed("c")).toBe(false);
        });

        test("isTableMark()", () => {
            const {
                schema: { isTableMark }
            } = combinePlugins([
                { schema: { isTableMark: v => v === "a" } },
                { schema: { isTableMark: v => v === "b" } }
            ]);
            expect(isTableMark("a")).toBe(true);
            expect(isTableMark("b")).toBe(true);
            expect(isTableMark("c")).toBe(false);
        });

        test("isRowMark()", () => {
            const {
                schema: { isRowMark }
            } = combinePlugins([
                { schema: { isRowMark: v => v === "a" } },
                { schema: { isRowMark: v => v === "b" } }
            ]);
            expect(isRowMark("a")).toBe(true);
            expect(isRowMark("b")).toBe(true);
            expect(isRowMark("c")).toBe(false);
        });

        test("isCellMark()", () => {
            const {
                schema: { isCellMark }
            } = combinePlugins([
                { schema: { isCellMark: v => v === "a" } },
                { schema: { isCellMark: v => v === "b" } }
            ]);
            expect(isCellMark("a")).toBe(true);
            expect(isCellMark("b")).toBe(true);
            expect(isCellMark("c")).toBe(false);
        });

        test("isBlockMark()", () => {
            const {
                schema: { isBlockMark }
            } = combinePlugins([
                { schema: { isBlockMark: v => v === "a" } },
                { schema: { isBlockMark: v => v === "b" } }
            ]);
            expect(isBlockMark("a")).toBe(true);
            expect(isBlockMark("b")).toBe(true);
            expect(isBlockMark("c")).toBe(false);
        });

        test("isBlockEmbedMark()", () => {
            const {
                schema: { isBlockEmbedMark }
            } = combinePlugins([
                { schema: { isBlockEmbedMark: v => v === "a" } },
                { schema: { isBlockEmbedMark: v => v === "b" } }
            ]);
            expect(isBlockEmbedMark("a")).toBe(true);
            expect(isBlockEmbedMark("b")).toBe(true);
            expect(isBlockEmbedMark("c")).toBe(false);
        });

        test("isTextMark()", () => {
            const {
                schema: { isTextMark }
            } = combinePlugins([
                { schema: { isTextMark: v => v === "a" } },
                { schema: { isTextMark: v => v === "b" } }
            ]);
            expect(isTextMark("a")).toBe(true);
            expect(isTextMark("b")).toBe(true);
            expect(isTextMark("c")).toBe(false);
        });

        test("isInlineEmbedMark()", () => {
            const {
                schema: { isInlineEmbedMark }
            } = combinePlugins([
                { schema: { isInlineEmbedMark: v => v === "a" } },
                { schema: { isInlineEmbedMark: v => v === "b" } }
            ]);
            expect(isInlineEmbedMark("a")).toBe(true);
            expect(isInlineEmbedMark("b")).toBe(true);
            expect(isInlineEmbedMark("c")).toBe(false);
        });
    });

    test("renderWrapper()", () => {
        const { renderWrapper } = combinePlugins([
            { renderWrapper: v => (v === "a" ? "a" : undefined) },
            { renderWrapper: v => (v === "b" ? "b" : undefined) }
        ]);
        expect(renderWrapper("a")).toEqual("a");
        expect(renderWrapper("b")).toEqual("b");
        expect(renderWrapper("c")).toBe(undefined);
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
