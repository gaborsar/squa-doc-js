export default function createToggleInlineAttribute(name) {
    return change => {
        const attributes = change.value.getInlineAttributes();
        change.setInlineAttributes({
            [name]: attributes[name] ? null : true
        });
    };
}
