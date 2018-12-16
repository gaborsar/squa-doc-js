import schema from "./schema";
import renderWrapper from "./renderWrapper";
import renderNode from "./renderNode";
import renderMark from "./renderMark";
import tokenizeNode from "./tokenizeNode";
import tokenizeClassName from "./tokenizeClassName";
import onKeyDown from "./onKeyDown";
import afterInput from "./afterInput";

const Plugin = {
    schema,
    renderWrapper,
    renderNode,
    renderMark,
    tokenizeNode,
    tokenizeClassName,
    onKeyDown,
    afterInput
};

export default Plugin;
