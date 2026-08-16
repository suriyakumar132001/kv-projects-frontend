import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import inventoryService from "../../services/inventoryService";
import siteService from "../../services/siteService";

import "./Inventory.css";

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [sites, setSites] = useState([]);
  const [siteFilter, setSiteFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSites();
  }, []);

  useEffect(() => {
    loadInventory(siteFilter);
  }, [siteFilter]);

  const loadSites = async () => {
    try {
      const res = await siteService.getSites();
      setSites(res.sites || []);
    } catch (error) {
      console.error(error);
    }
  };

  const loadInventory = async (site) => {
    try {
      setLoading(true);
      const res = await inventoryService.getInventory(
        site && site !== "All" ? { site } : {},
      );
      setInventory(res.inventory || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h2 style={{ padding: 24 }}>Loading...</h2>;

  return (
    <div className="pc-page">
      <div className="pc-header">
        <div>
          <h2>Inventory</h2>
          <p className="pc-header-subtitle">
            Current stock by site, updated automatically from Goods Receipts
          </p>
        </div>

        <div className="pc-header-actions">
          <button
            className={`pc-filter-btn ${siteFilter === "All" ? "active" : ""}`}
            onClick={() => setSiteFilter("All")}
          >
            All Sites
          </button>

          {sites.map((s) => (
            <button
              key={s._id}
              className={`pc-filter-btn ${siteFilter === s._id ? "active" : ""}`}
              onClick={() => setSiteFilter(s._id)}
            >
              {s.siteName}
            </button>
          ))}
        </div>
      </div>

      <div className="pc-table-wrapper">
        <table className="pc-table">
          <thead>
            <tr>
              <th>Site</th>
              <th>Material</th>
              <th>Quantity in Stock</th>
              <th>Last Updated</th>
            </tr>
          </thead>

          <tbody>
            {inventory.length > 0 ? (
              inventory.map((item) => (
                <tr key={item._id}>
                  <td>{item.site?.siteName || "-"}</td>
                  <td>{item.materialName}</td>
                  <td>
                    {item.quantity} {item.unit}
                  </td>
                  <td>
                    {item.lastUpdated
                      ? new Date(item.lastUpdated).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="pc-empty">
                  No inventory recorded yet — stock appears here once a Goods
                  Receipt is recorded against a Purchase Order
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryList;
