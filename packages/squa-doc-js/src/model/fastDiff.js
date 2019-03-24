import Delta from "quill-delta";

export default function fastDiff(nodesA, nodesB) {
    const { length: lA } = nodesA;
    const { length: lB } = nodesB;

    let iFrom = 0;
    let retainLength = 0;
    while (iFrom < lA && iFrom < lB && nodesA[iFrom] === nodesB[iFrom]) {
        retainLength += nodesA[iFrom].length;
        iFrom++;
    }

    let iToA = lA - 1;
    let iToB = lB - 1;
    while (iToA > iFrom && iToB > iFrom && nodesA[iToA] === nodesB[iToB]) {
        iToA--;
        iToB--;
    }

    const opsA = [];
    for (let i = iFrom; i <= iToA; i++) {
        const {
            delta: { ops }
        } = nodesA[i];
        for (let j = 0, l = ops.length; j < l; j++) {
            opsA.push(ops[j]);
        }
    }

    const opsB = [];
    for (let i = iFrom; i <= iToB; i++) {
        const {
            delta: { ops }
        } = nodesB[i];
        for (let j = 0, l = ops.length; j < l; j++) {
            opsB.push(ops[j]);
        }
    }

    const deltaA = new Delta(opsA);
    const deltaB = new Delta(opsB);

    return new Delta().retain(retainLength).concat(deltaA.diff(deltaB));
}
