import Delta from "quill-delta";

export default function fastDiff(nodesA, nodesB) {
    const lA = nodesA.length;
    const lB = nodesB.length;

    const delta = new Delta();

    let iFrom = 0;
    while (iFrom < lA && iFrom < lB && nodesA[iFrom] === nodesB[iFrom]) {
        delta.retain(nodesA[iFrom].length);
        iFrom++;
    }

    let iToA = lA - 1;
    let iToB = lB - 1;
    while (iToA > iFrom && iToB > iFrom && nodesA[iToA] === nodesB[iToB]) {
        iToA--;
        iToB--;
    }

    let deltaA = new Delta();
    for (let i = iFrom; i <= iToA; i++) {
        deltaA = deltaA.concat(nodesA[i].delta);
    }

    let deltaB = new Delta();
    for (let i = iFrom; i <= iToB; i++) {
        deltaB = deltaB.concat(nodesB[i].delta);
    }

    return delta.concat(deltaA.diff(deltaB));
}
