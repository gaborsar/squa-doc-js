import RangeIterator from "./RangeIterator";
import RangeBuilder from "./RangeBuilder";

export default function createRange(nodes, offset, length) {
  const iterator = new RangeIterator(nodes);
  const builder = new RangeBuilder();

  let remainingOffset = offset;

  while (!iterator.isDone() && remainingOffset > 0) {
    const item = iterator.next(remainingOffset);

    remainingOffset -= item.length;
  }

  let remainingLength = length;

  while (!iterator.isDone() && remainingLength > 0) {
    const item = iterator.next(remainingLength);

    builder.pushRangeItem(item);

    remainingLength -= item.length;
  }

  return builder.build();
}
