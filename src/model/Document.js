"use strict";

import Style from "./Style";
import Embed from "./Embed";
import Block, { EOL } from "./Block";
import findNodeAt from "./findNodeAt";

export default class Document {
  static create(props = {}) {
    const { schema, children = [] } = props;
    return new Document(schema, "", children);
  }

  constructor(schema, key, children) {
    this.schema = schema;
    this.key = key;
    this.children = children;
  }

  get length() {
    return this.children.reduce((length, child) => length + child.length, 0);
  }

  get text() {
    return this.children.reduce((text, child) => text + child.text, "");
  }

  toJSON() {
    return {
      children: this.children.map(child => child.toJSON())
    };
  }

  setKey(key) {
    return new Document(this.schema, key, this.children);
  }

  setChildren(children) {
    return new Document(this.schema, this.key, children);
  }

  formatAt(offset, length, attributes) {
    let node = this;

    const startPos = findNodeAt(node.children, offset, true);

    if (!startPos) {
      return node;
    }

    const endPos = findNodeAt(node.children, offset + length, true);

    if (!endPos) {
      return node;
    }

    const startChild = node.children[startPos.index];
    const endChild = node.children[endPos.index];

    let fragment = [];

    if (startPos.index === endPos.index) {
      // format a range in the child
      fragment.push(
        startChild.formatAt(
          startPos.offset,
          endPos.offset - startPos.offset,
          attributes
        )
      );
    } else {
      if (startPos.offset < startChild.length) {
        // format a range in the start child
        fragment.push(
          startChild.formatAt(
            startPos.offset,
            startChild.length - startPos.offset,
            attributes
          )
        );
      } else {
        // keep the start child without formatting
        fragment.push(startChild);
      }

      // format every children between the start child and the end child
      node.children.slice(startPos.index + 1, endPos.index).forEach(child => {
        fragment.push(child.formatAt(0, child.length, attributes));
      });

      // format a range in the end child
      fragment.push(endChild.formatAt(0, endPos.offset, attributes));
    }

    fragment = fragment.map(child => child.normalize());

    const children = node.children
      .slice(0, startPos.index)
      .concat(fragment)
      .concat(node.children.slice(endPos.index + 1));

    node = node.setChildren(children);

    return node;
  }

  insertAt(offset, value, attributes) {
    let node = this;

    const pos = findNodeAt(node.children, offset, false);

    if (!pos) {
      return node;
    }

    // insert text
    if (typeof value === "string") {
      let fragment = [];

      let { offset } = pos;
      let child = node.children[pos.index];

      const lines = value.split(EOL);
      let line = lines.shift();

      if (line.length) {
        child = child.insertAt(offset, line, attributes);
      }

      while (lines.length) {
        offset += line.length;

        const leftSlice = child
          .deleteAt(offset, child.length - 1 - offset)
          .setStyle(Style.create())
          .format(attributes);

        fragment.push(leftSlice);

        child = child.deleteAt(0, offset);

        offset = 0;

        line = lines.shift();

        if (line.length) {
          child = child.insertAt(offset, line, attributes);
        }
      }

      fragment.push(child);

      fragment = fragment.map(child => child.normalize());

      const children = node.children
        .slice(0, pos.index)
        .concat(fragment)
        .concat(node.children.slice(pos.index + 1));

      node = node.setChildren(children);
    } else {
      const embedType = Object.keys(value)[0];

      // insert block embed
      if (node.schema.isBlockEmbed(embedType)) {
        if (pos.offset === 0) {
          let newChild = Embed.create({
            schema: node.schema,
            type: embedType,
            value: value[embedType]
          });

          newChild = newChild.format(attributes);

          const children = node.children
            .slice(0, pos.index)
            .concat(newChild)
            .concat(node.children.slice(pos.index));

          node = node.setChildren(children);
        }

        // insert inline embed
      } else if (node.schema.isInlineEmbed(embedType)) {
        const child = node.children[pos.index];

        const children = node.children
          .slice(0, pos.index)
          .concat(child.insertAt(pos.offset, value, attributes).normalize())
          .concat(node.children.slice(pos.index + 1));

        node = node.setChildren(children);
      }
    }

    return node;
  }

  deleteAt(offset, length) {
    let node = this;

    const startPos = findNodeAt(node.children, offset, false);

    if (!startPos) {
      return node;
    }

    const endPos = findNodeAt(node.children, offset + length, false);

    if (!endPos) {
      return node;
    }

    let fragment = [];

    if (startPos.index === endPos.index) {
      const child = node.children[startPos.index];

      // delete a range from the child
      fragment.push(
        child.deleteAt(startPos.offset, endPos.offset - startPos.offset)
      );
    } else {
      const startChild = node.children[startPos.index];
      const endChild = node.children[endPos.index];

      if (startPos.offset > 0) {
        if (endChild instanceof Block) {
          // delete a range from the start child,
          // delete a range from the end child,
          // merge the start child and the end child
          fragment.push(
            startChild
              .deleteAt(
                startPos.offset,
                startChild.length - startPos.offset - 1
              )
              .concat(endChild.deleteAt(0, endPos.offset))
          );
        } else {
          // delete range from the start child,
          // delete the end child to compensate for the length of the
          // start child
          fragment.push(
            startChild.deleteAt(
              startPos.offset,
              startChild.length - startPos.offset - 1
            )
          );
        }
      } else {
        if (endPos.offset === 0) {
          // keep the end child
          fragment.push(endChild);
        } else if (endPos.offset < endChild.length) {
          // delete a range from the end child
          fragment.push(endChild.deleteAt(0, endPos.offset));
        }
      }
    }

    fragment = fragment.map(child => child.normalize());

    const children = node.children
      .slice(0, startPos.index)
      .concat(fragment)
      .concat(node.children.slice(endPos.index + 1));

    node = node.setChildren(children);

    return node;
  }
}
