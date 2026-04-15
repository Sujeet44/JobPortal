import axios from 'axios';

const API = axios.create({baseURL:"https://jobportal-rpam.onrender.com/"});

// Attach token automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401 &&
      error.response.data.message === "Session expired. Login again."
    ) {
      // Remove token
      localStorage.removeItem("token");

      // Show message
      alert("You have been logged out because your account was used on another device.");

      // Redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);


export default API;