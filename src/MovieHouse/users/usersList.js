import * as client from "./client";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { MdDeleteOutline } from "react-icons/md";
import { GoPerson } from "react-icons/go";

function UserList() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Initial loading state

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await client.deleteUser(id);
        const updatedUsers = users.filter((user) => user._id !== id);
        setUsers(updatedUsers);
      } catch (error) {
        console.error("Failed to delete user:", error);
      }
    }
  };

  const fetchUser = async () => {
    try {
      const user = await client.account();
      setCurrentUser(user);
    } catch (error) {
      console.error("Failed to fetch current user:", error);
    } finally {
      setIsLoading(false); // Set loading to false when the user is fetched
    }
  };

  const fetchUsers = async () => {
    try {
      const users = await client.findAllUsers();
      setUsers(users);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchUsers();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>; // Show a loading message while fetching data
  }

  if (!currentUser) {
    return <Navigate to="/signin" replace />;
  }

  if (currentUser.role !== "ADMIN") {
    alert("You must be an admin to view this page.");
    return <Navigate to="/" replace />;
  }

  return (
    <div
      className="container"
      style={{
        padding: "20px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
        borderRadius: "8px",
      }}
    >
      <h2 style={{ margin: "20px 0", textAlign: "center" }}>
        Users Management System ({users?.length})
      </h2>
      <div className="list-group mt-3">
        {users.map((user) => (
          <div
            key={user._id}
            className="list-group-item d-flex justify-content-between align-items-center"
            style={{ padding: "10px", borderBottom: "1px solid #ddd" }}
          >
            <Link
              to={`/profile/${user._id}`}
              className="flex-grow-1 mr-2"
              style={{
                textDecoration: "none",
                color: "black",
                fontWeight: "500",
              }}
            >
              <GoPerson
                className="text-black me-3"
                style={{ cursor: "pointer" }}
                size="1.2em"
              />
              <strong>
                {user.username} - <span className="text-info">{user.role}</span>
              </strong>
            </Link>

            {user.role !== "ADMIN" && (
              <MdDeleteOutline
                onClick={() => handleDelete(user._id)}
                style={{ cursor: "pointer", color: "red", fontSize: "1.5em" }} // Styling for the icon
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;

// import * as client from "./client";
// import { useEffect, useState } from "react";
// import { Link, Navigate } from "react-router-dom";
// function UserList() {
//   const [users, setUsers] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);
//   const fetchUser = async () => {
//     const user = await client.account();
//     setCurrentUser(user);
//   };
//   const fetchUsers = async () => {
//     const users = await client.findAllUsers();
//     setUsers(users);
//   };
//   useEffect(() => {
//     fetchUsers();
//     fetchUser();
//   }, []);
//   console.log(currentUser);
//   console.log(users);
//   return (
//     <div>
//       {currentUser ? (
//         currentUser.role === "ADMIN" ? (
//           <>
//             <h2>Users</h2>
//             <div className="list-group">
//               {users.map((user) => (
//                 <Link
//                   key={user._id}
//                   to={`/users/${user._id}`}
//                   className="list-group-item"
//                 >
//                   {user.username}
//                 </Link>
//               ))}
//             </div>
//           </>
//         ) : (
//           <Navigate to="/" />
//         )
//       ) : (
//         <Navigate to="/signin" />
//       )}
//     </div>
//     // <div>
//     //   <h2>Users</h2>
//     //   <div className="list-group">
//     //     {users.map((user) => (
//     //       <Link
//     //         key={user._id}
//     //         to={`/users/${user._id}`}
//     //         className="list-group-item"
//     //       >
//     //         {user.username}
//     //       </Link>
//     //     ))}
//     //   </div>
//     // </div>
//   );
// }

// export default UserList;
