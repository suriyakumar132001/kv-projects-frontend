import { useState } from "react";
import "../modal/DeleteModal.css";

const AssignAssetModal = ({
  isOpen,
  asset,
  sites,
  loading,
  onClose,
  onConfirm,
}) => {
  const [selectedSite, setSelectedSite] = useState("");

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">

      <div className="delete-modal">

        <div className="modal-header">
          <h2>Assign Asset to Site</h2>
        </div>

        <div className="modal-body">
          <p>Assign <strong>{asset?.assetName}</strong> to a site</p>

          <select
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "15px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
            }}
            value={selectedSite}
            onChange={(e) => setSelectedSite(e.target.value)}
          >
            <option value="">Select Site</option>
            {sites.map((site) => (
              <option key={site._id} value={site._id}>
                {site.siteName}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-footer">

          <button className="cancel-btn" onClick={onClose} disabled={loading}>
            Cancel
          </button>

          <button
            className="delete-btn"
            style={{ background: "#2563eb" }}
            onClick={() => onConfirm(selectedSite)}
            disabled={loading || !selectedSite}
          >
            {loading ? "Assigning..." : "Assign"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default AssignAssetModal;