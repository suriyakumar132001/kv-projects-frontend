import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaUserPlus } from "react-icons/fa";

import { useAuth } from "../../context/AuthContext";
import userService from "../../services/userService";

import "./Users.css";

const roleLabels = {
  owner: "Owner",
  admin: "Admin",
  hr: "HR",
  siteengineer: "Site Engineer",
};

const UserList = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const role = currentUser?.role?.toLowerCase();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const res = await userService.getUsers();
      setUsers(res.users || []);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const canManage = (targetUser) => {
    if (targetUser.role === "owner") return false;
    if (role === "admin" && targetUser.role === "admin") return false;
    return true;
  };

  const handleToggleStatus = async (targetUser) => {
    const nextStatus = targetUser.status === "Active" ? "Inactive" : "Active";

    try {
      setTogglingId(targetUser._id || targetUser.id);

      await userService.updateUserStatus(
        targetUser._id || targetUser.id,
        nextStatus
      );

      toast.success(
        `${targetUser.name} ${
          nextStatus === "Active" ? "activated" : "deactivated"
        }`
      );

      loadUsers();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  if (loading) {
    return <h2>Loading Users...</h2>;
  }

  return (
    <div className="users-page">
      <div className="users-header">
        <div>
          <h2>Users</h2>
          <p>Everyone with a login to KV Projects ERP</p>
        </div>

        <button
          className="users-add-btn"
          onClick={() => navigate(`/${role}/users/add`)}
        >
          <FaUserPlus /> Add User
        </button>
      </div>

      <div className="users-table-wrap">
        {users.length === 0 ? (
          <div className="users-empty">No users found.</div>
        ) : (
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const id = u._id || u.id;
                const uRole = u.role?.toLowerCase();
                const isSelf = id === (currentUser?.id || currentUser?._id);

                return (
                  <tr key={id}>
                    <td>
                      <div className="user-name-cell">
                        <div className="user-avatar">
                          {u.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <span>
                          {u.name}
                          {isSelf ? " (You)" : ""}
                        </span>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-badge ${uRole}`}>
                        {roleLabels[uRole] || u.role}
                      </span>
                    </td>
                    <td>{u.phone || "—"}</td>
                    <td>
                      <span className={`status-badge ${u.status}`}>
                        {u.status}
                      </span>
                    </td>
                    <td>
                      {canManage(u) ? (
                        <button
                          className={`status-toggle-btn ${
                            u.status === "Active" ? "deactivate" : "activate"
                          }`}
                          disabled={togglingId === id}
                          onClick={() => handleToggleStatus(u)}
                        >
                          {togglingId === id
                            ? "Updating..."
                            : u.status === "Active"
                            ? "Deactivate"
                            : "Activate"}
                        </button>
                      ) : (
                        <span style={{ color: "#9ca3af" }}>—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default UserList;