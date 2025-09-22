import React, { useState, useEffect } from "react";
import axios from "../../api/axios";

const AppointmentDate = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  const handlePaxChange = (index, value) => {
    const updatedAppointments = [...appointments];
    updatedAppointments[index].pax = Math.max(0, value);
    setAppointments(updatedAppointments);
  };

  // Handle save action
  const handleSave = async (index) => {
    try {
      const appointment = appointments[index];
      await axios.patch(`/appointmentDate/${appointment._id}`, appointment);
      alert("Appointment updated successfully!");
    } catch (err) {
      alert("Error updating appointment: " + err.message);
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
      <h1 className="text-2xl font-bold mb-6">Appointment Date Management</h1>

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
            {Array.isArray(appointments) && appointments.length > 0 ? (
              appointments.map((appointment, index) => (
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
                          handlePaxChange(index, (appointment.pax || 0) - 1)
                        }
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-t border-b border-gray-200 min-w-[2rem] text-center">
                        {appointment.pax || 0}
                      </span>
                      <button
                        className="bg-gray-200 hover:bg-gray-300 rounded-r px-2 py-1"
                        onClick={() =>
                          handlePaxChange(index, (appointment.pax || 0) + 1)
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
                      onClick={() => handleSave(index)}
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
      </div>
    </div>
  );
};

export default AppointmentDate;
