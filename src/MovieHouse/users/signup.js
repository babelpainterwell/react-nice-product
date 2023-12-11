import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import * as client from "./client";

function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signUp = async () => {
    try {
      const credentials = { username, password, email, role };
      const user = await client.signup(credentials);
      dispatch(setCurrentUser(user));
      navigate("/");
    } catch (error) {
      setError(error);
    }
  };

  const handleSignin = () => {
    navigate("/signin");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "70vh",
      }}
    >
      <div
        className="container"
        style={{
          maxWidth: "400px",
          margin: "0 auto",
          padding: "20px",
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
          borderRadius: "10px",
          backgroundColor: "#f8f9fa",
          textAlign: "center",
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Sign Up</h2>
        {error && <div className="alert alert-danger">{error.message}</div>}
        <input
          type="text"
          className="form-control"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <input
          type="password"
          className="form-control"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <input
          type="email"
          className="form-control"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ marginBottom: "10px" }}
        />
        <select
          className="form-control"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          style={{ marginBottom: "20px" }}
        >
          <option value="" disabled>
            Select your role
          </option>
          <option value="ADMIN">Admin</option>
          <option value="DIRECTOR">Movie Director</option>
          <option value="REVIEWER">Reviewer</option>
        </select>
        <button
          onClick={signUp}
          className="btn btn-info mb-3 text-white"
          style={{ width: "100%" }}
        >
          Sign Up
        </button>
        <button
          onClick={handleSignin}
          className="btn btn-secondary mb-3"
          style={{ width: "100%" }}
        >
          Sign In
        </button>
      </div>
    </div>
  );
}

export default SignUp;
