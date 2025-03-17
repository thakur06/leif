import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./route";
import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Auth0Provider
  domain="dev-3wkl15qapej7gb1v.us.auth0.com"
    clientId="szgbnDJfud12Kftj5QcaM1gJkz8BBjAU"
    authorizationParams={{ redirect_uri: window.location.origin }}
  >
    <RouterProvider router={router} />
  </Auth0Provider>
);
