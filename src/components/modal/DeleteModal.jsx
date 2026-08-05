import "./DeleteModal.css";

const DeleteModal = ({
  isOpen,
  title = "Delete Record",
  message = "Are you sure you want to delete this record?",
  loading = false,
  onClose,
  onConfirm,
}) => {

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">

      <div className="delete-modal">

        <div className="modal-header">
          <h2>{title}</h2>
        </div>

        <div className="modal-body">
          <p>{message}</p>
        </div>

        <div className="modal-footer">

          <button
            className="cancel-btn"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="delete-btn"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>

    </div>
  );
};

export default DeleteModal;