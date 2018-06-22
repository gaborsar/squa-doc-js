import getPosition from "../getPosition";

test("getPosition()", () => {
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
  table.appendChild(block1);

  const text1 = document.createTextNode("aaa");
  block1.appendChild(text1);

  const block2 = document.createElement("div");
  block2.setAttribute("data-block", "true");
  table.appendChild(block2);

  const text2 = document.createTextNode("bbb");
  block2.appendChild(text2);

  const offset = getPosition(root, text2, 3);
  expect(offset).toBe(10);
});
