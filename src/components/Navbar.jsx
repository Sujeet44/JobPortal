import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const navClass = ({ isActive }) =>
  `transition-all duration-300 ${
    isActive
      ? "underline decoration-2 underline-offset-22 decoration-blue-800 text-blue-800"
      : " hover:underline decoration-2 underline-offset-22 decoration-blue-800"
  }`;

  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="px-6 py-3 flex justify-between items-center">

        <div className="flex gap-6">

          <NavLink to="/" className="text-2xl font-bold text-blue-900">
            JobPortal
          </NavLink>

          <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <NavLink to="/" className={navClass}>Home</NavLink>
            <NavLink to="/review" className={navClass}>Company review</NavLink>
            <NavLink to="/salary" className={navClass}>Salary guide</NavLink>
          </div>

        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold">

          {user ? (
            <>
            
              {/* NORMAL USER MENU */}
              {user.role === "user" && (
                <>
                  <NavLink to="/appliedJobs" className={navClass}>
                    Applied Jobs
                  </NavLink>

                  <NavLink to="/dashboard" className={navClass}>
                    My Profile
                  </NavLink>
                </>
              )}

              {/* ADMIN MENU */}
              {user.role === "admin" && (
                <>
                  <NavLink to="/admin" className="hover:text-blue-800  hover:underline decoration-2 underline-offset-22 decoration-blue-800">
                    Admin Dashboard
                  </NavLink>

                  <NavLink to="/admin/manage-jobs" className="hover:text-blue-800">
                    Manage Jobs
                  </NavLink>

                  <NavLink to="/users" className="hover:text-blue-800">
                    Manage Users
                  </NavLink>
                </>
              )}

              <span>{user?.name}</span>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
              >
                Logout
              </button>

            </>
          ) : (
            <NavLink to="/login" className="hover:text-blue-800">
              Sign in
            </NavLink>
          )}

        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-2xl"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col px-6 pb-4 gap-3 text-sm font-semibold">

          <NavLink to="/">Home</NavLink>

          {user && user.role === "user" && (
            <>
              <NavLink to="/appliedJobs">Applied Jobs</NavLink>
              <NavLink to="/dashboard">My Profile</NavLink>
            </>
          )}

          {user && user.role === "admin" && (
            <>
              <NavLink to="/adminDashboard">Admin Dashboard</NavLink>
              <NavLink to="/manageJobs">Manage Jobs</NavLink>
              <NavLink to="/users">Manage Users</NavLink>
            </>
          )}

          {user ? (
            <>
              <span>{user?.name}</span>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg w-fit"
              >
                Logout
              </button>
            </>
          ) : (
            <NavLink to="/login">Sign in</NavLink>
          )}

        </div>
      )}

    </nav>
  );
};

export default Navbar;