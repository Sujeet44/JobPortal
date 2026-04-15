import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Jobs from "./pages/Jobs";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import AdminRoute from "./components/AdminRoute";
import AdminDashboard from "./pages/AdminDashboard";
import Home from "./pages/Home";
import AppliedJobs from "./pages/AppliedJobs";
import AdminGetJobs from "./pages/AdminGetJobs";
import {Toaster} from "react-hot-toast";
import OnlineStatus from "./components/OnlineStatus";
import AdminManageJob from "./pages/AdminManageJob";
import OTPVerification from "./pages/OTPVerification";

function AppLayout() {
  const location = useLocation();

  // Pages where navbar should NOT appear
  const hideNavbarRoutes = ["/login", "/register","/otp"];

  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      
      {!shouldHideNavbar && <Navbar />}
      <Toaster position="top-right" containerStyle={{
    top: 70, // moves it 60px down from the top
  }}  reverseOrder={false}></Toaster>
      <OnlineStatus/>

      {/* <div className="max-w-7xl mx-auto px-6"> */}
        <Routes>
          <Route path="/" element={<Home/>}></Route>
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/appliedJobs" element={<AppliedJobs/>}></Route>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* <Route path="/admin/postedJobs" element={<AdminGetJobs/>}></Route> */}
          <Route path="/admin/manage-jobs" element={<AdminManageJob/>}></Route>
          <Route path="/OTP" element={<OTPVerification/>}></Route>
          <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />
        </Routes>
      {/* </div> */}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}

export default App;