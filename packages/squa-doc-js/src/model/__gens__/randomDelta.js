import Delta from "quill-delta";
import SpecialCharacter from "../SpecialCharacter";

const inlineOperations = [
    { insert: "aaa", attributes: { link: "http://foo.bar" } },
    { insert: "aaa", attributes: { anchor: "foo" } },
    { insert: "aaa", attributes: { bold: true } },
    { insert: "aaa", attributes: { italic: true } },
    { insert: "aaa", attributes: { underline: true } },
    { insert: "aaa", attributes: { code: true } },
    { insert: "aaa" },
    { insert: { "inline-embed": "a" }, attributes: { link: "foo" } },
    {
        insert: { "inline-embed": "a" },
        attributes: { "inline-embed-mark": true }
    },
    { insert: { "inline-embed": "a" } }
];

const blockEndOperations = [
    { insert: SpecialCharacter.BlockEnd, attributes: { type: "heading-one" } },
    { insert: SpecialCharacter.BlockEnd, attributes: { type: "heading-two" } },
    { insert: SpecialCharacter.BlockEnd }
];

const blockEmbedOperations = [
    {
        insert: { "block-embed": "a" },
        attributes: { "block-embed-mark": "foo" }
    },
    { insert: { "block-embed": "a" } }
];

const tableStartOperations = [
    { insert: SpecialCharacter.TableStart },
    { insert: SpecialCharacter.TableStart, attributes: { "table-mark": true } }
];

const tableEndOperations = [{ insert: SpecialCharacter.TableEnd }];

const tableRowStartOperations = [
    { insert: SpecialCharacter.RowStart },
    {
        insert: SpecialCharacter.RowStart,
        attributes: { "table-row-mark": true }
    }
];

const tableCellStartOperations = [
    { insert: SpecialCharacter.CellStart },
    {
        insert: SpecialCharacter.CellStart,
        attributes: { "table-cell-mark": true }
    }
];

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement(list) {
    return list[random(0, list.length - 1)];
}

export function randomDelta(...generators) {
    let delta = new Delta();
    for (let i = 0; i < random(1, 10); i++) {
        delta = delta.concat(randomElement(generators)());
    }
    return delta;
}

export function randomInlineDelta() {
    return new Delta().push(randomElement(inlineOperations));
}

export function randomBlockEndDelta() {
    return new Delta().push(randomElement(blockEndOperations));
}

export function randomBlockDelta() {
    return randomDelta(randomInlineDelta).concat(randomBlockEndDelta());
}

export function randomBlockEmbedDelta() {
    return new Delta().push(randomElement(blockEmbedOperations));
}

export function randomCellStartDelta() {
    return new Delta().push(randomElement(tableCellStartOperations));
}

export function randomCellDelta() {
    return randomCellStartDelta().concat(randomDelta(randomBlockDelta));
}

export function randomRowStartDelta() {
    return new Delta().push(randomElement(tableRowStartOperations));
}

export function randomRowDelta() {
    return randomRowStartDelta().concat(randomDelta(randomCellDelta));
}

export function randomTableStartDelta() {
    return new Delta().push(randomElement(tableStartOperations));
}

export function randomTableEndDelta() {
    return new Delta().push(randomElement(tableEndOperations));
}

export function randomTableDelta() {
    return randomTableStartDelta()
        .concat(randomDelta(randomRowDelta))
        .concat(randomTableEndDelta());
}

export function randomDocumentDelta() {
    return randomDelta(
        randomBlockDelta,
        randomBlockEmbedDelta,
        randomTableDelta
    );
}
