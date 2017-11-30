import parseHTML from "../parseHTML";
import tokenizeNode from "../tokenizeNode";

describe("parseHTML", () => {
  test("unordered-list", () => {
    const actual = parseHTML(
      "<ul>" +
        "<li>first</li>" +
        "<li>second</li>" +
        "<li>third</li>" +
        "</ul>",
      tokenizeNode
    );
    const expected = [
      { insert: "first", attributes: {} },
      { insert: "\n", attributes: { type: "unordered-list-item" } },
      { insert: "second", attributes: {} },
      { insert: "\n", attributes: { type: "unordered-list-item" } },
      { insert: "third", attributes: {} },
      { insert: "\n", attributes: { type: "unordered-list-item" } }
    ];
    expect(actual).toEqual(expected);
  });

  test("ordered-list", () => {
    const actual = parseHTML(
      "<ol>" +
        "<li>first</li>" +
        "<li>second</li>" +
        "<li>third</li>" +
        "</ol>",
      tokenizeNode
    );
    const expected = [
      { insert: "first", attributes: {} },
      { insert: "\n", attributes: { type: "ordered-list-item" } },
      { insert: "second", attributes: {} },
      { insert: "\n", attributes: { type: "ordered-list-item" } },
      { insert: "third", attributes: {} },
      { insert: "\n", attributes: { type: "ordered-list-item" } }
    ];
    expect(actual).toEqual(expected);
  });

  test("code - br", () => {
    const actual = parseHTML(
      "<pre>first<br>second<br>third<br></pre>",
      tokenizeNode
    );
    const expected = [
      { insert: "first", attributes: {} },
      { insert: "\n", attributes: { type: "code" } },
      { insert: "second", attributes: {} },
      { insert: "\n", attributes: { type: "code" } },
      { insert: "third", attributes: {} },
      { insert: "\n", attributes: { type: "code" } }
    ];
    expect(actual).toEqual(expected);
  });

  test("code - div", () => {
    const actual = parseHTML(
      "<pre>" +
        "<div>first</div>" +
        "<div>second</div>" +
        "<div>third</div>" +
        "</pre>",
      tokenizeNode
    );
    const expected = [
      { insert: "first", attributes: {} },
      { insert: "\n", attributes: { type: "code" } },
      { insert: "second", attributes: {} },
      { insert: "\n", attributes: { type: "code" } },
      { insert: "third", attributes: {} },
      { insert: "\n", attributes: { type: "code" } }
    ];
    expect(actual).toEqual(expected);
  });

  test("heading-one", () => {
    const actual = parseHTML("<h1>aaa</h1>", tokenizeNode);
    const expected = [
      { insert: "aaa", attributes: {} },
      { insert: "\n", attributes: { type: "heading-one" } }
    ];
    expect(actual).toEqual(expected);
  });

  test("heading-two", () => {
    const actual = parseHTML("<h2>aaa</h2>", tokenizeNode);
    const expected = [
      { insert: "aaa", attributes: {} },
      { insert: "\n", attributes: { type: "heading-two" } }
    ];
    expect(actual).toEqual(expected);
  });

  test("heading-three", () => {
    const actual = parseHTML("<h3>aaa</h3>", tokenizeNode);
    const expected = [
      { insert: "aaa", attributes: {} },
      { insert: "\n", attributes: { type: "heading-three" } }
    ];
    expect(actual).toEqual(expected);
  });

  test("heading-four", () => {
    const actual = parseHTML("<h4>aaa</h4>", tokenizeNode);
    const expected = [
      { insert: "aaa", attributes: {} },
      { insert: "\n", attributes: { type: "heading-four" } }
    ];
    expect(actual).toEqual(expected);
  });

  test("heading-five", () => {
    const actual = parseHTML("<h5>aaa</h5>", tokenizeNode);
    const expected = [
      { insert: "aaa", attributes: {} },
      { insert: "\n", attributes: { type: "heading-five" } }
    ];
    expect(actual).toEqual(expected);
  });

  test("heading-six", () => {
    const actual = parseHTML("<h6>aaa</h6>", tokenizeNode);
    const expected = [
      { insert: "aaa", attributes: {} },
      { insert: "\n", attributes: { type: "heading-six" } }
    ];
    expect(actual).toEqual(expected);
  });

  test("paragraph", () => {
    const actual = parseHTML("<p>aaa</p>", tokenizeNode);
    const expected = [
      { insert: "aaa", attributes: {} },
      { insert: "\n", attributes: { type: "paragraph" } }
    ];
    expect(actual).toEqual(expected);
  });

  test("blockquote", () => {
    const actual = parseHTML("<blockquote>aaa</blockquote>", tokenizeNode);
    const expected = [
      { insert: "aaa", attributes: {} },
      { insert: "\n", attributes: { type: "blockquote" } }
    ];
    expect(actual).toEqual(expected);
  });

  test("link", () => {
    const actual = parseHTML('<a href="http://foo.bar">aaa</a>', tokenizeNode);
    const expected = [
      { insert: "aaa", attributes: { link: "http://foo.bar" } }
    ];
    expect(actual).toEqual(expected);
  });

  test("bold", () => {
    const actual = parseHTML("<b>aaa</b>", tokenizeNode);
    const expected = [{ insert: "aaa", attributes: { bold: true } }];
    expect(actual).toEqual(expected);
  });

  test("italic", () => {
    const actual = parseHTML("<i>aaa</i>", tokenizeNode);
    const expected = [{ insert: "aaa", attributes: { italic: true } }];
    expect(actual).toEqual(expected);
  });

  test("underline", () => {
    const actual = parseHTML("<u>aaa</u>", tokenizeNode);
    const expected = [{ insert: "aaa", attributes: { underline: true } }];
    expect(actual).toEqual(expected);
  });

  test("code", () => {
    const actual = parseHTML("<code>aaa</code>", tokenizeNode);
    const expected = [{ insert: "aaa", attributes: { code: true } }];
    expect(actual).toEqual(expected);
  });

  test("text", () => {
    const actual = parseHTML("aaa", tokenizeNode);
    const expected = [{ insert: "aaa", attributes: {} }];
    expect(actual).toEqual(expected);
  });

  test("align", () => {
    const actual = parseHTML('<p class="ed-align-left"></p>', tokenizeNode);
    const expected = [
      { insert: "\n", attributes: { type: "paragraph", align: "left" } }
    ];
    expect(actual).toEqual(expected);
  });

  test("indent", () => {
    const actual = parseHTML('<p class="ed-indent-1"></p>', tokenizeNode);
    const expected = [
      { insert: "\n", attributes: { type: "paragraph", indent: 1 } }
    ];
    expect(actual).toEqual(expected);
  });

  test("anchor", () => {
    const actual = parseHTML(
      '<span class="ed-anchor-foo">aaa</span>',
      tokenizeNode
    );
    const expected = [{ insert: "aaa", attributes: { anchor: "foo" } }];
    expect(actual).toEqual(expected);
  });

  test("block-image", () => {
    const actual = parseHTML(
      "<figure>" +
        '<img src="foo.png" alt="bar" />' +
        "<figcaption>baz</figcaption>" +
        "</figure>",
      tokenizeNode
    );
    const expected = [
      {
        insert: { "block-image": "foo.png" },
        attributes: { alt: "bar", caption: "baz" }
      }
    ];
    expect(actual).toEqual(expected);
  });

  test("inline-image", () => {
    const actual = parseHTML('<img src="foo.png" alt="bar" />', tokenizeNode);
    const expected = [
      {
        insert: { "inline-image": "foo.png" },
        attributes: { alt: "bar" }
      }
    ];
    expect(actual).toEqual(expected);
  });
});
