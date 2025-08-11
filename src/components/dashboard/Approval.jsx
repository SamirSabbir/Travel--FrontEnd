import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Approval = () => {
  const [unapprovedUsers, setUnapprovedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnapprovedUsers = async () => {
      try {
        const response = await axios.get("/users/findUnapprovedUsers");
        setUnapprovedUsers(response.data.data);
      } catch (error) {
        if (error.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate("/login");
        } else {
          toast.error(
            error.response?.data?.message || "Failed to fetch unapproved users"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUnapprovedUsers();
  }, [navigate]);

  const handleApprove = async (userEmail) => {
    try {
      await axios.patch(`/users/approve/${userEmail}`);
      toast.success("User approved successfully");
      setUnapprovedUsers((prev) =>
        prev.filter((user) => user.email !== userEmail)
      );
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to approve user");
      }
    }
  };

  const handleDelete = async (userEmail) => {
    try {
      await axios.delete(`/users/delete/${userEmail}`);
      toast.success("User deleted successfully");
      setUnapprovedUsers((prev) =>
        prev.filter((user) => user.email !== userEmail)
      );
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
      } else {
        toast.error(error.response?.data?.message || "Failed to delete user");
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-[#0F4F55]">
        Pending Approvals
      </h2>

      {unapprovedUsers.length === 0 ? (
        <p className="text-gray-500">No users pending approval</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Role</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {unapprovedUsers.map((user) => (
                <tr key={user._id}>
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4 capitalize">
                    {user.role.toLowerCase()}
                  </td>
                  <td className="py-3 px-4 space-x-2">
                    <button
                      onClick={() => handleApprove(user.email)}
                      className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleDelete(user.email)}
                      className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Approval;