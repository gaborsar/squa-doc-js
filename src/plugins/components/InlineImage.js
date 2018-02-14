import React from "react";

export default function InlineImage(props) {
  const { src, alt } = props;
  return <img src={src} alt={alt} />;
}
