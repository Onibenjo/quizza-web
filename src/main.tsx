import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "app/app";

import { configure } from "axios-hooks";
import Axios from "axios";
import { BASE_API } from "config";

const axios = Axios.create({
  baseURL: String(BASE_API),
});

// const cache = new LRU({ max: 10 })

configure({ axios });

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);
