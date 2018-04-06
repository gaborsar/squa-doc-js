export default function createId(text) {
  return encodeURIComponent(
    text
      .toLowerCase()
      .replace(/[^\w\d\s]/g, "")
      .replace(/\n/g, "")
      .replace(/\s/g, "-")
  );
}
