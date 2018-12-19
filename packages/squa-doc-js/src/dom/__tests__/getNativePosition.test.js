import getNativePosition from "../getNativePosition";

describe("getNativePosition()", () => {
    test("within an embed node", () => {
        const root = document.createElement("div");

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

        const { node, offset } = getNativePosition(root, 4);
        expect(node).toBe(block2);
        expect(offset).toBe(0);
    });

    test("within an ignored node", () => {
        const root = document.createElement("div");

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

        const { node, offset } = getNativePosition(root, 4);
        expect(node).toBe(block2);
        expect(offset).toBe(1);
    });

    test("after the last node", () => {
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

        const { node, offset } = getNativePosition(root, 8);
        expect(node).toBe(root);
        expect(offset).toBe(2);
    });

    test("within a text node", () => {
        const root = document.createElement("div");

        const table = document.createElement("table");
        table.setAttribute("data-table", "true");
        root.appendChild(table);

        const tbody = document.createElement("tbody");
        table.appendChild(tbody);

        const row = document.createElement("tr");
        row.setAttribute("data-row", "true");
        table.appendChild(row);

        const cell = document.createElement("td");
        cell.setAttribute("data-cell", "true");
        row.appendChild(cell);

        const block1 = document.createElement("div");
        block1.setAttribute("data-block", "true");
        table.appendChild(block1);

        const text1 = document.createTextNode("aaa");
        block1.appendChild(text1);

        const block2 = document.createElement("div");
        block2.setAttribute("data-block", "true");
        table.appendChild(block2);

        const ignored = document.createElement("span");
        ignored.setAttribute("data-ignore", "true");
        block2.appendChild(ignored);

        const embed = document.createElement("span");
        embed.setAttribute("data-embed", "true");
        block2.appendChild(embed);

        const comment = document.createComment("foo");
        block2.appendChild(comment);

        const text2 = document.createTextNode("bbb");
        block2.appendChild(text2);

        const inline1 = document.createElement("span");
        block2.appendChild(inline1);

        const text3 = document.createTextNode("ccc");
        inline1.appendChild(text3);

        const inline2 = document.createElement("span");
        block2.appendChild(inline2);

        const text4 = document.createTextNode("ccc");
        inline2.appendChild(text4);

        const { node, offset } = getNativePosition(root, 17);
        expect(node).toBe(text4);
        expect(offset).toBe(3);
    });
});
