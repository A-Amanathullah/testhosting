import { Outlet } from "react-router-dom";

import Sidebar from "./components/common/Sidebar";

// Import all pages here...
// import DashboardPage from "./pages/DashboardPage";
// import BusSchedulePage from "./pages/BusSchedulePage";
// import BusRegisterPage from "./pages/BusRegisterPage";
// import BusBookingPage from "./pages/booking/BusBookingPage";
// import FreezingSeatPage from "./pages/booking/FreezingSeatPage";
// import OnlinePaymentPage from "./pages/payment/OnlinePaymentPage";
// import AgentPaymentPage from "./pages/payment/AgentPaymentPage";
// import StaffCreatePage from "./pages/staff/CreatePage";
// import StaffListPage from "./pages/staff/ListPage";
// import BookingReportPage from "./pages/report/BookingReportPage";
// import CancellationReportPage from "./pages/report/CancellationReportPage";
// import AgentReportPage from "./pages/report/AgentReportPage";
// import RevenueReportPage from "./pages/report/RevenueReportPage";
// import TrackingPage from "./pages/TrackingPage";
// import LoyaltyCardPage from "./pages/loyalty/CardPage";
// import LoyaltyReportPage from "./pages/loyalty/ReportPage";
// import UsersPage from "./pages/UsersPage";
// import SmsTemplatePage from "./pages/SmsTemplatePage";
// import ProfilePage from "./pages/ProfilePage";

const AdminRoutes = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar />
      <Outlet />
    </div>
  );
};

export default AdminRoutes;
