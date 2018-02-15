export default function toggleBold(change) {
  const { value } = change;

  const format = value.getFormat();

  change
    .formatInline({
      bold: format.bold ? null : true
    })
    .save();
}
