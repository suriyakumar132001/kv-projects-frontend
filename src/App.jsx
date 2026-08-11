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

// ================= Vendors =================

import VendorList from "./pages/vendors/VendorList";
import AddVendor from "./pages/vendors/AddVendor";

// ================= Sites =================
import SiteList from "./pages/sites/SiteList";
import CreateSite from "./pages/sites/CreateSite";

import InventoryList from "./pages/inventory/InventoryList";

import AssetList from "./pages/assets/AssetList";
import AddAsset from "./pages/assets/AddAsset";
import EditAsset from "./pages/assets/EditAsset";
import AssetDetails from "./pages/assets/AssetDetails";

import InvoiceList from "./pages/invoices/InvoiceList";
import CreateInvoice from "./pages/invoices/CreateInvoice";
import EditInvoice from "./pages/invoices/EditInvoice";
import InvoiceDetails from "./pages/invoices/InvoiceDetails";

// ================= DPR =================
import DPRList from "./pages/dpr/DPRList";
import CreateDPR from "./pages/dpr/CreateDPR";
import DPRDetails from "./pages/dpr/DPRDetails";

import PaymentList from "./pages/payments/PaymentList";
import AddPayment from "./pages/payments/AddPayment";
import EditPayment from "./pages/payments/EditPayment";
import PaymentDetails from "./pages/payments/PaymentDetails";

import Settings from "./pages/settings/Settings";

import AnalyticsDashboard from "./pages/analytics/AnalyticsDashboard";

// ================= USERS (Owner/Admin only) =================
import UserList from "./pages/users/UserList";
import RegisterUser from "./pages/users/RegisterUser";
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

          {/* Vendors */}

          <Route path="vendors" element={<VendorList />} />

          <Route path="vendors/add" element={<AddVendor />} />

          {/* Sites */}
          <Route path="sites" element={<SiteList />} />
          <Route path="sites/create" element={<CreateSite />} />

          {/* Inventory */}
          <Route path="inventory" element={<InventoryList />} />

          {/* Assets */}
          <Route path="assets" element={<AssetList />} />
          <Route path="assets/add" element={<AddAsset />} />
          <Route path="assets/edit/:id" element={<EditAsset />} />
          <Route path="assets/view/:id" element={<AssetDetails />} />

          {/* Invoices */}

          <Route path="invoices" element={<InvoiceList />} />
          <Route path="invoices/create" element={<CreateInvoice />} />
          <Route path="invoices/edit/:id" element={<EditInvoice />} />
          <Route path="invoices/view/:id" element={<InvoiceDetails />} />

          {/* Payments */}
          <Route path="payments" element={<PaymentList />} />
          <Route path="payments/add" element={<AddPayment />} />
          <Route path="payments/edit/:id" element={<EditPayment />} />
          <Route path="payments/view/:id" element={<PaymentDetails />} />

          {/* Daily Progress Reports (view + delete only — creation is site-engineer only) */}
          <Route path="dpr" element={<DPRList />} />
          <Route path="dpr/view/:id" element={<DPRDetails />} />

          {/* Analytics */}
          <Route path="analytics" element={<AnalyticsDashboard />} />

          {/* Users (Owner: create Admin, HR, Site Engineer) */}
          <Route path="users" element={<UserList />} />
          <Route path="users/add" element={<RegisterUser />} />

          {/* Settings */}
          <Route path="settings" element={<Settings />} />
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

          {/* Vendors */}

          <Route path="vendors" element={<VendorList />} />
          <Route path="vendors/add" element={<AddVendor />} />

          {/* Sites */}
          <Route path="sites" element={<SiteList />} />
          <Route path="sites/create" element={<CreateSite />} />

          {/* Inventory */}
          <Route path="inventory" element={<InventoryList />} />

          {/* Analytics */}

          <Route path="analytics" element={<AnalyticsDashboard />} />

          <Route path="assets" element={<AssetList />} />
          <Route path="assets/add" element={<AddAsset />} />
          <Route path="assets/edit/:id" element={<EditAsset />} />
          <Route path="assets/view/:id" element={<AssetDetails />} />

          <Route path="invoices" element={<InvoiceList />} />
          <Route path="invoices/create" element={<CreateInvoice />} />
          <Route path="invoices/edit/:id" element={<EditInvoice />} />
          <Route path="invoices/view/:id" element={<InvoiceDetails />} />

          <Route path="payments" element={<PaymentList />} />
          <Route path="payments/add" element={<AddPayment />} />
          <Route path="payments/edit/:id" element={<EditPayment />} />
          <Route path="payments/view/:id" element={<PaymentDetails />} />

          {/* Daily Progress Reports (view + delete only — creation is site-engineer only) */}
          <Route path="dpr" element={<DPRList />} />
          <Route path="dpr/view/:id" element={<DPRDetails />} />

          {/* Users (Admin: create HR, Site Engineer only) */}
          <Route path="users" element={<UserList />} />
          <Route path="users/add" element={<RegisterUser />} />
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

          <Route path="invoices" element={<InvoiceList />} />
          <Route path="invoices/view/:id" element={<InvoiceDetails />} />

          <Route path="payments" element={<PaymentList />} />
          <Route path="payments/view/:id" element={<PaymentDetails />} />

          {/* Daily Progress Reports (view only — HR has no delete rights) */}
          <Route path="dpr" element={<DPRList />} />
          <Route path="dpr/view/:id" element={<DPRDetails />} />
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

          {/* Sites */}
          <Route path="sites" element={<SiteList />} />

          {/* Inventory */}
          <Route path="inventory" element={<InventoryList />} />

          {/* Daily Progress Reports — full access */}
          <Route path="dpr" element={<DPRList />} />
          <Route path="dpr/create" element={<CreateDPR />} />
          <Route path="dpr/view/:id" element={<DPRDetails />} />
        </Route>

        {/* ================= 404 ================= */}

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
