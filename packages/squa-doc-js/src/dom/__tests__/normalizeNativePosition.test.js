import normalizeNativePosition from "../normalizeNativePosition";

describe("normalizeNativePosition()", () => {
  test("text node", () => {
    const text = document.createTextNode("aaa");

    const { node, offset } = normalizeNativePosition(text, 3);

    expect(node).toBe(text);
    expect(offset).toBe(3);
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

  test("ignored node", () => {
    const div = document.createElement("div");
    div.setAttribute("data-ignore", "true");

    const text = document.createTextNode("aaa");
    div.appendChild(text);

    const { node, offset } = normalizeNativePosition(div, 1);

    expect(node).toBe(div);
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

  test("table node", () => {
    const table = document.createElement("table");
    table.setAttribute("data-table", "true");

    const text1 = document.createTextNode("aaa");
    table.appendChild(text1);

    const text2 = document.createTextNode("aaa");
    table.appendChild(text2);

    const text3 = document.createTextNode("aaa");
    table.appendChild(text3);

    const { node, offset } = normalizeNativePosition(table, 3);

    expect(node).toBe(table);
    expect(offset).toBe(10);
  });

  test("table row node", () => {
    const row = document.createElement("tr");
    row.setAttribute("data-table-row", "true");

    const text1 = document.createTextNode("aaa");
    row.appendChild(text1);

    const text2 = document.createTextNode("aaa");
    row.appendChild(text2);

    const text3 = document.createTextNode("aaa");
    row.appendChild(text3);

    const { node, offset } = normalizeNativePosition(row, 3);

    expect(node).toBe(row);
    expect(offset).toBe(10);
  });

  test("table cell node", () => {
    const cell = document.createElement("tr");
    cell.setAttribute("data-table-cell", "true");

    const text1 = document.createTextNode("aaa");
    cell.appendChild(text1);

    const text2 = document.createTextNode("aaa");
    cell.appendChild(text2);

    const text3 = document.createTextNode("aaa");
    cell.appendChild(text3);

    const { node, offset } = normalizeNativePosition(cell, 3);

    expect(node).toBe(cell);
    expect(offset).toBe(10);
  });
});
