import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import TeacherLogin from "./pages/TeacherLogin";
import StudentLogin from "./pages/StudentLogin";
import ParentLogin from "./pages/ParentLogin";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminInterface from "./pages/admin/AdminInterface";
import TeacherInterface from "./pages/teacher/TeacherInterface";
import StudentDashboard from "./pages/student/StudentInterface";
import ForgotPassword from "./components/login/ForgotPassword";
import OTPVerification from "./components/login/OTPVerifications";
import CreateNewPassword from "./components/login/CreateNewPass";
import PasswordChanged from "./components/login/PassChangeConfirm";
import PageTitle from "./components/PageTitle";
import NotFound from "./components/404NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/login/teacher" element={<TeacherLogin />} />
        <Route path="/login/student" element={<StudentLogin />} />
        <Route path="/login/parent" element={<ParentLogin />} />
        <Route path="/teacher/" element={<TeacherInterface />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route
          path="/admin/login"
          element={
            <>
              <PageTitle title="Admin" />
              <AdminLogin />{" "}
            </>
          }
        />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/create-new-password" element={<CreateNewPassword />} />
        <Route path="/password-changed" element={<PasswordChanged />} />
        <Route
          path="/admin"
          element={
            <>
              <PageTitle title="Admin" />
              <AdminInterface />
            </>
          }
        />
        <Route path="*" element={<NotFound />} />
        <Route path="/admin/" element={<ProtectedRoute />}>
          <Route index element={<AdminInterface />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
