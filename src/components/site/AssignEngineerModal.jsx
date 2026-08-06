import { useState } from "react";
import "../modal/DeleteModal.css";

const AssignEngineerModal = ({
  isOpen,
  site,
  engineers,
  loading,
  onClose,
  onConfirm,
}) => {
  const [selectedEngineer, setSelectedEngineer] = useState("");

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">

      <div className="delete-modal">

        <div className="modal-header">
          <h2>Assign Site Engineer</h2>
        </div>

        <div className="modal-body">
          <p>Assign an engineer to <strong>{site?.siteName}</strong></p>

          <select
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "15px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
            }}
            value={selectedEngineer}
            onChange={(e) => setSelectedEngineer(e.target.value)}
          >
            <option value="">Select Engineer</option>
            {engineers.map((eng) => (
              <option key={eng._id} value={eng._id}>
                {eng.name} - {eng.email}
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
            onClick={() => onConfirm(selectedEngineer)}
            disabled={loading || !selectedEngineer}
          >
            {loading ? "Assigning..." : "Assign"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default AssignEngineerModal;