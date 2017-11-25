# SquaDoc Editor

## Model

```
class Schema {
  rules: Object;
  
  constructor(rules: Object);
  
  isInlineEmbed(embedType: string): boolean;
  isBlockEmbed(embedType: string): boolean;
  isInlineMark(markType: string): boolean;
  isBlockMark(markType: string): boolean;
  isEmbedMark(embedType: string, markType: string): boolean;
}
```

```
class Mark {
  static create(props: Object): Mark;
  static compare(markA: Mark, markB: Mark): number;
  
  type: string;
  value: any;
  
  constructor(type: string, value: any);
  equals(other: Mark): boolean;
}
```

```
class Style {
  static create(props: Object): Style;
  
  marks: Mark[];
  
  constructor(marks: Mark[]);
  format(attributes: Object): Style;
  equals(other: Style): boolean;
}
```

```
class Text {
  static create(props: Object): Text;
  
  schema: Schema;
  key: string;
  style: Style;
  value: string;
  
  length: number;
  text: string;
  
  constructor(schema: Schema, style: Style, key: string, value: string);
  setKey(key: string): Text;
  setStyle(style: Style): Text;
  setValue(value: string): Text;
  regenerateKey(): Text;
  format(attributes: Object): Text;
  slice(startOffset: number, endOffset: number): Text;
  concat(other: Text): Text;
}
```

```
class Embed {
  static create(props: Object): Embed;
  static type(value: Object): string;
  
  schema: Schema;
  key: string;
  style: Style;
  value: Object;
  
  type: string;
  length: number;
  text: string;
  
  constructor(schema: Schema, key: string, style: Style, value: Object);
  setStyle(style: Style): Embed;
  setValue(value: Object): Embed;
  format(attributes: Object): Embed;
  formatAt(offset: number, length: number, attributes: Object): Embed;
  normalize(): Embed;
}
```

```
class Position {
  static create(nodes: Node, offset: number, inclusive: boolean): Position;
  
  node: Node|null;
  index: number;
  offset: number;
  
  constructor(node: Node|null, index: number, offset: number);
}
```

```
class Block {
  static create(props: Object): Block;
  
  schema: Schema;
  key: string;
  style: Style;
  children: (Text|Embed)[];
  
  length: number;
  text: string;
  
  setKey(key: string): Block;
  setStyle(style: Style): Block;
  setChildren(children: (Text|Embed)[]): Block;
  regenerateKey(): Block;
  clearStyle(): Block;
  createPosition(offset: number, inclusive: boolean): Position;
  format(attributes: Object): Block;
  formatAt(offset: number, length: number, attributes: Object): Block;
  insertAt(offset: number, value: string|Object, attributes: Object): Block;
  deleteAt(offset: number, length: number): Block;
  normalize(): Block;
  slice(startOffset: number, endOffset: number): Block;
  concat(other: Block): Block;
}
```

```
class Document {
  static create(props: Object): Document;
  
  schema: Schema;
  key: string;
  children: (Block|Embed)[];
  
  length: number;
  text: string;
  
  setChildren(children: (Block|Embed)[]): Document;
  createPosition(offset: number, inclusive: boolean): Position;
  formatAt(offset: number, length: number, attributes: Object): Document;
  insertAt(offset: number, value: string|Object, attributes: Object): Document;
  deleteAt(offset: number, length: number): Document;
}
```

## TODO

 - [ ] `getFormat(document, offset, length)`
 - [ ] `getBlockFormat(document, offset, length)`
 - [ ] `getBlockFormatByKey(document, blockKey)`
 - [ ] `getInlineFormat(document, offset, length)`
 - [ ] `getInlineFormatByKey(document, blockKey, inlineKey)`
 - [ ] `format(document, offset, length, attributes)`
 - [ ] `formatBlock(document, offset, length, attributes)`
 - [ ] `formatBlockBykey(document, blockKey, attributes)`
 - [ ] `formatInline(document, offset, length, attributes)`
 - [ ] `formatInlineByKey(document, blockKey, inlineKey, attributes)`
 - [ ] `formatIndent(document, offset, length)`
 - [ ] `formatOutdent(document, offset, length)`
 - [ ] `formatBold(document, offset, length)`
 - [ ] `formatItalic(document, offset, length)`
 - [ ] `insertText(document, offset, value, attributes)`
 - [ ] `insertEmbed(document, offset, value, attributes)`
 - [ ] `insertFragment(document, offset, fragment)`
 - [ ] `deleteCharacterBackward(document, offset)`
 - [ ] `deleteCharacterForward(document, offset)`
 - [ ] `deleteWordBackward(document, offset)`
 - [ ] `deleteWordForward(document, offset)`
 - [ ] `deleteBlockBackward(document, offset)`
 - [ ] `deleteBlockForward(document, offset)`
 - [ ] `deleteBlockByKey(document, offset)`
 - [ ] `deleteInlineByKey(document, offset)`
