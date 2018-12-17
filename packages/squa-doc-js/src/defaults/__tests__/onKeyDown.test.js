import Value from "../../model/Value";
import schema from "../schema";
import onKeyDown from "../onKeyDown.js";

describe("onKeyDown", () => {
    test("outdent a list item with backspace", () => {
        const { value } = Value.createEmpty({ schema })
            .change()
            .setBlockAttributes({ type: "unordered-list-item", indent: 2 });

        const event = createEvent("Backspace");
        const { value: valueA } = handleEvent(value.change(), event);
        const { value: valueB } = value
            .change()
            .setBlockAttributes({ indent: 1 });

        expect(event.preventDefault).toHaveBeenCalled();
        expect(valueA.toDelta()).toEqual(valueB.toDelta());
    });

    test("unindent a list item with backspace", () => {
        const { value } = Value.createEmpty({ schema })
            .change()
            .setBlockAttributes({ type: "unordered-list-item", indent: 1 });

        const event = createEvent("Backspace");
        const { value: valueA } = handleEvent(value.change(), event);
        const { value: valueB } = value
            .change()
            .setBlockAttributes({ indent: null });

        expect(event.preventDefault).toHaveBeenCalled();
        expect(valueA.toDelta()).toEqual(valueB.toDelta());
    });

    test("remove the type of a list item with backspace", () => {
        const { value } = Value.createEmpty({ schema })
            .change()
            .setBlockAttributes({ type: "unordered-list-item" });

        const event = createEvent("Backspace");
        const { value: valueA } = handleEvent(value.change(), event);
        const { value: valueB } = value
            .change()
            .setBlockAttributes({ type: null });

        expect(event.preventDefault).toHaveBeenCalled();
        expect(valueA.toDelta()).toEqual(valueB.toDelta());
    });

    test("outdent a list item with enter", () => {
        const { value } = Value.createEmpty({ schema })
            .change()
            .setBlockAttributes({ type: "unordered-list-item", indent: 2 });

        const event = createEvent("Enter");
        const { value: valueA } = handleEvent(value.change(), event);
        const { value: valueB } = value
            .change()
            .setBlockAttributes({ indent: 1 });

        expect(event.preventDefault).toHaveBeenCalled();
        expect(valueA.toDelta()).toEqual(valueB.toDelta());
    });

    test("unindent a list item with enter", () => {
        const { value } = Value.createEmpty({ schema })
            .change()
            .setBlockAttributes({ type: "unordered-list-item", indent: 1 });

        const event = createEvent("Enter");
        const { value: valueA } = handleEvent(value.change(), event);
        const { value: valueB } = value
            .change()
            .setBlockAttributes({ indent: null });

        expect(event.preventDefault).toHaveBeenCalled();
        expect(valueA.toDelta()).toEqual(valueB.toDelta());
    });

    test("remove the type of a list item with enter", () => {
        const { value } = Value.createEmpty({ schema })
            .change()
            .setBlockAttributes({ type: "unordered-list-item" });

        const event = createEvent("Enter");
        const { value: valueA } = handleEvent(value.change(), event);
        const { value: valueB } = value
            .change()
            .setBlockAttributes({ type: null });

        expect(event.preventDefault).toHaveBeenCalled();
        expect(valueA.toDelta()).toEqual(valueB.toDelta());
    });

    test("remove the type of a block with enter", () => {
        const { value } = Value.createEmpty({ schema })
            .change()
            .setBlockAttributes({ type: "heading-one" });

        const event = createEvent("Enter");
        const { value: valueA } = handleEvent(value.change(), event);
        const { value: valueB } = value
            .change()
            .setBlockAttributes({ type: null });

        expect(event.preventDefault).toHaveBeenCalled();
        expect(valueA.toDelta()).toEqual(valueB.toDelta());
    });
});

function createEvent(key) {
    return { key, preventDefault: jest.fn() };
}

function handleEvent(change, event) {
    onKeyDown(change, event);
    return change;
}
