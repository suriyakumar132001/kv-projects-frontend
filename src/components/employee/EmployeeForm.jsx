import "./EmployeeForm.css";

const EmployeeForm = ({
  title,
  formData,
  onChange,
  onSubmit,
  loading,
  submitText,
}) => {
  return (
    <div className="employee-form-page">

      <div className="employee-form-card">

        <div className="form-header">
          <h2>{title}</h2>
          <p>Fill in the employee information below.</p>
        </div>

        <form onSubmit={onSubmit}>

          <div className="form-grid">

            {/* Employee ID */}
            <div className="form-group">
              <label>Employee ID</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={onChange}
                required
              />
            </div>

            {/* Name */}
            <div className="form-group">
              <label>Employee Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={onChange}
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={onChange}
                required
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label>Phone</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={onChange}
                required
              />
            </div>

            {/* Department */}
            <div className="form-group">
              <label>Department</label>

              <select
                name="department"
                value={formData.department}
                onChange={onChange}
                required
              >
                <option value="">Select</option>
                <option value="Civil">Civil</option>
                <option value="Electrical">Electrical</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Accounts">Accounts</option>
                <option value="HR">HR</option>
              </select>
            </div>

            {/* Designation */}
            <div className="form-group">
              <label>Designation</label>

              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={onChange}
                required
              />
            </div>

            {/* Salary */}
            <div className="form-group">
              <label>Salary</label>

              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={onChange}
                required
              />
            </div>

            {/* Joining Date */}
            <div className="form-group">
              <label>Joining Date</label>

              <input
                type="date"
                name="joiningDate"
                value={formData.joiningDate}
                onChange={onChange}
                required
              />
            </div>

            {/* Status */}
            <div className="form-group">
              <label>Status</label>

              <select
                name="status"
                value={formData.status}
                onChange={onChange}
              >
                <option>Active</option>
                <option>Inactive</option>
              </select>
            </div>

            {/* Emergency Contact */}
            <div className="form-group">
              <label>Emergency Contact</label>

              <input
                type="text"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={onChange}
              />
            </div>

          </div>

          {/* Address */}

          <div className="form-group">

            <label>Address</label>

            <textarea
              rows="4"
              name="address"
              value={formData.address}
              onChange={onChange}
            />

          </div>

          <div className="form-actions">

            <button
              type="submit"
              className="save-btn"
              disabled={loading}
            >
              {loading ? "Saving..." : submitText}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
};

export default EmployeeForm;