import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Jobs from "./Jobs";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

const Home = () => {
  const [searchInput, setSearchInput] = useState("");
  const [locationInput, setLocationInput] = useState("");

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // 🎤 Speech Hook
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  // 🎯 Update search input when speaking
  useEffect(() => {
    if (transcript) {
      setSearchInput(transcript);
    }
  }, [transcript]);

  const startListening = () => {
    SpeechRecognition.startListening({ continuous: false });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
  };

  return (
    <>
      <div className="searchBarContainer py-8 flex justify-center">
        <div className="flex md:justify-between items-center gap-2 border md:pl-4 px-3 md:px-2 pb-3 md:pb-0 rounded-[20px] shadow-md flex-col md:flex-row xl:w-[50%] md:w10/12 w-4/5">

          {/* 🔍 SEARCH INPUT + MIC */}
          <div className="md:w-5/12 hover:ring-2 ring-blue-900 transition-all duration-300 ease-in-out rounded-[20px] -ml-4 flex items-center w-full">
            <i className="fas fa-search ml-3"></i>

            <input
              type="text"
              value={searchInput}
              placeholder="Job title, keywords, or company"
              className="px-3 w-full h-14 outline-0"
              onChange={(e) => setSearchInput(e.target.value)}
            />

            {/* 🎤 Mic Button */}
            
          </div>

          {/* 📍 LOCATION INPUT */}
          <div className="md:w-5/12 hover:ring-2 ring-blue-900 transition-all duration-300 ease-in-out rounded-[20px] -ml-2 flex items-center w-full">
            <i className="fas fa-map-marker-alt ml-3"></i>
            <input
              type="text"
              value={locationInput}
              placeholder="City, state, zip"
              className="px-3 w-[90%] h-14 outline-0"
              onChange={(e) => setLocationInput(e.target.value)}
            />
          </div>

          {/* 🔍 BUTTON */}
          <button
            className="bg-blue-800 px-4 py-3 md:m-0 mr-2 text-sm rounded-xl text-amber-50 font-semibold cursor-pointer md:w-2/12 w-full"
            onClick={() => {
              setSearch(searchInput);
              setLocation(locationInput);
              resetTranscript(); // optional
            }}
          >
            Find Jobs
          </button>
        </div>
        {/* <button
              onClick={listening ? stopListening : startListening}
              className={`px-5 py-1 rounded-full ${listening ? "bg-red-500" : "bg-blue-800"} text-white text-xl ml-3`}
            > 
             <i class="fa-solid fa-microphone"></i>
            </button> */}
      </div>

      {!user ? (
        <div className="flex items-center justify-center flex-col">
          <h1 className="text-[50px] font-bold text-blue-900">JobPortal</h1>
          <p className="text-2xl font-semibold pb-2">
            Your next job starts here
          </p>
          <p className="px-3 text-center">
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