import React from "react";
import Figure from "./Figure";

export default function BlockImage(props) {
  const { blockKey, deleteBlockByKey, src, alt } = props;
  return (
    <Figure blockKey={blockKey} deleteBlockByKey={deleteBlockByKey}>
      <img src={src} alt={alt} />
    </Figure>
  );
}
