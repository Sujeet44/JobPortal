import React from "react";
import { useEffect } from "react";
import API from "../services/api";
import { useState } from "react";
import Shimmer from "../components/Shimmer"; 
import {useNavigate } from "react-router-dom";
import toast from "react-hot-toast"; 

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [btnLoading,setBtnLoading] = useState(false);
  const userkey = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

 useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/jobs/applied");
      setAppliedJobs(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, []);


useEffect(() => {
  if (appliedJobs.length > 0) {
    setSelectedJob(appliedJobs[0]);
  }
}, [appliedJobs]);


const handleWithdraw =async(id)=>{
  setBtnLoading(true);
  try {
    const data = await API.post(`/jobs/${id}/withdraw`);

    toast.success("Withdraw successfull",{duration:4000})
    console.log(data)
  } catch (error) {
    
  }finally{
    setBtnLoading(false);
  }
}

if (loading) {
  return <Shimmer />;
}

  if (!loading && appliedJobs.length === 0) {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center">
      <h2 className="text-2xl font-semibold text-gray-700">
        You haven't applied to any jobs yet
      </h2>
      <p className="text-gray-500 mt-2">
        Start exploring jobs and apply to opportunities
      </p>

      <button onClick={() => navigate("/")} className="mt-4 bg-blue-600 text-white px-5 py-2 rounded-lg cursor-pointer">
        Browse Jobs
      </button>
    </div>
  );
}

  return (
    <div className="flex xl:max-w-3/5 max-w-3/4 m-auto gap-6 my-9">
      <div className="w-full flex flex-col  lg:w-5/12">
        {/* <h2 className="text-2xl font-bold mb-3 text-gray-800">
              Jobs for you
            </h2>
            <p>Jobs based on your skills matchs</p> */}

        <div className=" flex flex-col gap-6">
          {appliedJobs.map((job) => (
            <div
              key={job._id}
              onClick={() => setSelectedJob(job)}
              className={`bg-white shadow-md rounded-xl p-6 transition ease-in-out border border-gray-300 cursor-pointer
      ${selectedJob?._id === job._id ? " outline-1 outline-blue-700 shadow-lg" : "hover:scale-99 hover:shadow-lg"}`}
            >
              <div className="flex justify-between">
                <div>
                  <h3 className="md:text-xl text-md font-bold text-gray-800 jobTitle">
                    {job.title}
                  </h3>

                  {/* Company */}
                  <p className="text-gray-600  text-sm">
                    <span className="md:font-medium">
                      Company: {job.company}
                    </span>
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="md:font-medium">
                      {job?.location || "N/A"}
                    </span>
                  </p>
                  <p className="text-gray-600 mb-2 text-sm">
                    <span className="md:font-medium">
                      {job?.salary ? `₹${job?.salary}` : "₹Not Disclosed"}
                    </span>
                  </p>
                </div>
                {job.matchPercentage !== undefined && (
                  <div className="mb-3">
                    <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full ">
                      Match:{job.matchPercentage}%
                    </span>
                  </div>
                )}
              </div>

              {/* Match Percentage */}

              {/* Apply Button */}
              <button
                disabled
                className="w-full bg-gray-400 text-white py-2 rounded-lg cursor-not-allowed"
              >
                Already Applied
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="w-7/12 sticky top-4 bg-white border border-gray-200 rounded-xl p-6 shadow-md h-fit hidden lg:block">
        {selectedJob ? (
          <div className="flex flex-col gap-6">
            {/* Job Header */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {selectedJob.title}
              </h2>
              <p className="text-gray-600 mt-1">
                {selectedJob.company} • {selectedJob.location || "Remote"}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                Salary: {selectedJob.salary || "₹Not Disclosed"}
              </p>
            </div>

            {/* Apply Button */}
            <div className="flex gap-5">
              <button
                disabled
                className="  bg-blue-600 text-white px-6 py-2 rounded-lg opacity-50 cursor-not-allowed"
              >
                Applied
              </button>
              <button
                className="  bg-red-600 text-white  px-6 py-2 rounded-lg cursor-pointer"
                onClick={()=>handleWithdraw(selectedJob._id)}
              >
                 {btnLoading?(
          <div className="flex gap-2 px-3 py-2 ">
      <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
      <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
      <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
    </div>
        ):(

       "Withdraw"
        )}
              </button>
            </div>

            {/* Divider */}
            <hr className="text-gray-300" />

            {/* Job Description */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Job Description</h3>
              <p className="text-gray-600 leading-relaxed">
                {selectedJob?.description}
              </p>
            </div>

            {/* Responsibilities */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Responsibilities</h3>
              <ul className="list-disc pl-5 text-gray-600 space-y-1">
                <li>Develop and maintain web applications</li>
                <li>Collaborate with cross-functional teams</li>
                <li>Write clean and scalable code</li>
                <li>Participate in code reviews</li>
              </ul>
            </div>

            {/* Skills */}
            <div>
              <h3 className="text-lg font-semibold mb-2">Required Skills</h3>
              <div className="flex flex-wrap gap-2">
                {selectedJob.requiredSkills.map((skill) => (
                  <span
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm outline outline-gray-400"
                    key={skill._id}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-60 text-gray-400 md:block ">
            Select a job to view details
          </div>
        )}
      </div>
    </div>
  );
};

export default AppliedJobs;
