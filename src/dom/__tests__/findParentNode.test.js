import findParentNode from "../findParentNode";

describe("findParentNode", () => {
  test("the given node does note have a parent node", () => {
    const text = document.createTextNode("aaa");

    const parent = findParentNode(text, () => false);
    expect(parent).toBe(null);
  });

  test("the predicate is never fulfilled", () => {
    const div = document.createElement("div");

    const span = document.createElement("span");
    div.appendChild(span);

    const text = document.createTextNode("aaa");
    span.appendChild(text);

    const parent = findParentNode(text, () => false);
    expect(parent).toBe(null);
  });

  test("the predicate is fulfilled by a parent node", () => {
    const div = document.createElement("div");

    const span = document.createElement("span");
    div.appendChild(span);

    const text = document.createTextNode("aaa");
    span.appendChild(text);

    const parent = findParentNode(text, node => node === span);
    expect(parent).toBe(span);
  });

  test("the predicate is fulfilled by the node", () => {
    const div = document.createElement("div");

    const span = document.createElement("span");
    div.appendChild(span);

    const text = document.createTextNode("aaa");
    span.appendChild(text);

    const parent = findParentNode(text, node => node === text);
    expect(parent).toBe(text);
  });
});
