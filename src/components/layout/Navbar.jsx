import "./Navbar.css";
import { useAuth } from "../../context/AuthContext";

import {
  FaBell,
  FaSearch,
  FaUserCircle,
  FaBars,
} from "react-icons/fa";

const Navbar = ({ onMenuClick }) => {

  const { user } = useAuth();

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

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

          <FaUserCircle className="profile-icon"/>

          <div>

            <h4>{user?.name}</h4>

            <p>{user?.role}</p>

          </div>

        </div>

      </div>

    </header>

  );

};

export default Navbar;