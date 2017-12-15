import React from "react";

export default function InlineImage(props) {
  const { node } = props;
  return <img src={node.value["inline-image"]} alt={node.getMark("alt")} />;
}
