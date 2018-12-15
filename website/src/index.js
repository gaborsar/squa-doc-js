import React from "react";
import ReactDOM from "react-dom";
import "@babel/polyfill";

import App from "./components/App";
import contents from "./contents";

import "./styles/main.css";
import "./styles/outline.css";
import "./styles/editor.css";

ReactDOM.render(
    <App initialContents={contents} />,
    document.getElementById("app")
);
