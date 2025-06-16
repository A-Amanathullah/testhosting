import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import HomePage from "./pages/Homepage/HomePage";
import SignUp from "./pages/SignUp";
import BusCard from "./components/BusCard/BusCard";
import SeatBooking from "./components/SeatBooking/SeatBooking";
import AgentPanel from "./pages/AgentPanel";
import PassengerDashboard from "./components/Other/PassengerDashboard";
import PrivateRoute from "./context/PrivateRoute";
import BusList from "./components/BusCard/BusList";
import AdminRoutes from "./admin/AdminRoutes";
// import { AuthProvider } from './context/AuthContext';
import CompleteProfile from "./pages/CompleteProfile"; // Added import

// Import all admin pages
import DashboardPage from "./admin/pages/DashboardPage";
import BusSchedulePage from "./admin/pages/BusSchedulePage";
import BusRegisterPage from "./admin/pages/BusRegisterPage";
import BusBookingPage from "./admin/pages/booking/BusBookingPage";
import FreezingSeatPage from "./admin/pages/booking/FreezingSeatPage";
import OnlinePaymentPage from "./admin/pages/payment/OnlinePaymentPage";
import AgentPaymentPage from "./admin/pages/payment/AgentPaymentPage";
import StaffCreatePage from "./admin/pages/staff/CreatePage";
import StaffListPage from "./admin/pages/staff/ListPage";
import BookingReportPage from "./admin/pages/report/BookingReportPage";
import CancellationReportPage from "./admin/pages/report/CancellationReportPage";
import AgentReportPage from "./admin/pages/report/AgentReportPage";
import RevenueReportPage from "./admin/pages/report/RevenueReportPage";
import TrackingPage from "./admin/pages/TrackingPage";
import LoyaltyCardPage from "./admin/pages/loyalty/CardPage";
import LoyaltyReportPage from "./admin/pages/loyalty/ReportPage";
import UsersPage from "./admin/pages/UsersPage";
import SmsTemplatePage from "./admin/pages/SmsTemplatePage";
import ProfilePage from "./admin/pages/ProfilePage";
import RoleAccessPage from "./admin/pages/staff/RoleAccessPage";
import StaffDashboard from "./pages/StaffDashboard";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/busList" element={<BusList />} />
        <Route path="/busSearch" element={<BusCard />} />
        <Route path="/seatPlan" element={<SeatBooking />} />
        <Route path="/passengerdash" element={<PrivateRoute><PassengerDashboard /></PrivateRoute>} />
        <Route path="/complete-profile" element={<PrivateRoute><CompleteProfile /></PrivateRoute>} /> {/* Added route */}
        <Route path="/admin" element={<PrivateRoute requiredRole="admin"><AdminRoutes /></PrivateRoute>}>
          <Route index element={<DashboardPage />} />
          <Route path="bus-schedule" element={<BusSchedulePage />} />
          <Route path="bus-register" element={<BusRegisterPage />} />
          <Route path="booking/bus-booking" element={<BusBookingPage />} />
          <Route path="booking/freezing-seat" element={<FreezingSeatPage />} />
          <Route path="payment/online" element={<OnlinePaymentPage />} />
          <Route path="payment/agent" element={<AgentPaymentPage />} />
          <Route path="staff/create" element={<StaffCreatePage />} />
          <Route path="staff/list" element={<StaffListPage />} />
          <Route path="staff/role-access" element={<RoleAccessPage />} />
          <Route path="report/booking" element={<BookingReportPage />} />
          <Route path="report/cancellation" element={<CancellationReportPage />} />
          <Route path="report/agent" element={<AgentReportPage />} />
          <Route path="report/revenue" element={<RevenueReportPage />} />
          <Route path="tracking" element={<TrackingPage />} />
          <Route path="loyalty/card" element={<LoyaltyCardPage />} />
          <Route path="loyalty/report" element={<LoyaltyReportPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="sms-template" element={<SmsTemplatePage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="/agent" element={<AgentPanel />} />
        <Route path="/staff-dashboard" element={<StaffDashboard />} />
      </Routes>
    </>
  );
}

export default App;