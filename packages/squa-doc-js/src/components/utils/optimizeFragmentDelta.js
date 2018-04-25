import SpecialCharacter from "../../model/SpecialCharacter";

export default function optimizeFragmentDelta(delta) {
  if (delta.ops.length !== 0) {
    const op = delta.ops[delta.ops.length - 1];
    if (
      typeof op.insert === "string" &&
      op.insert.endsWith(SpecialCharacter.BlockEnd)
    ) {
      op.insert = op.insert.slice(0, -1);
      if (op.insert.length === 0) {
        delta.ops.pop();
      }
    }
  }
}
