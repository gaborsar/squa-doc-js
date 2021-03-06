/* eslint-disable no-console */

import Delta from "quill-delta";
import Value from "../packages/squa-doc-js/src/model/Value";

const NUMBER_OF_TESTS = 10;

const initialDelta = new Delta();
for (let i = 0; i < 5000; i++) {
    initialDelta
        .insert("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", {
            bold: true
        })
        .insert(" ")
        .insert("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa", {
            italic: true
        })
        .insert("\n");
}

const { document: initialDocument } = Value.fromDelta({
    contents: initialDelta
});

console.log(`document length: ${initialDocument.length}`);

const changeOffset = initialDocument.length - 60;

const changeDelta = new Delta()
    .retain(changeOffset)
    .insert("bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb", {
        underline: true
    })
    .delete(10)
    .retain(10, { underline: true });

const time1 = Date.now();
for (let i = 0; i < NUMBER_OF_TESTS; i++) {
    initialDocument.apply(changeDelta);
}
const time2 = Date.now();

console.log(`time to apply: ${(time2 - time1) / NUMBER_OF_TESTS / 1000}`);

const updatedDocument = initialDocument.apply(changeDelta);

const time3 = Date.now();
for (let i = 0; i < NUMBER_OF_TESTS; i++) {
    updatedDocument.delta.diff(initialDocument.delta, changeOffset);
}
const time4 = Date.now();

console.log(`time to diff: ${(time4 - time3) / NUMBER_OF_TESTS / 1000}`);

const time5 = Date.now();
for (let i = 0; i < NUMBER_OF_TESTS; i++) {
    updatedDocument.diff(initialDocument);
}
const time6 = Date.now();

console.log(`time to fast diff: ${(time6 - time5) / NUMBER_OF_TESTS / 1000}`);
