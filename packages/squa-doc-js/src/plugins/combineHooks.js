export default function combineHooks(hooks) {
  return (...args) => {
    hooks.forEach(hook => hook(...args));
  };
}
