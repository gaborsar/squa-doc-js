const exp = /^ed\-(\w+)\-(\w+)$/;

export default function tokenizeClassName(className) {
  const tokens = [];

  if (exp.test(className)) {
    const [, type, value] = className.match(exp);

    switch (type) {
      case "align":
        tokens.push({
          type: "block-style",
          payload: {
            align: value
          }
        });
        break;

      case "indent":
        tokens.push({
          type: "block-style",
          payload: {
            indent: parseInt(value, 10)
          }
        });
        break;

      case "anchor":
        tokens.push({
          type: "inline-style",
          payload: {
            anchor: value
          }
        });
        break;

      case "color":
        tokens.push({
          type: "inline-style",
          payload: {
            color: value
          }
        });
        break;
    }
  }

  return tokens;
}
