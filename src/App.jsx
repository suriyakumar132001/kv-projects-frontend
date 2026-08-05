import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

// ================= AUTH =================
import Login from "./pages/auth/Login";

// ================= LAYOUT =================
import DashboardLayout from "./layouts/DashboardLayout";

// ================= DASHBOARD =================
import Dashboard from "./pages/dashboard/Dashboard";

// ================= PROTECTED =================
import ProtectedRoute from "./routes/ProtectedRoute";

// ================= EMPLOYEE =================
import EmployeeList from "./pages/employees/EmployeeList";
import AddEmployee from "./pages/employees/AddEmployee";
import EditEmployee from "./pages/employees/EditEmployee";
import EmployeeDetails from "./pages/employees/EmployeeDetails";

// ================= ATTENDANCE =================
import AttendanceList from "./pages/attendance/AttendanceList";
import MarkAttendance from "./pages/attendance/MarkAttendance";
import AttendanceDetails from "./pages/attendance/AttendanceDetails";

// ================= LEAVE =================
import LeaveList from "./pages/leave/LeaveList";
import ApplyLeave from "./pages/leave/ApplyLeave";
import LeaveDetails from "./pages/leave/LeaveDetails";
import EditLeave from "./pages/leave/EditLeave";

// ================= PAYROLL =================
import PayrollList from "./pages/payroll/PayrollList";
import GeneratePayroll from "./pages/payroll/GeneratePayroll";
import EditPayroll from "./pages/payroll/EditPayroll";
import PayrollDetails from "./pages/payroll/PayrollDetails";
import Payslip from "./pages/payroll/Payslip";

// ================= PROJECTS =================
import ProjectDashboard from "./pages/projects/ProjectDashboard";
import ProjectList from "./pages/projects/ProjectList";
import CreateProject from "./pages/projects/CreateProject";
import ProjectDetails from "./pages/projects/ProjectDetails";
import EditProject from "./pages/projects/EditProject";

// ================= CLIENTS =================
import ClientList from "./pages/clients/ClientList";
import CreateClient from "./pages/clients/CreateClient";
import EditClient from "./pages/clients/EditClient";
import ClientDetails from "./pages/clients/ClientDetails";

// ================= QUOTATIONS =================
import QuotationList from "./pages/quotations/QuotationList";
import CreateQuotation from "./pages/quotations/CreateQuotation";
import EditQuotation from "./pages/quotations/EditQuotation";
import QuotationDetails from "./pages/quotations/QuotationDetails";

function App() {
  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />

      <Routes>
        {/* ================= LOGIN ================= */}

        <Route path="/" element={<Login />} />

        {/* =====================================================
OWNER ROUTES
===================================================== */}

        <Route
          path="/owner"
          element={
            <ProtectedRoute allowedRoles={["owner"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          {/* Dashboard */}

          <Route path="dashboard" element={<Dashboard />} />

          {/* Employee */}

          <Route path="employees" element={<EmployeeList />} />

          <Route path="employees/add" element={<AddEmployee />} />

          <Route path="employees/edit/:id" element={<EditEmployee />} />

          <Route path="employees/view/:id" element={<EmployeeDetails />} />

          {/* Attendance */}

          <Route path="attendance" element={<AttendanceList />} />

          <Route path="attendance/mark" element={<MarkAttendance />} />

          <Route path="attendance/view/:id" element={<AttendanceDetails />} />

          {/* Leave */}

          <Route path="leaves" element={<LeaveList />} />

          <Route path="leaves/apply" element={<ApplyLeave />} />

          <Route path="leaves/view/:id" element={<LeaveDetails />} />

          <Route path="leaves/edit/:id" element={<EditLeave />} />

          {/* Payroll */}

          <Route path="payroll" element={<PayrollList />} />

          <Route path="payroll/generate" element={<GeneratePayroll />} />

          <Route path="payroll/edit/:id" element={<EditPayroll />} />

          <Route path="payroll/view/:id" element={<PayrollDetails />} />

          <Route path="payroll/payslip/:id" element={<Payslip />} />

          {/* ================= PROJECT MANAGEMENT ================= */}

          <Route path="projects" element={<ProjectList />} />

          <Route path="projects/dashboard" element={<ProjectDashboard />} />

          <Route path="projects/create" element={<CreateProject />} />

          <Route path="projects/view/:id" element={<ProjectDetails />} />

          <Route path="projects/edit/:id" element={<EditProject />} />

          {/* ================= CLIENT MANAGEMENT ================= */}

          <Route path="clients" element={<ClientList />} />

          <Route path="clients/create" element={<CreateClient />} />

          <Route path="clients/view/:id" element={<ClientDetails />} />

          <Route path="clients/edit/:id" element={<EditClient />} />

          {/* ================= QUOTATIONS ================= */}

          <Route path="quotations" element={<QuotationList />} />

          <Route path="quotations/create" element={<CreateQuotation />} />

          <Route path="quotations/view/:id" element={<QuotationDetails />} />

          <Route path="quotations/edit/:id" element={<EditQuotation />} />
        </Route>

        {/* =====================================================
ADMIN ROUTES
===================================================== */}

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />

          {/* Employee */}

          <Route path="employees" element={<EmployeeList />} />

          <Route path="employees/add" element={<AddEmployee />} />

          <Route path="employees/edit/:id" element={<EditEmployee />} />

          <Route path="employees/view/:id" element={<EmployeeDetails />} />

          {/* Attendance */}

          <Route path="attendance" element={<AttendanceList />} />

          <Route path="attendance/mark" element={<MarkAttendance />} />

          <Route path="attendance/view/:id" element={<AttendanceDetails />} />

          {/* Leave */}

          <Route path="leaves" element={<LeaveList />} />

          <Route path="leaves/apply" element={<ApplyLeave />} />

          <Route path="leaves/view/:id" element={<LeaveDetails />} />

          <Route path="leaves/edit/:id" element={<EditLeave />} />

          {/* Payroll */}

          <Route path="payroll" element={<PayrollList />} />

          <Route path="payroll/generate" element={<GeneratePayroll />} />

          <Route path="payroll/edit/:id" element={<EditPayroll />} />

          <Route path="payroll/view/:id" element={<PayrollDetails />} />

          <Route path="payroll/payslip/:id" element={<Payslip />} />

          {/* Projects */}

          <Route path="projects" element={<ProjectList />} />

          <Route path="projects/dashboard" element={<ProjectDashboard />} />

          <Route path="projects/create" element={<CreateProject />} />

          <Route path="projects/view/:id" element={<ProjectDetails />} />

          <Route path="projects/edit/:id" element={<EditProject />} />

          {/* Clients */}

          <Route path="clients" element={<ClientList />} />

          <Route path="clients/create" element={<CreateClient />} />

          <Route path="clients/view/:id" element={<ClientDetails />} />

          <Route path="clients/edit/:id" element={<EditClient />} />
        </Route>

        {/* =====================================================
HR ROUTES
===================================================== */}

        <Route
          path="/hr"
          element={
            <ProtectedRoute allowedRoles={["hr"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />

          {/* Employee */}

          <Route path="employees" element={<EmployeeList />} />

          <Route path="employees/add" element={<AddEmployee />} />

          <Route path="employees/edit/:id" element={<EditEmployee />} />

          <Route path="employees/view/:id" element={<EmployeeDetails />} />

          {/* Attendance */}

          <Route path="attendance" element={<AttendanceList />} />

          <Route path="attendance/mark" element={<MarkAttendance />} />

          <Route path="attendance/view/:id" element={<AttendanceDetails />} />

          {/* Leave */}

          <Route path="leaves" element={<LeaveList />} />

          <Route path="leaves/apply" element={<ApplyLeave />} />

          <Route path="leaves/view/:id" element={<LeaveDetails />} />

          <Route path="leaves/edit/:id" element={<EditLeave />} />

          {/* Payroll */}

          <Route path="payroll" element={<PayrollList />} />

          <Route path="payroll/generate" element={<GeneratePayroll />} />

          <Route path="payroll/edit/:id" element={<EditPayroll />} />

          <Route path="payroll/view/:id" element={<PayrollDetails />} />

          <Route path="payroll/payslip/:id" element={<Payslip />} />
        </Route>

        {/* =====================================================
SITE ENGINEER ROUTES
===================================================== */}

        <Route
          path="/siteengineer"
          element={
            <ProtectedRoute allowedRoles={["siteengineer"]}>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />

          {/* Projects */}

          <Route path="projects" element={<ProjectList />} />

          <Route path="projects/dashboard" element={<ProjectDashboard />} />

          <Route path="projects/create" element={<CreateProject />} />

          <Route path="projects/view/:id" element={<ProjectDetails />} />

          <Route path="projects/edit/:id" element={<EditProject />} />

          {/* Attendance */}

          <Route path="attendance" element={<AttendanceList />} />

          <Route path="attendance/mark" element={<MarkAttendance />} />

          <Route path="attendance/view/:id" element={<AttendanceDetails />} />
        </Route>

        {/* ================= 404 ================= */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
