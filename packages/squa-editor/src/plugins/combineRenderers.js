const combineRenderers = renderers => (...args) => {
  for (const renderer of renderers) {
    const result = renderer(...args);
    if (result) {
      return result;
    }
  }
};

export default combineRenderers;
