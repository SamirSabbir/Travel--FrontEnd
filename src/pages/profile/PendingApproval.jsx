import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHourglassHalf } from "react-icons/fa";

const PendingApproval = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-yellow-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <FaHourglassHalf className="text-yellow-500 text-4xl mx-auto mb-4" />
        <h2 className="text-xl font-semibold text-yellow-700 mb-2">
          Awaiting Approval
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Your account has been submitted successfully. Please wait for the
          Admin to approve your account before logging in.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-yellow-500 text-white px-6 py-2 rounded hover:bg-yellow-600 transition"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default PendingApproval;
