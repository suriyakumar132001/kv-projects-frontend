import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import {
  FaTachometerAlt,
  FaUsers,
  FaCalendarCheck,
  FaCalendarAlt,
  FaMoneyCheckAlt,
  FaUserTie,
  FaTruck,
  FaBuilding,
  FaBoxes,
  FaLaptop,
  FaFileInvoice,
  FaFileInvoiceDollar,
  FaCreditCard,
  FaChartBar,
  FaCog,
  FaSignOutAlt,
  FaProjectDiagram,
  FaTimes,
  FaClipboardList,
  FaUserShield,
} from "react-icons/fa";

import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const role = user?.role?.toLowerCase();

  const menuItems = {
    owner: [
      {
        name: "Dashboard",
        icon: <FaTachometerAlt />,
        path: "/owner/dashboard",
      },
      { name: "Employees", icon: <FaUsers />, path: "/owner/employees" },
      {
        name: "Attendance",
        icon: <FaCalendarCheck />,
        path: "/owner/attendance",
      },
      { name: "Leave", icon: <FaCalendarAlt />, path: "/owner/leave" },
      { name: "Payroll", icon: <FaMoneyCheckAlt />, path: "/owner/payroll" },
      { name: "Projects", icon: <FaProjectDiagram />, path: "/owner/projects" },
      { name: "Clients", icon: <FaUserTie />, path: "/owner/clients" },
      { name: "Vendors", icon: <FaTruck />, path: "/owner/vendors" },
      { name: "Sites", icon: <FaBuilding />, path: "/owner/sites" },
      { name: "Inventory", icon: <FaBoxes />, path: "/owner/inventory" },
      { name: "Assets", icon: <FaLaptop />, path: "/owner/assets" },
      {
        name: "Quotations",
        icon: <FaFileInvoice />,
        path: "/owner/quotations",
      },
      {
        name: "Invoices",
        icon: <FaFileInvoiceDollar />,
        path: "/owner/invoices",
      },
      { name: "Payments", icon: <FaCreditCard />, path: "/owner/payments" },
      { name: "DPR", icon: <FaClipboardList />, path: "/owner/dpr" },
      { name: "Analytics", icon: <FaChartBar />, path: "/owner/analytics" },
      { name: "Users", icon: <FaUserShield />, path: "/owner/users" },
      { name: "Settings", icon: <FaCog />, path: "/owner/settings" },
    ],

    admin: [
      {
        name: "Dashboard",
        icon: <FaTachometerAlt />,
        path: "/admin/dashboard",
      },
      { name: "Employees", icon: <FaUsers />, path: "/admin/employees" },
      {
        name: "Attendance",
        icon: <FaCalendarCheck />,
        path: "/admin/attendance",
      },
      { name: "Leave", icon: <FaCalendarAlt />, path: "/admin/leave" },
      { name: "Payroll", icon: <FaMoneyCheckAlt />, path: "/admin/payroll" },
      { name: "Projects", icon: <FaProjectDiagram />, path: "/admin/projects" },
      { name: "Clients", icon: <FaUserTie />, path: "/admin/clients" },
      { name: "Vendors", icon: <FaTruck />, path: "/admin/vendors" },
      { name: "Sites", icon: <FaBuilding />, path: "/admin/sites" },
      { name: "Inventory", icon: <FaBoxes />, path: "/admin/inventory" },
      { name: "Analytics", icon: <FaChartBar />, path: "/admin/analytics" },
      {
        name: "Assets",
        icon: <FaLaptop />,
        path: "/admin/assets",
      },
      {
        name: "Invoices",
        icon: <FaFileInvoiceDollar />,
        path: "/admin/invoices",
      },
      {
        name: "Payments",
        icon: <FaCreditCard />,
        path: "/admin/payments",
      },
      {
        name: "DPR",
        icon: <FaClipboardList />,
        path: "/admin/dpr",
      },
      {
        name: "Users",
        icon: <FaUserShield />,
        path: "/admin/users",
      },
    ],

    hr: [
      { name: "Dashboard", icon: <FaTachometerAlt />, path: "/hr/dashboard" },
      { name: "Employees", icon: <FaUsers />, path: "/hr/employees" },
      { name: "Attendance", icon: <FaCalendarCheck />, path: "/hr/attendance" },
      { name: "Leave", icon: <FaCalendarAlt />, path: "/hr/leave" },
      { name: "Payroll", icon: <FaMoneyCheckAlt />, path: "/hr/payroll" },
      {
        name: "Invoices",
        icon: <FaFileInvoiceDollar />,
        path: "/hr/invoices",
      },
      {
        name: "Payments",
        icon: <FaCreditCard />,
        path: "/hr/payments",
      },
      {
        name: "DPR",
        icon: <FaClipboardList />,
        path: "/hr/dpr",
      },
    ],

    siteengineer: [
      {
        name: "Dashboard",
        icon: <FaTachometerAlt />,
        path: "/siteengineer/dashboard",
      },
      {
        name: "Projects",
        icon: <FaProjectDiagram />,
        path: "/siteengineer/projects",
      },
      {
        name: "Attendance",
        icon: <FaCalendarCheck />,
        path: "/siteengineer/attendance",
      },
      { name: "Sites", icon: <FaBuilding />, path: "/siteengineer/sites" },
      { name: "Inventory", icon: <FaBoxes />, path: "/siteengineer/inventory" },
      {
        name: "DPR",
        icon: <FaClipboardList />,
        path: "/siteengineer/dpr",
      },
    ],
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className={`sidebar ${isOpen ? "sidebar-open" : ""}`}>
      {/* Mobile close button */}
      <button className="sidebar-close-btn" onClick={onClose}>
        <FaTimes />
      </button>

      {/* Logo */}
      <div className="sidebar-logo">
        <h2>KV ERP</h2>
      </div>

      {/* User */}
      <div className="sidebar-user">
        <div className="avatar">{user?.name?.charAt(0)?.toUpperCase()}</div>
        <h3>{user?.name}</h3>
        <p>{user?.role}</p>
      </div>

      {/* Menu */}
      <nav className="sidebar-menu">
        {menuItems[role]?.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={onClose}
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <span>{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button className="logout-btn" onClick={handleLogout}>
        <FaSignOutAlt />
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
