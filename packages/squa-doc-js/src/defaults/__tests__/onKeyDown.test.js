import Value from "../../model/Value";
import schema from "../schema";
import onKeyDown from "../onKeyDown.js";

function createEvent(key) {
  return { key, preventDefault: jest.fn() };
}

function handleEvent(change, event) {
  onKeyDown(change, event);
  return change;
}

describe("onKeyDown", () => {
  test("outdent a list item with backspace", () => {
    const event = createEvent("Backspace");
    const value = Value.createEmpty({ schema })
      .change()
      .setBlockAttributes({ type: "unordered-list-item", indent: 2 })
      .getValue();
    expect(
      handleEvent(value.change(), event)
        .getValue()
        .toDelta()
    ).toEqual(
      value
        .change()
        .setBlockAttributes({ indent: 1 })
        .getValue()
        .toDelta()
    );
    expect(event.preventDefault).toHaveBeenCalled();
  });

  test("unindent a list item with backspace", () => {
    const event = createEvent("Backspace");
    const value = Value.createEmpty({ schema })
      .change()
      .setBlockAttributes({ type: "unordered-list-item", indent: 1 })
      .getValue();
    expect(
      handleEvent(value.change(), event)
        .getValue()
        .toDelta()
    ).toEqual(
      value
        .change()
        .setBlockAttributes({ indent: null })
        .getValue()
        .toDelta()
    );
    expect(event.preventDefault).toHaveBeenCalled();
  });

  test("remove the type of a list item with backspace", () => {
    const event = createEvent("Backspace");
    const value = Value.createEmpty({ schema })
      .change()
      .setBlockAttributes({ type: "unordered-list-item" })
      .getValue();
    expect(
      handleEvent(value.change(), event)
        .getValue()
        .toDelta()
    ).toEqual(
      value
        .change()
        .setBlockAttributes({ type: null })
        .getValue()
        .toDelta()
    );
    expect(event.preventDefault).toHaveBeenCalled();
  });

  test("outdent a list item with enter", () => {
    const event = createEvent("Enter");
    const value = Value.createEmpty({ schema })
      .change()
      .setBlockAttributes({ type: "unordered-list-item", indent: 2 })
      .getValue();
    expect(
      handleEvent(value.change(), event)
        .getValue()
        .toDelta()
    ).toEqual(
      value
        .change()
        .setBlockAttributes({ indent: 1 })
        .getValue()
        .toDelta()
    );
    expect(event.preventDefault).toHaveBeenCalled();
  });

  test("unindent a list item with enter", () => {
    const event = createEvent("Enter");
    const value = Value.createEmpty({ schema })
      .change()
      .setBlockAttributes({ type: "unordered-list-item", indent: 1 })
      .getValue();
    expect(
      handleEvent(value.change(), event)
        .getValue()
        .toDelta()
    ).toEqual(
      value
        .change()
        .setBlockAttributes({ indent: null })
        .getValue()
        .toDelta()
    );
    expect(event.preventDefault).toHaveBeenCalled();
  });

  test("remove the type of a list item with enter", () => {
    const event = createEvent("Enter");
    const value = Value.createEmpty({ schema })
      .change()
      .setBlockAttributes({ type: "unordered-list-item" })
      .getValue();
    expect(
      handleEvent(value.change(), event)
        .getValue()
        .toDelta()
    ).toEqual(
      value
        .change()
        .setBlockAttributes({ type: null })
        .getValue()
        .toDelta()
    );
    expect(event.preventDefault).toHaveBeenCalled();
  });

  test("remove the type of a block with enter", () => {
    const event = createEvent("Enter");
    const value = Value.createEmpty({ schema })
      .change()
      .setBlockAttributes({ type: "heading-one" })
      .getValue();
    expect(
      handleEvent(value.change(), event)
        .getValue()
        .toDelta()
    ).toEqual(
      value
        .change()
        .setBlockAttributes({ type: null })
        .getValue()
        .toDelta()
    );
    expect(event.preventDefault).toHaveBeenCalled();
  });
});
