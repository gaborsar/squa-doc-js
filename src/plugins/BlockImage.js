import React from "react";
import Figure from "./Figure";

export default function BlockImage(props) {
  const { node, deleteBlockByKey } = props;
  return (
    <Figure node={node} deleteBlockByKey={deleteBlockByKey}>
      <img src={node.value["block-image"]} alt={node.getMark("alt")} />
    </Figure>
  );
}
