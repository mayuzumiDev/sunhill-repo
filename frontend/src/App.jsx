import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import TeacherLogin from "./pages/TeacherLogin";
import StudentLogin from "./pages/StudentLogin";
import ParentLogin from "./pages/ParentLogin";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminInterface from "./pages/admin/AdminInterface";
import { AuthProvider } from "./utils/authContext";
import AdminRoute from "./components/AdminRoute";
import ForgotPassword from "./components/login/ForgotPassword";
import OTPVerification from "./components/login/OTPVerifications";
import CreateNewPassword from "./components/login/CreateNewPass";
import PasswordChanged from "./components/login/PassChangeConfirm";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login/" element={<LoginPage />} />
          <Route path="/login/teacher/" element={<TeacherLogin />} />
          <Route path="/login/Student/" element={<StudentLogin />} />
          <Route path="/login/Parent/" element={<ParentLogin />} />
          <Route path="/admin/login/" element={<AdminLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/otp-verification" element={<OTPVerification />} />
          <Route path="/create-new-password" element={<CreateNewPassword />} />
          <Route path="/password-changed" element={<PasswordChanged />} />
          <Route
            path="/admin/*"
            //element={<AdminRoute component={AdminInterface} />}
            element={<AdminInterface />}
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
