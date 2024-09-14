import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import UserSelectButton from "../components/UserSelectButton";

function TeacherLogin() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <LoginForm
        title="Greetings Teachers!"
        subtitle="Your passion for teaching is our greatest asset. Log in to access your tools."
      />
      <div className="mt-10">
        <Link to="/login/">
          <UserSelectButton />
        </Link>
      </div>
    </div>
  );
}

export default TeacherLogin;
