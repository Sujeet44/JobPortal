import React, { useState } from "react";
import { useNavigate,Link} from "react-router-dom";
import Modal from "../components/Modal";
import AddJob from "../components/AddJob";
import AdminGetJobs from "./AdminGetJobs";

const AdminDashboard = () => {
  const[open,setOpen] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Heading */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Admin Dashboard
        </h1>

        {/* Admin Info Card */}
        <div className="bg-white shadow-md rounded-xl p-6 mb-8">
          <h2 className="text-xl font-semibold mb-2 text-gray-700">
            Welcome, {user?.name}
          </h2>
          <p className="text-gray-600">Email: {user?.email}</p>
          <p className="text-gray-600">Role: {user?.role}</p>
        </div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Add Job */}
          <div
            onClick={() => setOpen(true)}
            className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:shadow-lg transition"
          >
            <h3 className="text-lg font-bold text-blue-600 mb-2">
              ➕ Add Job
            </h3>
            <p className="text-gray-600">
              Create and publish new job listings.
            </p>
          </div>

           <Modal isOpen={open} onClose={() => setOpen(false)}>
        <AddJob />
      </Modal>

          {/* Manage Jobs */}
          <div
            onClick={() => navigate("/admin/manage-jobs")}
            className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:shadow-lg transition"
          >
            <h3 className="text-lg font-bold text-green-600 mb-2">
              📋 Manage Jobs
            </h3>
            <p className="text-gray-600">
              View and delete existing jobs.
            </p>
          </div>

          {/* View Users */}
          <div
            onClick={() => navigate("/admin/users")}
            className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:shadow-lg transition"
          >
            <h3 className="text-lg font-bold text-purple-600 mb-2">
              👥 View Users
            </h3>
            <p className="text-gray-600">
              See all registered users.
            </p>
          </div>


          <div
            className="bg-white shadow-md rounded-xl p-6 cursor-pointer hover:shadow-lg transition" onClick={()=>navigate("/admin/postedJobs")}
          >
            <h3 className="text-lg font-bold text-purple-600 mb-2">
              👥 View Users
            </h3>
            
            <button className="text-gray-600">
              See all registered users.
            </button>
          
          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;