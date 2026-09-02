import { useState } from "react";

import FaceCapture from "../FaceCapture";

import "./EmployeeForm.css";

// Uploaded images are served from the backend's root (e.g. /uploads/xyz.jpg),
// not under /api — same convention as DPRDetails.jsx.
const BACKEND_ORIGIN = (import.meta.env.VITE_API_URL || "").replace(
  /\/api\/?$/,
  "",
);

const EmployeeForm = ({
  title,
  formData,
  onChange,
  onSubmit,
  loading,
  submitText,
  // ---- Face enrollment on Edit Employee (existing employee) ----
  employeeId,
  faceEnrolledAt,
  onEnrollFace,
  onRemoveFace,
  faceSaving,
  // ---- Face capture on Add Employee (before the employee exists) ----
  // Captured in-memory here and sent along with the create request in
  // one step (see AddEmployee.jsx), instead of a separate Edit-page
  // visit afterwards.
  pendingFaceDescriptor,
  onCapturePendingFace,
  onClearPendingFace,
  // ---- Profile photo on Edit Employee (existing employee) ----
  // A visible photo, separate from the face descriptor above — see
  // the comment on Employee.profilePhoto in models/Employee.js.
  profilePhotoPath,
  onUploadPhoto,
  onRemovePhoto,
  photoSaving,
  // ---- Profile photo on Add Employee (before the employee exists) ----
  // Held as a plain File in memory here; the actual upload happens
  // after the employee is created (see AddEmployee.jsx) since the
  // photo endpoint needs an employee id to attach to.
  pendingPhotoFile,
  onSelectPendingPhoto,
  onClearPendingPhoto,
  // ---- Login access on Add Employee only ----
  // Not every Employee needs a login — labourers billed through
  // Labour Bills, for instance, never sign into the ERP. This toggle
  // decides whether AddEmployee.jsx calls the merged
  // /auth/register flow (creates a User + linked Employee) or the
  // plain Employee-only createEmployee endpoint.
  createLogin,
  onToggleCreateLogin,
  loginRole,
  onLoginRoleChange,
  loginPassword,
  onLoginPasswordChange,
  availableLoginRoles,
}) => {
  const [showCapture, setShowCapture] = useState(false);

  const photoUrl = profilePhotoPath
    ? `${BACKEND_ORIGIN}/${profilePhotoPath}`
    : null;

  const pendingPhotoPreview = pendingPhotoFile
    ? URL.createObjectURL(pendingPhotoFile)
    : null;

  const handlePhotoInputChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      window.alert("Please choose an image file (JPG, PNG, or WEBP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      window.alert("Image must be 5MB or smaller.");
      return;
    }

    if (employeeId && onUploadPhoto) {
      onUploadPhoto(file);
    } else if (onSelectPendingPhoto) {
      onSelectPendingPhoto(file);
    }

    // Allow re-selecting the same file later (e.g. after removing it)
    e.target.value = "";
  };

  const handleCapture = async (descriptor) => {
    if (!onEnrollFace) return;
    await onEnrollFace(descriptor);
    setShowCapture(false);
  };

  const handlePendingCapture = (descriptor) => {
    if (!onCapturePendingFace) return;
    onCapturePendingFace(descriptor);
    setShowCapture(false);
  };

  const handleRemove = () => {
    if (!onRemoveFace) return;
    if (
      window.confirm(
        "Remove this employee's enrolled face? They will need to be re-enrolled before face verification works for them again.",
      )
    ) {
      onRemoveFace();
    }
  };

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
              {!employeeId && createLogin ? (
                <input
                  type="text"
                  value="Auto-generated on save"
                  disabled
                  title="Employees with login access get an auto-generated ID, same as accounts created from Add User."
                />
              ) : (
                <input
                  type="text"
                  name="employeeId"
                  value={formData.employeeId}
                  onChange={onChange}
                  required
                />
              )}
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

              <select name="status" value={formData.status} onChange={onChange}>
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

          {/* Login Access — Add Employee only. Editing an existing
              employee's login (role, password) is a User-module concern,
              handled from the Users page, not here. */}
          {!employeeId && (
            <div className="form-group face-enrollment">
              <label className="login-toggle-label">
                <input
                  type="checkbox"
                  checked={createLogin}
                  onChange={(e) => onToggleCreateLogin?.(e.target.checked)}
                />
                Create login access for this employee
              </label>
              <p className="face-enrollment-hint">
                Turn this on for staff who need to sign into the ERP (Site
                Engineer, HR, Accountant, Admin). Leave it off for field labour
                tracked only through DPR/Labour Bills — they never need to log
                in.
              </p>

              {createLogin && (
                <div className="form-grid" style={{ marginTop: 12 }}>
                  <div className="form-group">
                    <label>Role</label>
                    <select
                      value={loginRole}
                      onChange={(e) => onLoginRoleChange?.(e.target.value)}
                      required={createLogin}
                    >
                      <option value="">Select role</option>
                      {availableLoginRoles?.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Temporary Password</label>
                    <input
                      type="password"
                      placeholder="At least 6 characters"
                      value={loginPassword}
                      onChange={(e) => onLoginPasswordChange?.(e.target.value)}
                      required={createLogin}
                      minLength={6}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Profile Photo */}
          <div className="form-group face-enrollment">
            <label>Profile Photo</label>

            <div className="face-enrollment-status">
              {photoUrl || pendingPhotoPreview ? (
                <img
                  src={pendingPhotoPreview || photoUrl}
                  alt="Employee"
                  className="employee-photo-preview"
                />
              ) : (
                <span className="face-enrollment-badge not-enrolled">
                  No photo
                </span>
              )}

              <label
                className="face-enrollment-btn"
                style={{ cursor: "pointer" }}
              >
                {photoSaving
                  ? "Uploading..."
                  : photoUrl || pendingPhotoPreview
                    ? "Replace"
                    : "Upload Photo"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoInputChange}
                  disabled={photoSaving}
                  style={{ display: "none" }}
                />
              </label>

              {employeeId && photoUrl && onRemovePhoto && (
                <button
                  type="button"
                  className="face-enrollment-btn danger"
                  onClick={onRemovePhoto}
                  disabled={photoSaving}
                >
                  Remove
                </button>
              )}

              {!employeeId && pendingPhotoFile && onClearPendingPhoto && (
                <button
                  type="button"
                  className="face-enrollment-btn danger"
                  onClick={onClearPendingPhoto}
                >
                  Remove
                </button>
              )}
            </div>
          </div>

          {/* Face Enrollment */}
          <div className="form-group face-enrollment">
            <label>Face Enrollment</label>

            {!employeeId ? (
              // ---- Add Employee: capture now, saved with the employee
              // on submit (createEmployee accepts faceDescriptor) ----
              showCapture ? (
                <FaceCapture
                  captureLabel="Capture Face"
                  helperText="Center the employee's face in the frame and click capture."
                  onCapture={handlePendingCapture}
                  onCancel={() => setShowCapture(false)}
                />
              ) : pendingFaceDescriptor ? (
                <div className="face-enrollment-status">
                  <span className="face-enrollment-badge enrolled">
                    Face captured — will be saved with this employee
                  </span>
                  <button
                    type="button"
                    className="face-enrollment-btn"
                    onClick={() => setShowCapture(true)}
                  >
                    Recapture
                  </button>
                  <button
                    type="button"
                    className="face-enrollment-btn danger"
                    onClick={onClearPendingFace}
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="face-enrollment-status">
                  <span className="face-enrollment-badge not-enrolled">
                    Not captured
                  </span>
                  <button
                    type="button"
                    className="face-enrollment-btn"
                    onClick={() => setShowCapture(true)}
                  >
                    Capture Face
                  </button>
                </div>
              )
            ) : showCapture ? (
              <FaceCapture
                captureLabel={faceEnrolledAt ? "Re-enroll Face" : "Enroll Face"}
                helperText="Center the employee's face in the frame and click capture."
                onCapture={handleCapture}
                onCancel={() => setShowCapture(false)}
              />
            ) : (
              <div className="face-enrollment-status">
                {faceEnrolledAt ? (
                  <>
                    <span className="face-enrollment-badge enrolled">
                      Enrolled on{" "}
                      {new Date(faceEnrolledAt).toLocaleDateString()}
                    </span>
                    <button
                      type="button"
                      className="face-enrollment-btn"
                      onClick={() => setShowCapture(true)}
                      disabled={faceSaving}
                    >
                      Re-enroll
                    </button>
                    <button
                      type="button"
                      className="face-enrollment-btn danger"
                      onClick={handleRemove}
                      disabled={faceSaving}
                    >
                      Remove
                    </button>
                  </>
                ) : (
                  <>
                    <span className="face-enrollment-badge not-enrolled">
                      Not enrolled
                    </span>
                    <button
                      type="button"
                      className="face-enrollment-btn"
                      onClick={() => setShowCapture(true)}
                      disabled={faceSaving}
                    >
                      Enroll Face
                    </button>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn" disabled={loading}>
              {loading ? "Saving..." : submitText}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
