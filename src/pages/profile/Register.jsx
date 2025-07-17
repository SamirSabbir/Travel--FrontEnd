import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Employee", // Default role
  });

  const [profilePic, setProfilePic] = useState(null);
  const [preview, setPreview] = useState(null);

  // Available roles with their display names
  const roles = [
    { value: "Employee", label: "Employee" },
    { value: "HR", label: "HR Manager" },
    { value: "Admin", label: "Admin" },
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);

    // For preview selected image
    const reader = new FileReader();
    reader.onloadend = () => setPreview(reader.result);
    if (file) reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);
      formDataToSend.append("role", formData.role);
      if (profilePic) {
        formDataToSend.append("photo", profilePic);
      }

      const response = await axios.post("/users/register", formDataToSend);

      toast.success(response.data.message);

      // Handle different role-specific redirections
      if (response.data.data.role === "HR" || response.data.data.role === "Admin") {
        if (!response.data.data.isApproved) {
          navigate("/pending"); // Approval needed for privileged roles
        } else {
          navigate("/login"); // If somehow already approved
        }
      } else {
        setTimeout(() => {
          navigate("/login"); // Employees can login immediately
        }, 2000);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast.error(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f5f7fa]">
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-[#e0e6ed]">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#0F4F55]">Create Account</h2>
          <p className="text-[#6b7280] mt-2">
            Join us today and start your journey
          </p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
          encType="multipart/form-data"
        >
          {/* Name, Email, Password fields remain the same */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              className="w-full px-4 py-2.5 rounded-lg border border-[#e0e6ed] focus:outline-none focus:ring-2 focus:ring-[#0F4F55] focus:border-transparent transition"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2.5 rounded-lg border border-[#e0e6ed] focus:outline-none focus:ring-2 focus:ring-[#0F4F55] focus:border-transparent transition"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2.5 rounded-lg border border-[#e0e6ed] focus:outline-none focus:ring-2 focus:ring-[#0F4F55] focus:border-transparent transition"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>

          {/* Updated Role Selection */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">
              Role
            </label>
            <select
              name="role"
              className="w-full px-4 py-2.5 rounded-lg border border-[#e0e6ed] focus:outline-none focus:ring-2 focus:ring-[#0F4F55] focus:border-transparent transition"
              value={formData.role}
              onChange={handleChange}
              required
            >
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-[#6b7280]">
              {formData.role === "HR" || formData.role === "Admin"
                ? "Privileged roles require admin approval"
                : "Employees can access immediately"}
            </p>
          </div>

          {/* Profile Picture Upload */}
          <div>
            <label className="block text-sm font-medium text-[#374151] mb-1">
              Profile Picture
            </label>
            <div className="flex items-center justify-center w-full">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#e0e6ed] rounded-lg cursor-pointer hover:bg-[#f8fafc] transition">
                {preview ? (
                  <img
                    src={preview}
                    alt="Profile Preview"
                    className="h-full w-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-3 text-[#9ca3af]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      ></path>
                    </svg>
                    <p className="text-xs text-[#6b7280]">
                      Click to upload your photo
                    </p>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  required
                />
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 px-4 rounded-lg font-medium text-white ${
              isSubmitting
                ? "bg-[#9ca3af] cursor-not-allowed"
                : "bg-[#0F4F55] hover:bg-[#0c3d42]"
            } transition`}
          >
            {isSubmitting ? "Processing..." : "Register"}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-[#6b7280]">
            Already have an account?{" "}
            <button
              onClick={() => navigate("/login")}
              className="text-[#0F4F55] font-medium hover:underline focus:outline-none"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;