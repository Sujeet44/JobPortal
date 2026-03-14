import LOGO from "../utils/constant";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Jobs from "./Jobs";

const Home = () => {
  const [searchInput, setSearchInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <>
      <div className="searchBarContainer py-8 flex justify-center">
        <div className="flex md:justify-between items-center gap-2 border md:pl-4 px-3 md:px-2 pb-3 md:pb-0 rounded-[20px]  shadow-md  flex-col md:flex-row xl:w-[50%] md:w10/12 w-4/5">
          <div className="md:w-5/12 hover:ring-2  ring-blue-900 transition-all duration-300 ease-in-out rounded-[20px] -ml-4 flex items-center w-full">
            <i className="fas fa-search ml-3"></i>
            <input
              type="text"
              value={searchInput}
              name=""
              id=""
              placeholder="Job title,keywords, or company"
              className="px-3 w-[90%] h-14 outline-0"
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className="md:w-5/12 hover:ring-2 ring-blue-900 transition-all duration-300 ease-in-out rounded-[20px] -ml-2 flex items-center w-full">
            <i className="fas fa-map-marker-alt ml-3"></i>
            <input
              type="text"
              value={locationInput}
              name=""
              id=""
              placeholder="City,state,zip"
              className="px-3 w-[90%] h-14 outline-0"
              onChange={(e) => setLocationInput(e.target.value)}
            />
          </div>
          {/* <div className="w-[100%]">
            <i class="fas fa-map-marker-alt"></i>
            <input type="text" name="" id="" placeholder="City,state,zip" className="px-3 h-14 outline-0"
            />
          </div> */}
          <button
            className="bg-blue-800 px-4 py-3 md:m-0 mr-2 text-sm rounded-xl text-amber-50 font-semibold cursor-pointer md:w-2/12 w-full"
            onClick={() => {
              setSearch(searchInput);
              setLocation(locationInput);
            }}
          >
            Find Jobs
          </button>
        </div>
      </div>

      {!user ? (
        <div className="flex items-center justify-center flex-col">
          <h1 className="text-[50px] font-bold text-blue-900">JobPortal</h1>
          <p className="text-2xl font-semibold pb-2">
            Your next job starts here
          </p>
          <p className="">
            Create an account or sign in to see your personalised job
            recommendations.
          </p>
          <div
            className="bg-[#004FCB] py-2 px-9 mt-5 flex justify-between items-center rounded-xl cursor-pointer"
            onClick={() => navigate("/login")}
          >
            <button className="mr-4 text-amber-50">Get Started</button>
            <i className="fas fa-arrow-right font-semibold text-amber-50"></i>
          </div>
        </div>
      ) : (
        <Jobs search={search} location={location} />
      )}
    </>
  );
};

export default Home;
