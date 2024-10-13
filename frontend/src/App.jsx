import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../src/components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import TeacherLogin from "./pages/TeacherLogin";
import StudentLogin from "./pages/StudentLogin";
import ParentLogin from "./pages/ParentLogin";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminInterface from "./pages/admin/AdminInterface";
import TeacherInterface from "./pages/teacher/TeacherInterface";
import StudentInterfaceTemp from "./pages/student/StudentInterfaceTemp"; // Temporary Student Interface for testing purposes
import ParentInterfaceTemp from "./pages/parent/ParentInterfaceTemp"; // Temporary Parent Interface for testing  purposes
import ForgotPassword from "./components/login/ForgotPassword";
import OTPVerification from "./components/login/OTPVerifications";
import CreateNewPassword from "./components/login/CreateNewPass";
import PasswordChanged from "./components/login/PassChangeConfirm";
import PageTitle from "./components/PageTitle";
import NotFound from "./components/404NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login/" element={<LoginPage />} />
        <Route path="/login/teacher/" element={<TeacherLogin />} />
        <Route path="/login/student/" element={<StudentLogin />} />
        <Route path="/login/parent/" element={<ParentLogin />} />
        <Route
          path="/teacher/interface/"
          element={
            <ProtectedRoute userRole="teacher">
              <TeacherInterface />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student/interface/"
          element={
            <ProtectedRoute userRole="student">
              <StudentInterfaceTemp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent/interface/"
          element={
            <ProtectedRoute userRole="parent">
              <ParentInterfaceTemp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/login/"
          element={
            <>
              <PageTitle title="Sunhill LMS Admin" />
              <AdminLogin />
            </>
          }
        />
        <Route
          path="/admin/interface/"
          element={
            <ProtectedRoute userRole="admin">
              <AdminInterface />
            </ProtectedRoute>
          }
        />
        <Route path="/forgot-password/" element={<ForgotPassword />} />
        <Route path="/otp-verification/" element={<OTPVerification />} />
        <Route path="/create-new-password/" element={<CreateNewPassword />} />
        <Route path="/password-changed/" element={<PasswordChanged />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
