import parseNode from "./parseNode";

export default function parseHTML(html, customTokenizeNode) {
  const element = document.createElement("div");
  element.innerHTML = html;
  return parseNode(element, customTokenizeNode);
}
