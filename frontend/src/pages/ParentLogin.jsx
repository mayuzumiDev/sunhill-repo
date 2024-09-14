import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/login/LoginForm";
import UserSelectButton from "../components/login/UserSelectButton";
import Navbar from "../components/login/Navbar";

function ParentLogin() {
  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="flex flex-col items-center justify-center h-screen">
        <LoginForm
          title={"Welcome Parents!"}
          subtitle={
            "Thank you for your ongoing support. Log in to stay informed and involved."
          }
          color={"orange"}
        />
        <div className="mt-10">
          <Link to="/login/">
            <UserSelectButton />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ParentLogin;
