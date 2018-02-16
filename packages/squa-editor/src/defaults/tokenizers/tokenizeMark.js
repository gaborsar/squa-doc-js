export default function tokenzieMark(node) {
  const tokens = [];

  switch (node.nodeName) {
    case "A":
      tokens.push({
        inline: {
          link: node.getAttribute("href")
        }
      });
      break;

    case "B":
    case "STRONG":
      tokens.push({
        inline: {
          bold: true
        }
      });
      break;

    case "I":
    case "EM":
      tokens.push({
        inline: {
          italic: true
        }
      });
      break;

    case "U":
      tokens.push({
        inline: {
          underline: true
        }
      });
      break;

    case "S":
    case "DEL":
      tokens.push({
        inline: {
          strikethrough: true
        }
      });
      break;

    case "CODE":
      tokens.push({
        inline: {
          code: true
        }
      });
      break;
  }

  for (let i = 0; i < node.classList.length; i++) {
    const className = node.classList.item(i);

    if (className.startsWith("ed-align-")) {
      tokens.push({
        block: {
          align: className.replace("ed-align-", "")
        }
      });
    } else if (className.startsWith("ed-indent-")) {
      tokens.push({
        block: {
          indent: parseInt(className.replace("ed-indent-", ""), 10)
        }
      });
    } else if (className.startsWith("ed-anchor-")) {
      tokens.push({
        inline: {
          anchor: className.replace("ed-anchor-", "")
        }
      });
    }
  }

  if (node.style.color) {
    tokens.push({
      inline: {
        color: node.style.color
      }
    });
  }

  return tokens;
}
