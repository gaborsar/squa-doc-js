export default function toggleItalic(change) {
  const { value } = change;

  const format = value.getFormat();

  change
    .formatInline({
      italic: format.italic ? null : true
    })
    .save();
}
