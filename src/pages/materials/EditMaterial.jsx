// ===============================================
// KV Projects ERP
// EditMaterial.jsx
// ===============================================

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import materialService from "../../services/materialService";

const EditMaterial = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    materialName: "",
    category: "",
    quantity: "",
    unit: "",
    price: "",
    supplier: "",
    description: "",
  });

  // ============================================
  // Load Material
  // ============================================

  useEffect(() => {
    const loadMaterial = async () => {
      try {
        setLoading(true);

        const response = await materialService.getMaterialById(id);

        const material =
          response?.material ||
          response?.data?.material ||
          response?.data ||
          response;

        setFormData({
          materialName: material?.materialName || material?.name || "",

          category: material?.category || "",

          quantity: material?.quantity ?? "",

          unit: material?.unit || "",

          price: material?.price ?? material?.unitPrice ?? "",

          supplier: material?.supplier || material?.supplierName || "",

          description: material?.description || "",
        });
      } catch (error) {
        console.error("Failed to load material:", error);

        toast.error(
          error?.response?.data?.message || "Failed to load material",
        );

        navigate("../materials");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadMaterial();
    }
  }, [id, navigate]);

  // ============================================
  // Handle Change
  // ============================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ============================================
  // Submit
  // ============================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.materialName.trim()) {
      toast.error("Please enter material name");
      return;
    }

    if (!formData.category) {
      toast.error("Please select category");
      return;
    }

    if (formData.quantity === "" || Number(formData.quantity) < 0) {
      toast.error("Please enter a valid quantity");
      return;
    }

    if (!formData.unit) {
      toast.error("Please select unit");
      return;
    }

    if (formData.price === "" || Number(formData.price) < 0) {
      toast.error("Please enter a valid price");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        materialName: formData.materialName.trim(),

        category: formData.category,

        quantity: Number(formData.quantity),

        unit: formData.unit,

        price: Number(formData.price),

        supplier: formData.supplier.trim(),

        description: formData.description.trim(),
      };

      await materialService.updateMaterial(id, payload);

      toast.success("Material updated successfully");

      navigate("../materials");
    } catch (error) {
      console.error("Update material error:", error);

      toast.error(
        error?.response?.data?.message || "Failed to update material",
      );
    } finally {
      setSaving(false);
    }
  };

  // ============================================
  // Loading Screen
  // ============================================

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>

        <p style={styles.loadingText}>Loading material...</p>
      </div>
    );
  }

  // ============================================
  // UI
  // ============================================

  return (
    <div style={styles.page}>
      {/* ======================================
          Header
      ====================================== */}

      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>Edit Material</h1>

          <p style={styles.subtitle}>Update material information</p>
        </div>

        <button
          type="button"
          onClick={() => navigate("../materials")}
          style={styles.backButton}
          disabled={saving}
        >
          ← Back to Materials
        </button>
      </div>

      {/* ======================================
          Form
      ====================================== */}

      <form onSubmit={handleSubmit}>
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>Material Information</h2>

          <div style={styles.grid}>
            {/* Material Name */}

            <div style={styles.field}>
              <label style={styles.label}>Material Name *</label>

              <input
                type="text"
                name="materialName"
                value={formData.materialName}
                onChange={handleChange}
                placeholder="Enter material name"
                style={styles.input}
                disabled={saving}
              />
            </div>

            {/* Category */}

            <div style={styles.field}>
              <label style={styles.label}>Category *</label>

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={styles.input}
                disabled={saving}
              >
                <option value="">Select Category</option>

                <option value="Cement">Cement</option>

                <option value="Steel">Steel</option>

                <option value="Sand">Sand</option>

                <option value="Bricks">Bricks</option>

                <option value="Blocks">Blocks</option>

                <option value="Aggregate">Aggregate</option>

                <option value="Electrical">Electrical</option>

                <option value="Plumbing">Plumbing</option>

                <option value="Paint">Paint</option>

                <option value="Hardware">Hardware</option>

                <option value="Other">Other</option>
              </select>
            </div>

            {/* Quantity */}

            <div style={styles.field}>
              <label style={styles.label}>Quantity *</label>

              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0"
                style={styles.input}
                disabled={saving}
              />
            </div>

            {/* Unit */}

            <div style={styles.field}>
              <label style={styles.label}>Unit *</label>

              <select
                name="unit"
                value={formData.unit}
                onChange={handleChange}
                style={styles.input}
                disabled={saving}
              >
                <option value="">Select Unit</option>

                <option value="Nos">Nos</option>

                <option value="Kg">Kg</option>

                <option value="Ton">Ton</option>

                <option value="Bag">Bag</option>

                <option value="Cubic Feet">Cubic Feet</option>

                <option value="Cubic Meter">Cubic Meter</option>

                <option value="Meter">Meter</option>

                <option value="Liter">Liter</option>

                <option value="Box">Box</option>

                <option value="Piece">Piece</option>
              </select>
            </div>

            {/* Price */}

            <div style={styles.field}>
              <label style={styles.label}>Unit Price (₹) *</label>

              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                min="0"
                step="0.01"
                placeholder="0.00"
                style={styles.input}
                disabled={saving}
              />
            </div>

            {/* Supplier */}

            <div style={styles.field}>
              <label style={styles.label}>Supplier</label>

              <input
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                placeholder="Supplier name"
                style={styles.input}
                disabled={saving}
              />
            </div>

            {/* Description */}

            <div
              style={{
                ...styles.field,
                gridColumn: "1 / -1",
              }}
            >
              <label style={styles.label}>Description</label>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter description..."
                rows="5"
                style={styles.textarea}
                disabled={saving}
              />
            </div>
          </div>
        </div>

        {/* ======================================
            Value Summary
        ====================================== */}

        <div style={styles.summary}>
          <div>
            <p style={styles.summaryLabel}>Current Stock Value</p>

            <p style={styles.summaryValue}>
              ₹
              {(
                Number(formData.quantity || 0) * Number(formData.price || 0)
              ).toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        </div>

        {/* ======================================
            Actions
        ====================================== */}

        <div style={styles.actions}>
          <button
            type="button"
            onClick={() => navigate("../materials")}
            style={styles.cancelButton}
            disabled={saving}
          >
            Cancel
          </button>

          <button type="submit" style={styles.saveButton} disabled={saving}>
            {saving ? "Updating..." : "Update Material"}
          </button>
        </div>
      </form>
    </div>
  );
};

// ===============================================
// Styles
// ===============================================

const styles = {
  page: {
    minHeight: "100%",
    padding: "24px",
    background: "#f7f8fa",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
    marginBottom: "24px",
  },

  title: {
    margin: 0,
    fontSize: "28px",
    fontWeight: 700,
    color: "#111827",
  },

  subtitle: {
    margin: "6px 0 0",
    fontSize: "14px",
    color: "#6b7280",
  },

  backButton: {
    border: "1px solid #d1d5db",
    background: "#fff",
    color: "#374151",
    padding: "10px 16px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
  },

  card: {
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
  },

  sectionTitle: {
    margin: "0 0 22px",
    paddingBottom: "14px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "18px",
    fontWeight: 700,
    color: "#111827",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: "20px",
  },

  field: {
    display: "flex",
    flexDirection: "column",
  },

  label: {
    marginBottom: "8px",
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
  },

  input: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "12px 13px",
    fontSize: "14px",
    color: "#111827",
    background: "#fff",
    outline: "none",
  },

  textarea: {
    width: "100%",
    boxSizing: "border-box",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    padding: "12px 13px",
    fontSize: "14px",
    color: "#111827",
    background: "#fff",
    outline: "none",
    resize: "vertical",
    fontFamily: "inherit",
  },

  summary: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "18px",
    padding: "20px 24px",
    background: "#fff",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
  },

  summaryLabel: {
    margin: 0,
    fontSize: "13px",
    color: "#6b7280",
  },

  summaryValue: {
    margin: "5px 0 0",
    fontSize: "24px",
    fontWeight: 700,
    color: "#111827",
  },

  actions: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "20px",
  },

  cancelButton: {
    border: "1px solid #d1d5db",
    background: "#fff",
    color: "#374151",
    padding: "11px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
  },

  saveButton: {
    border: "none",
    background: "#2563eb",
    color: "#fff",
    padding: "11px 20px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
  },

  loadingContainer: {
    minHeight: "400px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#f7f8fa",
  },

  spinner: {
    width: "32px",
    height: "32px",
    border: "3px solid #e5e7eb",
    borderTop: "3px solid #2563eb",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },

  loadingText: {
    marginTop: "12px",
    color: "#6b7280",
    fontSize: "14px",
  },
};

export default EditMaterial;
