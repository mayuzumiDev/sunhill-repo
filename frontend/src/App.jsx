import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import ProtectedRoute from "../src/components/ProtectedRoute";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import TeacherLogin from "./pages/TeacherLogin";
import StudentLogin from "./pages/StudentLogin";
import ParentLogin from "./pages/ParentLogin";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminInterface from "./pages/admin/AdminInterface";
import PublicInterface from "./pages/public/PublicInterface";
import TeacherInterface from "./pages/teacher/TeacherInterface";
import StudentDashboard from "./pages/student/StudentInterface";
import ParentInterface from "./pages/parent/ParentInterface";
import ForgotPassword from "./components/login/ForgotPassword";
import OTPVerification from "./components/login/OTPVerifications";
import CreateNewPassword from "./components/login/CreateNewPass";
import PasswordChanged from "./components/login/PassChangeConfirm";
import PrivacyPolicy from "./components/PrivacyPolicy";
import TermsOfService from "./components/TermofService";
import FAQ from "../src/pages/admin/Faqs";
import Enrollment from "./pages/Enrollment";
import NotFound from "./components/404NotFound";

// import { TeacherProvider } from "./context/TeacherContext";

const App = () => {
  const location = useLocation();

  useEffect(() => {
    // Set the document title based on the current path
    const path = location.pathname;

    const titleMap = {
      "/": "Sunhill LMS",
      "/login": "Login | Sunhill LMS",
      "/login/": "Login | Sunhill LMS",
      "/login/teacher/": "Teacher Login | Sunhill LMS",
      "/login/student/": "Student Login | Sunhill LMS",
      "/login/parent/": "Parent Login | Sunhill LMS",
      "/teacher/interface/": "Teacher | Sunhill LMS",
      "/student/interface/": "Student | Sunhill LMS",
      "/parent/interface/": "Parent | Sunhill LMS",
      "/public/interface/": "Special Education Identification| Sunhill LMS",
      "/admin/login/": "Admin Login | Sunhill LMS",
      "/admin/login": "Admin Login | Sunhill LMS",
      "/admin/interface/": "Admin | Sunhill LMS",
      "/enrollment/": "Enrollment | Sunhill LMS",
      "/assessment": "Special Education Assessment | Sunhill LMS",
      "/forgot-password": "Forgot Password | Sunhill LMS",
      "/otp-verification": "OTP Verification | Sunhill LMS",
      "/create-new-password/": "Create New Password | Sunhill LMS",
      "/password-changed/": "Password Changed | Sunhill LMS",
      "/terms-of-service/": "Terms of Service | Sunhill LMS",
      "/terms-of-service": "Terms of Service | Sunhill LMS",
      "/privacy-policy/": "Privacy Policy | Sunhill LMS",
      "/privacy-policy": "Privacy Policy | Sunhill LMS",
    };

    document.title = titleMap[path] || "Sunhill LMS"; // Default title if not found
  }, [location]);

  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login/" element={<LoginPage />} />
      <Route path="/login/teacher/" element={<TeacherLogin />} />
      <Route path="/login/student/" element={<StudentLogin />} />
      <Route path="/login/parent/" element={<ParentLogin />} />
      <Route path="/enrollment/" element={<Enrollment />} />
      <Route
        path="/teacher/interface/"
        element={
          <ProtectedRoute userRole="teacher">
            {/* <TeacherProvider> */}
            <TeacherInterface />
            {/* </TeacherProvider> */}
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/interface/"
        element={
          <ProtectedRoute userRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parent/interface/"
        element={
          <ProtectedRoute userRole="parent">
            <ParentInterface />
          </ProtectedRoute>
        }
      />
      <Route
        path="/public/interface/"
        element={
          <ProtectedRoute userRole="public">
            <PublicInterface />
          </ProtectedRoute>
        }
      />
      <Route path="/admin/login/" element={<AdminLogin />} />
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
      <Route path="/terms-of-service/" element={<TermsOfService />} />
      <Route path="/privacy-policy/" element={<PrivacyPolicy />} />
      <Route path="/faq/" element={<FAQ />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const Root = () => (
  <Router>
    <App />
  </Router>
);

export default Root;
