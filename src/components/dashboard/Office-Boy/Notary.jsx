import React, { useState, useEffect } from "react";
import axios from "../../../api/axios"; // Adjust path as needed

const Notary = () => {
  const [employees, setEmployees] = useState([]);
  const [notaryData, setNotaryData] = useState({
    date: "",
    clientName: "",
    documents: "",
    employee: "",
    note: "",
    bill: "",
    status: "Pending",
  });
  const [loading, setLoading] = useState(false);

  // Fetch employees from API
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/users/findAllUsers");
        setEmployees(response.data.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
        alert("Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNotaryData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      // Validate required fields
      if (
        !notaryData.date ||
        !notaryData.clientName ||
        !notaryData.documents ||
        !notaryData.employee
      ) {
        alert("Please fill in all required fields");
        return;
      }

      // Here you would make the API call to save the data
      // await axios.post('/notary/save', notaryData);

      alert("Notary record saved successfully!");

      // Reset form
      setNotaryData({
        date: "",
        clientName: "",
        documents: "",
        employee: "",
        note: "",
        bill: "",
        status: "Pending",
      });
    } catch (error) {
      console.error("Error saving notary data:", error);
      alert("Failed to save notary record");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Notary Management
      </h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Client Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documents
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Note
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bill (tk)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr>
              {/* Date Column */}
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="date"
                  name="date"
                  value={notaryData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </td>

              {/* Client Name Column */}
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="text"
                  name="clientName"
                  value={notaryData.clientName}
                  onChange={handleInputChange}
                  placeholder="Enter client name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </td>

              {/* Documents Column */}
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="text"
                  name="documents"
                  value={notaryData.documents}
                  onChange={handleInputChange}
                  placeholder="Enter documents"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </td>

              {/* Employee Column */}
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  name="employee"
                  value={notaryData.employee}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                  disabled={loading}
                >
                  <option value="">Select Employee</option>
                  {employees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.name} - {employee.email}
                    </option>
                  ))}
                </select>
                {loading && (
                  <span className="text-xs text-gray-500">
                    Loading employees...
                  </span>
                )}
              </td>

              {/* Note Column */}
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="text"
                  name="note"
                  value={notaryData.note}
                  onChange={handleInputChange}
                  placeholder="Enter note"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>

              {/* Bill Column */}
              <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="number"
                  name="bill"
                  value={notaryData.bill}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>

              {/* Status Column */}
              <td className="px-6 py-4 whitespace-nowrap">
                <select
                  name="status"
                  value={notaryData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Pending">Pending</option>
                  <option value="Complete">Complete</option>
                </select>
              </td>

              {/* Action Column */}
              <td className="px-6 py-4 whitespace-nowrap">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200"
                >
                  Save
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Notary;
