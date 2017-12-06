import getNativePosition from "../getNativePosition";

test("getNativePosition", () => {
  const root = document.createElement("div");
  root.setAttribute("data-document", "true");

  const block1 = document.createElement("div");
  block1.setAttribute("data-block", "true");
  root.appendChild(block1);

  const text1 = document.createTextNode("aaa");
  block1.appendChild(text1);

  const block2 = document.createElement("div");
  block2.setAttribute("data-block", "true");
  root.appendChild(block2);

  const text2 = document.createTextNode("bbb");
  block2.appendChild(text2);

  const { node, offset } = getNativePosition(root, 7);
  expect(node).toBe(text2);
  expect(offset).toBe(3);
});
