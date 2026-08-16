import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import siteService from "../../services/siteService";
import userService from "../../services/userService";

import SiteToolbar from "../../components/site/SiteToolbar";
import SiteTable from "../../components/site/SiteTable";
import AssignEngineerModal from "../../components/site/AssignEngineerModal";

import "./Site.css";

const SiteList = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const canManage = role === "owner" || role === "admin";

  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [engineers, setEngineers] = useState([]);
  const [assignModal, setAssignModal] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [assignLoading, setAssignLoading] = useState(false);

  useEffect(() => {
    loadSites();

    if (canManage) {
      loadEngineers();
    }
  }, []);

  const loadSites = async () => {
    try {
      setLoading(true);

      const res = await siteService.getSites();

      setSites(res.sites || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load sites");
    } finally {
      setLoading(false);
    }
  };

  const loadEngineers = async () => {
    try {
      const res = await userService.getUsers();

      const siteEngineers = (res.users || []).filter(
        (u) => u.role === "siteengineer",
      );

      setEngineers(siteEngineers);
    } catch (error) {
      console.error(error);
    }
  };

  const openAssignModal = (site) => {
    setSelectedSite(site);
    setAssignModal(true);
  };

  const closeAssignModal = () => {
    setAssignModal(false);
    setSelectedSite(null);
  };

  const handleAssign = async (engineerId) => {
    try {
      setAssignLoading(true);

      await siteService.assignEngineer(selectedSite._id, engineerId);

      toast.success("Engineer Assigned Successfully");

      closeAssignModal();
      loadSites();
    } catch (error) {
      toast.error(error.response?.data?.message || "Assignment Failed");
    } finally {
      setAssignLoading(false);
    }
  };

  const filteredSites = sites.filter((item) => {
    const searchMatch = item.siteName
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const statusMatch = status ? item.status === status : true;

    return searchMatch && statusMatch;
  });

  if (loading) {
    return <h2>Loading Sites...</h2>;
  }

  return (
    <div className="site-page">
      <div className="site-header">
        <div>
          <h2>Sites</h2>
          <p>
            {role === "siteengineer"
              ? "Your assigned construction sites"
              : "Manage construction sites"}
          </p>
        </div>
      </div>

      <SiteToolbar
        search={search}
        setSearch={setSearch}
        status={status}
        setStatus={setStatus}
        onAddSite={() => navigate(`/${role}/sites/add`)}
        canCreate={canManage}
      />

      <SiteTable
        sites={filteredSites}
        onAssignEngineer={openAssignModal}
        canAssign={canManage}
      />

      <AssignEngineerModal
        isOpen={assignModal}
        site={selectedSite}
        engineers={engineers}
        loading={assignLoading}
        onClose={closeAssignModal}
        onConfirm={handleAssign}
      />
    </div>
  );
};

export default SiteList;
