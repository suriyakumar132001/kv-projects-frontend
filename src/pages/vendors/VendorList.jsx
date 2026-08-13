// ===============================================
// KV Projects ERP
// Vendor List
// ===============================================

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Eye, Edit, Truck, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";

import vendorService from "../../services/vendorService";
import "./Vendor.css";

const VendorList = () => {
  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchVendors = async () => {
    try {
      setLoading(true);

      const response = await vendorService.getVendors();

      const data = response?.vendors || response?.data || [];

      setVendors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch vendors:", error);

      toast.error(error?.response?.data?.message || "Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  const filteredVendors = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return vendors;

    return vendors.filter((vendor) => {
      const name = vendor?.name || vendor?.vendorName || "";
      const company = vendor?.company || "";
      const category = vendor?.category || "";
      const contact = vendor?.contactNumber || "";

      return (
        name.toLowerCase().includes(keyword) ||
        company.toLowerCase().includes(keyword) ||
        category.toLowerCase().includes(keyword) ||
        contact.toLowerCase().includes(keyword)
      );
    });
  }, [vendors, search]);

  return (
    <div className="vendor-page">
      <div className="vendor-header">
        <div className="vendor-header-left">
          <h1>Vendors</h1>
          <p>Manage suppliers and vendor records.</p>
        </div>

        <div className="vendor-header-actions">
          <button
            type="button"
            onClick={fetchVendors}
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
            Add Vendor
          </button>
        </div>
      </div>

      <div className="vendor-kpis">
        <div className="kpi-card">
          <div className="kpi-icon">
            <Truck size={22} />
          </div>
          <div>
            <p className="kpi-label">Total Vendors</p>
            <p className="kpi-value">{vendors.length}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">
            <Search size={22} />
          </div>
          <div>
            <p className="kpi-label">Search Results</p>
            <p className="kpi-value">{filteredVendors.length}</p>
          </div>
        </div>

        <div className="kpi-card">
          <div className="kpi-icon">
            <Truck size={22} />
          </div>
          <div>
            <p className="kpi-label">Active Vendors</p>
            <p className="kpi-value">
              {
                vendors.filter(
                  (vendor) => (vendor?.status || "Active") === "Active",
                ).length
              }
            </p>
          </div>
        </div>
      </div>

      <div className="vendor-search-card">
        <div className="vendor-search-box">
          <Search size={18} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vendor..."
          />
        </div>
      </div>

      <div className="vendor-table-card">
        <div className="table-wrapper">
          <table className="vendor-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Vendor</th>
                <th>Company</th>
                <th>Category</th>
                <th>Contact</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="table-loading">
                    Loading vendors...
                  </td>
                </tr>
              ) : filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    <div className="table-empty">
                      <Truck size={40} />
                      <p>No vendors found</p>
                      <p>Add a vendor to get started.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredVendors.map((vendor, index) => {
                  const id = vendor?._id || vendor?.id;
                  const name =
                    vendor?.name || vendor?.vendorName || "Unnamed Vendor";
                  const status = vendor?.status || "Active";

                  return (
                    <tr key={id || index}>
                      <td>{index + 1}</td>

                      <td className="vendor-name">{name}</td>

                      <td>{vendor?.company || "-"}</td>

                      <td>{vendor?.category || "-"}</td>

                      <td>{vendor?.contactNumber || "-"}</td>

                      <td>
                        <span
                          className={`status-pill ${status === "Active" ? "active" : "inactive"}`}
                        >
                          {status}
                        </span>
                      </td>

                      <td>
                        <div className="vendor-actions">
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

export default VendorList;
