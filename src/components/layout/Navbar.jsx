import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";
import ChangePasswordModal from "../common/ChangePasswordModal";
import leaveService from "../../services/leaveService";

import {
  FaBell,
  FaSearch,
  FaBars,
  FaChevronDown,
  FaKey,
  FaSignOutAlt,
} from "react-icons/fa";

const Navbar = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [pendingLeaveCount, setPendingLeaveCount] = useState(0);

  const menuRef = useRef(null);

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

  const handleNotificationClick = () => {
    if (!user) return;

    const role = user.role?.toLowerCase();
    const basePath = ["owner", "admin", "hr"].includes(role)
      ? `/${role}/leave`
      : "/";

    if (basePath !== "/") {
      navigate(`${basePath}?status=Pending`);
    }
  };

  useEffect(() => {
    const loadPendingCount = async () => {
      if (!user) return;

      const role = user.role?.toLowerCase();

      if (!["owner", "admin", "hr"].includes(role)) {
        setPendingLeaveCount(0);
        return;
      }

      try {
        const count = await leaveService.getPendingLeaveCount();
        setPendingLeaveCount(count);
      } catch (error) {
        console.error("Failed to load leave notification count", error);
      }
    };

    loadPendingCount();
  }, [user]);

  // Close the dropdown when clicking anywhere outside of it
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle-btn" onClick={onMenuClick}>
          <FaBars />
        </button>

        <h2>Construction ERP</h2>
      </div>

      <div className="navbar-center">
        <div className="search-box">
          <FaSearch />

          <input type="text" placeholder="Search..." />
        </div>
      </div>

      <div className="navbar-right">
        <span className="today">{today}</span>

        <button
          className="notification-btn"
          onClick={handleNotificationClick}
          title={
            pendingLeaveCount > 0
              ? `${pendingLeaveCount} pending leave request(s)`
              : "No pending leave requests"
          }
        >
          <FaBell />

          {pendingLeaveCount > 0 && (
            <span className="badge">{pendingLeaveCount}</span>
          )}
        </button>

        <div className="profile-menu-wrap" ref={menuRef}>
          <div className="profile" onClick={() => setMenuOpen(!menuOpen)}>
            <div className="profile-avatar">{initial}</div>

            <div className="profile-text">
              <h4>{user?.name}</h4>

              <p>{user?.role}</p>
            </div>

            <FaChevronDown
              className={`profile-chevron ${menuOpen ? "open" : ""}`}
            />
          </div>

          {menuOpen && (
            <div className="profile-dropdown">
              <button
                className="profile-dropdown-item"
                onClick={() => {
                  setShowChangePassword(true);
                  setMenuOpen(false);
                }}
              >
                <FaKey />
                Change Password
              </button>

              <button
                className="profile-dropdown-item logout"
                onClick={handleLogout}
              >
                <FaSignOutAlt />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </header>
  );
};

export default Navbar;
