import combineSchemas from "./combineSchemas";
import combineRenderers from "./combineRenderers";
import combineTokenizers from "./combineTokenizers";
import combineHandlers from "./combineHandlers";

const properties = [
  { name: "schema", combiner: combineSchemas },
  { name: "renderNode", combiner: combineRenderers },
  { name: "renderMark", combiner: combineRenderers },
  { name: "tokenizeNode", combiner: combineTokenizers },
  { name: "onKeyDown", combiner: combineHandlers }
];

export default function combinePlugins(plugins) {
  return properties.reduce((plugin, { name, combiner }) => {
    const properties = plugins
      .filter(plugin => plugin.hasOwnProperty(name))
      .map(plugin => plugin[name]);
    return {
      ...plugin,
      [name]: combiner(properties)
    };
  }, {});
}
