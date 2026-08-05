import {
  FaMapMarkerAlt,
  FaUserTie,
  FaCalendarAlt,
  FaMoneyBillWave,
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const ProjectCard = ({
  project,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="project-card">

      {/* ===========================
          Header
      =========================== */}

      <div className="project-card-header">

        <div>

          <h3>{project.projectName}</h3>

          <span
            className={`status-badge ${
              project.status === "Completed"
                ? "completed"
                : project.status === "Running"
                ? "running"
                : project.status === "Pending"
                ? "pending"
                : "hold"
            }`}
          >
            {project.status}
          </span>

        </div>

      </div>

      {/* ===========================
          Body
      =========================== */}

      <div className="project-card-body">

        <p>
          <FaUserTie />
          <strong> Client :</strong>{" "}
          {project.clientName}
        </p>

        <p>
          <FaMapMarkerAlt />
          <strong> Location :</strong>{" "}
          {project.location}
        </p>

        <p>
          <FaMoneyBillWave />
          <strong> Budget :</strong>{" "}
          ₹ {Number(project.budget || 0).toLocaleString()}
        </p>

        <p>
          <FaCalendarAlt />
          <strong> Start :</strong>{" "}
          {project.startDate
            ? new Date(project.startDate).toLocaleDateString()
            : "-"}
        </p>

        <p>
          <FaCalendarAlt />
          <strong> End :</strong>{" "}
          {project.endDate
            ? new Date(project.endDate).toLocaleDateString()
            : "-"}
        </p>

        <div className="project-description">

          <strong>Description</strong>

          <p>
            {project.description || "No description available."}
          </p>

        </div>

      </div>

      {/* ===========================
          Footer
      =========================== */}

      <div className="project-card-footer">

        <button
          className="view-btn"
          onClick={() => onView(project)}
        >
          <FaEye />
          View
        </button>

        <button
          className="edit-btn"
          onClick={() => onEdit(project)}
        >
          <FaEdit />
          Edit
        </button>

        <button
          className="delete-btn"
          onClick={() => onDelete(project)}
        >
          <FaTrash />
          Delete
        </button>

      </div>

    </div>
  );
};

export default ProjectCard;