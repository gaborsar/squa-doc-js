import Schema from "../Schema";
import combineSchemas from "../../plugins/combineSchemas";
import defaultSchema from "../../defaults/schema";
import { randomDocumentDelta } from "../__gens__/randomDelta";

const customSchema = {
    isBlockEmbed(name) {
        return name === "block-embed";
    },
    isInlineEmbed(name) {
        return name === "inline-embed";
    },
    isTableMark(name) {
        return name === "table-mark";
    },
    isRowMark(name) {
        return name === "table-row-mark";
    },
    isCellMark(name) {
        return name === "table-cell-mark";
    },
    isBlockEmbedMark(embedName, markName) {
        return embedName === "block-embed" && markName === "block-embed-mark";
    },
    isInlineEmbedMark(embedName, markName) {
        return embedName === "inline-embed" && markName === "inline-embed-mark";
    }
};

const schema = new Schema(combineSchemas([defaultSchema, customSchema]));

function createDocument(delta) {
    const builder = schema.createDocumentBuilder();
    delta.forEach(op => {
        builder.insert(op.insert, op.attributes);
    });
    return builder.build();
}

describe("Document", () => {
    test("create a document from a delta", () => {
        for (let i = 0; i < 100; i++) {
            const delta = randomDocumentDelta();
            const document = createDocument(delta);
            expect(document.delta).toEqual(delta);
        }
    });

    test("apply a delta to a document", () => {
        for (let i = 0; i < 100; i++) {
            const deltaA = randomDocumentDelta();
            const deltaB = randomDocumentDelta();
            const document = createDocument(deltaA).apply(deltaA.diff(deltaB));
            expect(document.delta).toEqual(deltaB);
        }
    });

    test("get the diff of two documents", () => {
        for (let i = 0; i < 100; i++) {
            const documentA = createDocument(randomDocumentDelta());
            const documentB = createDocument(randomDocumentDelta());
            const documentC = documentA.apply(documentA.diff(documentB));
            expect(documentB.delta).toEqual(documentC.delta);
        }
    });
});
