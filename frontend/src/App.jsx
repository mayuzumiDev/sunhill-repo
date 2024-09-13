import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminInterface from "./pages/admin/AdminInterface";
import { AuthProvider } from "./utils/authContext";
import AdminRoute from "./components/AdminRoute";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/admin/login/" element={<AdminLogin />} />
          <Route
            path="/admin/interface/"
            //element={<AdminRoute component={AdminInterface} />}
            element={<AdminInterface />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
