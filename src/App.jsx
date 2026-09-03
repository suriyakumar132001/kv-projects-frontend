// ===============================================
// KV Projects ERP
// App.jsx
// ===============================================

import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

// ===============================================
// AUTH
// ===============================================

import Login from "./pages/auth/Login";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// ===============================================
// LAYOUT
// ===============================================

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

// ===============================================
// DASHBOARD
// ===============================================

import Dashboard from "./pages/dashboard/Dashboard";

// ===============================================
// EMPLOYEES
// ===============================================

import EmployeeList from "./pages/employees/EmployeeList";
import AddEmployee from "./pages/employees/AddEmployee";
import EditEmployee from "./pages/employees/EditEmployee";
import EmployeeDetails from "./pages/employees/EmployeeDetails";

// ===============================================
// ATTENDANCE
// ===============================================

import AttendanceList from "./pages/attendance/AttendanceList";
import MarkAttendance from "./pages/attendance/MarkAttendance";
import AttendanceDetails from "./pages/attendance/AttendanceDetails";
import AttendanceMap from "./pages/attendance/AttendanceMap";

// ===============================================
// LEAVE
// ===============================================

import LeaveList from "./pages/leave/LeaveList";
import ApplyLeave from "./pages/leave/ApplyLeave";
import LeaveDetails from "./pages/leave/LeaveDetails";
import EditLeave from "./pages/leave/EditLeave";

// ===============================================
// PAYROLL
// ===============================================

import PayrollList from "./pages/payroll/PayrollList";
import GeneratePayroll from "./pages/payroll/GeneratePayroll";
import EditPayroll from "./pages/payroll/EditPayroll";
import PayrollDetails from "./pages/payroll/PayrollDetails";
import PayrollReport from "./pages/payroll/PayrollReport";

// ===============================================
// PROJECTS
// ===============================================

import ProjectList from "./pages/projects/ProjectList";
import CreateProject from "./pages/projects/CreateProject";
import ProjectDetails from "./pages/projects/ProjectDetails";
import EditProject from "./pages/projects/EditProject";
import ProjectDashboard from "./pages/projects/ProjectDashboard";
import ProjectProfitability from "./pages/projects/ProjectProfitability";

// ===============================================
// EXPENSES
// ===============================================

import ExpenseList from "./pages/expenses/ExpenseList";
import CreateExpense from "./pages/expenses/CreateExpense";
import ExpenseDetails from "./pages/expenses/ExpenseDetails";
import EditExpense from "./pages/expenses/EditExpense";

// ===============================================
// SITES
// ===============================================

import SiteList from "./pages/sites/SiteList";
import AddSite from "./pages/sites/AddSite";
import EditSite from "./pages/sites/EditSite";
import SiteDetails from "./pages/sites/SiteDetails";

// ===============================================
// BUDGETS
// ===============================================

import BudgetList from "./pages/budgets/BudgetList";
import CreateBudget from "./pages/budgets/CreateBudget";
import EditBudget from "./pages/budgets/EditBudget";

// ===============================================
// EMPLOYEE SELF-SERVICE (ESS)
// Available to every logged-in role — the backend (/api/ess)
// resolves "own" data from the token, not from a role check.
// ===============================================

import MyProfile from "./pages/ess/MyProfile";
import MyPayslips from "./pages/ess/MyPayslips";
import PayslipDetails from "./pages/ess/PayslipDetails";

// ===============================================
// DPR
// ===============================================

import DPRList from "./pages/dpr/DPRList";
import CreateDPR from "./pages/dpr/CreateDPR";
import DPRDetails from "./pages/dpr/DPRDetails";

// ===============================================
// MATERIALS
// ===============================================

import MaterialList from "./pages/materials/MaterialList";
import AddMaterial from "./pages/materials/AddMaterial";
import EditMaterial from "./pages/materials/EditMaterial";
import MaterialDetails from "./pages/materials/MaterialDetails";

// ===============================================
// MATERIAL REQUESTS
// ===============================================

import MaterialRequestList from "./pages/materialRequests/MaterialRequestList";
import CreateMaterialRequest from "./pages/materialRequests/CreateMaterialRequest";
import ConvertToPO from "./pages/materialRequests/ConvertToPO";

// ===============================================
// GOODS RECEIPT (GRN)
// ===============================================

import GRNList from "./pages/grn/GRNList";
import CreateGRN from "./pages/grn/CreateGRN";

// ===============================================
// LABOUR
// ===============================================

import LabourList from "./pages/labour/LabourList";
import AddLabour from "./pages/labour/AddLabour";
import EditLabour from "./pages/labour/EditLabour";
import LabourDetails from "./pages/labour/LabourDetails";

// LABOUR BILL
import LabourBillList from "./pages/labourbill/LabourBillList";
import LabourBillForm from "./pages/labourbill/LabourBillForm";

// ===============================================
// VENDORS
// ===============================================

import VendorList from "./pages/vendors/VendorList";
import AddVendor from "./pages/vendors/AddVendor";
import EditVendor from "./pages/vendors/EditVendor";
import VendorDetails from "./pages/vendors/VendorDetails";

// ===============================================
// PURCHASE ORDERS
// ===============================================

import PurchaseOrderList from "./pages/purchaseOrders/PurchaseOrderList";
import CreatePurchaseOrder from "./pages/purchaseOrders/CreatePurchaseOrder";
import PurchaseOrderDetails from "./pages/purchaseOrders/PurchaseOrderDetails";

// ===============================================
// INVENTORY
// ===============================================

import InventoryList from "./pages/inventory/InventoryList";

// ===============================================
// MATERIAL ISSUES
// ===============================================

import MaterialIssueList from "./pages/materialIssues/MaterialIssueList";
import CreateMaterialIssue from "./pages/materialIssues/CreateMaterialIssue";

// ===============================================
// ANALYTICS
// ===============================================

import AnalyticsDashboard from "./pages/analytics/AnalyticsDashboard";
import AdvancedDashboard from "./pages/analytics/AdvancedDashboard";

// ===============================================
// USERS
// ===============================================

import UserList from "./pages/users/UserList";
import AddUser from "./pages/users/AddUser";
import EditUser from "./pages/users/EditUser";

// ===============================================
// CLIENTS
// ===============================================

import ClientList from "./pages/clients/ClientList";
import CreateClient from "./pages/clients/CreateClient";
import EditClient from "./pages/clients/EditClient";
import ClientDetails from "./pages/clients/ClientDetails";

import LeadBoard from "./pages/leads/LeadBoard";
import CreateLead from "./pages/leads/CreateLead";
import EditLead from "./pages/leads/EditLead";
import LeadDetails from "./pages/leads/LeadDetails";
import CRMDashboard from "./pages/crm/CRMDashboard";

// ===============================================
// ASSETS
// ===============================================

import AssetList from "./pages/assets/AssetList";
import AddAsset from "./pages/assets/AddAsset";
import EditAsset from "./pages/assets/EditAsset";
import AssetDetails from "./pages/assets/AssetDetails";

// ===============================================
// QUOTATIONS
// ===============================================

import QuotationList from "./pages/quotations/QuotationList";
import CreateQuotation from "./pages/quotations/CreateQuotation";
import EditQuotation from "./pages/quotations/EditQuotation";
import QuotationDetails from "./pages/quotations/QuotationDetails";

// ===============================================
// INVOICES
// ===============================================

import InvoiceList from "./pages/invoices/InvoiceList";
import CreateInvoice from "./pages/invoices/CreateInvoice";
import InvoiceDetails from "./pages/invoices/InvoiceDetails";

// ===============================================
// PAYMENTS
// ===============================================

import PaymentList from "./pages/payments/PaymentList";
import AddPayment from "./pages/payments/AddPayment";
import EditPayment from "./pages/payments/EditPayment";
import PaymentDetails from "./pages/payments/PaymentDetails";

// ===============================================
// TASKS
// ===============================================

import TaskList from "./pages/tasks/TaskList";
import CreateTask from "./pages/tasks/CreateTask";
import EditTask from "./pages/tasks/EditTask";
import TaskDetails from "./pages/tasks/TaskDetails";

// ===============================================
// SETTINGS
// ===============================================

import Settings from "./pages/settings/Settings";

// ===============================================
// CLIENT PORTAL
// ===============================================
//
// Fully separate auth domain from everything above.
// ClientAuthProvider is scoped locally to this route
// subtree (not wrapped around the whole app), so it
// never interferes with the staff AuthProvider that
// wraps <App /> in main.jsx.
// ===============================================

import { ClientAuthProvider } from "./context/ClientAuthContext";
import ClientProtectedRoute from "./routes/ClientProtectedRoute";
import PortalLayout from "./layouts/PortalLayout";

import PortalLogin from "./pages/portal/PortalLogin";
import PortalForgotPassword from "./pages/portal/PortalForgotPassword";
import PortalResetPassword from "./pages/portal/PortalResetPassword";
import PortalDashboard from "./pages/portal/PortalDashboard";
import PortalProjectDetails from "./pages/portal/PortalProjectDetails";
import PortalInvoices from "./pages/portal/PortalInvoices";
import PortalPayments from "./pages/portal/PortalPayments";

// ===============================================
// APP
// ===============================================

function App() {
  return (
    <>
      <Routes>
        {/* =============================================
            PUBLIC
        ============================================= */}

        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* =============================================
            CLIENT PORTAL
            Wrapped in its own ClientAuthProvider, kept
            entirely separate from the staff app below.
        ============================================= */}

        <Route
          path="/portal/*"
          element={
            <ClientAuthProvider>
              <Outlet />
            </ClientAuthProvider>
          }
        >
          <Route path="login" element={<PortalLogin />} />
          <Route path="forgot-password" element={<PortalForgotPassword />} />
          <Route
            path="reset-password/:token"
            element={<PortalResetPassword />}
          />

          <Route element={<ClientProtectedRoute />}>
            <Route element={<PortalLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<PortalDashboard />} />
              <Route path="projects/:id" element={<PortalProjectDetails />} />
              <Route path="invoices" element={<PortalInvoices />} />
              <Route path="payments" element={<PortalPayments />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="login" replace />} />
        </Route>

        {/* =============================================
            PROTECTED APPLICATION (STAFF)
        ============================================= */}

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            {/* =========================================
                OWNER
            ========================================= */}

            <Route path="/owner">
              <Route index element={<Navigate to="dashboard" replace />} />

              {/* Dashboard */}

              <Route path="dashboard" element={<Dashboard />} />

              {/* My Profile (ESS) */}

              <Route path="my-profile" element={<MyProfile />} />

              <Route path="my-payslips" element={<MyPayslips />} />

              <Route path="my-payslips/view/:id" element={<PayslipDetails />} />

              {/* Employees */}

              <Route path="employees" element={<EmployeeList />} />

              <Route path="employees/add" element={<AddEmployee />} />

              <Route path="employees/edit/:id" element={<EditEmployee />} />

              <Route path="employees/view/:id" element={<EmployeeDetails />} />

              {/* Attendance */}

              <Route path="attendance" element={<AttendanceList />} />

              <Route
                path="attendance/view/:id"
                element={<AttendanceDetails />}
              />

              <Route path="attendance-map" element={<AttendanceMap />} />

              {/* Payroll */}

              <Route path="payroll" element={<PayrollList />} />

              <Route path="payroll/generate" element={<GeneratePayroll />} />

              <Route path="payroll/edit/:id" element={<EditPayroll />} />

              <Route path="payroll/view/:id" element={<PayrollDetails />} />

              <Route path="payroll/report" element={<PayrollReport />} />

              {/* Leave */}

              <Route path="leave" element={<LeaveList />} />

              <Route path="leave/apply" element={<ApplyLeave />} />

              <Route path="leave/view/:id" element={<LeaveDetails />} />

              <Route path="leave/edit/:id" element={<EditLeave />} />

              {/* Projects */}

              <Route path="projects" element={<ProjectList />} />

              <Route path="projects/create" element={<CreateProject />} />

              <Route path="projects/view/:id" element={<ProjectDetails />} />

              <Route path="projects/edit/:id" element={<EditProject />} />

              <Route path="projects/dashboard" element={<ProjectDashboard />} />

              <Route
                path="projects/:id/profitability"
                element={<ProjectProfitability />}
              />

              {/* Expenses */}

              <Route path="expenses" element={<ExpenseList />} />

              <Route path="expenses/create" element={<CreateExpense />} />

              <Route path="expenses/view/:id" element={<ExpenseDetails />} />

              <Route path="expenses/edit/:id" element={<EditExpense />} />

              {/* Sites */}

              <Route path="sites" element={<SiteList />} />

              <Route path="sites/add" element={<AddSite />} />

              <Route path="sites/edit/:id" element={<EditSite />} />

              <Route path="sites/view/:id" element={<SiteDetails />} />

              {/* Budgets */}

              <Route path="budgets" element={<BudgetList />} />

              <Route path="budgets/create" element={<CreateBudget />} />

              <Route path="budgets/edit/:id" element={<EditBudget />} />

              {/* Tasks */}

              <Route path="tasks" element={<TaskList />} />

              <Route path="tasks/create" element={<CreateTask />} />

              <Route path="tasks/edit/:id" element={<EditTask />} />

              <Route path="tasks/view/:id" element={<TaskDetails />} />

              {/* Inventory */}

              <Route path="inventory" element={<InventoryList />} />

              {/* Assets */}

              <Route path="assets" element={<AssetList />} />

              <Route path="assets/add" element={<AddAsset />} />

              <Route path="assets/edit/:id" element={<EditAsset />} />

              <Route path="assets/view/:id" element={<AssetDetails />} />

              {/* Vendors */}

              <Route path="vendors" element={<VendorList />} />

              <Route path="vendors/add" element={<AddVendor />} />

              <Route path="vendors/edit/:id" element={<EditVendor />} />

              <Route path="vendors/view/:id" element={<VendorDetails />} />

              {/* Quotations */}

              <Route path="quotations" element={<QuotationList />} />

              <Route path="quotations/create" element={<CreateQuotation />} />

              <Route path="quotations/edit/:id" element={<EditQuotation />} />

              <Route
                path="quotations/view/:id"
                element={<QuotationDetails />}
              />

              {/* Invoices */}

              <Route path="invoices" element={<InvoiceList />} />

              <Route path="invoices/create" element={<CreateInvoice />} />

              <Route path="invoices/view/:id" element={<InvoiceDetails />} />

              {/* Payments */}

              <Route path="payments" element={<PaymentList />} />

              <Route path="payments/add" element={<AddPayment />} />

              <Route path="payments/edit/:id" element={<EditPayment />} />

              <Route path="payments/view/:id" element={<PaymentDetails />} />

              {/* Clients */}

              <Route path="clients" element={<ClientList />} />

              <Route path="clients/add" element={<CreateClient />} />

              <Route path="clients/edit/:id" element={<EditClient />} />

              <Route path="clients/view/:id" element={<ClientDetails />} />

              {/* Leads */}

              <Route path="leads" element={<LeadBoard />} />

              <Route path="crm/dashboard" element={<CRMDashboard />} />

              <Route path="leads/add" element={<CreateLead />} />

              <Route path="leads/edit/:id" element={<EditLead />} />

              <Route path="leads/view/:id" element={<LeadDetails />} />

              {/* DPR */}

              <Route path="dpr" element={<DPRList />} />

              <Route path="dpr/view/:id" element={<DPRDetails />} />

              {/* Material Requests */}

              <Route
                path="material-requests"
                element={<MaterialRequestList />}
              />

              <Route
                path="material-requests/create"
                element={<CreateMaterialRequest />}
              />

              <Route
                path="material-requests/:id/convert-to-po"
                element={<ConvertToPO />}
              />

              {/* Labour */}

              <Route path="labour" element={<LabourList />} />

              <Route path="labour/add" element={<AddLabour />} />

              <Route path="labour/edit/:id" element={<EditLabour />} />

              <Route path="labour/view/:id" element={<LabourDetails />} />

              {/* Labour Bills */}

              <Route path="labour-bills" element={<LabourBillList />} />

              <Route path="labour-bills/create" element={<LabourBillForm />} />

              {/* Purchase Orders */}

              <Route path="purchase-orders" element={<PurchaseOrderList />} />

              <Route
                path="purchase-orders/view/:id"
                element={<PurchaseOrderDetails />}
              />

              <Route
                path="purchase-orders/create"
                element={<CreatePurchaseOrder />}
              />

              <Route
                path="purchase-orders/:id/receive"
                element={<CreateGRN />}
              />

              {/* Goods Receipts (GRN) */}

              <Route path="grn" element={<GRNList />} />

              {/* Analytics */}

              <Route path="analytics" element={<AnalyticsDashboard />} />

              <Route
                path="analytics/advanced"
                element={<AdvancedDashboard />}
              />

              {/* Users */}

              <Route path="users" element={<UserList />} />

              <Route path="users/add" element={<AddUser />} />

              <Route path="users/edit/:id" element={<EditUser />} />

              {/* Settings */}

              <Route path="settings" element={<Settings />} />
            </Route>

            {/* =========================================
                ACCOUNTANT
            ========================================= */}

            <Route path="/accountant">
              <Route index element={<Navigate to="dashboard" replace />} />

              <Route path="dashboard" element={<Dashboard />} />

              {/* My Profile (ESS) */}

              <Route path="my-profile" element={<MyProfile />} />

              <Route path="my-payslips" element={<MyPayslips />} />

              <Route path="my-payslips/view/:id" element={<PayslipDetails />} />

              {/* Leave */}

              <Route path="leave" element={<LeaveList />} />

              <Route path="leave/apply" element={<ApplyLeave />} />

              <Route path="leave/view/:id" element={<LeaveDetails />} />

              {/* Invoices */}

              <Route path="invoices" element={<InvoiceList />} />

              <Route path="invoices/create" element={<CreateInvoice />} />

              <Route path="invoices/view/:id" element={<InvoiceDetails />} />

              {/* Payments */}

              <Route path="payments" element={<PaymentList />} />

              <Route path="payments/add" element={<AddPayment />} />

              <Route path="payments/edit/:id" element={<EditPayment />} />

              <Route path="payments/view/:id" element={<PaymentDetails />} />

              {/* Expenses */}

              <Route path="expenses" element={<ExpenseList />} />

              <Route path="expenses/create" element={<CreateExpense />} />

              <Route path="expenses/view/:id" element={<ExpenseDetails />} />

              <Route path="expenses/edit/:id" element={<EditExpense />} />

              {/* Quotations */}

              <Route path="quotations" element={<QuotationList />} />

              <Route path="quotations/create" element={<CreateQuotation />} />

              <Route path="quotations/edit/:id" element={<EditQuotation />} />

              <Route
                path="quotations/view/:id"
                element={<QuotationDetails />}
              />

              {/* Clients */}

              <Route path="clients" element={<ClientList />} />

              <Route path="clients/view/:id" element={<ClientDetails />} />

              {/* Leads */}

              <Route path="leads" element={<LeadBoard />} />

              <Route path="crm/dashboard" element={<CRMDashboard />} />

              <Route path="leads/add" element={<CreateLead />} />

              <Route path="leads/edit/:id" element={<EditLead />} />

              <Route path="leads/view/:id" element={<LeadDetails />} />

              {/* Analytics */}

              <Route path="analytics" element={<AnalyticsDashboard />} />

              <Route
                path="analytics/advanced"
                element={<AdvancedDashboard />}
              />

              {/* Projects — profitability only (accountant has no
                  project list/detail routes above, so this is the
                  entry point) */}

              <Route
                path="projects/:id/profitability"
                element={<ProjectProfitability />}
              />
            </Route>

            {/* =========================================
                ADMIN
            ========================================= */}

            <Route path="/admin">
              <Route index element={<Navigate to="dashboard" replace />} />

              <Route path="dashboard" element={<Dashboard />} />

              {/* My Profile (ESS) */}

              <Route path="my-profile" element={<MyProfile />} />

              <Route path="my-payslips" element={<MyPayslips />} />

              <Route path="my-payslips/view/:id" element={<PayslipDetails />} />

              <Route path="employees" element={<EmployeeList />} />

              <Route path="employees/add" element={<AddEmployee />} />

              <Route path="employees/edit/:id" element={<EditEmployee />} />

              <Route path="employees/view/:id" element={<EmployeeDetails />} />

              <Route path="attendance" element={<AttendanceList />} />

              <Route path="attendance/mark" element={<MarkAttendance />} />

              <Route
                path="attendance/view/:id"
                element={<AttendanceDetails />}
              />

              <Route path="attendance-map" element={<AttendanceMap />} />

              {/* Leave */}

              <Route path="leave" element={<LeaveList />} />

              <Route path="leave/apply" element={<ApplyLeave />} />

              <Route path="leave/view/:id" element={<LeaveDetails />} />

              <Route path="leave/edit/:id" element={<EditLeave />} />

              <Route path="payroll" element={<PayrollList />} />

              <Route path="payroll/generate" element={<GeneratePayroll />} />

              <Route path="payroll/edit/:id" element={<EditPayroll />} />

              <Route path="payroll/view/:id" element={<PayrollDetails />} />

              <Route path="payroll/report" element={<PayrollReport />} />

              {/* Projects */}

              <Route path="projects" element={<ProjectList />} />

              <Route path="projects/create" element={<CreateProject />} />

              <Route path="projects/view/:id" element={<ProjectDetails />} />

              <Route path="projects/edit/:id" element={<EditProject />} />

              <Route path="projects/dashboard" element={<ProjectDashboard />} />

              <Route
                path="projects/:id/profitability"
                element={<ProjectProfitability />}
              />

              {/* Sites */}

              <Route path="sites" element={<SiteList />} />

              {/* Admin can edit sites, same as Owner — backend's
                  updateSite is authorize("owner", "admin"). This route
                  was missing here, so the "Edit Site" button on
                  SiteDetails had nowhere to navigate to for Admins. */}
              <Route path="sites/edit/:id" element={<EditSite />} />

              <Route path="sites/view/:id" element={<SiteDetails />} />

              {/* Budgets */}

              <Route path="budgets" element={<BudgetList />} />

              <Route path="budgets/create" element={<CreateBudget />} />

              <Route path="budgets/edit/:id" element={<EditBudget />} />

              {/* Tasks */}

              <Route path="tasks" element={<TaskList />} />

              <Route path="tasks/create" element={<CreateTask />} />

              <Route path="tasks/edit/:id" element={<EditTask />} />

              <Route path="tasks/view/:id" element={<TaskDetails />} />

              {/* Materials */}

              <Route path="materials" element={<MaterialList />} />

              <Route path="materials/add" element={<AddMaterial />} />

              <Route path="materials/edit/:id" element={<EditMaterial />} />

              <Route path="materials/view/:id" element={<MaterialDetails />} />

              {/* Material Requests */}

              <Route
                path="material-requests"
                element={<MaterialRequestList />}
              />

              <Route
                path="material-requests/create"
                element={<CreateMaterialRequest />}
              />

              <Route
                path="material-requests/:id/convert-to-po"
                element={<ConvertToPO />}
              />

              {/* Labour */}

              <Route path="labour" element={<LabourList />} />

              <Route path="labour/add" element={<AddLabour />} />

              <Route path="labour/edit/:id" element={<EditLabour />} />

              <Route path="labour/view/:id" element={<LabourDetails />} />

              {/* Labour Bills */}

              <Route path="labour-bills" element={<LabourBillList />} />

              <Route path="labour-bills/create" element={<LabourBillForm />} />

              {/* Inventory */}

              <Route path="inventory" element={<InventoryList />} />

              {/* Expenses */}

              <Route path="expenses" element={<ExpenseList />} />

              <Route path="expenses/view/:id" element={<ExpenseDetails />} />

              <Route path="expenses/edit/:id" element={<EditExpense />} />

              {/* Leads */}

              <Route path="leads" element={<LeadBoard />} />

              <Route path="crm/dashboard" element={<CRMDashboard />} />

              <Route path="leads/add" element={<CreateLead />} />

              <Route path="leads/edit/:id" element={<EditLead />} />

              <Route path="leads/view/:id" element={<LeadDetails />} />

              {/* DPR */}

              <Route path="dpr" element={<DPRList />} />

              <Route path="dpr/view/:id" element={<DPRDetails />} />

              {/* Analytics */}

              <Route path="analytics" element={<AnalyticsDashboard />} />

              <Route
                path="analytics/advanced"
                element={<AdvancedDashboard />}
              />

              {/* Vendors */}

              <Route path="vendors" element={<VendorList />} />

              <Route path="vendors/add" element={<AddVendor />} />

              <Route path="vendors/edit/:id" element={<EditVendor />} />

              <Route path="vendors/view/:id" element={<VendorDetails />} />

              {/* Assets */}

              <Route path="assets" element={<AssetList />} />

              <Route path="assets/add" element={<AddAsset />} />

              <Route path="assets/edit/:id" element={<EditAsset />} />

              <Route path="assets/view/:id" element={<AssetDetails />} />

              {/* Quotations */}

              <Route path="quotations" element={<QuotationList />} />

              <Route path="quotations/create" element={<CreateQuotation />} />

              <Route path="quotations/edit/:id" element={<EditQuotation />} />

              <Route
                path="quotations/view/:id"
                element={<QuotationDetails />}
              />

              {/* Purchase Orders */}

              <Route path="purchase-orders" element={<PurchaseOrderList />} />

              <Route
                path="purchase-orders/view/:id"
                element={<PurchaseOrderDetails />}
              />

              <Route
                path="purchase-orders/create"
                element={<CreatePurchaseOrder />}
              />

              <Route
                path="purchase-orders/:id/receive"
                element={<CreateGRN />}
              />

              {/* Goods Receipts (GRN) */}

              <Route path="grn" element={<GRNList />} />

              {/* Material Issues */}

              <Route path="material-issues" element={<MaterialIssueList />} />

              <Route
                path="material-issues/create"
                element={<CreateMaterialIssue />}
              />
            </Route>

            {/* =========================================
                HR
            ========================================= */}

            <Route path="/hr">
              <Route index element={<Navigate to="dashboard" replace />} />

              <Route path="dashboard" element={<Dashboard />} />

              {/* My Profile (ESS) */}

              <Route path="my-profile" element={<MyProfile />} />

              <Route path="my-payslips" element={<MyPayslips />} />

              <Route path="my-payslips/view/:id" element={<PayslipDetails />} />

              <Route path="employees" element={<EmployeeList />} />

              <Route path="employees/add" element={<AddEmployee />} />

              <Route path="employees/edit/:id" element={<EditEmployee />} />

              <Route path="employees/view/:id" element={<EmployeeDetails />} />

              <Route path="attendance" element={<AttendanceList />} />

              <Route path="attendance/mark" element={<MarkAttendance />} />

              <Route
                path="attendance/view/:id"
                element={<AttendanceDetails />}
              />

              <Route path="leave" element={<LeaveList />} />

              <Route path="leave/apply" element={<ApplyLeave />} />

              <Route path="leave/view/:id" element={<LeaveDetails />} />

              <Route path="leave/edit/:id" element={<EditLeave />} />

              <Route path="payroll" element={<PayrollList />} />

              <Route path="payroll/generate" element={<GeneratePayroll />} />

              <Route path="payroll/edit/:id" element={<EditPayroll />} />

              <Route path="payroll/view/:id" element={<PayrollDetails />} />

              <Route path="payroll/report" element={<PayrollReport />} />

              {/* Labour (view only — backend only authorizes HR to GET,
                  not create/update/delete) */}

              <Route path="labour" element={<LabourList />} />

              <Route path="labour/view/:id" element={<LabourDetails />} />

              {/* Projects */}

              <Route path="projects" element={<ProjectList />} />

              <Route path="projects/view/:id" element={<ProjectDetails />} />

              <Route path="projects/dashboard" element={<ProjectDashboard />} />

              {/* Expenses */}

              <Route path="expenses" element={<ExpenseList />} />

              <Route path="expenses/view/:id" element={<ExpenseDetails />} />

              <Route path="expenses/edit/:id" element={<EditExpense />} />

              {/* Material Requests */}

              <Route
                path="material-requests"
                element={<MaterialRequestList />}
              />

              <Route
                path="material-requests/create"
                element={<CreateMaterialRequest />}
              />

              {/* Clients */}

              <Route path="clients" element={<ClientList />} />

              <Route path="clients/add" element={<CreateClient />} />

              <Route path="clients/edit/:id" element={<EditClient />} />

              <Route path="clients/view/:id" element={<ClientDetails />} />

              {/* Leads */}

              <Route path="leads" element={<LeadBoard />} />

              <Route path="leads/add" element={<CreateLead />} />

              <Route path="leads/edit/:id" element={<EditLead />} />

              <Route path="leads/view/:id" element={<LeadDetails />} />

              {/* Quotations */}

              <Route path="quotations" element={<QuotationList />} />

              <Route path="quotations/create" element={<CreateQuotation />} />

              <Route path="quotations/edit/:id" element={<EditQuotation />} />

              <Route
                path="quotations/view/:id"
                element={<QuotationDetails />}
              />

              {/* Invoices */}

              <Route path="invoices" element={<InvoiceList />} />

              <Route path="invoices/create" element={<CreateInvoice />} />

              <Route path="invoices/view/:id" element={<InvoiceDetails />} />

              {/* Payments */}

              <Route path="payments" element={<PaymentList />} />

              <Route path="payments/add" element={<AddPayment />} />

              <Route path="payments/edit/:id" element={<EditPayment />} />

              <Route path="payments/view/:id" element={<PaymentDetails />} />

              {/* DPR */}

              <Route path="dpr" element={<DPRList />} />

              <Route path="dpr/create" element={<CreateDPR />} />

              <Route path="dpr/view/:id" element={<DPRDetails />} />

              {/* Analytics */}

              <Route path="analytics" element={<AnalyticsDashboard />} />
            </Route>

            {/* =========================================
                SITE ENGINEER
            ========================================= */}

            <Route path="/siteengineer">
              <Route index element={<Navigate to="dashboard" replace />} />

              <Route path="dashboard" element={<Dashboard />} />

              {/* My Profile (ESS) */}

              <Route path="my-profile" element={<MyProfile />} />

              <Route path="my-payslips" element={<MyPayslips />} />

              <Route path="my-payslips/view/:id" element={<PayslipDetails />} />

              {/* Projects */}

              <Route path="projects" element={<ProjectList />} />

              <Route path="projects/view/:id" element={<ProjectDetails />} />

              <Route path="projects/dashboard" element={<ProjectDashboard />} />

              {/* Attendance */}

              <Route path="attendance" element={<AttendanceList />} />

              <Route path="attendance/mark" element={<MarkAttendance />} />
              <Route
                path="attendance/view/:id"
                element={<AttendanceDetails />}
              />

              {/* Leave */}

              <Route path="leave" element={<LeaveList />} />

              <Route path="leave/apply" element={<ApplyLeave />} />

              <Route path="leave/view/:id" element={<LeaveDetails />} />

              <Route path="leave/edit/:id" element={<EditLeave />} />

              {/* Sites */}

              <Route path="sites" element={<SiteList />} />

              <Route path="sites/view/:id" element={<SiteDetails />} />

              {/* Tasks */}

              <Route path="tasks" element={<TaskList />} />

              <Route path="tasks/view/:id" element={<TaskDetails />} />

              {/* Materials */}

              <Route path="materials" element={<MaterialList />} />

              <Route path="materials/view/:id" element={<MaterialDetails />} />

              {/* Material Requests */}

              <Route
                path="material-requests"
                element={<MaterialRequestList />}
              />

              <Route
                path="material-requests/create"
                element={<CreateMaterialRequest />}
              />

              {/* Purchase Orders (view + receive only) */}

              <Route path="purchase-orders" element={<PurchaseOrderList />} />

              <Route
                path="purchase-orders/view/:id"
                element={<PurchaseOrderDetails />}
              />

              <Route
                path="purchase-orders/:id/receive"
                element={<CreateGRN />}
              />

              {/* Goods Receipts (GRN) */}

              <Route path="grn" element={<GRNList />} />

              {/* Labour */}

              <Route path="labour" element={<LabourList />} />

              <Route path="labour/add" element={<AddLabour />} />

              <Route path="labour/view/:id" element={<LabourDetails />} />

              {/* Inventory */}

              <Route path="inventory" element={<InventoryList />} />

              {/* Expenses */}

              <Route path="expenses" element={<ExpenseList />} />

              <Route path="expenses/create" element={<CreateExpense />} />

              <Route path="expenses/view/:id" element={<ExpenseDetails />} />

              <Route path="expenses/edit/:id" element={<EditExpense />} />

              {/* DPR */}

              <Route path="dpr" element={<DPRList />} />

              <Route path="dpr/create" element={<CreateDPR />} />

              <Route path="dpr/view/:id" element={<DPRDetails />} />
            </Route>
          </Route>
        </Route>

        {/* =============================================
            FALLBACK
        ============================================= */}

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>

      {/* =============================================
          TOAST
      ============================================= */}

      <ToastContainer
        position="top-right"
        autoClose={3000}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </>
  );
}

export default App;
