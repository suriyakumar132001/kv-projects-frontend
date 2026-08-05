import {
  FaProjectDiagram,
  FaPlayCircle,
  FaClock,
  FaCheckCircle,
  FaPauseCircle,
} from "react-icons/fa";

const ProjectStats = ({ stats = {} }) => {
  const {
    totalProjects = 0,
    runningProjects = 0,
    pendingProjects = 0,
    completedProjects = 0,
    onHoldProjects = 0,
  } = stats;

  return (
    <div className="project-stats">

      <div className="stat-card total">

        <div className="stat-icon">
          <FaProjectDiagram />
        </div>

        <div className="stat-content">
          <h4>Total Projects</h4>
          <h2>{totalProjects}</h2>
        </div>

      </div>

      <div className="stat-card running">

        <div className="stat-icon">
          <FaPlayCircle />
        </div>

        <div className="stat-content">
          <h4>Running</h4>
          <h2>{runningProjects}</h2>
        </div>

      </div>

      <div className="stat-card pending">

        <div className="stat-icon">
          <FaClock />
        </div>

        <div className="stat-content">
          <h4>Pending</h4>
          <h2>{pendingProjects}</h2>
        </div>

      </div>

      <div className="stat-card completed">

        <div className="stat-icon">
          <FaCheckCircle />
        </div>

        <div className="stat-content">
          <h4>Completed</h4>
          <h2>{completedProjects}</h2>
        </div>

      </div>

      <div className="stat-card hold">

        <div className="stat-icon">
          <FaPauseCircle />
        </div>

        <div className="stat-content">
          <h4>On Hold</h4>
          <h2>{onHoldProjects}</h2>
        </div>

      </div>

    </div>
  );
};

export default ProjectStats;