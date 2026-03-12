import { useEffect, useState } from "react";
import API from "../services/api";
import Profile from "../components/Profile";

function Dashboard() {
  const [userInfo, setUserInfo] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 2;

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = appliedJobs.slice(indexOfFirstJob, indexOfLastJob);

  const totalPages = Math.ceil(appliedJobs.length / jobsPerPage);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data } = await API.get("/profile/dashboard");
        console.log("aklsdjflasdflsdj",data.data)
        setUserInfo(data.data);
        setAppliedJobs(data.data.appliedJobs || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchDashboard();
  }, []);

  if (!userInfo)
    return (
      <div className="max-w-2xl mx-auto p-8 rounded-2xl mt-9 bg-gray-100 h-150">
      </div>
    );

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto md:p-8 p-4 rounded-2xl  bg-gray-100">
        {/* <h2 className="text-3xl font-bold mb-6 text-gray-800">
          My Dashboard
        </h2> */}

        {/* Profile Card */}
        <Profile />

        {/* Applied Jobs */}
        <div>
          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Recent Jobs Applied
          </h3>

          {appliedJobs.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-6 text-gray-500">
              No jobs applied yet
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {currentJobs.map((job) => (
                <div
                  key={job._id}
                  className="bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition max-h-48 overflow-auto"
                >
                  <h4 className="text-lg font-bold text-gray-800 mb-2">
                    {job.title}
                  </h4>

                  <p className="text-sm text-gray-600 mb-2">
                    <span className="font-medium">Company:</span> {job.company}
                  </p>

                  <p className="text-sm text-gray-600 mb-2">
                    {job.description}
                  </p>

                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Required Skills:</span>{" "}
                    {job.requiredSkills?.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          )}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Previous
            </button>

            <span className="px-4 py-2">
              Page {currentPage} of {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
