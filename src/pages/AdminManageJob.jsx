import React, { useEffect, useState } from 'react'
import API from '../services/api'

const AdminManageJob = () => {
    const[createdJob,setCreatedJob]  = useState([]);
    const[selectedJob,setSelectedJob] = useState(null);

    const userkey = JSON.parse(localStorage.getItem('user'));

    useEffect(()=>{
        const fetchJobs=async()=>{
            const {data} = await API.get("/jobs/adminJobs");
            setCreatedJob(data);
            // setSelectedJob(createdJob[0]);
            console.log(data)
        }
        fetchJobs();
    },[])


      useEffect(() => {
    if (createdJob.length>0) {
      setSelectedJob(createdJob[0]);
    } else {
      setSelectedJob(null);
    }
  }, [createdJob]);


  return (
    <div className="min-h-screen  p-6 md:mx-20 lg:mx-auto">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between gap-4">
          <div className="w-full flex flex-col  lg:w-5/12">
            <h2 className="text-2xl font-bold mb-3 text-gray-800">
              View your Jobs
            </h2>
            {/* <p>Jobs based on your skills matches</p> */}

            <div className=" flex flex-col gap-6">
              {createdJob.map((job) => (
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
                          {job?.location || "Unknown"}
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

                  <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer">
                    View Description
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
                <div>
  {/* {selectedJob?.applicants?.includes(userkey?.id) ? (
    <button
      disabled
      className="bg-blue-600 text-white px-6 py-2 rounded-lg opacity-50"
    >
      Applied
    </button>
  ) : (
    <button
      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2  cursor-pointer"
      onClick={() => handleApply(selectedJob._id)}
      disabled={btnLoading}
    >
      {btnLoading ? (
    <div className="flex gap-2 px-3 py-2 ">
      <span className="w-2 h-2 bg-white rounded-full animate-bounce"></span>
      <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.2s]"></span>
      <span className="w-2 h-2 bg-white rounded-full animate-bounce [animation-delay:0.4s]"></span>
    </div>
   ): (
        <span className="font-bold">Apply Now</span> 
      )}  
    </button>
  )} */}
</div>

                {/* Divider */}
                <hr className="text-gray-300" />

                {/* Job Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Job Description
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {selectedJob?.description}
                  </p>
                </div>

                {/* Responsibilities */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Responsibilities
                  </h3>
                  <ul className="list-disc pl-5 text-gray-600 space-y-1">
                    {selectedJob?.responsibilities?.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                {/* Skills */}
                <div>
                  <h3 className="text-lg font-semibold mb-2">
                    Required Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.requiredSkills.map((skill, index) => (
                      <span
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm outline outline-gray-400"
                        key={index}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-60 text-gray-400 md:block x">
                Select a job to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminManageJob