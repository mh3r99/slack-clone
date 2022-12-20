import React from "react";
import ReactDOM from "react-dom/client";
import "semantic-ui-css/semantic.min.css";
import { Provider } from "react-redux";
import { store } from "./store/store";
import AppRoutes from "./Routes";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <AppRoutes />
  </Provider>
);
