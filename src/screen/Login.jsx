import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
// import logo from "./logo.png"; // Ensure the logo file is in the correct path

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:4000/api/loginuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const json = await response.json();

      if (!json.success) {
        Swal.fire({
          title: "Error!",
          text: "Enter valid credentials",
          icon: "error",
        });
      } else {
        Swal.fire({
          title: "SignIn Successfully!",
          icon: "success",
        });
        localStorage.setItem("userEmail", email);
        localStorage.setItem("authtoken", json.authtoken);

        navigate("/home");
      }
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "Something went wrong. Please try again later.",
        icon: "error",
      });
    }
  };

  return (
    <div className="login">
      <div className="login-container">
        <div className="login-right">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRM7vNLb7DLGkqB26WLYGjp89xhYrFWOVZ1ow&s" alt="Suvidha Foundation" className="logo" />
        </div>
        <div className="loginline"></div>
        <div className="login-left">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                placeholder="Enter your email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <a href="/reset-password" className="forgot">Forgot password?</a>
            </div>

            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
