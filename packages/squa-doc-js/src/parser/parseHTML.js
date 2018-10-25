import parseNode from "./parseNode";

function createFragmentElement(html) {
    const element = document.createElement("div");

    element.innerHTML = html;

    // Remove every dummy child (comments, EOLs, etc...)
    let child = element.firstChild;
    while (child) {
        const nextChild = child.nextSibling;
        if (child.nodeType !== Node.ELEMENT_NODE) {
            element.removeChild(child);
        }
        child = nextChild;
    }

    return element;
}

export default function parseHTML(html, tokenizeNode, tokenizeClassName) {
    const element = createFragmentElement(html);
    return parseNode(element, tokenizeNode, tokenizeClassName);
}
