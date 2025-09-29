import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
const Transfer = () => {
  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Search and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter data based on search term
  const filteredData = transfers.filter(
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

  // Reset to first page when search term changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const transferTypes = [
    "Airport Pick-up",
    "Airport Drop-off",
    "Private Transfer",
    "Helicopter",
    "Speed Boat",
    "Yatch",
  ];

  const carTypes = [
    "Sedan",
    "SUV",
    "MPV",
    "Minivan",
    "Minibus",
    "Luxury car",
    "Van",
    "Bus",
  ];

  // Get color based on transfer type
  const getTransferTypeColor = (type) => {
    switch (type) {
      case "Airport Pick-up":
        return "bg-blue-100 text-blue-800";
      case "Airport Drop-off":
        return "bg-green-100 text-green-800";
      case "Private Transfer":
        return "bg-purple-100 text-purple-800";
      case "Helicopter":
        return "bg-red-100 text-red-800";
      case "Speed Boat":
        return "bg-indigo-100 text-indigo-800";
      case "Yatch":
        return "bg-amber-100 text-amber-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get color based on car type
  const getCarTypeColor = (type) => {
    switch (type) {
      case "Sedan":
        return "bg-blue-100 text-blue-800";
      case "SUV":
        return "bg-green-100 text-green-800";
      case "MPV":
        return "bg-purple-100 text-purple-800";
      case "Minivan":
        return "bg-red-100 text-red-800";
      case "Minibus":
        return "bg-indigo-100 text-indigo-800";
      case "Luxury car":
        return "bg-amber-100 text-amber-800";
      case "Van":
        return "bg-teal-100 text-teal-800";
      case "Bus":
        return "bg-pink-100 text-pink-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Fetch transfers from API
  useEffect(() => {
    const fetchTransfers = async () => {
      try {
        const response = await axios.get("/transfer/user");

        // Handle both array and single object responses
        if (Array.isArray(response.data)) {
          setTransfers(response.data);
        } else if (response.data && typeof response.data === "object") {
          setTransfers([response.data]);
        } else {
          setTransfers([]);
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTransfers();
  }, []);

  // Handle input changes
  const handleInputChange = (index, field, value) => {
    const updatedTransfers = [...transfers];
    updatedTransfers[index][field] = value;
    setTransfers(updatedTransfers);
  };

  // Handle passenger count change
  const handlePassengerChange = (transferId, value) => {
    const updatedTransfers = transfers.map((item) => {
      if (item._id === transferId) {
        return { ...item, passenger: Math.max(0, value) };
      }
      return item;
    });
    setTransfers(updatedTransfers);
  };

  // Handle save action
  const handleSave = async (transferId) => {
    try {
      const transfer = transfers.find((t) => t._id === transferId);
      if (transfer) {
        await axios.patch(`/transfer/${transfer._id}`, transfer);
        toast.success("Transfer updated successfully!");
      }
    } catch (err) {
      toast.error("Error updating transfer: " + err.message);
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
        <h1 className="text-2xl font-bold">Transfer Management</h1>
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
                Transfer Type
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Time
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Car Type
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Passenger
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 border-b border-gray-200 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {Array.isArray(currentItems) && currentItems.length > 0 ? (
              currentItems.map((transfer, index) => (
                <tr key={transfer._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transfer.workId?.name || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transfer.workId?.uuId || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={transfer.transferType || ""}
                      onChange={(e) =>
                        handleInputChange(index, "transferType", e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Transfer Type</option>
                      {transferTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {transfer.transferType && (
                      <span
                        className={`ml-2 px-2 py-1 text-xs rounded-full ${getTransferTypeColor(
                          transfer.transferType
                        )}`}
                      >
                        {transfer.transferType}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="time"
                      value={transfer.time || ""}
                      onChange={(e) =>
                        handleInputChange(index, "time", e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="date"
                      value={
                        transfer.date
                          ? new Date(transfer.date).toISOString().split("T")[0]
                          : ""
                      }
                      onChange={(e) =>
                        handleInputChange(index, "date", e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={transfer.carType || ""}
                      onChange={(e) =>
                        handleInputChange(index, "carType", e.target.value)
                      }
                      className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select Car Type</option>
                      {carTypes.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                    {transfer.carType && (
                      <span
                        className={`ml-2 px-2 py-1 text-xs rounded-full ${getCarTypeColor(
                          transfer.carType
                        )}`}
                      >
                        {transfer.carType}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <button
                        className="bg-gray-200 hover:bg-gray-300 rounded-l px-2 py-1"
                        onClick={() =>
                          handlePassengerChange(
                            index,
                            (transfer.passenger || 0) - 1
                          )
                        }
                      >
                        -
                      </button>
                      <span className="px-3 py-1 border-t border-b border-gray-200 min-w-[2rem] text-center">
                        {transfer.passenger || 0}
                      </span>
                      <button
                        className="bg-gray-200 hover:bg-gray-300 rounded-l px-2 py-1"
                        onClick={() =>
                          handlePassengerChange(
                            transfer._id,
                            (transfer.passenger || 0) + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <span className="pr-1">৳</span>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={transfer.amount || ""}
                        onChange={(e) =>
                          handleInputChange(index, "amount", e.target.value)
                        }
                        className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleSave(transfer._id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Save
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-6 py-4 text-center">
                  No transfers found
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

export default Transfer;
