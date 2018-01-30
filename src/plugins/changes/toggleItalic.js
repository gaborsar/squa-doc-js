export default function toggleItalic(change) {
  const { value } = change;

  const attributes = value.getFormat();

  change.formatInline({ italic: attributes.italic ? null : true }).save();
}
