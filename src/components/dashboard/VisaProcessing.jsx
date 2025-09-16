import React, { useState, useEffect } from "react";
import axios from "../../api/axios"; // Adjust the path as needed
import CustomerModal from "../visa-processing/CustomerModal";
import ApplicationModal from "../visa-processing/ApplicationModal";

const VisaProcessing = () => {
  const [visaData, setVisaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);

  // Fetch visa data on component mount
  useEffect(() => {
    const fetchVisaData = async () => {
      try {
        const response = await axios.get("/visa/user");
        setVisaData(
          Array.isArray(response.data) ? response.data : [response.data]
        );

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchVisaData();
  }, []);

  // Handle customer modal
  const handleCustomerClick = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleCustomerClose = () => {
    setSelectedCustomer(null);
  };

  // Handle application modal
  const handleApplicationClick = (application) => {
    setSelectedApplication(application);
  };

  const handleApplicationClose = () => {
    setSelectedApplication(null);
  };

  // Handle form changes
  const handleInputChange = (index, field, value) => {
    const updatedData = [...visaData];
    updatedData[index][field] = value;
    setVisaData(updatedData);
  };

  // Handle save
  const handleSave = async (index) => {
    try {
      const item = visaData[index];
      await axios.put(`/visa/user/${item._id}`, item);
      alert("Data saved successfully!");
    } catch (err) {
      alert("Error saving data: " + err.message);
    }
  };

  // Status color mapping
  const statusColors = {
    Done: "#5CC976",
    "Need Biometric": "#CDCDCD",
    B2B: "#9DD43B",
    "Application Done": "#65CAFF",
    "Working on it": "#F5AB3E",
    Emergency: "#BA3354",
    "stuck at Doc": "#DF3649",
    Block: "#4e4b4b",
    "Doc Need Notary": "#2A7FB9",
    "B2B ST": "#38804E",
    "Doc at Notary": "#9D50DE",
    "Upload Documents": "#9BADBA",
  };

  // Visa status colors
  const visaStatusColors = {
    "Visa approved": "#5CC976",
    "Visa rejected": "#DF3649",
    "Decision Pending": "#F5AB3E",
  };

  // Country options
  const countries = [
    "France",
    "UK",
    "Canada",
    "Australia",
    "Sweden",
    "USA",
    "Thailand",
    "Singapore",
    "Germany",
    "South Korea",
    "Japan",
    "UAE",
    "Portugal",
    "Netherland",
    "Belgium",
    "Poland",
    "Finland",
    "Denmark",
    "Estonia",
    "Austria",
    "Czech Republic",
    "Iceland",
    "Slovenia",
    "Latvia",
    "Norway",
    "Nepal",
    "China",
    "Luxembourg",
    "Kenya",
    "New Zealand",
  ];

  // Status options
  const statusOptions = Object.keys(statusColors);

  // Visa status options
  const visaStatusOptions = Object.keys(visaStatusColors);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">Loading...</div>
    );
  if (error)
    return <div className="text-red-500 text-center">Error: {error}</div>;

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-6">Visa Processing</h1>

      <div className="w-full overflow-x-auto">
        <table className="w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-3 border-b text-left">Name</th>
              <th className="py-2 px-3 border-b text-left">Unique ID</th>
              <th className="py-2 px-3 border-b">PAX</th>
              <th className="py-2 px-3 border-b">Country</th>
              <th className="py-2 px-3 border-b">Date of Entry</th>
              <th className="py-2 px-3 border-b">Date of Deadline</th>
              <th className="py-2 px-3 border-b">Details</th>
              <th className="py-2 px-3 border-b">Status</th>
              <th className="py-2 px-3 border-b">Transferred From</th>
              <th className="py-2 px-3 border-b">Closed Date</th>
              <th className="py-2 px-3 border-b">Application</th>
              <th className="py-2 px-3 border-b">Visa Status</th>
              <th className="py-2 px-3 border-b">Action</th>
            </tr>
          </thead>
          <tbody>
            {visaData.map((item, index) => (
              <tr key={item._id} className="hover:bg-gray-50">
                {/* Name Column */}
                <td className="py-4 px-6 border-b whitespace-nowrap">
                  <div className="flex items-center">
                    <span>{item.workId.name}</span>
                    <button
                      onClick={() => handleCustomerClick(item)}
                      className="ml-2 mb-1 text-blue-500 hover:text-blue-700 text-[30px]"
                    >
                      +
                    </button>
                  </div>
                </td>

                {/* Unique ID Column */}
                <td className="py-4 px-6 border-b whitespace-nowrap">
                  {item.workId.uuId}
                </td>

                {/* PAX Column */}
                <td className="py-2 px-4 border-b">
                  <input
                    type="number"
                    className="w-16 border rounded px-2 py-1"
                    value={item.pax || ""}
                    onChange={(e) =>
                      handleInputChange(index, "pax", e.target.value)
                    }
                  />
                </td>

                {/* Country Column */}
                <td className="py-2 px-4 border-b">
                  <select
                    className="border rounded px-2 py-1"
                    value={item.country || ""}
                    onChange={(e) =>
                      handleInputChange(index, "country", e.target.value)
                    }
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Date of Entry Column */}
                <td className="py-2 px-4 border-b">
                  {new Date(item.workId.updatedAt).toLocaleDateString()}
                </td>

                {/* Date of Deadline Column */}
                <td className="py-2 px-4 border-b">
                  {item.submissionDate
                    ? new Date(item.submissionDate).toLocaleDateString()
                    : "N/A"}
                </td>

                {/* Details Column */}
                <td className="py-6 px-1 border-b min-w-[300px]">
                  <textarea
                    className="w-full border rounded px-6 py-2"
                    value={item.details || ""}
                    onChange={(e) =>
                      handleInputChange(index, "details", e.target.value)
                    }
                  />
                </td>

                {/* Status Column */}
                <td className="py-2 px-4 border-b">
                  <select
                    className="border rounded px-2 py-1"
                    style={{
                      backgroundColor:
                        statusColors[item.status] || "transparent",
                    }}
                    value={item.status || ""}
                    onChange={(e) =>
                      handleInputChange(index, "status", e.target.value)
                    }
                  >
                    <option value="">Select Status</option>
                    {statusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Transferred From Column */}
                <td className="py-2 px-4 border-b">
                  {item.workId.employeeEmail}
                </td>

                {/* Closed Date Column */}
                <td className="py-2 px-4 border-b">
                  <input
                    type="date"
                    className="border rounded px-2 py-1"
                    value={item.closedDate || ""}
                    onChange={(e) =>
                      handleInputChange(index, "closedDate", e.target.value)
                    }
                  />
                </td>

                {/* Application Column */}
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleApplicationClick(item)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded"
                  >
                    Application
                  </button>
                </td>

                {/* Visa Status Column */}
                <td className="py-2 px-4 border-b">
                  <select
                    className="border rounded px-2 py-1"
                    style={{
                      backgroundColor:
                        visaStatusColors[item.visaStatus] || "transparent",
                    }}
                    value={item.visaStatus || ""}
                    onChange={(e) =>
                      handleInputChange(index, "visaStatus", e.target.value)
                    }
                  >
                    <option value="">Select Visa Status</option>
                    {visaStatusOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Action Column */}
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleSave(index)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded"
                  >
                    Save
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Modal */}
      {selectedCustomer && (
        <CustomerModal
          customer={selectedCustomer}
          onClose={handleCustomerClose}
        />
      )}

      {/* Application Modal */}
      {selectedApplication && (
        <ApplicationModal
          application={selectedApplication}
          onClose={handleApplicationClose}
        />
      )}
    </div>
  );
};

export default VisaProcessing;
