import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Users() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8081/users")
      .then((results) => {
        setUsers(results.data);
      })
      .catch((error) => {
        console.log(error.message);
      });
  }, []);

  return (
    <div className="users-container">
      <h2>All Users</h2>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
              <th>Email</th>
              <th>Gender</th>
              <th>College</th>
              <th>Semester</th>
              <th>Batch</th>
              <th>Created On</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id}>
                <td>{user.user_id}</td>
                <td>{user.first_name}</td>
                <td>{user.last_name}</td>
                <td>@{user.username}</td>
                <td>{user.email}</td>
                <td>{user.gender}</td>
                <td>{user.college || 'Not specified'}</td>
                <td>{user.semester || 'Not specified'}</td>
                <td>{user.batch || 'Not specified'}</td>
                <td>{new Date(user.created_on).toLocaleDateString()}</td>
                <td>
                  {user.admin ? (
                    <span className="badge bg-danger">Admin</span>
                  ) : (
                    <span className="badge bg-primary">User</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {users.length === 0 && (
        <div className="text-center mt-4">
          <p>No users found.</p>
        </div>
      )}
    </div>
  );
}

export default Users;
