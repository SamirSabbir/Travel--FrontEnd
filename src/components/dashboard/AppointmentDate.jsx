import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";

const AppointmentDate = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Search and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter data based on search term
  const filteredData = appointments.filter(
    (item) =>
      item && // make sure item is not null
      (item?.workId?.uuId || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  // Pagination calculation
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentItems = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axios.get("/appointmentDate/user");

        // Handle both array and single object responses
        if (Array.isArray(response.data)) {
          setAppointments(response.data);
        } else if (response.data && typeof response.data === "object") {
          setAppointments([response.data]);
        } else {
          setAppointments([]);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  // Handle input changes
  const handleInputChange = (index, field, value) => {
    const updatedAppointments = [...appointments];
    updatedAppointments[index][field] = value;
    setAppointments(updatedAppointments);
  };

  // Handle pax count change
  const handlePaxChange = (appointmentId, value) => {
    const updatedAppointments = appointments.map((item) => {
      if (item._id === appointmentId) {
        return { ...item, pax: Math.max(0, value) };
      }
      return item;
    });
    setAppointments(updatedAppointments);
  };

  // Handle save action
  const handleSave = async (appointmentId) => {
    try {
      const appointment = appointments.find((a) => a._id === appointmentId);
      if (appointment) {
        await axios.patch(`/appointmentDate/${appointment._id}`, appointment);
        toast.success("Appointment updated successfully!");
      }
    } catch (err) {
      toast.error("Error updating appointment: " + err.message);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  if (error)
    return <div className="text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Appointment Date Management</h1>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            placeholder="Search by Unique ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded px-3 py-2 w-64"
          />
        </div>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Unique ID
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Pax
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Appointment Date
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User Name
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Password
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Array.isArray(currentItems) && currentItems.length > 0 ? (
              currentItems.map((appointment, index) => (
                <tr key={appointment._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {appointment.workId?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {appointment.workId?.uuId || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {appointment.workId?.phone || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <button
                        className="bg-gray-200 hover:bg-gray-300 rounded-l px-2 py-1"
                        onClick={() =>
                          handlePaxChange(
                            appointment._id,
                            (appointment.pax || 0) - 1
                          )
                        }
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-t border-b border-gray-200 min-w-[2rem] text-center">
                        {appointment.pax || 0}
                      </span>
                      <button
                        className="bg-gray-200 hover:bg-gray-300 rounded-r px-2 py-1"
                        onClick={
                          () =>
                            handlePaxChange(
                              appointment._id,
                              (appointment.pax || 0) + 1
                            ) // ✅ pass _id
                        }
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="datetime-local"
                      value={
                        appointment.appointmentDate
                          ? new Date(appointment.appointmentDate)
                              .toISOString()
                              .slice(0, 16)
                          : ""
                      }
                      onChange={(e) =>
                        handleInputChange(
                          index,
                          "appointmentDate",
                          e.target.value
                        )
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={appointment.userName || ""}
                      onChange={(e) =>
                        handleInputChange(index, "userName", e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter username"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="text"
                      value={appointment.password || ""}
                      onChange={(e) =>
                        handleInputChange(index, "password", e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter password"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleSave(appointment._id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center">
                  No appointments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Pagination */}
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="text-sm text-gray-700">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredData.length)} of{" "}
              {filteredData.length} entries
            </span>
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === pageNum ? "bg-blue-500 text-white" : ""
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDate;
