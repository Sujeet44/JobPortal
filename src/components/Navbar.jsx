import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

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

          <Link to="/" className="text-2xl font-bold text-blue-900">
            JobPortal
          </Link>

          <div className="hidden md:flex items-center gap-6 text-sm font-semibold">
            <Link to="/" className="hover:text-blue-800">Home</Link>
            <Link to="/" className="hover:text-blue-800">Company review</Link>
            <Link to="/" className="hover:text-blue-800">Salary guide</Link>
          </div>

        </div>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-6 text-sm font-semibold">

          {user ? (
            <>
            
              {/* NORMAL USER MENU */}
              {user.role === "user" && (
                <>
                  <Link to="/appliedJobs" className="hover:text-blue-800">
                    Applied Jobs
                  </Link>

                  <Link to="/dashboard" className="hover:text-blue-800">
                    My Profile
                  </Link>
                </>
              )}

              {/* ADMIN MENU */}
              {user.role === "admin" && (
                <>
                  <Link to="/admin" className="hover:text-blue-800">
                    Admin Dashboard
                  </Link>

                  <Link to="/manageJobs" className="hover:text-blue-800">
                    Manage Jobs
                  </Link>

                  <Link to="/users" className="hover:text-blue-800">
                    Manage Users
                  </Link>
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
            <Link to="/login" className="hover:text-blue-800">
              Sign in
            </Link>
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

          <Link to="/">Home</Link>

          {user && user.role === "user" && (
            <>
              <Link to="/appliedJobs">Applied Jobs</Link>
              <Link to="/dashboard">My Profile</Link>
            </>
          )}

          {user && user.role === "admin" && (
            <>
              <Link to="/adminDashboard">Admin Dashboard</Link>
              <Link to="/manageJobs">Manage Jobs</Link>
              <Link to="/users">Manage Users</Link>
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
            <Link to="/login">Sign in</Link>
          )}

        </div>
      )}

    </nav>
  );
};

export default Navbar;