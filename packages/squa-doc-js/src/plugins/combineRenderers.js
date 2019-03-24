export default function combineRenderers(renderers) {
    return (...args) => {
        for (let i = 0, l = renderers.length; i < l; i++) {
            const result = renderers[i](...args);
            if (result) {
                return result;
            }
        }
    };
}
