export default function combineHandlers(handlers) {
  return (...args) => handlers.some(handler => handler(...args));
}
