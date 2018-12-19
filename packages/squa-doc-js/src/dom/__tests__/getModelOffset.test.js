import getModelOffset from "../getModelOffset";

describe("getModelOffset", () => {
    test("within an element node", () => {
        const root = document.createElement("div");

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

        const offset = getModelOffset(root, block2, 1);
        expect(offset).toBe(7);
    });

    test("within a text node", () => {
        const root = document.createElement("div");

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

        const offset = getModelOffset(root, text2, 3);
        expect(offset).toBe(7);
    });

    test("within a table node", () => {
        const root = document.createElement("div");

        const table = document.createElement("table");
        table.setAttribute("data-table", "true");
        root.appendChild(table);

        const row = document.createElement("td");
        row.setAttribute("data-row", "true");
        table.appendChild(row);

        const cell = document.createElement("td");
        cell.setAttribute("data-cell", "true");
        row.appendChild(cell);

        const block1 = document.createElement("div");
        block1.setAttribute("data-block", "true");
        cell.appendChild(block1);

        const text1 = document.createTextNode("aaa");
        block1.appendChild(text1);

        const block2 = document.createElement("div");
        block2.setAttribute("data-block", "true");
        cell.appendChild(block2);

        const text2 = document.createTextNode("bbb");
        block2.appendChild(text2);

        const offset = getModelOffset(root, text2, 3);
        expect(offset).toBe(10);
    });

    test("within an ignored node", () => {
        const root = document.createElement("div");

        const block = document.createElement("div");
        block.setAttribute("data-block", "true");
        root.appendChild(block);

        const text1 = document.createTextNode("aaa");
        block.appendChild(text1);

        const ignored = document.createElement("span");
        ignored.setAttribute("data-ignore", "true");
        block.appendChild(ignored);

        const text2 = document.createTextNode("bbb");
        ignored.appendChild(text2);

        const offset = getModelOffset(root, text2, 3);
        expect(offset).toBe(3);
    });

    test("between two block nodes", () => {
        const root = document.createElement("div");

        const block1 = document.createElement("div");
        block1.setAttribute("data-block", "true");
        root.appendChild(block1);

        const block2 = document.createElement("div");
        block2.setAttribute("data-block", "true");
        root.appendChild(block2);

        const offset = getModelOffset(root, root, 1);
        expect(offset).toBe(-1);
    });
});
