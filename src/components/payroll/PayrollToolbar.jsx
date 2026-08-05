import { FaPlus, FaSyncAlt } from "react-icons/fa";

const PayrollToolbar = ({
  onRefresh,
  onGenerate,
}) => {
  return (
    <div className="payroll-toolbar">

      <div className="toolbar-left">
        <h3>Payroll Records</h3>
      </div>

      <div className="toolbar-right">

        <button
          className="refresh-btn"
          onClick={onRefresh}
        >
          <FaSyncAlt />
          Refresh
        </button>

        <button
          className="add-btn"
          onClick={onGenerate}
        >
          <FaPlus />
          Generate Payroll
        </button>

      </div>

    </div>
  );
};

export default PayrollToolbar;