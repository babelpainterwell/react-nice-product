import * as client from "./client";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const signIn = async () => {
    try {
      const credentials = { username: username, password: password };
      const user = await client.signin(credentials);
      dispatch(setCurrentUser(user));
      navigate("/");
    } catch (error) {
      setError(error);
    }
  };

  const handleSignUp = () => {
    navigate("/signup");
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
          padding: "20px",
          boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
          borderRadius: "5px",
          backgroundColor: "white",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Sign In</h2>
        {error && <div className="alert alert-danger">{error.message}</div>}
        <div style={{ marginBottom: "15px" }}>
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
        </div>
        <button
          onClick={signIn}
          className="btn btn-info mb-3 text-white"
          style={{ width: "100%" }}
        >
          Sign In
        </button>
        <button
          onClick={handleSignUp}
          className="btn btn-secondary mb-3"
          style={{ width: "100%" }}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}

export default SignIn;
