import getNodeOffset from "../getNodeOffset";

describe("getNodeOffset()", () => {
  test("within an embed node", () => {
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

    const embed = document.createElement("div");
    embed.setAttribute("data-embed", "true");
    block2.appendChild(embed);

    const text2 = document.createTextNode("bbb");
    embed.appendChild(text2);

    const text3 = document.createTextNode("ccc");
    embed.appendChild(text3);

    const offset = getNodeOffset(root, text3);
    expect(offset).toBe(4);
  });

  test("within an ignored node", () => {
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

    const ignored = document.createElement("div");
    ignored.setAttribute("data-ignore", "true");
    block2.appendChild(ignored);

    const text2 = document.createTextNode("bbb");
    ignored.appendChild(text2);

    const text3 = document.createTextNode("ccc");
    ignored.appendChild(text3);

    const offset = getNodeOffset(root, text3);
    expect(offset).toBe(4);
  });

  test("within a text node", () => {
    const root = document.createElement("div");
    root.setAttribute("data-document", "true");

    const table = document.createElement("table");
    table.setAttribute("data-table", "true");
    root.appendChild(table);

    const tbody = document.createElement("tbody");
    table.appendChild(tbody);

    const row = document.createElement("tr");
    row.setAttribute("data-table-row", "true");
    table.appendChild(row);

    const cell = document.createElement("td");
    cell.setAttribute("data-table-cell", "true");
    row.appendChild(cell);

    const block1 = document.createElement("div");
    block1.setAttribute("data-block", "true");
    row.appendChild(block1);

    const text1 = document.createTextNode("aaa");
    block1.appendChild(text1);

    const block2 = document.createElement("div");
    block2.setAttribute("data-block", "true");
    row.appendChild(block2);

    const text2 = document.createTextNode("bbb");
    block2.appendChild(text2);

    const text3 = document.createTextNode("ccc");
    block2.appendChild(text3);

    const offset = getNodeOffset(root, text3);
    expect(offset).toBe(10);
  });
});
