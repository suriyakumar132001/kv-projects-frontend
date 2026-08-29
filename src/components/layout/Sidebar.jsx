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
  FaDolly,
  FaShoppingCart,
  FaClipboardCheck,
  FaMapMarkedAlt,
  FaUserPlus,
  FaChartLine,
  FaAngleLeft,
  FaAngleRight,
  FaHardHat,
} from "react-icons/fa";

import "./Sidebar.css";

const Sidebar = ({ isOpen, onClose, collapsed, onToggleCollapse }) => {
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
      {
        name: "Attendance Map",
        icon: <FaMapMarkedAlt />,
        path: "/owner/attendance-map",
      },
      { name: "Leave", icon: <FaCalendarAlt />, path: "/owner/leave" },
      { name: "Payroll", icon: <FaMoneyCheckAlt />, path: "/owner/payroll" },
      { name: "Labour", icon: <FaHardHat />, path: "/owner/labour" },
      { name: "Projects", icon: <FaProjectDiagram />, path: "/owner/projects" },
      { name: "Leads", icon: <FaUserPlus />, path: "/owner/leads" },
      {
        name: "CRM Dashboard",
        icon: <FaChartLine />,
        path: "/owner/crm/dashboard",
      },
      { name: "Clients", icon: <FaUserTie />, path: "/owner/clients" },
      { name: "Vendors", icon: <FaTruck />, path: "/owner/vendors" },
      { name: "Sites", icon: <FaBuilding />, path: "/owner/sites" },
      { name: "Inventory", icon: <FaBoxes />, path: "/owner/inventory" },
      {
        name: "Material Requests",
        icon: <FaDolly />,
        path: "/owner/material-requests",
      },
      {
        name: "Purchase Orders",
        icon: <FaShoppingCart />,
        path: "/owner/purchase-orders",
      },
      {
        name: "Goods Receipts",
        icon: <FaClipboardCheck />,
        path: "/owner/grn",
      },
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
      {
        name: "Attendance Map",
        icon: <FaMapMarkedAlt />,
        path: "/admin/attendance-map",
      },
      { name: "Leave", icon: <FaCalendarAlt />, path: "/admin/leave" },
      { name: "Payroll", icon: <FaMoneyCheckAlt />, path: "/admin/payroll" },
      { name: "Labour", icon: <FaHardHat />, path: "/admin/labour" },
      { name: "Projects", icon: <FaProjectDiagram />, path: "/admin/projects" },
      { name: "Leads", icon: <FaUserPlus />, path: "/admin/leads" },
      {
        name: "CRM Dashboard",
        icon: <FaChartLine />,
        path: "/admin/crm/dashboard",
      },
      { name: "Clients", icon: <FaUserTie />, path: "/admin/clients" },
      { name: "Vendors", icon: <FaTruck />, path: "/admin/vendors" },
      { name: "Sites", icon: <FaBuilding />, path: "/admin/sites" },
      { name: "Inventory", icon: <FaBoxes />, path: "/admin/inventory" },
      {
        name: "Material Requests",
        icon: <FaDolly />,
        path: "/admin/material-requests",
      },
      {
        name: "Purchase Orders",
        icon: <FaShoppingCart />,
        path: "/admin/purchase-orders",
      },
      {
        name: "Goods Receipts",
        icon: <FaClipboardCheck />,
        path: "/admin/grn",
      },
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
      { name: "Labour", icon: <FaHardHat />, path: "/hr/labour" },
      {
        name: "Material Requests",
        icon: <FaDolly />,
        path: "/hr/material-requests",
      },
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
    // =====================================================
    // ACCOUNTANT
    // =====================================================

    accountant: [
      {
        name: "Dashboard",
        icon: <FaTachometerAlt />,
        path: "/accountant/dashboard",
      },

      { name: "Leave", icon: <FaCalendarAlt />, path: "/accountant/leave" },

      {
        name: "Invoices",
        icon: <FaFileInvoiceDollar />,
        path: "/accountant/invoices",
      },

      {
        name: "Payments",
        icon: <FaCreditCard />,
        path: "/accountant/payments",
      },

      {
        name: "Expenses",
        icon: <FaFileInvoice />,
        path: "/accountant/expenses",
      },

      {
        name: "Quotations",
        icon: <FaFileInvoice />,
        path: "/accountant/quotations",
      },

      {
        name: "Leads",
        icon: <FaUserPlus />,
        path: "/accountant/leads",
      },
      {
        name: "CRM Dashboard",
        icon: <FaChartLine />,
        path: "/accountant/crm/dashboard",
      },
      {
        name: "Clients",
        icon: <FaUserTie />,
        path: "/accountant/clients",
      },

      {
        name: "Analytics",
        icon: <FaChartBar />,
        path: "/accountant/analytics",
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
      { name: "Leave", icon: <FaCalendarAlt />, path: "/siteengineer/leave" },
      { name: "Labour", icon: <FaHardHat />, path: "/siteengineer/labour" },
      { name: "Sites", icon: <FaBuilding />, path: "/siteengineer/sites" },
      { name: "Inventory", icon: <FaBoxes />, path: "/siteengineer/inventory" },
      {
        name: "Material Requests",
        icon: <FaDolly />,
        path: "/siteengineer/material-requests",
      },
      {
        name: "Purchase Orders",
        icon: <FaShoppingCart />,
        path: "/siteengineer/purchase-orders",
      },
      {
        name: "Goods Receipts",
        icon: <FaClipboardCheck />,
        path: "/siteengineer/grn",
      },
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
    <aside
      className={`sidebar ${isOpen ? "sidebar-open" : ""} ${
        collapsed ? "sidebar-collapsed" : ""
      }`}
    >
      {/* Mobile close button */}
      <button className="sidebar-close-btn" onClick={onClose}>
        <FaTimes />
      </button>

      {/* Desktop collapse / expand handle */}
      <button
        className="sidebar-collapse-btn"
        onClick={onToggleCollapse}
        title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <FaAngleRight /> : <FaAngleLeft />}
      </button>

      {/* Logo */}
      <div className="sidebar-logo">
        <h2>{collapsed ? "KV" : "KV ERP"}</h2>
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
            data-tooltip={item.name}
            className={({ isActive }) =>
              isActive ? "menu-item active" : "menu-item"
            }
          >
            <span className="menu-icon">{item.icon}</span>
            <span className="menu-label">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <button
        className="logout-btn"
        onClick={handleLogout}
        data-tooltip="Logout"
      >
        <FaSignOutAlt />
        <span className="logout-label">Logout</span>
      </button>
    </aside>
  );
};

export default Sidebar;
