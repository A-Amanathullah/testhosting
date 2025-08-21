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
import CompleteProfile from "./pages/CompleteProfile";
import DashboardPage from "./admin/pages/DashboardPage";
import BusSchedulePage from "./admin/pages/BusSchedulePage";
import BusRouteManagementPage from "./admin/pages/BusRouteManagementPage";
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
import LoyaltyMembersPage from "./admin/pages/loyalty/LoyaltyMembersPage";
import LoyaltyReportPage from "./admin/pages/loyalty/ReportPage";
import UsersPage from "./admin/pages/UsersPage";
import SmsTemplatePage from "./admin/pages/SmsTemplatePage";
import ProfilePage from "./admin/pages/ProfilePage";
import RoleAccessPage from "./admin/pages/staff/RoleAccessPage";
import StaffDashboard from "./pages/StaffDashboard";
import EnhancedBusSearch from "./pages/EnhancedBusSearch";
import { AuthProvider, AuthContext } from './context/AuthContext';
import { PermissionsProvider } from './context/PermissionsContext';
import ProtectedRoute from './components/ProtectedRoute';
import NotAuthorized from './pages/NotAuthorized';
import AboutUs from './pages/AboutUs';
import Gallery from './pages/Gallery';
import Career from './pages/Career';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/Policies/PrivacyPolicy';
import TermsConditions from './pages/Policies/TermsConditions';
import TicketPolicy from './pages/Policies/TicketPolicy';
import Conductor from "./conductor/Conductor";
import React, { useContext } from 'react';
import { usePermissions } from './context/PermissionsContext';
import { Navigate } from 'react-router-dom';
import CommissionManagementPage from "./admin/pages/commission/CommissionManagementPage";

function App() {
  const { user, loading } = useContext(AuthContext);

  // Wait for auth to load before rendering permissions
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="relative inline-block mb-4">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <div className="w-10 h-10 border-3 border-transparent border-t-blue-400 rounded-full animate-spin absolute top-3 left-3" style={{animationDirection: 'reverse', animationDuration: '0.8s'}}></div>
        </div>
        <div className="text-gray-600 text-lg font-medium mb-2">Loading Bus System</div>
        <div className="flex space-x-1 justify-center">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );

  return (
    <Routes>
      {/* Conductor route - standalone without navbar */}
      <Route path="/conductor" element={<Conductor />} />
      
      {/* All other routes with navbar and permissions */}
      <Route 
        path="/*" 
        element={
          <PermissionsProvider role={user?.role}>
            <Navbar />
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/about-us" element={<AboutUs />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/career" element={<Career />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-conditions" element={<TermsConditions />} />
              <Route path="/ticket-policy" element={<TicketPolicy />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/busList" element={<BusList />} />
              <Route path="/busSearch" element={<BusCard />} />
              <Route path="/bus-search" element={<EnhancedBusSearch />} />
              <Route path="/seatPlan" element={<SeatBooking />} />
              <Route path="/passengerdash" element={<PrivateRoute><PassengerDashboard /></PrivateRoute>} />
              <Route path="/complete-profile" element={<PrivateRoute><CompleteProfile /></PrivateRoute>} />
              <Route path="/admin" element={<PrivateRoute><AdminRoutes /></PrivateRoute>}>
                <Route index element={<AutoRedirectDashboard />} />
                <Route path="bus-schedule" element={<ProtectedRoute module="Bus Schedule" action="view"><BusSchedulePage /></ProtectedRoute>} />
                <Route path="bus-routes" element={<ProtectedRoute module="Bus Routes" action="view"><BusRouteManagementPage /></ProtectedRoute>} />
                <Route path="bus-register" element={<ProtectedRoute module="Bus Register" action="view"><BusRegisterPage /></ProtectedRoute>} />
                <Route path="booking/bus-booking" element={<ProtectedRoute module="Bus Booking" action="view"><BusBookingPage /></ProtectedRoute>} />
                <Route path="booking/freezing-seat" element={<ProtectedRoute module="Freezing Seat" action="view"><FreezingSeatPage /></ProtectedRoute>} />
                <Route path="payment/online" element={<ProtectedRoute module="Booking List" action="add"><OnlinePaymentPage /></ProtectedRoute>} />
                <Route path="payment/agent" element={<ProtectedRoute module="Booking List" action="add"><AgentPaymentPage /></ProtectedRoute>} />
                <Route path="staff/create" element={<ProtectedRoute module="Staff List" action="add"><StaffCreatePage /></ProtectedRoute>} />
                <Route path="staff/list" element={<ProtectedRoute module="Staff List" action="view"><StaffListPage /></ProtectedRoute>} />
                <Route path="staff/role-access" element={<ProtectedRoute module="Role Access Management" action="view"><RoleAccessPage /></ProtectedRoute>} />
                <Route path="staff/list/delete" element={<ProtectedRoute module="Staff List" action="delete"><StaffListPage deleteMode={true} /></ProtectedRoute>} />
                <Route path="staff/list/edit" element={<ProtectedRoute module="Staff List" action="edit"><StaffListPage editMode={true} /></ProtectedRoute>} />
                <Route path="report/booking" element={<ProtectedRoute module="Bus Booking Report" action="view"><BookingReportPage /></ProtectedRoute>} />
                <Route path="report/cancellation" element={<ProtectedRoute module="Cancellation Report" action="view"><CancellationReportPage /></ProtectedRoute>} />
                <Route path="report/agent" element={<ProtectedRoute module="Agentwise Report" action="view"><AgentReportPage /></ProtectedRoute>} />
                <Route path="report/revenue" element={<ProtectedRoute module="Revenue Report" action="view"><RevenueReportPage /></ProtectedRoute>} />
                <Route path="agent-commission" element={<ProtectedRoute module="Agent Commission" action="view"><CommissionManagementPage /></ProtectedRoute>} />
                <Route path="tracking" element={<ProtectedRoute module="Bus Tracking" action="view"><TrackingPage /></ProtectedRoute>} />
                <Route path="loyalty/card" element={<ProtectedRoute module="Loyalty Card" action="view"><LoyaltyCardPage /></ProtectedRoute>} />
                <Route path="loyalty/members" element={<ProtectedRoute module="Loyalty Members" action="view"><LoyaltyMembersPage /></ProtectedRoute>} />
                <Route path="loyalty/report" element={<ProtectedRoute module="Loyalty Report" action="view"><LoyaltyReportPage /></ProtectedRoute>} />
                <Route path="users" element={<ProtectedRoute module="User Management" action="view"><UsersPage /></ProtectedRoute>} />
                <Route path="sms-template" element={<ProtectedRoute module="SMS Template" action="view"><SmsTemplatePage /></ProtectedRoute>} />
                <Route path="profile" element={<ProtectedRoute module="Profile" action="view"><ProfilePage /></ProtectedRoute>} />
              </Route>
              <Route path="/agent" element={<AgentPanel />} />
              <Route path="/staff-dashboard" element={<StaffDashboard />} />
              <Route path="/not-authorized" element={<NotAuthorized />} />
            </Routes>
          </PermissionsProvider>
        } 
      />
    </Routes>
  );
}

const AppWithProviders = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

const ADMIN_PAGES = [
  { path: 'bus-schedule', module: 'Bus Schedule', action: 'view' },
  { path: 'bus-register', module: 'Bus Register', action: 'view' },
  { path: 'booking/bus-booking', module: 'Booking List', action: 'view' },
  { path: 'booking/freezing-seat', module: 'Booking List', action: 'edit' },
  { path: 'payment/online', module: 'Booking List', action: 'add' },
  { path: 'payment/agent', module: 'Booking List', action: 'add' },
  { path: 'staff/create', module: 'Staff List', action: 'add' },
  { path: 'staff/list', module: 'Staff List', action: 'view' },
  { path: 'staff/role-access', module: 'Role Access Management', action: 'view' },
  { path: 'report/booking', module: 'Bus Booking Report', action: 'view' },
  { path: 'report/cancellation', module: 'Cancellation Report', action: 'view' },
  { path: 'report/agent', module: 'Agentwise Report', action: 'view' },
  { path: 'report/revenue', module: 'Revenue Report', action: 'view' },
  { path: 'tracking', module: 'Bus Tracking', action: 'view' },
  { path: 'loyalty/card', module: 'Loyalty Card', action: 'view' },
  { path: 'loyalty/members', module: 'Loyalty Members', action: 'view' },
  { path: 'loyalty/report', module: 'Loyalty Report', action: 'view' },
  { path: 'users', module: 'User Management', action: 'view' },
  { path: 'sms-template', module: 'SMS Template', action: 'view' },
  { path: 'profile', module: 'Profile', action: 'view' },
];

function AutoRedirectDashboard() {
  const { permissions, loading } = usePermissions();
  if (loading) return <div>Loading...</div>;
  // Try dashboard first
  if (permissions?.Dashboard?.view) {
    return <DashboardPage />;
  }
  // Find first accessible admin page
  const first = ADMIN_PAGES.find(
    ({ module, action }) => permissions?.[module]?.[action]
  );
  if (first) {
    return <Navigate to={`/admin/${first.path}`} replace />;
  }
  // If nothing, show not authorized
  return <NotAuthorized />;
}

export default AppWithProviders;
