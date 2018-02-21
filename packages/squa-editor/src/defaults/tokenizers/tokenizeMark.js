export default function tokenzieMark(node) {
  const tokens = [];

  switch (node.nodeName) {
    case "A":
      tokens.push({
        type: "inline-style",
        payload: {
          link: node.getAttribute("href")
        }
      });
      break;

    case "B":
    case "STRONG":
      tokens.push({
        type: "inline-style",
        payload: {
          bold: true
        }
      });
      break;

    case "I":
    case "EM":
      tokens.push({
        type: "inline-style",
        payload: {
          italic: true
        }
      });
      break;

    case "U":
      tokens.push({
        type: "inline-style",
        payload: {
          underline: true
        }
      });
      break;

    case "S":
    case "DEL":
      tokens.push({
        type: "inline-style",
        payload: {
          strikethrough: true
        }
      });
      break;

    case "CODE":
      tokens.push({
        type: "inline-style",
        payload: {
          code: true
        }
      });
      break;
  }

  for (let i = 0; i < node.classList.length; i++) {
    const className = node.classList.item(i);

    if (className.startsWith("ed-align-")) {
      tokens.push({
        type: "block-style",
        payload: {
          align: className.replace("ed-align-", "")
        }
      });
    } else if (className.startsWith("ed-indent-")) {
      tokens.push({
        type: "block-style",
        payload: {
          indent: parseInt(className.replace("ed-indent-", ""), 10)
        }
      });
    } else if (className.startsWith("ed-anchor-")) {
      tokens.push({
        type: "inline-style",
        payload: {
          anchor: className.replace("ed-anchor-", "")
        }
      });
    } else if (className.startsWith("ed-color-")) {
      tokens.push({
        type: "inline-style",
        payload: {
          color: className.replace("ed-color-", "")
        }
      });
    }
  }

  return tokens;
}
