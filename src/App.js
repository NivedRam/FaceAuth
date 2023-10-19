import "./App.css";
import CameraComponent from "./Pages/CameraComponent";
import Pricing from "./Pages/Pricing";
import Landing from "./Pages/LandingPage";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<CameraComponent />} />
        <Route path="/pricing" element={<Pricing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
