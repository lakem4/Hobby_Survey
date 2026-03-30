import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Survey from "./pages/Survey";
import Confirmation from "./pages/Confirmation";
import Results from "./pages/Results";

function App() {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");

  return (
    <BrowserRouter basename={base}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/survey" element={<Survey />} />
        <Route path="/confirmation" element={<Confirmation />} />
        <Route path="/results" element={<Results />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
