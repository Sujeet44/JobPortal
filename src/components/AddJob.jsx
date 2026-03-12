import { useState } from "react";
import API from "../services/api";

export default function AddJob({ setOpen }) {
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    jobType: "Full-Time",
    description: "",
    responsibilities: "",
    requiredSkills: "",
    minExperience: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...formData,
        requiredSkills: formData.requiredSkills
          .split(",")
          .map((s) => s.trim()),
        responsibilities: formData.responsibilities
          .split("\n")
          .map((r) => r.trim())
      };

      await API.post("/jobs/createJob", payload);

      alert("Job created successfully");
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("Failed to create job");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}   
      className="p-8 rounded-xl w-125  space-y-4  max-h-3/4"
    >
      <h2 className="text-2xl font-bold text-center text-gray-800">
        Post New Job
      </h2>

      {/* Job Title */}
      <div>
        <label className="text-sm font-semibold text-gray-700">
          Job Title *
        </label>
        <input
          type="text"
          name="title"
          onChange={handleChange}
          className="w-full border p-2 rounded mt-1"
          required
        />
      </div>

      {/* Company */}
      <div>
        <label className="text-sm font-semibold text-gray-700">
          Company *
        </label>
        <input
          type="text"
          name="company"
          onChange={handleChange}
          className="w-full border p-2 rounded mt-1"
          required
        />
      </div>

      {/* Location */}
      <div>
        <label className="text-sm font-semibold text-gray-700">
          Location *
        </label>
        <input
          type="text"
          name="location"
          onChange={handleChange}
          className="w-full border p-2 rounded mt-1"
          required
        />
      </div>

      {/* Salary */}
      <div>
        <label className="text-sm font-semibold text-gray-700">
          Salary (₹)
        </label>
        <input
          type="number"
          name="salary"
          onChange={handleChange}
          className="w-full border p-2 rounded mt-1"
        />
      </div>

      {/* Job Type */}
      <div>
        <label className="text-sm font-semibold text-gray-700">
          Job Type
        </label>
        <select
          name="jobType"
          onChange={handleChange}
          className="w-full border p-2 rounded mt-1"
        >
          <option>Full-Time</option>
          <option>Part-Time</option>
          <option>Contract</option>
          <option>Internship</option>
        </select>
      </div>

      {/* Experience */}
      <div>
        <label className="text-sm font-semibold text-gray-700">
          Minimum Experience (Years) *
        </label>
        <input
          type="number"
          name="minExperience"
          onChange={handleChange}
          className="w-full border p-2 rounded mt-1"
          required
        />
      </div>

      {/* Job Description */}
      <div>
        <label className="text-sm font-semibold text-gray-700">
          Job Description *
        </label>
        <textarea
          name="description"
          rows="3"
          onChange={handleChange}
          className="w-full border p-2 rounded mt-1"
          required
        />
      </div>

      {/* Responsibilities */}
      <div>
        <label className="text-sm font-semibold text-gray-700">
          Responsibilities
        </label>
        <textarea
          name="responsibilities"
          rows="3"
          placeholder="One responsibility per line"
          onChange={handleChange}
          className="w-full border p-2 rounded mt-1"
        />
      </div>

      {/* Skills */}
      <div>
        <label className="text-sm font-semibold text-gray-700">
          Required Skills *
        </label>
        <input
          type="text"
          name="requiredSkills"
          placeholder="React, Node.js, MongoDB"
          onChange={handleChange}
          className="w-full border p-2 rounded mt-1"
          required
        />
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Post Job
        </button>

        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}