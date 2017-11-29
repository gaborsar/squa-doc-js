import parseNode from "./parseNode";

export default function parseHTML(html, tokenizeNode) {
  const element = document.createElement("div");
  element.innerHTML = html;
  return parseNode(element, tokenizeNode);
}
