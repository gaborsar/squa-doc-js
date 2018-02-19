import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import initialContents from "./data/initialContents";
import "babel-polyfill";
import "./main.scss";

ReactDOM.render(
  <App initialContents={initialContents} />,
  document.getElementById("app")
);
