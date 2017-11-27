# SquaDoc Editor

## Rich Functions

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
