import Schema from "../Schema";
import combineSchemas from "../../plugins/combineSchemas";
import defaultSchema from "../../defaults/schema";
import { randomDelta, randomInlineDelta } from "../__gens__/randomDelta";

const customSchema = {
    isInlineEmbed(name) {
        return name === "inline-embed";
    },
    isInlineEmbedMark(embedName, markName) {
        return embedName === "inline-embed" && markName === "inline-embed-mark";
    }
};

const schema = new Schema(combineSchemas([defaultSchema, customSchema]));

function createBlock(delta) {
    const builder = schema.createBlockBuilder();
    delta.forEach(op => {
        builder.insert(op.insert, op.attributes);
    });
    return builder.build();
}

describe("Block", () => {
    test("create a block from a delta", () => {
        for (let i = 0; i < 100; i++) {
            const delta = randomDelta(randomInlineDelta);
            const block = createBlock(delta);
            expect(block.delta).toEqual(delta.insert("\n"));
        }
    });

    test("apply a delta to a block", () => {
        for (let i = 0; i < 100; i++) {
            const deltaA = randomDelta(randomInlineDelta);
            const deltaB = randomDelta(randomInlineDelta);
            const block = createBlock(deltaA).apply(deltaA.diff(deltaB));
            expect(block.delta).toEqual(deltaB.insert("\n"));
        }
    });
});
