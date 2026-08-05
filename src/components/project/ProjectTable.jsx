import {
  FaEye,
  FaEdit,
  FaTrash,
} from "react-icons/fa";

const ProjectTable = ({
  projects,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="table-container">

      <table className="erp-table">

        <thead>

          <tr>
            <th>#</th>
            <th>Project Name</th>
            <th>Client</th>
            <th>Location</th>
            <th>Budget</th>
            <th>Status</th>
            <th>Created On</th>
            <th>Actions</th>
          </tr>

        </thead>

        <tbody>

          {projects.length > 0 ? (

            projects.map((project, index) => (

              <tr key={project._id}>

                <td>{index + 1}</td>

                <td>
                  <strong>
                    {project.projectName}
                  </strong>
                </td>

                <td>
                  {project.clientName}
                </td>

                <td>
                  {project.location}
                </td>

                <td>
                  ₹{" "}
                  {Number(
                    project.budget || 0
                  ).toLocaleString()}
                </td>

                <td>

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

                </td>

                <td>
                  {project.createdAt
                    ? new Date(
                        project.createdAt
                      ).toLocaleDateString()
                    : "-"}
                </td>

                <td>

                  <div className="action-buttons">

                    <button
                      className="view-btn"
                      onClick={() =>
                        onView(project)
                      }
                      title="View"
                    >
                      <FaEye />
                    </button>

                    <button
                      className="edit-btn"
                      onClick={() =>
                        onEdit(project)
                      }
                      title="Edit"
                    >
                      <FaEdit />
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() =>
                        onDelete(project)
                      }
                      title="Delete"
                    >
                      <FaTrash />
                    </button>

                  </div>

                </td>

              </tr>

            ))

          ) : (

            <tr>

              <td
                colSpan="8"
                style={{
                  textAlign: "center",
                  padding: "30px",
                }}
              >
                No Projects Found
              </td>

            </tr>

          )}

        </tbody>

      </table>

    </div>
  );
};

export default ProjectTable;