export default function combineRenderers(renderers) {
  return (...args) => {
    for (const renderer of renderers) {
      const result = renderer(...args);
      if (result) {
        return result;
      }
    }
  };
}
