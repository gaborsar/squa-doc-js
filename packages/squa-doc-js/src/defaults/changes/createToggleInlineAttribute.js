export default function createToggleInlineAttribute(name) {
  return change => {
    const attributes = change.getValue().getInlineAttributes();
    change.setInlineAttributes({
      [name]: attributes[name] ? null : true
    });
  };
}
