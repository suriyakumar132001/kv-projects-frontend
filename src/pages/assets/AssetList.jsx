import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";

import assetService from "../../services/assetService";
import siteService from "../../services/siteService";

import AssetToolbar from "../../components/asset/AssetToolbar";
import AssetTable from "../../components/asset/AssetTable";
import AssignAssetModal from "../../components/asset/AssignAssetModal";
import DeleteModal from "../../components/modal/DeleteModal";

import "./Asset.css";

const AssetList = () => {
  const navigate = useNavigate();

  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  const canDelete = role === "owner";

  const [assets, setAssets] = useState([]);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");

  const [assignModal, setAssignModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [assignLoading, setAssignLoading] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    loadAssets();
    loadSites();
  }, []);

  const loadAssets = async () => {
    try {
      setLoading(true);

      const res = await assetService.getAssets();

      setAssets(res.assets || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load assets");
    } finally {
      setLoading(false);
    }
  };

  const loadSites = async () => {
    try {
      const res = await siteService.getSites();

      setSites(res.sites || []);
    } catch (error) {
      console.error(error);
    }
  };

  const openAssignModal = (asset) => {
    setSelectedAsset(asset);
    setAssignModal(true);
  };

  const closeAssignModal = () => {
    setAssignModal(false);
    setSelectedAsset(null);
  };

  const handleAssign = async (siteId) => {
    try {
      setAssignLoading(true);

      await assetService.assignAssetToSite(selectedAsset._id, siteId);

      toast.success("Asset Assigned Successfully");

      closeAssignModal();
      loadAssets();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Assignment Failed"
      );
    } finally {
      setAssignLoading(false);
    }
  };

  const openDeleteModal = (asset) => {
    setDeleteTarget(asset);
    setDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setDeleteModal(false);
    setDeleteTarget(null);
  };

  const handleDelete = async () => {
    try {
      setDeleteLoading(true);

      await assetService.deleteAsset(deleteTarget._id);

      toast.success("Asset Deleted Successfully");

      closeDeleteModal();
      loadAssets();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Delete Failed"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const filteredAssets = assets.filter((item) => {
    const searchMatch = item.assetName
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const categoryMatch = category ? item.category === category : true;

    const statusMatch = status ? item.status === status : true;

    return searchMatch && categoryMatch && statusMatch;
  });

  if (loading) {
    return <h2>Loading Assets...</h2>;
  }

  return (
    <div className="asset-page">

      <div className="asset-header">
        <div>
          <h2>Assets</h2>
          <p>Manage machinery, vehicles, tools and equipment</p>
        </div>
      </div>

      <AssetToolbar
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
        status={status}
        setStatus={setStatus}
        onAddAsset={() => navigate(`/${role}/assets/add`)}
      />

      <AssetTable
        assets={filteredAssets}
        onView={(asset) => navigate(`/${role}/assets/view/${asset._id}`)}
        onEdit={(asset) => navigate(`/${role}/assets/edit/${asset._id}`)}
        onDelete={openDeleteModal}
        onAssign={openAssignModal}
        canDelete={canDelete}
      />

      <AssignAssetModal
        isOpen={assignModal}
        asset={selectedAsset}
        sites={sites}
        loading={assignLoading}
        onClose={closeAssignModal}
        onConfirm={handleAssign}
      />

      <DeleteModal
        isOpen={deleteModal}
        title="Delete Asset"
        message={`Are you sure you want to delete ${
          deleteTarget?.assetName || "this asset"
        }?`}
        loading={deleteLoading}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
      />

    </div>
  );
};

export default AssetList;