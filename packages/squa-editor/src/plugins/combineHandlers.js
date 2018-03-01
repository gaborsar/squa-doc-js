const combineHandlers = handlers => (...args) =>
  handlers.some(handler => handler(...args));

export default combineHandlers;
