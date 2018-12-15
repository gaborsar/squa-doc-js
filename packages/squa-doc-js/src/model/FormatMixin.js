const FormatMixin = {
    getStyle() {
        return this.style;
    },

    setStyle(style) {
        return this.merge({ style });
    },

    getMarks() {
        return this.style.marks;
    },

    setMarks(marks) {
        return this.setStyle(this.style.setMarks(marks));
    },

    isPristine() {
        return this.style.isEmpty();
    },

    hasAttribute(name) {
        return this.style.hasAttribute(name);
    },

    getAttribute(name) {
        return this.style.getAttribute(name);
    },

    setAttribute(name, value) {
        return this.setStyle(this.style.setAttribute(name, value));
    },

    getAttributes() {
        return this.style.getAttributes();
    },

    setAttributes(attributes) {
        return this.setStyle(
            this.style.setAttributes(attributes, this.isValidMark.bind(this))
        );
    }
};

export default FormatMixin;
