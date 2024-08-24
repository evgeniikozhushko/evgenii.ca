import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import DocsPage from "@/pages/docs";
import Intro from "./pages/intro";
import PricingPage from "@/pages/pricing";
import BlogPage from "@/pages/blog";
import AboutPage from "@/pages/about";
import Test from "@/pages/test";

function App() {
  return (
    <Routes>
      <Route path="/"  element={<IndexPage />} />
      <Route path="/docs" element={<DocsPage />}  />
      <Route path="/intro" element={<Intro />} /> {/* Add the Intro page route */}
      {/* <Route path="/pricing" element={<PricingPage />}  />
      <Route path="/blog" element={<BlogPage />}  />
      <Route path="/about" element={<AboutPage />}  />
      <Route path="/test" element={<Test />}  /> */}
    </Routes>
  );
}

export default App;
