import * as client from "./client";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCurrentUser } from "./reducer";
import "./Account.css"; // Importing the CSS file for styling
import { useSelector } from "react-redux";

function Account() {
  const [user, setUser] = useState(null);
  const { currentUser } = useSelector((state) => state.userReducer);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchUser = async () => {
    try {
      const user = await client.account();
      setUser(user);
    } catch (error) {
      navigate("/signin");
    }
  };

  const updateUser = async () => {
    const status = await client.updateUser(user._id, user);
  };

  const signout = async () => {
    const status = await client.signout();
    dispatch(setCurrentUser(null));
    navigate("/");
  };

  useEffect(() => {
    if (!currentUser) {
      navigate("/signin");
      return;
    }
    fetchUser();
  }, []);

  return (
    <div className="account-container">
      <h1 className="account-title text-info">Account</h1>
      <hr />
      {user && (
        <div className="account-detail">
          <p>
            Your Username: <strong>{user.username}</strong>
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <span style={{ marginRight: "10px", minWidth: "120px" }}>
              <strong>Email:</strong>
            </span>
            <input
              type="email"
              className="form-input"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <span style={{ marginRight: "10px", minWidth: "120px" }}>
              <strong>First Name:</strong>
            </span>
            <input
              type="text"
              className="form-input"
              value={user.firstName}
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
              placeholder="Update your first name"
            />
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <span style={{ marginRight: "10px", minWidth: "120px" }}>
              <strong>Last Name:</strong>
            </span>
            <input
              type="text"
              className="form-input"
              value={user.lastName}
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              placeholder="Update your last name"
            />
          </div>

          <button onClick={updateUser} className="btn btn-outline-info">
            Update
          </button>
          <button onClick={signout} className="btn btn-outline-danger">
            Sign Out
          </button>
          {user.role === "ADMIN" && (
            <Link to="/users" className="btn btn-info float-right text-white">
              Manage Users
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default Account;
