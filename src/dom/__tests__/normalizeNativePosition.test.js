import normalizeNativePosition from "../normalizeNativePosition";

describe("normalizeNativePosition", () => {
  test("text node", () => {
    const text = document.createTextNode("aaa");

    const { node, offset } = normalizeNativePosition(text, 3);

    expect(node).toBe(text);
    expect(offset).toBe(3);
  });

  test("ignored node", () => {
    const div = document.createElement("div");
    div.setAttribute("data-ignore", "true");

    const text = document.createTextNode("aaa");
    div.appendChild(text);

    const { node, offset } = normalizeNativePosition(div, 1);

    expect(node).toBe(div);
    expect(offset).toBe(0);
  });

  test("embed node", () => {
    const div = document.createElement("div");
    div.setAttribute("data-embed", "true");

    const text = document.createTextNode("aaa");
    div.appendChild(text);

    const { node, offset } = normalizeNativePosition(div, 1);

    expect(node).toBe(div);
    expect(offset).toBe(0);
  });

  test("br node", () => {
    const br = document.createElement("br");

    const { node, offset } = normalizeNativePosition(br, 1);

    expect(node).toBe(br);
    expect(offset).toBe(0);
  });

  test("image node", () => {
    const img = document.createElement("img");

    const { node, offset } = normalizeNativePosition(img, 1);

    expect(node).toBe(img);
    expect(offset).toBe(0);
  });

  test("parent node", () => {
    const div = document.createElement("div");

    const text1 = document.createTextNode("aaa");
    div.appendChild(text1);

    const text2 = document.createTextNode("aaa");
    div.appendChild(text2);

    const text3 = document.createTextNode("aaa");
    div.appendChild(text3);

    const { node, offset } = normalizeNativePosition(div, 3);

    expect(node).toBe(div);
    expect(offset).toBe(9);
  });
});
