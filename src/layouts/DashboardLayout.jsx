import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import ChatAssistant from "../components/ai/ChatAssistant";

import "./DashboardLayout.css";

const COLLAPSE_KEY = "kv_sidebar_collapsed";

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Desktop icon-rail collapse — remembered across visits.
  const [collapsed, setCollapsed] = useState(
    () => localStorage.getItem(COLLAPSE_KEY) === "true",
  );

  const location = useLocation();

  useEffect(() => {
    localStorage.setItem(COLLAPSE_KEY, String(collapsed));
  }, [collapsed]);

  // Close the mobile drawer automatically whenever the route changes,
  // so navigating never leaves the overlay stuck open.
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);
  const toggleCollapse = () => setCollapsed((prev) => !prev);

  return (
    <div className="dashboard-layout">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
      />

      {sidebarOpen && (
        <div className="sidebar-backdrop" onClick={closeSidebar} />
      )}

      <div className="dashboard-main">
        <Navbar onMenuClick={toggleSidebar} />
        <ChatAssistant />

        {/* key={pathname} remounts the animation (not the page) on every
            navigation, giving the "content slides/fades in" feel the
            sidebar toggle already has. */}
        <main
          className="dashboard-content page-transition"
          key={location.pathname}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
