export default function combineHandlers(handlers) {
    return (...args) => {
        return handlers.some(handler => handler(...args));
    };
}
