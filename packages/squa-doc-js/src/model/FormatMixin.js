export default class FormatMixin {
    get isPristine() {
        return this.style.isEmpty;
    }

    setStyle(style) {
        return this.merge({ style });
    }

    getAttributes() {
        return this.style.getAttributes();
    }

    setAttributes(attributes) {
        return this.setStyle(
            this.style.setAttributes(attributes, this.isValidMark.bind(this))
        );
    }

    hasAttribute(name) {
        return this.style.hasAttribute(name);
    }

    getAttribute(name) {
        return this.style.getAttribute(name);
    }

    setAttribute(name, value) {
        return this.setStyle(this.style.setAttribute(name, value));
    }
}
