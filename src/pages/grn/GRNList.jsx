import { useEffect, useState } from "react";
import { toast } from "react-toastify";

import grnService from "../../services/grnService";

import "./GRN.css";

const GRNList = () => {
  const [grns, setGrns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGRNs();
  }, []);

  const loadGRNs = async () => {
    try {
      setLoading(true);
      const res = await grnService.getGRNs();
      setGrns(res.grns || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load goods receipts");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <h2 style={{ padding: 24 }}>Loading...</h2>;

  return (
    <div className="pc-page">
      <div className="pc-header">
        <div>
          <h2>Goods Receipts</h2>
          <p className="pc-header-subtitle">
            Every delivery recorded against a Purchase Order
          </p>
        </div>
      </div>

      <div className="pc-table-wrapper">
        <table className="pc-table">
          <thead>
            <tr>
              <th>GRN Number</th>
              <th>PO Number</th>
              <th>Site</th>
              <th>Material</th>
              <th>Qty Received</th>
              <th>Condition</th>
              <th>Received By</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {grns.length > 0 ? (
              grns.map((grn) => (
                <tr key={grn._id}>
                  <td>{grn.grnNumber}</td>
                  <td>{grn.purchaseOrder?.poNumber || "-"}</td>
                  <td>{grn.site?.siteName || "-"}</td>
                  <td>{grn.materialName}</td>
                  <td>
                    {grn.quantityReceived} {grn.unit}
                  </td>
                  <td>
                    <span
                      className={`pc-condition-pill ${grn.condition.replace(/\s/g, "")}`}
                    >
                      {grn.condition}
                    </span>
                  </td>
                  <td>{grn.receivedBy?.name || "-"}</td>
                  <td>{new Date(grn.receivedDate).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="pc-empty">
                  No goods receipts recorded yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GRNList;