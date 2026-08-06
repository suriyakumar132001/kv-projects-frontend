import { useState } from "react";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import userService from "../../services/userService";

import "./Settings.css";

const Settings = () => {
  const { user } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });

  const [profileLoading, setProfileLoading] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [passwordLoading, setPasswordLoading] = useState(false);

  const handleProfileChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();

    try {
      setProfileLoading(true);

      await userService.updateProfile(profileData);

      toast.success("Profile Updated Successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return toast.error("New password and confirm password do not match");
    }

    if (passwordData.newPassword.length < 6) {
      return toast.error("New password must be at least 6 characters");
    }

    try {
      setPasswordLoading(true);

      await userService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      toast.success("Password Changed Successfully");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Password change failed");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h2>Settings</h2>
        <p>Manage your account details and password</p>
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <h3>Profile Information</h3>

          <form onSubmit={handleProfileSubmit}>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleProfileChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" value={user?.email || ""} disabled />
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={profileData.phone}
                onChange={handleProfileChange}
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <input type="text" value={user?.role || ""} disabled />
            </div>

            <button
              type="submit"
              className="save-btn"
              disabled={profileLoading}
            >
              {profileLoading ? "Saving..." : "Update Profile"}
            </button>
          </form>
        </div>

        <div className="settings-card">
          <h3>Change Password</h3>

          <form onSubmit={handlePasswordSubmit}>
            <div className="form-group">
              <label>Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>

            <button
              type="submit"
              className="save-btn"
              disabled={passwordLoading}
            >
              {passwordLoading ? "Updating..." : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
