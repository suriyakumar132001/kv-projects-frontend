import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import assetService from "../../services/assetService";

import "./Asset.css";

const AssetDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAsset();
  }, []);

  const loadAsset = async () => {
    try {
      const res = await assetService.getAsset(id);

      setAsset(res.asset);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load asset details");

      navigate(`/${role}/assets`);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (!asset) {
    return <h2>Asset not found</h2>;
  }

  return (
    <div className="asset-form-page">

      <div className="details-card">

        <h2>Asset Details</h2>

        <div className="details-grid">

          <div>
            <label>Asset Code</label>
            <p>{asset.assetCode}</p>
          </div>

          <div>
            <label>Asset Name</label>
            <p>{asset.assetName}</p>
          </div>

          <div>
            <label>Category</label>
            <p>{asset.category}</p>
          </div>

          <div>
            <label>Status</label>
            <p>{asset.status}</p>
          </div>

          <div>
            <label>Site</label>
            <p>{asset.site?.siteName || "Unassigned"}</p>
          </div>

          <div>
            <label>Assigned To</label>
            <p>{asset.assignedTo?.name || "-"}</p>
          </div>

          <div>
            <label>Purchase Date</label>
            <p>
              {asset.purchaseDate
                ? new Date(asset.purchaseDate).toLocaleDateString()
                : "-"}
            </p>
          </div>

          <div>
            <label>Purchase Cost</label>
            <p>₹ {Number(asset.purchaseCost || 0).toLocaleString()}</p>
          </div>

          <div className="full-width">
            <label>Remarks</label>
            <p>{asset.remarks || "No Remarks"}</p>
          </div>

        </div>

        <button
          className="back-btn"
          onClick={() => navigate(`/${role}/assets`)}
        >
          Back
        </button>

      </div>

    </div>
  );
};

export default AssetDetails;