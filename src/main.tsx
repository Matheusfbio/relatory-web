import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFoundPage from "./pages/NotFound";
import Layout from "./layouts/dashboard";
import Products from "./pages/products";
import Items from "./pages/Items";

const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    children: [
      {
        path: "/",
        Component: Layout,
      },
      {
        path: "Items",
        Component: Items,
      },
      {
        path: "products",
        Component: Products,
      },
      {
        path: "*",
        Component: NotFoundPage,
      },
    ],
  },
]);

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
} else {
  console.error("Root element not found");
}
