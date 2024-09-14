import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/LoginForm";
import UserSelectButton from "../components/UserSelectButton";

function ParentLogin() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <LoginForm
        title={"Welcome Parents!"}
        subtitle={
          "Thank you for your ongoing support. Log in to stay informed and involved."
        }
      />
      <div className="mt-10">
        <Link to="/login/">
          <UserSelectButton />
        </Link>
      </div>
    </div>
  );
}

export default ParentLogin;
