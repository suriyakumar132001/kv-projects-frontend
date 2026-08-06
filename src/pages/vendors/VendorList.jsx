import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import vendorService from "../../services/vendorService";

import VendorToolbar from "../../components/vendor/VendorToolbar";
import VendorTable from "../../components/vendor/VendorTable";

import "./Vendor.css";

const VendorList = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [materialType, setMaterialType] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      setLoading(true);

      const res = await vendorService.getVendors();

      setVendors(res.vendors || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load vendors");
    } finally {
      setLoading(false);
    }
  };

  const filteredVendors = vendors.filter((item) => {
    const searchMatch = item.vendorName
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const materialMatch = materialType
      ? item.materialType === materialType
      : true;

    const statusMatch = status ? item.status === status : true;

    return searchMatch && materialMatch && statusMatch;
  });

  if (loading) {
    return <h2>Loading Vendors...</h2>;
  }

  return (
    <div className="vendor-page">

      <div className="vendor-header">
        <div>
          <h2>Vendors</h2>
          <p>Manage material suppliers</p>
        </div>
      </div>

      <VendorToolbar
        search={search}
        setSearch={setSearch}
        materialType={materialType}
        setMaterialType={setMaterialType}
        status={status}
        setStatus={setStatus}
        onAddVendor={() => navigate(`/${role}/vendors/add`)}
      />

      <VendorTable vendors={filteredVendors} />

    </div>
  );
};

export default VendorList;