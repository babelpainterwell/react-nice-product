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

  return (
    <div className="container">
      <h2>Sign Up</h2>
      {error && <div className="alert alert-danger">{error.message}</div>}
      <input
        type="text"
        className="form-control"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        className="form-control"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <input
        type="email"
        className="form-control"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <select
        className="form-control"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="ADMIN">Admin</option>
        <option value="DIRECTOR">Movie Director</option>
        <option value="REVIEWER">Reviewer</option>
      </select>
      <button onClick={signUp} className="btn btn-primary">
        Sign Up
      </button>
    </div>
  );
}

export default SignUp;
