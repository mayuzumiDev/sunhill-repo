import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminLogin from "./pages/AdminLogin";
import AdminInterface from "./pages/AdminInterface";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/admin/login/" element={<AdminLogin />} />
        <Route path="/admin/interface/" element={<AdminInterface />} />
      </Routes>
    </Router>
  );
}

export default App;
