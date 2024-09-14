import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import UserSelectButton from "../components/UserSelectButton";

function StudentLogin() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <LoginForm
        title="Welcome, Young Learners! "
        subtitle="Ready for a fun day of discovery? Log in to start your adventure!"
      />
      <div className="mt-10">
        <Link to="/login/">
          <UserSelectButton />
        </Link>
      </div>
    </div>
  );
}

export default StudentLogin;
