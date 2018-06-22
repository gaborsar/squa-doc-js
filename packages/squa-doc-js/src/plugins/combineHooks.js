export default function combineHooks(hooks) {
  return (...args) => {
    return hooks.forEach(hook => hook(...args));
  };
}
