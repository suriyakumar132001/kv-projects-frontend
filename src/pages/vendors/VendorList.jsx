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
import "./VendorList.css";

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
      <div className="vendor-container p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Vendors</h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage suppliers and vendor records.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={fetchVendors}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw size={18} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => navigate("add")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Add Vendor
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
              <Truck className="text-blue-600" size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Vendors</p>

              <p className="text-2xl font-bold text-gray-900">
                {vendors.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Search Results</p>

          <p className="text-2xl font-bold text-gray-900 mt-1">
            {filteredVendors.length}
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Active Vendors</p>

          <p className="text-2xl font-bold text-gray-900 mt-1">
            {
              vendors.filter(
                (vendor) => (vendor?.status || "Active") === "Active",
              ).length
            }
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="relative max-w-md">
          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search vendor..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-5 py-4 font-semibold text-gray-600">
                  #
                </th>

                <th className="text-left px-5 py-4 font-semibold text-gray-600">
                  Vendor
                </th>

                <th className="text-left px-5 py-4 font-semibold text-gray-600">
                  Company
                </th>

                <th className="text-left px-5 py-4 font-semibold text-gray-600">
                  Category
                </th>

                <th className="text-left px-5 py-4 font-semibold text-gray-600">
                  Contact
                </th>

                <th className="text-left px-5 py-4 font-semibold text-gray-600">
                  Status
                </th>

                <th className="text-right px-5 py-4 font-semibold text-gray-600">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-12 text-center text-gray-500"
                  >
                    Loading vendors...
                  </td>
                </tr>
              ) : filteredVendors.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center">
                    <Truck size={40} className="mx-auto text-gray-300" />

                    <p className="mt-3 font-medium text-gray-700">
                      No vendors found
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Add a vendor to get started.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredVendors.map((vendor, index) => {
                  const id = vendor?._id || vendor?.id;

                  const name =
                    vendor?.name || vendor?.vendorName || "Unnamed Vendor";

                  const status = vendor?.status || "Active";

                  return (
                    <tr
                      key={id || index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4 text-gray-500">{index + 1}</td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900">{name}</p>
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {vendor?.company || "-"}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {vendor?.category || "-"}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {vendor?.contactNumber || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            status === "Active"
                              ? "bg-green-50 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {status}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            title="View"
                            onClick={() => navigate(`view/${id}`)}
                            className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                          >
                            <Eye size={18} />
                          </button>

                          <button
                            type="button"
                            title="Edit"
                            onClick={() => navigate(`edit/${id}`)}
                            className="p-2 rounded-lg text-green-600 hover:bg-green-50"
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
    </div>
  );
};

export default VendorList;
