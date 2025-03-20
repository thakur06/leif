import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./route";
import { Auth0Provider } from "@auth0/auth0-react";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
<Auth0Provider
    domain="dev-c70oax132wfgzj0a.us.auth0.com"
    clientId="Sz3LefJHa0DWOzKn2zx3QMUd89ReE81L"
    authorizationParams={{
      redirect_uri: window.location.origin
    }}
  >
    <RouterProvider router={router} />
  </Auth0Provider></AuthProvider>
);
