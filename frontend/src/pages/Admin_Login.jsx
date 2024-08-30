import React from "react";
import "../styles/Admin_Login.css";

function Admin_Login() {
  return (
    <div className="form-container">
      <form onSubmit={""} className="login-form">
        <h2>Admin Login</h2>
        <div className="input-container">
          <input
            type="text"
            value={""}
            placeholder="Username"
            //onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="input-container">
          <input
            type="password"
            value={""}
            placeholder="Password"
            //onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-bttn">
          Login
        </button>
      </form>
    </div>
  );
}

export default Admin_Login;
