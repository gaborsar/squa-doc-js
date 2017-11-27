# API Documentation

## Model

### Schema

 * [`constructor`](#constructor)
 * [`isBlockEmbed`](#isblockembed)
 * [`isInlineEmbed`](#isinlineembed)
 * [`isBlockMark`](#isblockmark)
 * [`isInlineMark`](#isinlinemark)
 * [`isEmbedMark`](#isembedmark)

#### constructor()

Creates an new schema object.

##### Parameters

 * `rules`
 
##### Example

```JavaScript
const schema = new Schema({
  block: {
    marks: ["type", "align", "indent"],
    embeds: ["block-image"]
  },
  inline: {
    marks: ["bold", "italic", "underline"],
    embeds: ["inline-image"]
  },
  "block-image": {
    marks: ["width", "alt"]
  },
  "inline-image": {
    marks: ["alt"]
  }
});
```

#### isBlockEmbed()

Returns true if the given type is a block level embed type, false otherwise.

##### Parameters

 * `embedType`

##### Example
 
```JavaScript
// => true
schema.isBlockEmbed('block-image');

// => false
schema.isBlockEmbed('inline-image');
```

#### isInlineEmbed()

Returns true if the given type is an inline level embed type, false otherwise.

##### Parameters

 * `embedType`

##### Example
 
```JavaScript
// => true
schema.isInlineEmbed('inline-image');

// => false
schema.isInlineEmbed('block-image');
```

#### isBlockMark()

Returns true if the given mark type is a block level mark type, false otherwise.

##### Parameters

 * `markType`
 
##### Example
  
```JavaScript
// => true
schema.isBlockMark('indent');

// => false
schema.isBlockMark('bold');
```

#### isInlineMark()

Returns true if the given mark type is an inline level mark type, false
otherwise.

##### Parameters

 * `markType`
 
##### Example
  
```JavaScript
// => true
schema.isInlineMark('bold');

// => false
schema.isInlineMark('indent');
```

#### isEmbedMark()

Returns true if the given mark type is an embed mark type.

##### Parameters

 * `embedType`
 * `markType`
 
##### Example
  
```JavaScript
// => true
schema.isEmbedMark('block-image', 'width');
schema.isEmbedMark('block-image', 'align');

// => false
schema.isInlineMark('block-image', 'bold');
```