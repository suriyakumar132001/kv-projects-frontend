import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import leadService from "../../services/leadService";

import "./Lead.css";

const STAGES = ["New Lead", "Contacted", "On Hold", "Lost", "Converted"];

const stageClass = (stage) => `stage-${stage.replace(/\s+/g, "-")}`;

const LeadDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const canManage =
    role === "owner" || role === "admin" || role === "accountant";
  const canConvert = role === "owner" || role === "admin";
  const canDelete = role === "owner";

  const [lead, setLead] = useState(null);
  const [loading, setLoading] = useState(true);

  const [noteText, setNoteText] = useState("");
  const [nextFollowUp, setNextFollowUp] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    loadLead();
  }, [id]);

  const loadLead = async () => {
    try {
      setLoading(true);
      const res = await leadService.getLead(id);
      setLead(res.lead);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load lead");
    } finally {
      setLoading(false);
    }
  };

  const handleMove = async (newStage) => {
    if (newStage === lead.stage) return;

    let lostReason;
    if (newStage === "Lost") {
      lostReason = window.prompt("Why was this lead lost? (optional)") || "";
    }

    try {
      await leadService.updateStage(lead._id, { stage: newStage, lostReason });
      toast.success(`Moved to ${newStage}`);
      loadLead();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to move lead");
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) {
      toast.error("Enter a note first");
      return;
    }

    try {
      setSavingNote(true);
      await leadService.addNote(lead._id, {
        text: noteText.trim(),
        nextFollowUpDate: nextFollowUp || undefined,
      });
      setNoteText("");
      setNextFollowUp("");
      toast.success("Note added");
      loadLead();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add note");
    } finally {
      setSavingNote(false);
    }
  };

  const handleConvert = async () => {
    const confirmConvert = window.confirm(
      "Convert this lead to a Client record?",
    );
    if (!confirmConvert) return;

    try {
      const res = await leadService.convertToClient(lead._id);
      toast.success("Lead converted to client");
      navigate(`/${role}/clients/view/${res.client._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Conversion failed");
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete this lead permanently?");
    if (!confirmDelete) return;

    try {
      await leadService.deleteLead(lead._id);
      toast.success("Lead deleted");
      navigate(`/${role}/leads`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  if (loading) return <h2 style={{ padding: 24 }}>Loading...</h2>;

  if (!lead) {
    return (
      <div className="lead-page">
        <div className="lead-empty">Lead not found</div>
      </div>
    );
  }

  const isOpen = lead.stage !== "Lost" && lead.stage !== "Converted";

  return (
    <div className="lead-page">
      <div className="lead-header">
        <div>
          <h2>{lead.leadName}</h2>
          <p className="lead-header-subtitle">
            {lead.companyName || "No company on file"}
          </p>
        </div>

        <span className={`lead-stage-pill ${stageClass(lead.stage)}`}>
          {lead.stage}
        </span>
      </div>

      {canManage && (
        <div className="lead-actions-row">
          {isOpen && (
            <select
              value=""
              onChange={(e) => e.target.value && handleMove(e.target.value)}
              style={{
                padding: "9px 14px",
                borderRadius: 8,
                border: "1px solid #e5e7eb",
                fontSize: 13,
              }}
            >
              <option value="">Move to...</option>
              {STAGES.filter((s) => s !== lead.stage).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          )}

          <button
            className="lead-btn lead-btn-edit"
            onClick={() => navigate(`/${role}/leads/edit/${lead._id}`)}
          >
            Edit
          </button>

          {canConvert && isOpen && (
            <button
              className="lead-btn lead-btn-convert"
              onClick={handleConvert}
            >
              Convert to Client
            </button>
          )}

          {canDelete && (
            <button className="lead-btn lead-btn-delete" onClick={handleDelete}>
              Delete
            </button>
          )}
        </div>
      )}

      <div className="lead-details-grid">
        <div className="lead-details-card">
          <h3>Lead Details</h3>

          <div className="lead-detail-row">
            <span>Phone</span>
            <span>{lead.phone || "-"}</span>
          </div>

          <div className="lead-detail-row">
            <span>Email</span>
            <span>{lead.email || "-"}</span>
          </div>

          <div className="lead-detail-row">
            <span>Project Type</span>
            <span>{lead.projectType || "-"}</span>
          </div>

          <div className="lead-detail-row">
            <span>Source</span>
            <span>{lead.source || "-"}</span>
          </div>

          <div className="lead-detail-row">
            <span>Estimated Value</span>
            <span>
              {lead.estimatedValue
                ? `₹${lead.estimatedValue.toLocaleString("en-IN")}`
                : "-"}
            </span>
          </div>

          <div className="lead-detail-row">
            <span>Assigned To</span>
            <span>{lead.assignedTo?.name || "Unassigned"}</span>
          </div>

          <div className="lead-detail-row">
            <span>Next Follow-up</span>
            <span>
              {lead.nextFollowUpDate
                ? new Date(lead.nextFollowUpDate).toLocaleDateString()
                : "-"}
            </span>
          </div>

          <div className="lead-detail-row">
            <span>Last Contacted</span>
            <span>
              {lead.lastContactedAt
                ? new Date(lead.lastContactedAt).toLocaleDateString()
                : "-"}
            </span>
          </div>

          {lead.stage === "Lost" && lead.lostReason && (
            <div className="lead-detail-row">
              <span>Lost Reason</span>
              <span>{lead.lostReason}</span>
            </div>
          )}

          {lead.convertedClient && (
            <div className="lead-detail-row">
              <span>Converted Client</span>
              <span>{lead.convertedClient.clientName}</span>
            </div>
          )}

          <div className="lead-detail-row">
            <span>Created By</span>
            <span>{lead.createdBy?.name || "-"}</span>
          </div>
        </div>

        <div className="lead-details-card">
          <h3>Follow-up Timeline</h3>

          <div className="lead-timeline">
            {lead.notes && lead.notes.length > 0 ? (
              [...lead.notes].reverse().map((note, idx) => (
                <div className="lead-timeline-item" key={idx}>
                  <div className="lead-timeline-text">{note.text}</div>
                  <div className="lead-timeline-meta">
                    {note.createdBy?.name || "System"} •{" "}
                    {new Date(note.createdAt).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <p style={{ fontSize: 13, color: "#6b7280" }}>No activity yet</p>
            )}
          </div>

          {canManage && isOpen && (
            <form className="lead-note-form" onSubmit={handleAddNote}>
              <textarea
                placeholder="Log a call, site visit, or update..."
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
              />

              <label style={{ fontSize: 12.5, fontWeight: 600 }}>
                Next follow-up date (optional)
              </label>
              <input
                type="date"
                value={nextFollowUp}
                onChange={(e) => setNextFollowUp(e.target.value)}
              />

              <button
                type="submit"
                className="lead-submit-btn"
                disabled={savingNote}
                style={{ alignSelf: "flex-start" }}
              >
                {savingNote ? "Saving..." : "Add Note"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadDetails;
