import React from "react";
import ReactDOM from "react-dom/client";
import "./style.css";
import Page from "./page";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);

root.render(
  <React.StrictMode>
    <Page />
  </React.StrictMode>
);
