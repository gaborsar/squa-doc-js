import findChildNode from "../findChildNode";

describe("findChildNode()", () => {
  test("the predicate is never fulfilled", () => {
    const div = document.createElement("div");

    const span = document.createElement("span");
    div.appendChild(span);

    const text = document.createTextNode("aaa");
    span.appendChild(text);

    const child = findChildNode(div, () => false);
    expect(child).toBe(null);
  });

  test("the predicate is fulfilled by a child node", () => {
    const div = document.createElement("div");

    const span = document.createElement("span");
    div.appendChild(span);

    const text = document.createTextNode("aaa");
    span.appendChild(text);

    const child = findChildNode(div, currentNode => currentNode === text);
    expect(child).toBe(text);
  });
});
