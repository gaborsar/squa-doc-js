import React from "react";
import ReactDOM from "react-dom";
import "babel-polyfill";

import App from "./components/App";
import contents from "./contents";

import "./styles/main.scss";
import "./styles/outline.scss";
import "./styles/editor.scss";

ReactDOM.render(
    <App initialContents={contents} />,
    document.getElementById("app")
);
