import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import initialContents from "./data/initialContents";
import "babel-polyfill";
import "./styles/main.scss";
import "./styles/outline.scss";
import "./styles/editor.scss";

ReactDOM.render(
  <App initialContents={initialContents} />,
  document.getElementById("app")
);
