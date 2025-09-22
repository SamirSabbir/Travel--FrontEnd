import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FiEye, FiEyeOff, FiX } from "react-icons/fi";

const Register = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Employee",
  });

  const [files, setFiles] = useState([]);
  const [previews, setPreviews] = useState([]);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  const roles = [
    { value: "Employee", label: "Employee" },
    { value: "AccountAdmin", label: "HR Account Admin" },
    { value: "OfficeBoy", label: "Office Boy" },
  ];

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (!selectedFiles.length) return;

    // Validate each file
    const validTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      // "application/pdf",
    ];
    const maxSize = 5 * 1024 * 1024; // 5MB

    const validFiles = selectedFiles.filter((file) => {
      if (!validTypes.includes(file.type)) {
        toast.error(
          `Invalid file type for ${file.name}. Only JPEG, PNG, GIF, or PDF allowed.`
        );
        return false;
      }

      if (file.size > maxSize) {
        toast.error(`${file.name} is too large. Max size is 5MB.`);
        return false;
      }

      return true;
    });

    // Create previews for images
    const newPreviews = validFiles.map((file) => {
      if (file.type.startsWith("image/")) {
        return {
          type: "image",
          url: URL.createObjectURL(file),
          name: file.name,
        };
      } else {
        return {
          type: "file",
          name: file.name,
        };
      }
    });

    setFiles((prev) => [...prev, ...validFiles]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeFile = (index) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index].url); // Clean up memory
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const uploadFilesToCloudinary = async (files) => {
    const uploadPromises = files.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("cloud_name", cloudName);
      console.log(cloudName);
      try {
        const response = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error(`Upload failed for ${file.name}`);
        }

        const data = await response.json();
        console.log(data);
        return {
          url: data.url,
          type: file.type.startsWith("image/") ? "image" : "file",
          name: file.name,
        };
      } catch (error) {
        console.error(`Upload error for ${file.name}:`, error);
        throw error;
      }
    });

    return Promise.all(uploadPromises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let uploadedFiles = [];

      if (files.length > 0) {
        uploadedFiles = await uploadFilesToCloudinary(files);
      }
      console.log(uploadedFiles);
      const response = await axios.post("/users/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        ...(uploadedFiles.length > 0 && { photo: uploadedFiles[0].url }), //only include if exists
      });

      toast.success(response.data.message);

      setTimeout(() => {
        navigate("/pending");
      }, 2000);
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
    <div className="min-h-screen flex bg-[#f5f7fa]">
      {/* Left Side - Welcome Section */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-gradient-to-br from-[#0F4F55] to-[#0c3d42] p-12">
        <div className="max-w-md text-white">
          <h1 className="text-5xl font-bold mb-6">
            Welcome to Trip and Travel
          </h1>
          <p className="text-xl opacity-90">
            Discover amazing destinations and create unforgettable memories with
            our platform.
          </p>
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <ToastContainer position="top-center" autoClose={3000} />
          <div className="bg-white p-8 rounded-xl shadow-lg border border-[#e0e6ed]">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-[#0F4F55]">
                Create Account
              </h2>
              <p className="text-[#6b7280] mt-2">
                Join us today and start your journey
              </p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Field */}
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

              {/* Email Field */}
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

              {/* Password Field with Toggle */}
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    className="w-full px-4 py-2.5 rounded-lg border border-[#e0e6ed] focus:outline-none focus:ring-2 focus:ring-[#0F4F55] focus:border-transparent transition pr-10"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff size={18} />
                    ) : (
                      <FiEye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
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
                  All roles require admin approval before access is granted
                </p>
              </div>

              {/* File Upload Section */}
              <div>
                <label className="block text-sm font-medium text-[#374151] mb-1">
                  Upload Image (Optional)
                </label>
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-[#e0e6ed] rounded-lg cursor-pointer hover:bg-[#f8fafc] transition">
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
                        Click to upload image (Images max 5MB each)
                      </p>
                    </div>
                    <input
                      type="file"
                      multiple
                      accept="image/jpeg, image/png, image/gif"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Preview Section */}
                {previews.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-sm text-[#6b7280]">Selected files:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {previews.map((preview, index) => (
                        <div
                          key={index}
                          className="relative border rounded-md p-2 flex items-center"
                        >
                          {preview.type === "image" ? (
                            <img
                              src={preview.url}
                              alt="Preview"
                              className="h-16 w-16 object-cover rounded"
                            />
                          ) : (
                            <div className="h-16 w-16 bg-gray-100 flex items-center justify-center rounded">
                              <span className="text-xs text-gray-500 truncate w-full px-1">
                                {preview.name}
                              </span>
                            </div>
                          )}
                          <span className="ml-2 text-sm truncate flex-1">
                            {preview.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-gray-500 hover:text-red-500 ml-2"
                          >
                            <FiX size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
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
      </div>
    </div>
  );
};

export default Register;
