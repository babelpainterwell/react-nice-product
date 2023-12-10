import * as client from "./client";
import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";

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
    <div className="container">
      <h2>Users ({users?.length})</h2>
      <div className="list-group mt-3">
        {users.map((user) => (
          <div
            key={user._id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <Link
              to={`/users/${user._id}`}
              className="flex-grow-1 mr-2"
              style={{ textDecoration: "none", color: "black" }} // Inline style as a JavaScript object
            >
              {user.username} - {user.role}
            </Link>

            {user.role !== "ADMIN" && (
              <button
                className="btn btn-danger btn-sm"
                onClick={() => handleDelete(user._id)} // Attach event handler
              >
                Delete
              </button>
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
