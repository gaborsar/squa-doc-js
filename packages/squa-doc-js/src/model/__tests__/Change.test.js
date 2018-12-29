import Delta from "quill-delta";
import Value from "../Value";
import combineSchemas from "../../plugins/combineSchemas";
import defaultSchema from "../../defaults/schema";

const customSchema = {
    isBlockEmbed(name) {
        return name === "block-embed";
    },
    isInlineEmbed(name) {
        return name === "inline-embed";
    },
    isBlockEmbedMark(embedName, markName) {
        return embedName === "block-embed" && markName === "block-embed-mark";
    },
    isInlineEmbedMark(embedName, markName) {
        return embedName === "inline-embed" && markName === "inline-embed-mark";
    }
};

const schema = combineSchemas([defaultSchema, customSchema]);

describe("Change", () => {
    test("history", () => {
        const { value } = Value.createEmpty()
            .change()

            .insertText("aaa", { bold: true })
            .save("insert")

            .insertText("bbb", { italic: true })
            .save("insert")

            .select(0, 0)
            .insertText("ccc")
            .save("insert")

            .select(0, 3)
            .delete()
            .save("delete")

            .undo()
            .undo()

            .redo()
            .redo();

        expect(value.toDelta()).toEqual(
            new Delta()
                .insert("aaa", { bold: true })
                .insert("bbb", { italic: true })
                .insert("\n")
        );

        expect(value.selection.anchorOffset).toBe(0);
        expect(value.selection.focusOffset).toBe(0);
    });

    test("select a range", () => {
        const { value } = Value.createEmpty()
            .change()
            .select(3, 6);
        expect(value.selection.anchorOffset).toBe(3);
        expect(value.selection.focusOffset).toBe(6);
    });

    test("select a range backward", () => {
        const { value } = Value.createEmpty()
            .change()
            .select(6, 3);
        expect(value.selection.anchorOffset).toBe(6);
        expect(value.selection.focusOffset).toBe(3);
    });

    test("select everything", () => {
        const delta = new Delta().insert("aaa\nbbb\n");
        const { value } = Value.fromDelta({ contents: delta })
            .change()
            .selectAll();
        expect(value.selection.anchorOffset).toBe(0);
        expect(value.selection.focusOffset).toBe(7);
    });

    test("collapse the selection", () => {
        const { value } = Value.createEmpty()
            .change()
            .select(3, 6)
            .collapse();
        expect(value.selection.anchorOffset).toBe(3);
        expect(value.selection.focusOffset).toBe(3);
    });

    test("collapse the selection to the left when the current selection is forward", () => {
        const { value } = Value.createEmpty()
            .change()
            .select(3, 6)
            .collapseToLeft();
        expect(value.selection.anchorOffset).toBe(3);
        expect(value.selection.focusOffset).toBe(3);
    });

    test("collapse the selection to the left when the current selection is backward", () => {
        const { value } = Value.createEmpty()
            .change()
            .select(6, 3)
            .collapseToLeft();
        expect(value.selection.anchorOffset).toBe(3);
        expect(value.selection.focusOffset).toBe(3);
    });

    test("collapse the selection to the end when the current selection is forward", () => {
        const { value } = Value.createEmpty()
            .change()
            .select(3, 6)
            .collapseToRight();
        expect(value.selection.anchorOffset).toBe(6);
        expect(value.selection.focusOffset).toBe(6);
    });

    test("collapse the selection to the end when the current selection is backward", () => {
        const { value } = Value.createEmpty()
            .change()
            .select(6, 3)
            .collapseToRight();
        expect(value.selection.anchorOffset).toBe(6);
        expect(value.selection.focusOffset).toBe(6);
    });

    test("select a character backward", () => {
        const delta = new Delta().insert("aaa\n");
        const { value } = Value.fromDelta({ contents: delta })
            .change()
            .select(3, 3)
            .selectCharacterBackward();
        expect(value.selection.anchorOffset).toBe(3);
        expect(value.selection.focusOffset).toBe(2);
    });

    test("select a character forward", () => {
        const delta = new Delta().insert("aaabbb\n");
        const { value } = Value.fromDelta({ contents: delta })
            .change()
            .select(3, 3)
            .selectCharacterForward();
        expect(value.selection.anchorOffset).toBe(3);
        expect(value.selection.focusOffset).toBe(4);
    });

    test("select a word backward", () => {
        const delta = new Delta().insert("aaa bbb \n");
        const { value } = Value.fromDelta({ contents: delta })
            .change()
            .select(8, 8)
            .selectWordBackward();
        expect(value.selection.anchorOffset).toBe(8);
        expect(value.selection.focusOffset).toBe(4);
    });

    test("select the first word", () => {
        const delta = new Delta().insert("aaa bbb\n");
        const { value } = Value.fromDelta({ contents: delta })
            .change()
            .select(4, 4)
            .selectWordBackward();
        expect(value.selection.anchorOffset).toBe(4);
        expect(value.selection.focusOffset).toBe(0);
    });

    test("select a word forward()", () => {
        const delta = new Delta().insert("aaa bbb ccc\n");
        const { value } = Value.fromDelta({ contents: delta })
            .change()
            .select(3, 3)
            .selectWordForward();
        expect(value.selection.anchorOffset).toBe(3);
        expect(value.selection.focusOffset).toBe(7);
    });

    test("select the last word", () => {
        const delta = new Delta().insert("aaa bbb\n");
        const { value } = Value.fromDelta({ contents: delta })
            .change()
            .select(3, 3)
            .selectWordForward();
        expect(value.selection.anchorOffset).toBe(3);
        expect(value.selection.focusOffset).toBe(7);
    });

    test("select a block backward", () => {
        const delta = new Delta().insert("aaabbb\n").insert("cccddd\n");
        const { value } = Value.fromDelta({ contents: delta })
            .change()
            .select(10, 10)
            .selectBlockBackward();
        expect(value.selection.anchorOffset).toBe(10);
        expect(value.selection.focusOffset).toBe(7);
    });

    test("select a block forward", () => {
        const delta = new Delta().insert("aaabbb\n");
        const { value } = Value.fromDelta({ contents: delta })
            .change()
            .select(3, 3)
            .selectBlockForward();
        expect(value.selection.anchorOffset).toBe(3);
        expect(value.selection.focusOffset).toBe(6);
    });

    test("insert text", () => {
        const delta = new Delta().insert("aaabbb\n");

        const { value } = Value.fromDelta({ contents: delta })
            .change()
            .select(3, 3)
            .insertText("ccc", { bold: true });

        expect(value.toDelta()).toEqual(
            new Delta()
                .insert("aaa")
                .insert("ccc", { bold: true })
                .insert("bbb\n")
        );

        expect(value.selection.anchorOffset).toBe(6);
        expect(value.selection.focusOffset).toBe(6);
    });

    test("insert an embed element", () => {
        const delta = new Delta().insert("aaabbb\n");

        const { value } = Value.fromDelta({ schema, contents: delta })
            .change()
            .select(3, 3)
            .insertEmbed(
                { "inline-embed": "foo" },
                { "inline-embed-mark": "foo" }
            );

        expect(value.toDelta()).toEqual(
            new Delta()
                .insert("aaa")
                .insert(
                    { "inline-embed": "foo" },
                    { "inline-embed-mark": "foo" }
                )
                .insert("bbb\n")
        );

        expect(value.selection.anchorOffset).toBe(4);
        expect(value.selection.focusOffset).toBe(4);
    });

    test("insert a fragment", () => {
        const delta = new Delta().insert("aaa\n").insert("bbb\n");

        const { value } = Value.fromDelta({ contents: delta })
            .change()
            .select(4, 4)
            .insertFragment(new Delta().insert("ccc\n"));

        expect(value.toDelta()).toEqual(new Delta().insert("aaa\nccc\nbbb\n"));

        expect(value.selection.anchorOffset).toBe(8);
        expect(value.selection.focusOffset).toBe(8);
    });

    test("set attributes at a range", () => {
        const delta = new Delta().insert("aaabbb\ncccddd\n");

        const { value } = Value.fromDelta({ contents: delta })
            .change()
            .select(3, 10)
            .setAttributes({ bold: true });

        expect(value.toDelta()).toEqual(
            new Delta()
                .insert("aaa")
                .insert("bbb", { bold: true })
                .insert("\n")
                .insert("ccc", { bold: true })
                .insert("ddd")
                .insert("\n")
        );
    });

    test("set block attributes at an offset", () => {
        const delta = new Delta().insert("\n");

        const { value } = Value.fromDelta({ contents: delta })
            .change()
            .setBlockAttributes({ align: "left" });

        expect(value.toDelta()).toEqual(
            new Delta().insert("\n", { align: "left" })
        );
    });

    test("set block attributes at a range", () => {
        const delta = new Delta()
            .insert("\n")
            .insert({ "block-embed": "foo" })
            .insert("\n");

        const { value } = Value.fromDelta({ schema, contents: delta })
            .change()
            .select(0, 3)
            .setBlockAttributes({ align: "left" });

        expect(value.toDelta()).toEqual(
            new Delta()
                .insert("\n", { align: "left" })
                .insert({ "block-embed": "foo" }, { align: "left" })
                .insert("\n", { align: "left" })
        );
    });

    test("set inline attributes at an offset and insert some text", () => {
        const { value } = Value.createEmpty()
            .change()
            .setInlineAttributes({ bold: true })
            .insertText("aaa");

        expect(value.toDelta()).toEqual(
            new Delta().insert("aaa", { bold: true }).insert("\n")
        );
    });

    test("set inline attributes at a range", () => {
        const delta = new Delta()
            .insert("aaabbb\n")
            .insert("ccc")
            .insert({ "inline-embed": "foo" })
            .insert("ddd\n");

        const { value } = Value.fromDelta({ schema, contents: delta })
            .change()
            .select(3, 11)
            .setInlineAttributes({ bold: true });

        expect(value.toDelta()).toEqual(
            new Delta()
                .insert("aaa")
                .insert("bbb", { bold: true })
                .insert("\n")
                .insert("ccc", { bold: true })
                .insert({ "inline-embed": "foo" }, { bold: true })
                .insert("ddd\n")
        );
    });

    test("delete a range", () => {
        const delta = new Delta()
            .insert("aaabbb")
            .insert("\n", { type: "heading-one" })
            .insert("cccddd\n");

        const { value } = Value.fromDelta({ contents: delta })
            .change()
            .select(3, 10)
            .delete();

        expect(value.toDelta()).toEqual(
            new Delta().insert("aaaddd").insert("\n", { type: "heading-one" })
        );

        expect(value.selection.anchorOffset).toBe(3);
        expect(value.selection.focusOffset).toBe(3);
    });

    test("remove a node by reference", () => {
        const oldValue = Value.fromDelta({
            contents: new Delta()
                .insert("aaa\n")
                .insert("bbb\n")
                .insert("ccc\n")
        });

        const node = oldValue.document.getChildAtIndex(1);
        const { value: newValue } = oldValue.change().removeNode(node);

        expect(newValue.toDelta()).toEqual(
            new Delta().insert("aaa\n").insert("ccc\n")
        );
    });

    test("replace a node by reference", () => {
        const oldValue = Value.fromDelta({
            contents: new Delta()
                .insert("aaa\n")
                .insert("bbb\n")
                .insert("ccc\n")
        });

        const oldNode = oldValue.document.getChildAtIndex(1);
        const newNode = oldNode
            .editor()
            .delete(3)
            .insert("ddd")
            .retain(Infinity)
            .build();
        const { value: newValue } = oldValue
            .change()
            .replaceNode(newNode, oldNode);

        expect(newValue.toDelta()).toEqual(
            new Delta()
                .insert("aaa\n")
                .insert("ddd\n")
                .insert("ccc\n")
        );
    });
});
