import Mark from "./Mark";
import Pool from "./Pool";

const pool = new Pool();

export default class Style {
    static create(props = {}) {
        return pool.recycle(new Style(props), Style.equals);
    }

    static equals(styleA, styleB) {
        return (
            styleA.marks.length === styleB.marks.length &&
            styleA.marks.every((mark, i) => mark === styleB.marks[i])
        );
    }

    constructor({ marks = [] } = {}) {
        this.marks = marks.sort(Mark.compare);
    }

    merge(props) {
        return Style.create({ ...this, ...props });
    }

    getMarks() {
        return this.marks;
    }

    setMarks(marks) {
        return this.merge({ marks });
    }

    isEmpty() {
        return this.marks.length === 0;
    }

    hasAttribute(name) {
        return this.marks.some(mark => mark.name === name);
    }

    getAttribute(name) {
        const mark = this.marks.find(currentMark => currentMark.name === name);
        if (mark === undefined) {
            return null;
        }
        return mark.value;
    }

    setAttribute(name, value) {
        let marks = this.marks.filter(mark => mark.name !== name);
        if (value !== null) {
            marks = marks.concat(Mark.create({ name, value }));
        }
        return this.setMarks(marks);
    }

    getAttributes() {
        const attributes = {};
        this.marks.forEach(mark => {
            attributes[mark.name] = mark.value;
        });
        return attributes;
    }

    setAttributes(attributes, isValidMark) {
        return Object.keys(attributes)
            .filter(isValidMark)
            .reduce(
                (style, name) => style.setAttribute(name, attributes[name]),
                this
            );
    }

    static intersect(styleA, styleB) {
        return styleA.setMarks(
            styleA.marks.filter(mark => styleB.marks.includes(mark))
        );
    }
}
