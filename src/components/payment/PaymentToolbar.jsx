import { FaSearch, FaPlus } from "react-icons/fa";

const PaymentToolbar = ({
  search,
  setSearch,
  method,
  setMethod,
  onAddPayment,
}) => {
  return (
    <div className="payment-toolbar">

      <div className="search-box">
        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search by invoice or client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <select
        className="payment-select"
        value={method}
        onChange={(e) => setMethod(e.target.value)}
      >
        <option value="">All Methods</option>
        <option value="Cash">Cash</option>
        <option value="Bank Transfer">Bank Transfer</option>
        <option value="Cheque">Cheque</option>
        <option value="UPI">UPI</option>
      </select>

      <button className="add-btn" onClick={onAddPayment}>
        <FaPlus />
        Add Payment
      </button>

    </div>
  );
};

export default PaymentToolbar;