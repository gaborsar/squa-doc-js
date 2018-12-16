const renderClassName = memoize(mark => ({
    className: `SquaDocJs-${mark.name}-${mark.value}`
}));

const renderLink = memoize(mark => ({
    component: "a",
    props: { href: mark.value }
}));

const dynamicMarkMap = {
    align: renderClassName,
    indent: renderClassName,
    anchor: renderClassName,
    color: renderClassName,
    link: renderLink
};

const staticMarkMap = {
    bold: {
        component: "b"
    },
    italic: {
        component: "i"
    },
    underline: {
        component: "u"
    },
    strikethrough: {
        component: "s"
    },
    code: {
        component: "code"
    }
};

export default function renderMark(mark) {
    if (dynamicMarkMap[mark.name] !== undefined) {
        return dynamicMarkMap[mark.name](mark);
    }
    if (staticMarkMap[mark.name] !== undefined) {
        return staticMarkMap[mark.name];
    }
}

function memoize(fn) {
    const cache = {};
    return mark => {
        const key = `${mark.name}-${mark.value}`;
        if (cache[key] === undefined) {
            cache[key] = fn(mark);
        }
        return cache[key];
    };
}
