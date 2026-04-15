import React, { useState } from "react";
import axios from "axios";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const OTPVerification = () => {
  const [method, setMethod] = useState(""); // email or phone
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1); // 1 = select method, 2 = enter otp
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const userId = JSON.parse(localStorage.getItem('user'));
  console.log(userId.id)

  // Send OTP
  const handleSendOTP = async (selectedMethod) => {
    try {
      setLoading(true);
      setMethod(selectedMethod);

      await API.post("/send-otp", {
        userId:userId.id,
        method: selectedMethod,
      });

      setStep(2);
      alert(`OTP sent via ${selectedMethod}`);
    } catch (err) {
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP
  const handleVerifyOTP = async () => {
    try {
      setLoading(true);

      const res = await API.post(
        "/verify-otp",
        {
          userId:userId.id,
          otp,
        }
      );



      alert("Login successful 🎉");
      navigate("/");
      
    } catch (err) {
      alert("Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">

        <h2 className="text-2xl font-bold mb-6 text-center">
          OTP Verification
        </h2>

        {/* STEP 1 → Select Method */}
        {step === 1 && (
          <>
            <p className="text-center mb-4">
              Choose how you want to receive OTP
            </p>

            <button
              onClick={() => handleSendOTP("email")}
              className="w-full bg-blue-500 text-white py-2 rounded-lg mb-3 hover:bg-blue-600"
              disabled={loading}
            >
              Send OTP via Email
            </button>

            <button
              onClick={() => handleSendOTP("phone")}
              className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
              disabled={loading}
            >
              Send OTP via Phone
            </button>
          </>
        )}

        {/* STEP 2 → Enter OTP */}
        {step === 2 && (
          <>
            <p className="text-center mb-4">
              Enter OTP sent via <b>{method}</b>
            </p>

            <input
              type="text"
              placeholder="Enter OTP"
              className="w-full border px-3 py-2 rounded-lg mb-4"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={handleVerifyOTP}
              className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600"
              disabled={loading}
            >
              Verify OTP
            </button>

            <button
              onClick={() => setStep(1)}
              className="w-full mt-2 text-sm text-gray-500 underline"
            >
              Change Method
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OTPVerification;