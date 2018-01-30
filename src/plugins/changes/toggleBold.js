export default function toggleBold(change) {
  const { value } = change;

  const attributes = value.getFormat();

  change.formatInline({ bold: attributes.bold ? null : true }).save();
}
