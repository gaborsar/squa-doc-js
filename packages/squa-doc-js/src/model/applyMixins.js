export default function applyMixins(target, ...sources) {
    sources.forEach(source => {
        Object.getOwnPropertyNames(source.prototype).forEach(key => {
            Object.defineProperty(
                target.prototype,
                key,
                Object.getOwnPropertyDescriptor(source.prototype, key)
            );
        });
    });
}
