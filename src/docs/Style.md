# API Documentation

## Model

### Schema

 * [`create`](#create)
 * [`update`](#update)
 * [`equals`](#equals)

#### create()

Creates a new (pooled) style object.

##### Parameters

 * `props`
 * `props.marks`

##### Example

```JavaScript
const style = Style.create({
  marks: [
    Mark.create({
      type: "bold",
      value: true
    })
  ] 
});
```

#### update()

Updates the style with the given attributes object.

##### Parameters

 * `attributes`

##### Example

```JavaScript
const updatedStyle = style.update({
  bold: null,
  italic: true
});
```

#### equals()

Returns true if the given style equals to the style, false otherwise.

##### Parameters

 * `other`

##### Example

```JavaScript
const styleA = Style.create({}).update({
  bold: true
});

const styleB = Style.create({}).update({
  bold: true
});

const styleC = Style.create({}).update({
  italic: true
});

// => true
styleA.equals(styleB);

// => false
styleA.equals(styleC);
```