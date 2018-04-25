import combineSchemas from "./combineSchemas";
import combineRenderers from "./combineRenderers";
import combineTokenizers from "./combineTokenizers";
import combineHandlers from "./combineHandlers";
import combineHooks from "./combineHooks";

const properties = [
  {
    name: "schema",
    combiner: combineSchemas
  },
  {
    name: "renderNode",
    combiner: combineRenderers
  },
  {
    name: "renderMark",
    combiner: combineRenderers
  },
  {
    name: "tokenizeNode",
    combiner: combineTokenizers
  },
  {
    name: "tokenizeClassName",
    combiner: combineTokenizers
  },
  {
    name: "onKeyDown",
    combiner: combineHandlers
  },
  {
    name: "afterInput",
    combiner: combineHooks
  }
];

export default function combinePlugins(plugins) {
  return properties.reduce((plugin, { name, combiner }) => {
    const currentProperties = plugins
      .filter(currentPlugin => currentPlugin.hasOwnProperty(name))
      .map(currentPlugin => currentPlugin[name]);
    return {
      ...plugin,
      [name]: combiner(currentProperties)
    };
  }, {});
}
