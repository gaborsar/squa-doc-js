# SquaDoc Editor

## TODO

 - [x] Schema integration
       - [x] Text
       - [x] Embed
       - [x] Block
       - [x] Document
 - [x] Block normalization integration
 - [x] Mark tests
 - [x] Schema tests
 - [x] EOL insertion
 - [x] Insert unknown embed into a block

 - [x] Text.create(props)
 - [x] text.length()
 - [x] text.text()
 - [x] text.slice(startOffset, endOffset)
 - [x] text.getFormat()
 - [x] text.format(attributes)
 - [x] text.concat(other)

 - [x] Embed.create(props)
 - [x] embed.length()
 - [x] embed.text()
 - [x] embed.getFormat()
 - [x] embed.format(attributes)
 - [x] embed.formatAt(offset, length, attributes)
 - [x] embed.normalize()

 - [x] Block.create(props)
 - [x] block.length()
 - [x] block.text()
 - [x] block.getFormat()
 - [x] block.format(attributes)
 - [x] block.formatAt(offset, length, attributes)
 - [x] block.insertAt(offset, value, attributes)
 - [x] block.deleteAt(offset, length)
 - [x] block.concat(other)
 - [x] block.normalize()

 - [x] Document.create(props)
 - [x] document.length()
 - [x] document.text()
 - [x] document.formatAt(offset, length, attributes)
 - [x] document.insertAt(offset, value, attributes, schema)
 - [x] document.deleteAt(offset, length)
 - [ ] document.apply(delta)

 - [ ] getFormat(document, offset, length)
 - [ ] getBlockFormat(document, offset, length)
 - [ ] getBlockFormatByKey(document, blockKey)
 - [ ] getInlineFormat(document, offset, length)
 - [ ] getInlineFormatByKey(document, blockKey, inlineKey)
 - [ ] format(document, offset, length, attributes)
 - [ ] formatBlock(document, offset, length, attributes)
 - [ ] formatBlockBykey(document, blockKey, attributes)
 - [ ] formatInline(document, offset, length, attributes)
 - [ ] formatInlineByKey(document, blockKey, inlineKey, attributes)
 - [ ] formatIndent(document, offset, length)
 - [ ] formatOutdent(document, offset, length)
 - [ ] formatBold(document, offset, length)
 - [ ] formatItalic(document, offset, length)
 - [ ] insertText(document, offset, value, attributes)
 - [ ] insertEmbed(document, offset, value, attributes)
 - [ ] insertFragment(document, offset, fragment)
 - [ ] deleteCharacterBackward(document, offset)
 - [ ] deleteCharacterForwrad(document, offset)
 - [ ] deleteWordBackward(document, offset)
 - [ ] deleteWordForward(document, offset)
 - [ ] deleteBlockBackward(document, offset)
 - [ ] deleteBlockForward(document, offset)
 - [ ] deleteBlockByKey(document, offset)
 - [ ] deleteInlineByKey(document, offset)
