import { useEffect, useState } from "react";
import API from "../services/api";

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [resume, setResume] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [photo,setPhoto] = useState(null);

  const {name,email,phoneNo,skills,experience} = profile;
  console.log(profile)

  useEffect(() => {
    const fetchProfile = async () => {
      const { data } = await API.get("/profile/dashboard");
      setProfile(data.data);
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const updateProfile = async () => {
  try {
    await API.patch("/profile/update", profile);
    alert("Profile Updated");
    setIsEditing(false);
  } catch (error) {
    alert("Update failed");
  }
};

  const details = [
  { icon: "fas fa-envelope", value: email || "Update email"},
  { icon: "fa-solid fa-phone", value: phoneNo || "Update number"},
  { icon: "fa-solid fa-location-dot", value: "Mumbai" || 'Update location'},
  {icon : "fa-solid fa-brain", value:"Skills"}
];

  const uploadResume = async () => {
    if(resume==null){
      alert("Select a filea to upload");
      return
    }
    const formData = new FormData();
    formData.append("resume", resume);

    await API.post("/profile/uploadResume", formData);
    alert("Resume uploaded");
  };

  const skillsHandle = (e) => {
  if (e.key === "Enter" && e.target.value.trim() !== "") {
    e.preventDefault();

    if (!profile.skills.includes(e.target.value.trim())) {
      setProfile({
        ...profile,
        skills: [...profile.skills, e.target.value.trim()],
      });
    }

    e.target.value = "";
  }
};


  const isData = profile?.userId;

    if (!isData )
    return (
      <div className="max-w-2xl mx-auto p-8 rounded-2xl bg-gray-100 h-134">
        
      </div>
    );

  return (
    <div>

      {isEditing ? (
        <>
         <div className="profileContainer">
          <div className="profileHeader flex justify-between items-center pb-8 pt-3">
            <input type="text" name="name" value={profile.name || ""} onChange={handleChange} className="text-4xl font-semibold outline-0 h-full"/>
            {/* <p className="px-6 py-5 rounded-[100%] bg-blue-900 text-amber-50 font-bold text-xl">
                {name?.split(" ").map(word => word[0]).filter((_, i, arr) => i === 0 || i === arr.length - 1).join("").toUpperCase()}
            </p> */}
          </div>

         <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
                <i className="fas fa-envelope text-l text-gray-600"></i>
                <input type="text" name="email" value={email} id="" className="outline-0" onChange={handleChange} placeholder="xyz@gmail.com"/>
            </div>

            <div className="flex items-center gap-3">
                <i className="fa-solid fa-phone text-l text-gray-600"></i>
                <input type="text" maxLength={10} name="phoneNo" value={phoneNo} id="" className="outline-0 w-25" onChange={handleChange} placeholder="99xxxx"/>
            </div>

            <div className="flex items-center gap-3">
                <i className="fa-solid fa-location-dot text-l text-gray-600"></i>
                <input type="text" name="location" value={details[2].value} id="" className="outline-0 w-25" onChange={handleChange}/>
            </div>

            <div className="flex items-center gap-3">
               <i className="fa-solid fa-brain text-l text-gray-600"></i>
               <input type="text" placeholder="Add skill and press Enter" onKeyDown={skillsHandle}/>
            </div>
         </div>


         <div>
            <div className="skills flex gap-2 px-8 py-4 rounded-xl flex-wrap">
                {skills && skills.map((skill,index)=>(
                    <div key={index}>
                        <p className="bg-blue-800 rounded-2xl px-5 py-1 text-amber-50  cursor-pointer"><i className="fas fa-close pr-2 text-sm" onClick={() =>setProfile({...profile,skills: skills.filter((s) => s !== skill)})}></i>{skill}</p>
                    </div>
                ))}
            </div>
         </div>

         <div className="flex items-center justify-between gap-3 p-3 mb-5 border border-gray-300 rounded-lg w-full bg-gray-50 mt-2">
           {/* File Icon */}
           <div className="flex items-center gap-3">
            <div style={{ fontSize: "28px" }}>📄</div>
            <div className="flex  flex-col">
            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResume(e.target.files[0])} />
            <small>Only .pdf,.doc,.docx are allowed</small>
            </div>
           </div>
               {/* File Info */}
               {/* <div style={{ flex: 1 }}>
                 <p style={{ margin: 0, fontWeight: "bold" }}>{profile?.resumeUrl.split("-")[1] || "Upload resume"}</p>
                 <small>PDF Document</small>
               </div> */}
   
           {/* Actions */}
           <div>
               {/* <a href={`http://localhost:9065${profile.resumeUrl}`} target="_blank" rel="noreferrer"> */}
                   <button className="cursor-pointer px-4" onClick={uploadResume}>Update</button>
               {/* </a> */}
           </div>
         </div>

         

          {/* <button onClick={() => setIsEditing(true)}>Edit Profile</button> */}
        </div>

         <div className="flex gap-4 justify-end">
          <button onClick={()=>setIsEditing(false)} className="bg-red-600 text-amber-50 px-3 py-1  rounded-md cursor-pointer">Cancel</button> 
          <button onClick={()=>updateProfile()}  className="bg-green-700 text-amber-50 px-4 py-1 rounded-md cursor-pointer">Save</button>
         </div>
        </>
      ) : (
        <div className="profileContainer">
          <div className="profileHeader flex justify-between items-center md:mb-6 ">
            <p className="md:text-4xl text-2xl font-semibold bg-b">{name}</p>
            <p className="md:px-6 md:py-5 px-4 py-3 rounded-[100%] bg-blue-900 text-amber-50 font-bold text-xl">
                {name?.split(" ").map(word => word[0]).filter((_, i, arr) => i === 0 || i === arr.length - 1).join("").toUpperCase()}
            </p>
            
          </div>

          <div className="profileBody flex flex-col gap-2 cursor-pointer">
            {details.map((item, index) => (
                <div key={index} className="flex items-center gap-3">
                    <i className={`${item.icon} text-l text-gray-600`}></i>
                    <p className="text">{item.value}</p>
                </div>
            ))}
          </div>

         <div>
            <div className="skills flex gap-2 mb-2 md:px-8 py-4 rounded-xl flex-wrap">
                {skills ? skills.map((skill,index)=>(
                    <div key={index}>
                        <p className="bg-blue-800 rounded-2xl px-5 py-1 text-amber-50  cursor-pointer text-sm md:text-[17px] ">{skill}</p>
                    </div>
                )):""}
            </div>
         </div>

         {profile.resumeUrl && (
           <div className="flex items-center gap-3 p-3 border border-gray-300 rounded-lg w-full bg-gray-50 mt-2">
           {/* File Icon */}
               <div style={{ fontSize: "28px" }}>📄</div>
               {/* File Info */}
               <div style={{ flex: 1 }}>
                 <p style={{ margin: 0, fontWeight: "bold" }}>{profile?.resumeUrl.split("-")[1] || "Upload resume"}</p>
                 <small>PDF Document</small>
               </div>
   
           {/* Actions */}
           <div>
               <a href={`http://localhost:9065${profile.resumeUrl}`} target="_blank" rel="noreferrer">
                   <button className="cursor-pointer px-4">View</button>
               </a>
           </div>
         </div>
       )}
    <button onClick={() => setIsEditing(true)} className="my-4 bg-blue-600 p-2 px-3 rounded-full cursor-pointer block ml-auto"><i class="fa-solid fa-pencil text-amber-50"></i></button>    
        </div>
      )}


      {/* <input
        type="file"
        accept=".pdf,.doc,.docx"
        onChange={(e) => setResume(e.target.files[0])}
      /> */}

      {/* <button onClick={uploadResume}>Upload Resume</button> */}
    </div>
  );
};

export default Profile;