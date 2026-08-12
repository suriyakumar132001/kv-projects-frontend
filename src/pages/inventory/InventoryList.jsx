import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import inventoryService from "../../services/inventoryService";

import InventoryToolbar from "../../components/inventory/InventoryToolbar";
import InventoryTable from "../../components/inventory/InventoryTable";

import "./Inventory.css";

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [siteFilter, setSiteFilter] = useState("");

  useEffect(() => {
    loadInventory();
  }, []);

  const loadInventory = async () => {
    try {
      setLoading(true);

      console.debug("InventoryList: API baseURL", import.meta.env.VITE_API_URL, "token", localStorage.getItem("token"));

      const res = await inventoryService.getInventory();

      console.debug("InventoryList: response", res);

      setInventory(res.inventory || []);
    } catch (error) {
      console.error("InventoryList error:", error);
      if (error.response) {
        console.error("InventoryList error response:", error.response.status, error.response.data);
      }
      toast.error(error.response?.data?.message || "Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  const siteNames = [
    ...new Set(
      inventory
        .map((item) => item.site?.siteName)
        .filter(Boolean)
    ),
  ];

  const filteredInventory = inventory.filter((item) => {
    const searchMatch = item.materialName
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const siteMatch = siteFilter
      ? item.site?.siteName === siteFilter
      : true;

    return searchMatch && siteMatch;
  });

  if (loading) {
    return <h2>Loading Inventory...</h2>;
  }

  return (
    <div className="inventory-page">

      <div className="inventory-header">
        <div>
          <h2>Inventory</h2>
          <p>Track material stock across sites</p>
        </div>
      </div>

      <InventoryToolbar
        search={search}
        setSearch={setSearch}
        siteFilter={siteFilter}
        setSiteFilter={setSiteFilter}
        sites={siteNames}
        onRefresh={loadInventory}
      />

      <InventoryTable inventory={filteredInventory} />

    </div>
  );
};

export default InventoryList;