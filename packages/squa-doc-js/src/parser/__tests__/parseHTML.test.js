import Delta from "quill-delta";
import SpecialCharacter from "../../model/SpecialCharacter";
import parseHTML from "../parseHTML";
import tokenizeNode from "../../defaults/tokenizeNode";
import tokenizeClassName from "../../defaults/tokenizeClassName";

describe("parseHTML()", () => {
    test("table", () => {
        // ╔════════════════╦════════╗
        // ║ first          ║        ║
        // ╠═══════╦════════╣ second ║
        // ║ third ║ fourth ║        ║
        // ╚═══════╩════════╩════════╝
        const actual = parseHTML(
            "<table>" +
                "<thead>" +
                "<tr>" +
                '<th colspan="2"><p>first</p></th>' +
                '<th rowspan="2"><p>second</p></th>' +
                "</tr>" +
                "</thead>" +
                "<tbody>" +
                "<tr>" +
                "<th><p>third</p></th>" +
                "<th><p>fourth</p></th>" +
                "</tr>" +
                "</tbody>" +
                "</table>",
            tokenizeNode,
            tokenizeClassName
        );
        const expected = new Delta()
            .insert(SpecialCharacter.TableStart)
            .insert(SpecialCharacter.RowStart)
            .insert(SpecialCharacter.CellStart, { colspan: 2 })
            .insert("first")
            .insert(SpecialCharacter.BlockEnd, { type: "paragraph" })
            .insert(SpecialCharacter.CellStart, { rowspan: 2 })
            .insert("second")
            .insert(SpecialCharacter.BlockEnd, { type: "paragraph" })
            .insert(SpecialCharacter.RowStart)
            .insert(SpecialCharacter.CellStart)
            .insert("third")
            .insert(SpecialCharacter.BlockEnd, { type: "paragraph" })
            .insert(SpecialCharacter.CellStart)
            .insert("fourth")
            .insert(SpecialCharacter.BlockEnd, { type: "paragraph" })
            .insert(SpecialCharacter.TableEnd);
        expect(actual).toEqual(expected);
    });

    test("unordered-list", () => {
        const actual = parseHTML(
            "<ul>" +
                "<li>first</li>" +
                "<li>second</li>" +
                "<li>third</li>" +
                "</ul>",
            tokenizeNode,
            tokenizeClassName
        );
        const expected = new Delta()
            .insert("first")
            .insert(SpecialCharacter.BlockEnd, { type: "unordered-list-item" })
            .insert("second")
            .insert(SpecialCharacter.BlockEnd, { type: "unordered-list-item" })
            .insert("third")
            .insert(SpecialCharacter.BlockEnd, { type: "unordered-list-item" });
        expect(actual).toEqual(expected);
    });

    test("ordered-list", () => {
        const actual = parseHTML(
            "<ol>" +
                "<li>first</li>" +
                "<li>second</li>" +
                "<li>third</li>" +
                "</ol>",
            tokenizeNode,
            tokenizeClassName
        );
        const expected = new Delta()
            .insert("first")
            .insert(SpecialCharacter.BlockEnd, { type: "ordered-list-item" })
            .insert("second")
            .insert(SpecialCharacter.BlockEnd, { type: "ordered-list-item" })
            .insert("third")
            .insert(SpecialCharacter.BlockEnd, { type: "ordered-list-item" });
        expect(actual).toEqual(expected);
    });

    test("code - br", () => {
        const actual = parseHTML(
            "<pre>first<br>second<br>third<br></pre>",
            tokenizeNode,
            tokenizeClassName
        );
        const expected = new Delta()
            .insert("first")
            .insert(SpecialCharacter.BlockEnd, { type: "code" })
            .insert("second")
            .insert(SpecialCharacter.BlockEnd, { type: "code" })
            .insert("third")
            .insert(SpecialCharacter.BlockEnd, { type: "code" });
        expect(actual).toEqual(expected);
    });

    test("code - div", () => {
        const actual = parseHTML(
            "<pre>" +
                "<div>first</div>" +
                "<div>second</div>" +
                "<div>third</div>" +
                "</pre>",
            tokenizeNode,
            tokenizeClassName
        );
        const expected = new Delta()
            .insert("first")
            .insert(SpecialCharacter.BlockEnd, { type: "code" })
            .insert("second")
            .insert(SpecialCharacter.BlockEnd, { type: "code" })
            .insert("third")
            .insert(SpecialCharacter.BlockEnd, { type: "code" });
        expect(actual).toEqual(expected);
    });

    test("heading-one", () => {
        const actual = parseHTML(
            "<h1>aaa</h1>",
            tokenizeNode,
            tokenizeClassName
        );
        const expected = new Delta()
            .insert("aaa")
            .insert(SpecialCharacter.BlockEnd, { type: "heading-one" });
        expect(actual).toEqual(expected);
    });

    test("heading-two", () => {
        const actual = parseHTML(
            "<h2>aaa</h2>",
            tokenizeNode,
            tokenizeClassName
        );
        const expected = new Delta()
            .insert("aaa")
            .insert(SpecialCharacter.BlockEnd, { type: "heading-two" });
        expect(actual).toEqual(expected);
    });

    test("heading-three", () => {
        const actual = parseHTML(
            "<h3>aaa</h3>",
            tokenizeNode,
            tokenizeClassName
        );
        const expected = new Delta()
            .insert("aaa")
            .insert(SpecialCharacter.BlockEnd, { type: "heading-three" });
        expect(actual).toEqual(expected);
    });

    test("heading-four", () => {
        const actual = parseHTML(
            "<h4>aaa</h4>",
            tokenizeNode,
            tokenizeClassName
        );
        const expected = new Delta()
            .insert("aaa")
            .insert(SpecialCharacter.BlockEnd, { type: "heading-four" });
        expect(actual).toEqual(expected);
    });

    test("heading-five", () => {
        const actual = parseHTML(
            "<h5>aaa</h5>",
            tokenizeNode,
            tokenizeClassName
        );
        const expected = new Delta()
            .insert("aaa")
            .insert(SpecialCharacter.BlockEnd, { type: "heading-five" });
        expect(actual).toEqual(expected);
    });

    test("heading-six", () => {
        const actual = parseHTML(
            "<h6>aaa</h6>",
            tokenizeNode,
            tokenizeClassName
        );
        const expected = new Delta()
            .insert("aaa")
            .insert(SpecialCharacter.BlockEnd, { type: "heading-six" });
        expect(actual).toEqual(expected);
    });

    test("paragraph", () => {
        const actual = parseHTML("<p>aaa</p>", tokenizeNode, tokenizeClassName);
        const expected = new Delta()
            .insert("aaa")
            .insert(SpecialCharacter.BlockEnd, { type: "paragraph" });
        expect(actual).toEqual(expected);
    });

    test("blockquote", () => {
        const actual = parseHTML(
            "<blockquote>aaa</blockquote>",
            tokenizeNode,
            tokenizeClassName
        );
        const expected = new Delta()
            .insert("aaa")
            .insert(SpecialCharacter.BlockEnd, { type: "blockquote" });
        expect(actual).toEqual(expected);
    });

    test("link", () => {
        const actual = parseHTML(
            '<a href="http://foo.bar">aaa</a>',
            tokenizeNode,
            tokenizeClassName
        );
        const expected = new Delta().insert("aaa", { link: "http://foo.bar" });
        expect(actual).toEqual(expected);
    });

    test("bold", () => {
        const actual = parseHTML("<b>aaa</b>", tokenizeNode, tokenizeClassName);
        const expected = new Delta().insert("aaa", { bold: true });
        expect(actual).toEqual(expected);
    });

    test("italic", () => {
        const actual = parseHTML("<i>aaa</i>", tokenizeNode, tokenizeClassName);
        const expected = new Delta().insert("aaa", { italic: true });
        expect(actual).toEqual(expected);
    });

    test("underline", () => {
        const actual = parseHTML("<u>aaa</u>", tokenizeNode, tokenizeClassName);
        const expected = new Delta().insert("aaa", { underline: true });
        expect(actual).toEqual(expected);
    });

    test("strikethrough", () => {
        const actual = parseHTML("<s>aaa</s>", tokenizeNode, tokenizeClassName);
        const expected = new Delta().insert("aaa", { strikethrough: true });
        expect(actual).toEqual(expected);
    });

    test("code", () => {
        const actual = parseHTML(
            "<code>aaa</code>",
            tokenizeNode,
            tokenizeClassName
        );
        const expected = new Delta().insert("aaa", { code: true });
        expect(actual).toEqual(expected);
    });

    test("color", () => {
        const actual = parseHTML(
            '<span class="SquaDocJs-color-red">aaa</span>',
            tokenizeNode,
            tokenizeClassName
        );
        const expected = new Delta().insert("aaa", { color: "red" });
        expect(actual).toEqual(expected);
    });

    test("align", () => {
        const actual = parseHTML(
            '<p class="SquaDocJs-align-left"></p>',
            tokenizeNode,
            tokenizeClassName
        );
        const expected = new Delta().insert(SpecialCharacter.BlockEnd, {
            type: "paragraph",
            align: "left"
        });
        expect(actual).toEqual(expected);
    });

    test("indent", () => {
        const actual = parseHTML(
            '<p class="SquaDocJs-indent-1"></p>',
            tokenizeNode,
            tokenizeClassName
        );
        const expected = new Delta().insert(SpecialCharacter.BlockEnd, {
            type: "paragraph",
            indent: 1
        });
        expect(actual).toEqual(expected);
    });

    test("anchor", () => {
        const actual = parseHTML(
            '<span class="SquaDocJs-anchor-foo">aaa</span>',
            tokenizeNode,
            tokenizeClassName
        );
        const expected = new Delta().insert("aaa", { anchor: "foo" });
        expect(actual).toEqual(expected);
    });
});
