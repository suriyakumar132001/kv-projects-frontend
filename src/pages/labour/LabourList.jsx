// ===============================================
// KV Projects ERP
// Labour List
// ===============================================

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Eye, Edit, Users, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";

import labourService from "../../services/labourService";
import "./Labour.css";

const LabourList = () => {
  const navigate = useNavigate();

  const [labours, setLabours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchLabours = async () => {
    try {
      setLoading(true);

      const response = await labourService.getLabours();

      const data = response?.attendance || response?.labours || response?.data || [];

      setLabours(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch labour records:", error);

      toast.error(
        error?.response?.data?.message || "Failed to load labour records",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLabours();
  }, []);

  const filteredLabours = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return labours;

    return labours.filter((labour) => {
      const name = labour?.name || "";

      const role = labour?.role || "";

      const contact = labour?.contactNumber || "";

      return (
        name.toLowerCase().includes(keyword) ||
        role.toLowerCase().includes(keyword) ||
        contact.toLowerCase().includes(keyword)
      );
    });
  }, [labours, search]);

  const formatAmount = (amount) => {
    const value = Number(amount || 0);

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="labour-page">
      {/* Header */}
      <div className="labour-header">
        <div className="labour-header-left">
          <h1>Labour</h1>
          <p>Manage labour records and wage details.</p>
        </div>

        <div className="labour-header-actions">
          <button
            type="button"
            onClick={fetchLabours}
            className="btn btn-outline"
          >
            <RefreshCw size={18} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => navigate("add")}
            className="btn btn-primary"
          >
            <Plus size={18} />
            Add Labour
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="labour-kpis">
        <div className="kpi-card">
          <div className="kpi-icon">
            <Users size={22} />
          </div>
          <div>
            <p className="kpi-label">Total Labour</p>
            <p className="kpi-value">{labours.length}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">
            <Search size={22} />
          </div>
          <div>
            <p className="kpi-label">Search Results</p>
            <p className="kpi-value">{filteredLabours.length}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">
            <Users size={22} />
          </div>
          <div>
            <p className="kpi-label">Active Labour</p>
            <p className="kpi-value">
              {
                labours.filter(
                  (labour) => (labour?.status || "Active") === "Active",
                ).length
              }
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="labour-search-card">
        <div className="labour-search-box">
          <Search size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search labour..."
          />
        </div>
      </div>

      {/* Table */}
      <div className="labour-table-card">
        <div className="table-wrapper">
          <table className="labour-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Role</th>
                <th>Contact</th>
                <th>Wage Type</th>
                <th>Wage Rate</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="table-loading">
                    Loading labour records...
                  </td>
                </tr>
              ) : filteredLabours.length === 0 ? (
                <tr>
                  <td colSpan="8">
                    <div className="table-empty">
                      <Users size={40} />
                      <p>No labour records found</p>
                      <p>Add a labour record to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLabours.map((labour, index) => {
                  const id = labour?._id || labour?.id;

                  const name = labour?.name || "Unnamed";

                  const status = labour?.status || "Active";

                  return (
                    <tr key={id || index}>
                      <td>{index + 1}</td>

                      <td className="labour-name">{name}</td>

                      <td>{labour?.role || "-"}</td>

                      <td>{labour?.contactNumber || "-"}</td>

                      <td>{labour?.wageType || "-"}</td>

                      <td>{formatAmount(labour?.wageRate || 0)}</td>

                      <td>
                        <span
                          className={`status-pill ${status === "Active" ? "active" : "inactive"}`}
                        >
                          {status}
                        </span>
                      </td>

                      <td>
                        <div className="labour-actions">
                          <button
                            type="button"
                            title="View"
                            onClick={() => navigate(`view/${id}`)}
                            className="btn-icon view"
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            type="button"
                            title="Edit"
                            onClick={() => navigate(`edit/${id}`)}
                            className="btn-icon edit"
                          >
                            <Edit size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LabourList;
