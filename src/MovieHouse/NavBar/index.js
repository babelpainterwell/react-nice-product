import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../users/reducer";
import * as client from "../users/client";

const NavBar = () => {
  const currentUser = useSelector((state) => state.userReducer.currentUser);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const response = await client.signout();

      // Check if signout was successful
      dispatch(setCurrentUser(null));
      navigate("/");
    } catch (error) {
      console.error("Error during sign out:", error);
      // Here you might want to display an error message to the user
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div className="container-fluid">
        <NavLink className="navbar-brand text-bold text-info" to="/">
          <strong>MovieHouse</strong>
        </NavLink>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item ms-4 me-2">
              <NavLink className="nav-link" aria-current="page" to="/">
                <strong>Home</strong>
              </NavLink>
            </li>
            <li className="nav-item ms-2 me-2">
              <NavLink className="nav-link" aria-current="page" to="/search">
                <strong>Search</strong>
              </NavLink>
            </li>
            {currentUser && (
              <li className="nav-item ms-2 me-2">
                <NavLink className="nav-link" to="/profile">
                  <strong>Profile</strong>
                </NavLink>
              </li>
            )}
          </ul>
          <ul className="navbar-nav ms-auto">
            {currentUser ? (
              <>
                <li className="nav-item d-flex align-items-center">
                  <NavLink
                    className="navbar-link nav-link mr-5 text-info"
                    to="/account"
                  >
                    <strong>
                      {currentUser.username} {` - `}
                      {currentUser.role}
                    </strong>
                  </NavLink>
                  {/* <span className="navbar-text mr-3">({currentUser.role})</span> */}
                  <button
                    className="nav-link btn btn-link"
                    onClick={handleSignOut}
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item ms-2 me-2">
                  <NavLink className="nav-link" to="/signin">
                    <strong>Sign In</strong>
                  </NavLink>
                </li>
                <li className="nav-item ms-2 me-2">
                  <NavLink className="nav-link" to="/signup">
                    <strong>Sign Up</strong>
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;

// import React from "react";
// import { NavLink } from "react-router-dom";
// import { useSelector } from "react-redux"; // Import useSelector

// const NavBar = () => {
//   const currentUser = useSelector((state) => state.currentUser); // Access currentUser from the Redux store

//   return (
//     <nav className="navbar navbar-expand-lg navbar-light bg-light mb-">
//       <div className="container-fluid">
//         <NavLink className="navbar-brand" to="/">
//           MovieHouse
//         </NavLink>
//         <button
//           className="navbar-toggler"
//           type="button"
//           data-bs-toggle="collapse"
//           data-bs-target="#navbarNav"
//           aria-controls="navbarNav"
//           aria-expanded="false"
//           aria-label="Toggle navigation"
//         >
//           <span className="navbar-toggler-icon"></span>
//         </button>
//         <div className="collapse navbar-collapse" id="navbarNav">
//           <ul className="navbar-nav">
//             <li className="nav-item">
//               <NavLink className="nav-link" aria-current="page" to="/">
//                 Home
//               </NavLink>
//             </li>
//             <li className="nav-item">
//               <NavLink className="nav-link" to="/profile">
//                 Profile
//               </NavLink>
//             </li>
//           </ul>
//           <ul className="navbar-nav ms-auto">
//             {currentUser ? (
//               // Display current user's username if logged in
//               <li className="nav-item">
//                 <span className="navbar-text">{currentUser.username}</span>
//                 <span className="navbar-text">{currentUser.role}</span>
//               </li>
//             ) : (
//               // Otherwise, show SignIn and SignUp links
//               <>
//                 <li className="nav-item">
//                   <NavLink className="nav-link" to="/signin">
//                     SignIn
//                   </NavLink>
//                 </li>
//                 <li className="nav-item">
//                   <NavLink className="nav-link" to="/signup">
//                     SignUp
//                   </NavLink>
//                 </li>
//               </>
//             )}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default NavBar;
