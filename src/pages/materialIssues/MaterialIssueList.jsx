// ===============================================
// KV Projects ERP
// Material Issue List
// ===============================================
//
// A "material issue" records materials being issued/allocated
// out of inventory to a site or purpose (as opposed to a
// purchase order, which brings materials in).

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Eye, PackageMinus, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";

import materialIssueService from "../../services/materialIssueService";

const MaterialIssueList = () => {
  const navigate = useNavigate();

  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchIssues = async () => {
    try {
      setLoading(true);

      const response = await materialIssueService.getMaterialIssues();

      const data = response?.materialIssues || response?.data || [];

      setIssues(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Failed to fetch material issues:", error);

      toast.error(
        error?.response?.data?.message || "Failed to load material issues",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const filteredIssues = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) return issues;

    return issues.filter((issue) => {
      const issueNumber = issue?.issueNumber || issue?._id || "";

      const materialName = issue?.material?.name || issue?.materialName || "";

      const issuedTo = issue?.issuedTo || issue?.site || "";

      return (
        String(issueNumber).toLowerCase().includes(keyword) ||
        materialName.toLowerCase().includes(keyword) ||
        issuedTo.toLowerCase().includes(keyword)
      );
    });
  }, [issues, search]);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Material Issues</h1>

          <p className="text-sm text-gray-500 mt-1">
            Track materials issued from inventory to sites.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={fetchIssues}
            className="inline-flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
          >
            <RefreshCw size={18} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => navigate("create")}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Issue Material
          </button>
        </div>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-lg bg-blue-50 flex items-center justify-center">
              <PackageMinus className="text-blue-600" size={22} />
            </div>

            <div>
              <p className="text-sm text-gray-500">Total Issues</p>

              <p className="text-2xl font-bold text-gray-900">
                {issues.length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <p className="text-sm text-gray-500">Search Results</p>

          <p className="text-2xl font-bold text-gray-900 mt-1">
            {filteredIssues.length}
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
            placeholder="Search issue number, material, or site..."
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
                  Issue No.
                </th>

                <th className="text-left px-5 py-4 font-semibold text-gray-600">
                  Material
                </th>

                <th className="text-left px-5 py-4 font-semibold text-gray-600">
                  Quantity
                </th>

                <th className="text-left px-5 py-4 font-semibold text-gray-600">
                  Issued To
                </th>

                <th className="text-left px-5 py-4 font-semibold text-gray-600">
                  Date
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
                    Loading material issues...
                  </td>
                </tr>
              ) : filteredIssues.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-5 py-12 text-center">
                    <PackageMinus size={40} className="mx-auto text-gray-300" />

                    <p className="mt-3 font-medium text-gray-700">
                      No material issues found
                    </p>

                    <p className="text-sm text-gray-500 mt-1">
                      Issue a material to get started.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredIssues.map((issue, index) => {
                  const id = issue?._id || issue?.id;

                  const issueNumber = issue?.issueNumber || id;

                  const materialName =
                    issue?.material?.name || issue?.materialName || "-";

                  return (
                    <tr
                      key={id || index}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <td className="px-5 py-4 text-gray-500">{index + 1}</td>

                      <td className="px-5 py-4">
                        <p className="font-semibold text-gray-900">
                          {issueNumber}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {materialName}
                      </td>

                      <td className="px-5 py-4 text-gray-700">
                        {issue?.quantity ?? 0} {issue?.unit || ""}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {issue?.issuedTo || issue?.site || "-"}
                      </td>

                      <td className="px-5 py-4 text-gray-600">
                        {formatDate(issue?.issueDate || issue?.createdAt)}
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

export default MaterialIssueList;
