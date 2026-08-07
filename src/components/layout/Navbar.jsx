import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";

import {
  FaBell,
  FaSearch,
  FaBars,
  FaChevronDown,
} from "react-icons/fa";

const Navbar = ({ onMenuClick }) => {

  const { user } = useAuth();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const initial = user?.name?.charAt(0)?.toUpperCase() || "U";

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

          <input
            type="text"
            placeholder="Search..."
          />

        </div>

      </div>

      <div className="navbar-right">

        <span className="today">{today}</span>

        <button className="notification-btn">

          <FaBell />

          <span className="badge">3</span>

        </button>

        <div className="profile">

          <div className="profile-avatar">{initial}</div>

          <div className="profile-text">

            <h4>{user?.name}</h4>

            <p>{user?.role}</p>

          </div>

          <FaChevronDown className="profile-chevron" />

        </div>

      </div>

    </header>

  );

};

export default Navbar;