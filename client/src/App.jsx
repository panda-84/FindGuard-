// App.jsx
// This is the root of our React app
// Everything starts from here

import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from "./AppRoutes.jsx";

export default function App() {
  return (
    // BrowserRouter enables page navigation without refresh
    <BrowserRouter>
      {/* AppRoutes has all our page routes */}
      <AppRoutes />
    </BrowserRouter>
  );
}
