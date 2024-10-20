import React, { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import {BrowserRouter, useNavigate, useHref} from 'react-router-dom';
import {NextUIProvider} from '@nextui-org/react';

// Lazy load components
const IndexPage = React.lazy(() => import("@/pages/index"));
const DocsPage = React.lazy(() => import("@/pages/docs"));
const Intro = React.lazy(() => import("@/pages/intro"));
// import IndexPage from "@/pages/index";
// import DocsPage from "@/pages/docs";
// import Intro from "@/pages/intro";

function App() {
  const navigate = useNavigate();

  return (
    <NextUIProvider navigate={navigate} useHref={useHref}>
      <Routes>
        <Route path="/" element={<IndexPage />} />
        {/* <Route path="/docs" element={<DocsPage />}  /> */}
        <Route path="/intro" element={<Intro />} />
      </Routes>
    </NextUIProvider>
  );
}

export default App;
