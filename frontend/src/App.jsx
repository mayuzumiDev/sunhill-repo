import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home_Page from "./pages/Home_Page";
import Admin_Login from "./pages/Admin_Login";
import Admin_Interface from "./pages/Admin_Interface";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home_Page />} />
        <Route path="/admin/login/" element={<Admin_Login />} />
        <Route path="/admin/interface/" element={<Admin_Interface />} />
      </Routes>
    </Router>
  );
}

export default App;
