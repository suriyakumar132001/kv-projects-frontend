import { useEffect, useState } from "react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

import "./Dashboard.css";

const RADIUS = 70;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Animates a number from 0 up to `target` whenever `target` changes.
const useCountUp = (target, duration = 900) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf;
    const start = performance.now();

    const tick = (now) => {
      const progress = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(target * eased));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);

  return value;
};

const Dashboard = () => {
  const { user: authUser } = useAuth();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    employees: 0,
    projects: 0,
    attendance: 0,
    revenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [ringReady, setRingReady] = useState(false);

  useEffect(() => {
    getDashboard();
  }, []);

  const getDashboard = async () => {
    try {
      const role = authUser?.role?.toLowerCase();
      const res = await api.get(`/dashboard/${role}`);

      setUser(res.data.user);
      setStats(res.data.stats || {});
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Trigger the ring's draw-in animation just after real data has arrived.
  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => setRingReady(true), 200);
      return () => clearTimeout(t);
    }
  }, [loading]);

  const employees = useCountUp(stats.employees ?? 0);
  const projects = useCountUp(stats.projects ?? 0);
  const attendance = useCountUp(stats.attendance ?? 0);
  const revenue = useCountUp(Number(stats.revenue) || 0, 1100);

  // Real derived metric (not fabricated): how much of today's workforce
  // has been marked present, out of total employees.
  const attendanceRate =
    stats.employees > 0
      ? Math.min(100, Math.round((stats.attendance / stats.employees) * 100))
      : 0;

  const ringOffset = ringReady
    ? CIRCUMFERENCE - (attendanceRate / 100) * CIRCUMFERENCE
    : CIRCUMFERENCE;

  if (loading) return <h2>Loading Dashboard...</h2>;
  if (!user) return <h2>Unable to load dashboard</h2>;

  return (
    <div className="dashboard">
      <div className="welcome-card">
        <div className="welcome-inner">
          <div className="welcome-text">
            <h1>
              Welcome, {user.name} <span className="wave">👋</span>
            </h1>
            <div className="welcome-meta">
              <p>
                Role: <strong>{user.role}</strong>
              </p>
              <p>
                Status:{" "}
                <span
                  className={`status-chip ${
                    user.status === "Active" ? "is-active" : ""
                  }`}
                >
                  {user.status}
                </span>
              </p>
              <p>Email: {user.email}</p>
              <p>Phone: {user.phone}</p>
            </div>
          </div>

          <div className="attendance-ring">
            <svg viewBox="0 0 160 160" width="150" height="150">
              <circle className="ring-track" cx="80" cy="80" r={RADIUS} />
              <circle
                className="ring-bar"
                cx="80"
                cy="80"
                r={RADIUS}
                style={{
                  strokeDasharray: CIRCUMFERENCE,
                  strokeDashoffset: ringOffset,
                }}
              />
            </svg>
            <div className="ring-label">
              <b>{attendanceRate}%</b>
              <span>Today's Attendance</span>
            </div>
          </div>
        </div>
      </div>

      <div className="cards">
        <div className="card c-emp">
          <div className="card-icon">👥</div>
          <h2>Employees</h2>
          <h1>{employees}</h1>
          <div className="accent-bar" />
        </div>

        <div className="card c-proj">
          <div className="card-icon">📐</div>
          <h2>Projects</h2>
          <h1>{projects}</h1>
          <div className="accent-bar" />
        </div>

        <div className="card c-att">
          <div className="card-icon">🗓</div>
          <h2>Attendance</h2>
          <h1>{attendance}</h1>
          <div className="accent-bar" />
        </div>

        <div className="card c-rev">
          <div className="card-icon">₹</div>
          <h2>Revenue</h2>
          <h1>₹ {revenue.toLocaleString("en-IN")}</h1>
          <div className="accent-bar" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
