import Delta from "quill-delta";
import parseHTML from "../parseHTML";

describe("parseHTML()", () => {
  test("unordered-list", () => {
    const actual = parseHTML(
      "<ul>" + "<li>first</li>" + "<li>second</li>" + "<li>third</li>" + "</ul>"
    );
    const expected = new Delta()
      .insert("first")
      .insert("\n", { type: "unordered-list-item" })
      .insert("second")
      .insert("\n", { type: "unordered-list-item" })
      .insert("third")
      .insert("\n", { type: "unordered-list-item" });
    expect(actual).toEqual(expected);
  });

  test("ordered-list", () => {
    const actual = parseHTML(
      "<ol>" + "<li>first</li>" + "<li>second</li>" + "<li>third</li>" + "</ol>"
    );
    const expected = new Delta()
      .insert("first")
      .insert("\n", { type: "ordered-list-item" })
      .insert("second")
      .insert("\n", { type: "ordered-list-item" })
      .insert("third")
      .insert("\n", { type: "ordered-list-item" });
    expect(actual).toEqual(expected);
  });

  test("code - br", () => {
    const actual = parseHTML("<pre>first<br>second<br>third<br></pre>");
    const expected = new Delta()
      .insert("first")
      .insert("\n", { type: "code" })
      .insert("second")
      .insert("\n", { type: "code" })
      .insert("third")
      .insert("\n", { type: "code" });
    expect(actual).toEqual(expected);
  });

  test("code - div", () => {
    const actual = parseHTML(
      "<pre>" +
        "<div>first</div>" +
        "<div>second</div>" +
        "<div>third</div>" +
        "</pre>"
    );
    const expected = new Delta()
      .insert("first")
      .insert("\n", { type: "code" })
      .insert("second")
      .insert("\n", { type: "code" })
      .insert("third")
      .insert("\n", { type: "code" });
    expect(actual).toEqual(expected);
  });

  test("heading-one", () => {
    const actual = parseHTML("<h1>aaa</h1>");
    const expected = new Delta()
      .insert("aaa")
      .insert("\n", { type: "heading-one" });
    expect(actual).toEqual(expected);
  });

  test("heading-two", () => {
    const actual = parseHTML("<h2>aaa</h2>");
    const expected = new Delta()
      .insert("aaa")
      .insert("\n", { type: "heading-two" });
    expect(actual).toEqual(expected);
  });

  test("heading-three", () => {
    const actual = parseHTML("<h3>aaa</h3>");
    const expected = new Delta()
      .insert("aaa")
      .insert("\n", { type: "heading-three" });
    expect(actual).toEqual(expected);
  });

  test("heading-four", () => {
    const actual = parseHTML("<h4>aaa</h4>");
    const expected = new Delta()
      .insert("aaa")
      .insert("\n", { type: "heading-four" });
    expect(actual).toEqual(expected);
  });

  test("heading-five", () => {
    const actual = parseHTML("<h5>aaa</h5>");
    const expected = new Delta()
      .insert("aaa")
      .insert("\n", { type: "heading-five" });
    expect(actual).toEqual(expected);
  });

  test("heading-six", () => {
    const actual = parseHTML("<h6>aaa</h6>");
    const expected = new Delta()
      .insert("aaa")
      .insert("\n", { type: "heading-six" });
    expect(actual).toEqual(expected);
  });

  test("paragraph", () => {
    const actual = parseHTML("<p>aaa</p>");
    const expected = new Delta()
      .insert("aaa")
      .insert("\n", { type: "paragraph" });
    expect(actual).toEqual(expected);
  });

  test("blockquote", () => {
    const actual = parseHTML("<blockquote>aaa</blockquote>");
    const expected = new Delta()
      .insert("aaa")
      .insert("\n", { type: "blockquote" });
    expect(actual).toEqual(expected);
  });

  test("link", () => {
    const actual = parseHTML('<a href="http://foo.bar">aaa</a>');
    const expected = new Delta().insert("aaa", { link: "http://foo.bar" });
    expect(actual).toEqual(expected);
  });

  test("bold", () => {
    const actual = parseHTML("<b>aaa</b>");
    const expected = new Delta().insert("aaa", { bold: true });
    expect(actual).toEqual(expected);
  });

  test("italic", () => {
    const actual = parseHTML("<i>aaa</i>");
    const expected = new Delta().insert("aaa", { italic: true });
    expect(actual).toEqual(expected);
  });

  test("underline", () => {
    const actual = parseHTML("<u>aaa</u>");
    const expected = new Delta().insert("aaa", { underline: true });
    expect(actual).toEqual(expected);
  });

  test("code", () => {
    const actual = parseHTML("<code>aaa</code>");
    const expected = new Delta().insert("aaa", { code: true });
    expect(actual).toEqual(expected);
  });

  test("text", () => {
    const actual = parseHTML("aaa");
    const expected = new Delta().insert("aaa");
    expect(actual).toEqual(expected);
  });

  test("align", () => {
    const actual = parseHTML('<p class="ed-align-left"></p>');
    const expected = new Delta().insert("\n", {
      type: "paragraph",
      align: "left"
    });
    expect(actual).toEqual(expected);
  });

  test("indent", () => {
    const actual = parseHTML('<p class="ed-indent-1"></p>');
    const expected = new Delta().insert("\n", { type: "paragraph", indent: 1 });
    expect(actual).toEqual(expected);
  });

  test("anchor", () => {
    const actual = parseHTML('<span class="ed-anchor-foo">aaa</span>');
    const expected = new Delta().insert("aaa", { anchor: "foo" });
    expect(actual).toEqual(expected);
  });

  test("block-image", () => {
    const actual = parseHTML(
      "<figure>" +
        '<img src="foo.png" alt="bar" />' +
        "<figcaption>baz</figcaption>" +
        "</figure>"
    );
    const expected = new Delta().insert(
      { "block-image": "foo.png" },
      { alt: "bar", caption: "baz" }
    );
    expect(actual).toEqual(expected);
  });

  test("inline-image", () => {
    const actual = parseHTML('<img src="foo.png" alt="bar" />');
    const expected = new Delta().insert(
      { "inline-image": "foo.png" },
      { alt: "bar" }
    );
    expect(actual).toEqual(expected);
  });

  test("parse a custome node", () => {
    const tokenizeNode = node => {
      if (node.nodeName === "S") {
        return [{ inline: { strikethrough: true } }];
      }
    };
    const actual = parseHTML("<s>aaa</s>", tokenizeNode);
    const expected = new Delta().insert("aaa", { strikethrough: true });
    expect(actual).toEqual(expected);
  });

  test("ignore a node", () => {
    const tokenizeNode = node => {
      if (node.nodeName === "S") {
        return null;
      }
    };
    const actual = parseHTML("<span><s>aaa</s>bbb</span>", tokenizeNode);
    const expected = new Delta().insert("bbb");
    expect(actual).toEqual(expected);
  });
});
