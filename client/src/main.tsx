import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css"; // Optional: Add global styles (e.g., Tailwind or custom styles)
import App from "./App";

// Make sure there is an element with id="app" in your index.html
const container = document.getElementById("app");
const root = createRoot(container!);

// Render the App component to the DOM
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
