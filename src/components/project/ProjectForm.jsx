import { FaSave, FaTimes } from "react-icons/fa";

const ProjectForm = ({
  formData,
  handleChange,
  handleSubmit,
  loading = false,
  onCancel,
}) => {
  return (
    <form
      className="project-form"
      onSubmit={handleSubmit}
    >
      <div className="form-grid">

        {/* Project Name */}
        <div className="form-group">
          <label>Project Name *</label>

          <input
            type="text"
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            placeholder="Enter Project Name"
            required
          />
        </div>

        {/* Client Name */}
        <div className="form-group">
          <label>Client Name *</label>

          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            placeholder="Enter Client Name"
            required
          />
        </div>

        {/* Location */}
        <div className="form-group">
          <label>Location *</label>

          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter Project Location"
            required
          />
        </div>

        {/* Budget */}
        <div className="form-group">
          <label>Budget *</label>

          <input
            type="number"
            name="budget"
            value={formData.budget}
            onChange={handleChange}
            placeholder="Enter Budget"
            required
          />
        </div>

        {/* Start Date */}
        <div className="form-group">
          <label>Start Date</label>

          <input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
          />
        </div>

        {/* End Date */}
        <div className="form-group">
          <label>End Date</label>

          <input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
          />
        </div>

        {/* Status */}
        <div className="form-group">
          <label>Status</label>

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Pending">Pending</option>
            <option value="Running">Running</option>
            <option value="Completed">Completed</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>

      </div>

      {/* Description */}

      <div className="form-group">

        <label>Description</label>

        <textarea
          name="description"
          rows="5"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter Project Description"
        />

      </div>

      {/* Buttons */}

      <div className="form-actions">

        <button
          type="submit"
          className="save-btn"
          disabled={loading}
        >
          <FaSave />

          {loading ? " Saving..." : " Save Project"}
        </button>

        <button
          type="button"
          className="cancel-btn"
          onClick={onCancel}
        >
          <FaTimes />
          Cancel
        </button>

      </div>

    </form>
  );
};

export default ProjectForm;