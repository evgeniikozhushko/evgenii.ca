import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import Intro from "./pages/intro";

function App() {
  return (
    <Routes>
      <Route path="/"  element={<IndexPage />} />
      <Route path="/docs" element={<DocsPage />}  />
      <Route path="/intro" element={<Intro />} />
    </Routes>
  );
}

export default App;
