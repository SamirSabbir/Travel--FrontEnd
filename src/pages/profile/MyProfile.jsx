import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { FaUserEdit, FaSave, FaTimes, FaLock, FaUser, FaEnvelope, FaDollarSign, FaPercent, FaChartLine } from "react-icons/fa";
import { motion } from "framer-motion";

const MyProfile = () => {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    password: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/users/employeeProfile");
        setProfile(response.data.data);
        setFormData({
          name: response.data.data.name,
          password: "",
        });
        setLoading(false);
      } catch (error) {
        toast.error(error.message || "Failed to fetch profile");
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch("/users/employeeProfileUpdate", formData);
      toast.success("Profile updated successfully");
      setProfile((prev) => ({
        ...prev,
        name: formData.name,
      }));
      setIsEditing(false);
    } catch (error) {
      toast.error(error.message || "Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4F46E5]"
        ></motion.div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-10 text-gray-500">
        No profile data available
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Profile Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold text-gray-800">My Profile</h2>
          <p className="text-gray-500">Manage your personal information</p>
        </div>
        
        {!isEditing ? (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-5 py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all"
          >
            <FaUserEdit className="text-lg" /> Edit Profile
          </motion.button>
        ) : (
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg shadow hover:bg-gray-200 transition-all"
            >
              <FaTimes /> Cancel
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Profile Content */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg overflow-hidden"
      >
        {!isEditing ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Personal Info Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-50 rounded-full">
                  <FaUser className="text-indigo-600 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
              </div>
              
              <div className="space-y-5 pl-16">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-500">Full Name</span>
                  <p className="text-lg font-semibold text-gray-800">{profile.name}</p>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-500">Email</span>
                  <p className="text-lg font-semibold text-gray-800">{profile.email}</p>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-500">Role</span>
                  <p className="text-lg font-semibold text-gray-800 capitalize">
                    {profile.role.toLowerCase()}
                  </p>
                </div>
              </div>
            </div>

            {/* Financial Info Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 rounded-full">
                  <FaDollarSign className="text-purple-600 text-xl" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Financial Information</h3>
              </div>
              
              <div className="space-y-5 pl-16">
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-500">Salary</span>
                  <p className="text-lg font-semibold text-gray-800">
                    ${profile.salary?.toLocaleString() || "N/A"}
                  </p>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-500">Commission</span>
                  <p className="text-lg font-semibold text-gray-800">
                    {profile.Commission}%
                  </p>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-sm font-medium text-gray-500">KPI</span>
                  <p className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    <FaChartLine className="text-green-500" />
                    {profile.KPI || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Editable Fields */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-50 rounded-full">
                    <FaUserEdit className="text-indigo-600 text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Update Information</h3>
                </div>
                
                <div className="space-y-5 pl-16">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">Full Name</label>
                    <div className="relative">
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                        required
                      />
                      <FaUser className="absolute right-3 top-3 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-medium text-gray-700">
                      New Password (leave blank to keep current)
                    </label>
                    <div className="relative">
                      <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
                      />
                      <FaLock className="absolute right-3 top-3 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Read-only Fields */}
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-gray-100 rounded-full">
                    <FaEnvelope className="text-gray-600 text-xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800">Account Details</h3>
                </div>
                
                <div className="space-y-5 pl-16">
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-500">Email</span>
                    <div className="relative">
                      <input
                        type="email"
                        value={profile.email}
                        disabled
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed"
                      />
                      <FaEnvelope className="absolute right-3 top-3 text-gray-400" />
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium text-gray-500">Role</span>
                    <div className="relative">
                      <input
                        type="text"
                        value={profile.role}
                        disabled
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg cursor-not-allowed"
                      />
                      <FaUser className="absolute right-3 top-3 text-gray-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end mt-8">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="flex items-center gap-2 bg-gradient-to-r from-[#4F46E5] to-[#7C3AED] text-white px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
              >
                <FaSave /> Save Changes
              </motion.button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  );
};

export default MyProfile;