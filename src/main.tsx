import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter} from 'react-router-dom';
import {NextUIProvider} from '@nextui-org/react';

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";

const storedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.classList.add(storedTheme); // Apply the theme before React mounts

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
    <NextUIProvider>
      <Provider>
        <App />
      </Provider>
      </NextUIProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
