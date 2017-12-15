import React, { PureComponent } from "react";
import ReactDOM from "react-dom";
import {
  Editor,
  Schema,
  DocumentBuilder,
  Value,
  tokenizeNode
} from "../../src/SquaDocEditor";

function BlockImage(props) {
  const { node } = props;
  return (
    <figure>
      <img src={node.value["block-image"]} alt={node.getMark("alt")} />
      <figcaption>{node.getMark("caption")}</figcaption>
    </figure>
  );
}

function InlineImage(props) {
  const { node } = props;
  return <img src={node.value["inline-image"]} alt={node.getMark("alt")} />;
}

const schema = new Schema({
  block: {
    marks: ["type"],
    embeds: ["block-image"]
  },
  inline: {
    marks: ["bold", "italic"],
    embeds: ["inline-image"]
  },
  "block-image": {
    marks: ["alt", "caption"]
  },
  "inline-image": {
    marks: ["alt"]
  }
});

function renderWrapper(node) {
  switch (node.type) {
    case "unordered-list-item":
      return { component: "ul" };

    case "ordered-list-item":
      return { component: "ol" };

    default:
      return {};
  }
}

function renderBlock(node) {
  switch (node.type) {
    case "heading-one":
      return { component: "h1" };

    case "heading-two":
      return { component: "h2" };

    case "paragraph":
      return { component: "p" };

    case "unordered-list-item":
      return { component: "li" };

    case "ordered-list-item":
      return { component: "li" };

    default:
      return {};
  }
}

function renderEmbed(node) {
  switch (node.type) {
    case "block-image":
      return { component: BlockImage, props: { node } };

    case "inline-image":
      return { component: InlineImage, props: { node } };

    default:
      return {};
  }
}

function renderMark(mark) {
  switch (mark.type) {
    case "bold":
      return { component: "b" };

    case "italic":
      return { component: "i" };

    default:
      return {};
  }
}

const doc = new DocumentBuilder(schema)
  .insert("Heading level one")
  .insert("\n", { type: "heading-one" })
  .insert("Heading level two")
  .insert("\n", { type: "heading-two" })
  .insert(
    { "block-image": "http://mirtchovski.com/p9/plan9-guru.gif" },
    { alt: "Plan 9", caption: "Plan 9" }
  )
  .insert("Lorem ipsum dolor sit amet, ")
  .insert("consectetur", { bold: true })
  .insert(" ")
  .insert("adipiscing", { italic: true })
  .insert(" elit. ")
  .insert(
    { "inline-image": "http://9p.io/plan9/img/9logo.jpg" },
    { alt: "Plan 9" }
  )
  .insert(" ")
  .insert("Mauris enim quam, semper eu ex id, consectetur vulputate elit. ")
  .insert("Suspendisse molestie vel arcu et euismod. ")
  .insert(
    "Sed tincidunt, erat vel convallis finibus, ante purus tempus purus, at suscipit nisl ex vel magna."
  )
  .insert("\n", { type: "paragraph" })
  .insert("Unordered list item 1")
  .insert("\n", { type: "unordered-list-item" })
  .insert("Unordered list item 2")
  .insert("\n", { type: "unordered-list-item" })
  .insert("Unordered list item 3")
  .insert("\n", { type: "unordered-list-item" })
  .insert("Ordered list item 1")
  .insert("\n", { type: "ordered-list-item" })
  .insert("Ordered list item 2")
  .insert("\n", { type: "ordered-list-item" })
  .insert("Ordered list item 3")
  .insert("\n", { type: "ordered-list-item" })
  .insert("Donec at lacus sed eros cursus tincidunt. ")
  .insert("Pellentesque ac convallis turpis, ut tincidunt nisi. ")
  .insert("Suspendisse rutrum auctor tellus, in lobortis erat dapibus et. ")
  .insert("Aliquam ac sem tellus. ")
  .insert(
    "Integer pretium sapien et dui pellentesque, vitae ultrices neque placerat. "
  )
  .insert("Ut tempus nibh neque, et dapibus magna venenatis ac. ")
  .insert("Nulla scelerisque non ligula et varius. ")
  .insert("Etiam condimentum in purus sit amet auctor. ")
  .insert("In eros est, posuere nec erat ac, feugiat pretium metus. ")
  .insert("Nunc nec ultrices risus. ")
  .insert("Fusce eu nulla ante. ")
  .insert("Vivamus in faucibus felis.")
  .insert("\n", { type: "paragraph" })
  .build();

const value = Value.create({
  document: doc
});

class App extends PureComponent {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.state = { value };
  }

  onChange(change) {
    // eslint-disable-next-line no-console
    console.log(change);

    const { value } = change;
    this.setState({ value });
  }

  render() {
    const { value } = this.state;
    return (
      <Editor
        value={value}
        renderWrapper={renderWrapper}
        renderBlock={renderBlock}
        renderEmbed={renderEmbed}
        renderMark={renderMark}
        tokenizeNode={tokenizeNode}
        onChange={this.onChange}
      />
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
