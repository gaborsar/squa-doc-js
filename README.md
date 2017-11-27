# SquaDoc Editor

## API Docs

### Schema
 * `constructor(rules)`
 * `isBlockEmbed(embedType)`
 * `isInlineEmbed(embedType)`
 * `isBlockMark(markType)`
 * `isInlineMark(markType)`
 * `isEmbedMark(embedType, markType)`

### Mark
 * `static create({ type, value })`
 * `static compare(markA, markB)`
 * `name`
 * `value`
 * `equals(other)`

### Style
 * `static create({ marks })`
 * `marks`
 * `equals(other)`
 * `update(attributes, predicate)`
 * `hasMark(type)`
 * `getMark(type)`

### Position
 * `static create(nodes, offset, inclusive)`
 * `node`
 * `index` - **deprecated**
 * `offset`

### RangeElement
 * `node`
 * `startOffset`
 * `endOffset`
 * `length`
 * `isPartial`

### Range
 * `elements`

### RangeBuilder
 * `constructor(nodes)`
 * `skip(length)`
 * `keep(length)`
 * `build()`

### Text
 * `static create({ schema, key, style, value })`
 * `key`
 * `style`
 * `value`
 * `length`
 * `text`
 * `setKey(key)`
 * `regenerateKey()`
 * `setValue(value)`
 * `setStyle(style)`
 * `clearStyle()`
 * `hasMark(type)`
 * `getMark(type)`
 * `format(attributes)`
 * `slice(startOffset, endOffset)`
 * `concat(other)`

### Embed
 * `static create({ schema, key, style, value })`
 * `key`
 * `style`
 * `value`
 * `length`
 * `text`
 * `setKey(key)`
 * `regenerateKey()`
 * `setValue(value)`
 * `setStyle(style)`
 * `clearStyle()`
 * `hasMark(type)`
 * `getMark(type)`
 * `format(attributes)`
 * `formatAt(startOffset, endOffset, attributes)` - **do we need this?**

### Block
 * `static create({ schema, key, style, children })`
 * `key`
 * `style`
 * `children`
 * `length`
 * `text`
 * `setKey(key)`
 * `regenerateKey()`
 * `createPosition(offset, inclusive)`
 * `createRange(startOffset, endOffset)`
 * `setChildren(children)`
 * `appendChild(child)`
 * `insertBefore(newChild, referenceChild)`
 * `removeChild(child)`
 * `replaceChild(newChild, oldChild)`
 * `getPreviousSibling(referenceChild)`
 * `getNextSibling(referenceChild)`
 * `findPreviousSibling(referenceChild, predicate)` - **TODO**
 * `findNextSibling(referenceChild, predicate)` - **TODO**
 * `setStyle(style)`
 * `clearStyle()`
 * `hasMark(type)`
 * `getMark(type)`
 * `format(attributes)`
 * `formatAt(startOffset, endOffset, attributes)`
 * `insertAt(offset, value, attributes)`
 * `deleteAt(startOffset, endOffset)`
 * `slice(startOffset, endOffset)`

### Document
 * `static create({ schema, key, children })`
 * `key`
 * `children`
 * `length`
 * `text`
 * `setKey(key)`
 * `regenerateKey()`
 * `createPosition(offset, inclusive)`
 * `createRange(startOffset, endOffset)`
 * `setChildren(children)`
 * `appendChild(child)`
 * `insertBefore(newChild, referenceChild)`
 * `removeChild(child)`
 * `replaceChild(newChild, oldChild)`
 * `getPreviousSibling(referenceChild)`
 * `getNextSibling(referenceChild)`
 * `findPreviousSibling(referenceChild, predicate)` - **TODO**
 * `findNextSibling(referenceChild, predicate)` - **TODO**
 * `formatAt(startOffset, endOffset, attributes)`
 * `insertAt(offset, value, attributes)`
 * `deleteAt(startOffset, endOffset)`

## TODO Rich Functions

 * `getFormat(document, startOffset, endOffset)`
 * `getBlockFormat(document, startOffset, endOffset)`
 * `getBlockFormatByKey(document, blockKey)`
 * `getInlineFormat(document, startOffset, endOffset)`
 * `getInlineFormatByKey(document, blockKey, inlineKey)`
 * `format(document, startOffset, endOffset, attributes)`
 * `formatBlock(document, startOffset, endOffset, attributes)`
 * `formatBlockBykey(document, blockKey, attributes)`
 * `formatInline(document, startOffset, endOffset, attributes)`
 * `formatInlineByKey(document, blockKey, inlineKey, attributes)`
 * `formatIndent(document, startOffset, endOffset)`
 * `formatOutdent(document, startOffset, endOffset)`
 * `formatBold(document, startOffset, endOffset)`
 * `formatItalic(document, startOffset, endOffset)`
 * `insertText(document, offset, value, attributes)`
 * `insertEmbed(document, offset, value, attributes)`
 * `insertFragment(document, offset, fragment)`
 * `deleteContent(document, startOffset, endOffset)`
 * `deleteBlockByKey(document, offset)`
 * `deleteInlineByKey(document, offset)`
