import React from "react";
import ReactDOM from "react-dom/client";
import AppRoutes from "./Route";  // Import the AppRoutes component
import "./index.css"; // Optional: Your styles

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRoutes />
  </React.StrictMode>
);
