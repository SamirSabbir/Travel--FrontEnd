import React, { useEffect, useState } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { Loader2, Save, Search } from "lucide-react";

const Work = ({ userRole }) => {
  const [workData, setWorkData] = useState([]);
  const [filteredWorkData, setFilteredWorkData] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchWorks = async () => {
    try {
      const endpoint = userRole === "AccountAdmin" 
        ? "/works/employee-works" 
        : "/works/my-works";
      const res = await axios.get(endpoint);
      setWorkData(res.data.data);
      setFilteredWorkData(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch work data");
    }
  };

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("/users/findEmployeeUsers");
      setEmployees(res.data.data);
    } catch (err) {
      toast.error("Failed to fetch employees");
    }
  };

  useEffect(() => {
    Promise.all([fetchWorks(), fetchEmployees()]).finally(() =>
      setLoading(false)
    );
  }, [userRole]);

  useEffect(() => {
    const filtered = workData.filter(work =>
      work.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWorkData(filtered);
  }, [searchTerm, workData]);

  const handleUpdate = async (id, updatedFields) => {
    setUpdatingId(id);
    try {
      if (userRole === "AccountAdmin") {
        await axios.patch(`/works/update-work-account-admin/${id}`, {
          payment: updatedFields.payment,
          paymentStatus: updatedFields.paymentStatus,
        });
      } else {
        await axios.patch(`/works/update-work-employee/${id}`, updatedFields);
      }
      toast.success("Work updated successfully");
      await fetchWorks();
    } catch (err) {
      toast.error("Failed to update work");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleFieldChange = (id, field, value) => {
    setWorkData((prev) =>
      prev.map((w) => (w._id === id ? { ...w, [field]: value } : w))
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "more_info":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "Full Payment":
        return "bg-green-100 text-green-800";
      case "Partial Payment":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin h-8 w-8 text-gray-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Assigned Works</h2>
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {[
                  "Name",
                  "Pax",
                  "Country",
                  "Submission Date",
                  "Payment",
                  "Payment Status",
                  "Assigned To",
                  "Status",
                  "Actions",
                ].map((col) => (
                  <th
                    key={col}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredWorkData.map((work) => (
                <tr key={work._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {work.name}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={work.pax || ""}
                      onChange={(e) =>
                        handleFieldChange(work._id, "pax", e.target.value)
                      }
                      className="w-20 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={work.country || ""}
                      onChange={(e) =>
                        handleFieldChange(work._id, "country", e.target.value)
                      }
                      className="w-24 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="date"
                      value={work.submissionDate?.slice(0, 10) || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          work._id,
                          "submissionDate",
                          e.target.value
                        )
                      }
                      className="px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">
                        $
                      </span>
                      <input
                        type="number"
                        value={work.payment || ""}
                        onChange={(e) =>
                          handleFieldChange(work._id, "payment", e.target.value)
                        }
                        className="pl-7 w-24 px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        disabled={
                          userRole !== "AccountAdmin" && userRole !== "Admin"
                        }
                      />
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={work.paymentStatus || ""}
                      onChange={(e) =>
                        handleFieldChange(work._id, "paymentStatus", e.target.value)
                      }
                      className={`px-3 py-1 rounded-md text-xs font-medium ${getPaymentStatusColor(work.paymentStatus)} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                      disabled={userRole !== "AccountAdmin" && userRole !== "Admin"}
                    >
                      <option value="">Select Status</option>
                      <option value="Partial Payment">Partial Payment</option>
                      <option value="Full Payment">Full Payment</option>
                    </select>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={work.employeeEmail || ""}
                      onChange={(e) =>
                        handleFieldChange(
                          work._id,
                          "employeeEmail",
                          e.target.value
                        )
                      }
                      className="w-full px-3 py-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">Select</option>
                      {employees.map((emp) => (
                        <option key={emp._id} value={emp.email}>
                          {emp.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={work.status || "pending"}
                      onChange={(e) =>
                        handleFieldChange(work._id, "status", e.target.value)
                      }
                      className={`px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(work.status)} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                      <option value="draft">Draft</option>
                      <option value="more_info">Pending More Info</option>
                    </select>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() =>
                        handleUpdate(work._id, {
                          pax: work.pax,
                          country: work.country,
                          submissionDate: work.submissionDate,
                          payment: work.payment,
                          paymentStatus: work.paymentStatus,
                          employeeEmail: work.employeeEmail,
                          status: work.status,
                        })
                      }
                      disabled={updatingId === work._id}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      {updatingId === work._id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Saving
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" /> Save
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Work;