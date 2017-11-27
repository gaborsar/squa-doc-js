# API Documentation

## Model

### Schema

 * [`create`](#create)
 * [`compare`](#compare)
 * [`equals`](#equals)

#### create()

Creates a (pooled) mark object.

##### Parameters

 * `props`
 * `props.type`
 * `props.value` - Defaults to `null`.

##### Example

```JavaScript
const mark = Mark.create({
  type: "bold",
  value: true 
});
```

#### compare()

Returns a number (-1, 0, 1) that indicated the sorting order of the given marks.

##### Parameters

 * `markA`
 * `markB`
 
##### Example

```JavaScript
const markA = Mark.create({
  type: "bold",
  value: true 
});

const markB = Mark.create({
  type: "italic",
  value: true
});

// => -1 
Mark.compare(markB, markA);

// => 0
Mark.compare(markA, markA);

// => 1
Mark.compare(markA, markB);
```

#### equals()

Returns true if the given mark equals to the mark, false otherwise.

##### Parameters

 * `other`
 
##### Example

```JavaScript
const markA = Mark.create({
  type: "bold",
  value: true 
});

const markB = Mark.create({
  type: "bold",
  value: true
});

const markC = Mark.create({
  type: "italic",
  value: true
});

// => true
markA.equals(markB);

// => false
markA.equals(markC);
```
