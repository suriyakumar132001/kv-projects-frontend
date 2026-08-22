import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import leadService from "../../services/leadService";

import "./Lead.css";

const STAGES = ["New Lead", "Contacted", "On Hold", "Lost", "Converted"];

const stageClass = (stage) => `stage-${stage.replace(/\s+/g, "-")}`;

const LeadBoard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const canCreate =
    role === "owner" ||
    role === "admin" ||
    role === "accountant" ||
    role === "hr";

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const res = await leadService.getLeads();
      setLeads(res.leads || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load leads");
    } finally {
      setLoading(false);
    }
  };

  const grouped = useMemo(() => {
    const map = Object.fromEntries(STAGES.map((s) => [s, []]));
    leads.forEach((lead) => {
      if (map[lead.stage]) map[lead.stage].push(lead);
    });
    return map;
  }, [leads]);

  const summary = useMemo(() => {
    const openValue = leads
      .filter((l) => l.stage !== "Lost" && l.stage !== "Converted")
      .reduce((sum, l) => sum + (l.estimatedValue || 0), 0);
    return { openValue };
  }, [leads]);

  const handleMove = async (lead, newStage) => {
    if (newStage === lead.stage) return;

    let lostReason;
    if (newStage === "Lost") {
      lostReason = window.prompt("Why was this lead lost? (optional)") || "";
    }

    try {
      await leadService.updateStage(lead._id, { stage: newStage, lostReason });
      toast.success(`Moved to ${newStage}`);
      loadLeads();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to move lead");
    }
  };

  const isOverdue = (lead) =>
    lead.nextFollowUpDate &&
    new Date(lead.nextFollowUpDate) < new Date() &&
    lead.stage !== "Lost" &&
    lead.stage !== "Converted";

  if (loading) return <h2 style={{ padding: 24 }}>Loading...</h2>;

  return (
    <div className="lead-page">
      <div className="lead-header">
        <div>
          <h2>Leads</h2>
          <p className="lead-header-subtitle">
            Manage all leads in one place for faster follow-ups
          </p>
        </div>

        {canCreate && (
          <button
            className="lead-add-btn"
            onClick={() => navigate(`/${role}/leads/add`)}
          >
            New Lead
          </button>
        )}
      </div>

      <div className="lead-summary">
        <div className="lead-summary-card">
          <div className="count">{leads.length}</div>
          <div className="label">Total Leads</div>
        </div>

        {STAGES.map((stage) => (
          <div className="lead-summary-card" key={stage}>
            <div className="count">{grouped[stage].length}</div>
            <div className="label">{stage}</div>
          </div>
        ))}
      </div>

      <p style={{ margin: "0 0 16px", fontSize: 13.5, color: "#6b7280" }}>
        Open pipeline value:{" "}
        <strong style={{ color: "#111827" }}>
          ₹{summary.openValue.toLocaleString("en-IN")}
        </strong>
      </p>

      <div className="lead-board">
        {STAGES.map((stage) => (
          <div className={`lead-column ${stageClass(stage)}`} key={stage}>
            <div className="lead-column-header">
              <span className="lead-column-title">{stage}</span>
              <span className="lead-column-count">{grouped[stage].length}</span>
            </div>

            {grouped[stage].length === 0 && (
              <div className="lead-empty-col">No leads</div>
            )}

            {grouped[stage].map((lead) => (
              <div
                className="lead-card"
                key={lead._id}
                onClick={() => navigate(`/${role}/leads/view/${lead._id}`)}
              >
                <div className="lead-card-name">{lead.leadName}</div>

                {lead.companyName && (
                  <div className="lead-card-company">{lead.companyName}</div>
                )}

                <div className="lead-card-row">
                  <span>{lead.phone}</span>
                  {lead.estimatedValue > 0 && (
                    <span className="lead-card-value">
                      ₹{lead.estimatedValue.toLocaleString("en-IN")}
                    </span>
                  )}
                </div>

                {lead.assignedTo?.name && (
                  <div className="lead-card-row">
                    <span>Assigned</span>
                    <span>{lead.assignedTo.name}</span>
                  </div>
                )}

                {lead.nextFollowUpDate &&
                  stage !== "Lost" &&
                  stage !== "Converted" && (
                    <span
                      className={`lead-card-followup ${isOverdue(lead) ? "overdue" : ""}`}
                    >
                      {isOverdue(lead) ? "Overdue: " : "Follow up: "}
                      {new Date(lead.nextFollowUpDate).toLocaleDateString()}
                    </span>
                  )}

                {stage !== "Lost" && stage !== "Converted" && (
                  <div
                    className="lead-card-move"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <select
                      value=""
                      onChange={(e) => {
                        if (e.target.value) handleMove(lead, e.target.value);
                        e.target.value = "";
                      }}
                    >
                      <option value="">Move to...</option>
                      {STAGES.filter((s) => s !== stage).map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadBoard;
