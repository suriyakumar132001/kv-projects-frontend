import { FaSearch, FaPlus } from "react-icons/fa";

const InvoiceToolbar = ({
  search,
  setSearch,
  status,
  setStatus,
  onAddInvoice,
  canCreate,
}) => {
  return (
    <div className="invoice-toolbar">

      <div className="search-box">
        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search invoice number or project..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <select
        className="invoice-select"
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="Pending">Pending</option>
        <option value="Partial">Partial</option>
        <option value="Paid">Paid</option>
      </select>

      {canCreate && (
        <button className="add-btn" onClick={onAddInvoice}>
          <FaPlus />
          Create Invoice
        </button>
      )}

    </div>
  );
};

export default InvoiceToolbar;