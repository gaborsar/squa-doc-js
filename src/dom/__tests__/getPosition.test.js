import getPosition from "../getPosition";

test("getPosition", () => {
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

  const offset = getPosition(root, text2, 3);
  expect(offset).toBe(7);
});
