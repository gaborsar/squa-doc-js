import React from "react";

export default function BlockImage(props) {
  const { node } = props;
  return (
    <figure>
      <img src={node.value["block-image"]} alt={node.getMark("alt")} />
      <figcaption>{node.getMark("caption")}</figcaption>
    </figure>
  );
}
