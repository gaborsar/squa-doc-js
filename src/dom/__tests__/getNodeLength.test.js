import getNodeLength from "../getNodeLength";

describe("getNodeLength(node)", () => {
  test("text node", () => {
    const text = document.createTextNode("aaa");

    const length = getNodeLength(text);
    expect(length).toBe(3);
  });

  test("ignored node", () => {
    const ignored = document.createElement("span");
    ignored.setAttribute("data-ignore", "true");

    const text = document.createTextNode("aaa");
    ignored.appendChild(text);

    const length = getNodeLength(ignored);
    expect(length).toBe(0);
  });

  test("wrapper node", () => {
    const wrapper = document.createElement("div");
    wrapper.setAttribute("data-wrapper", "true");

    const text = document.createTextNode("aaa");
    wrapper.appendChild(text);

    const length = getNodeLength(wrapper);
    expect(length).toBe(3);
  });

  test("block node", () => {
    const block = document.createElement("div");
    block.setAttribute("data-block", "true");

    const text = document.createTextNode("aaa");
    block.appendChild(text);

    const length = getNodeLength(block);
    expect(length).toBe(4);
  });

  test("inline node", () => {
    const inline = document.createElement("span");

    const text = document.createTextNode("aaa");
    inline.appendChild(text);

    const length = getNodeLength(inline);
    expect(length).toBe(3);
  });

  test("embed node", () => {
    const embed = document.createElement("figure");
    embed.setAttribute("data-embed", "true");

    const text = document.createTextNode("aaa");
    embed.appendChild(text);

    const length = getNodeLength(embed);
    expect(length).toBe(1);
  });

  test("br node", () => {
    const br = document.createElement("br");

    const length = getNodeLength(br);
    expect(length).toBe(1);
  });

  test("img node", () => {
    const img = document.createElement("img");

    const length = getNodeLength(img);
    expect(length).toBe(1);
  });
});
